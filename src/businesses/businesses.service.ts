import {
  Injectable,
  HttpStatus,
  UnprocessableEntityException,
  forwardRef,
  Inject,
} from '@nestjs/common';
import { CreateBusinessDto } from './dto/create-business.dto';
import { UpdateBusinessDto } from './dto/update-business.dto';
import {
  BusinessFilterOptions,
  BusinessListResult,
  BusinessRepository,
} from './infrastructure/persistence/business.repository';
import { IPaginationOptions } from '../utils/types/pagination-options';
import { Business } from './domain/business';

import { ContactsService } from '../contacts/contacts.service';
import { Contact } from '../contacts/domain/contact';
import { ServicesService } from '../services/services.service';
import { Service } from '../services/domain/service';
import { MembersService } from '../members/members.service';
import { Member } from '../members/domain/member';
import { FilesService } from 'src/files/files.service';

import { FileType } from 'src/files/domain/file';
import { FileMapper } from 'src/files/infrastructure/persistence/relational/mappers/file.mapper';
import { FileEntity } from 'src/files/infrastructure/persistence/relational/entities/file.entity';

import { DataSource, EntityManager } from 'typeorm';
import { AddressesService } from 'src/addresses/addresses.service';
import { Address } from 'src/addresses/domain/address';
import { ContactEntity } from 'src/contacts/infrastructure/persistence/relational/entities/contact.entity';

@Injectable()
export class BusinessesService {
  constructor(
    private readonly addressService: AddressesService,

    private readonly contactService: ContactsService,
    private readonly serviceService: ServicesService,
    @Inject(forwardRef(() => MembersService))
    private readonly memberService: MembersService,
    private readonly filesService: FilesService,
    private readonly businessRepository: BusinessRepository,
    private dataSource: DataSource,
  ) {}

  private async mapFile(
    fileDto?: { id: string } | null,
  ): Promise<FileType | null | undefined> {
    if (fileDto === null) return null;
    if (!fileDto?.id) return undefined;
    const file = await this.filesService.findById(fileDto.id);
    return file ? FileMapper.toDomain(file as FileEntity) : undefined;
  }

  /**
   * Address rows are shared with the contact, so the business only needs the
   * reference. Loading it through the transaction manager keeps the lookup
   * inside the surrounding create/update transaction.
   */
  private async findContactAddress(
    contactId: Contact['id'],
    manager?: EntityManager,
  ): Promise<Address | null> {
    const repo = (manager ?? this.dataSource).getRepository(ContactEntity);
    const contactEntity = await repo.findOne({
      where: { id: contactId },
      relations: { address: true },
    });

    return contactEntity?.address
      ? ({ id: contactEntity.address.id } as Address)
      : null;
  }

  /**
   * Resolves the address the business must be linked to. Priority: an explicit
   * address coming from the form, otherwise the selected contact's address.
   */
  private async resolveBusinessAddress(
    dto: { Address?: { id?: string } | null },
    contact?: Contact | null,
    manager?: EntityManager,
  ): Promise<Address | null | undefined> {
    if (dto.Address?.id) {
      const address = await this.addressService.findById(dto.Address.id);
      if (!address) {
        throw new UnprocessableEntityException({ address: 'notExists' });
      }
      return { id: address.id } as Address;
    }

    if (contact?.id) {
      return this.findContactAddress(contact.id, manager);
    }

    return undefined;
  }

  async create(createBusinessDto: CreateBusinessDto): Promise<Business> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // 1. Validations
      if (!createBusinessDto.owner?.id) {
        throw new UnprocessableEntityException({ owner: 'ownerIsRequired' });
      }

      const owner = await this.memberService.findById(
        createBusinessDto.owner.id,
      );
      if (!owner)
        throw new UnprocessableEntityException({ owner: 'ownerNotExists' });

      // 2. Fetch Relations
      let contact: Contact | null | undefined;
      if (createBusinessDto.contact?.id) {
        contact = await this.contactService.findById(
          createBusinessDto.contact.id as any,
        );
      }

      if (!createBusinessDto.manager?.id) {
        throw new UnprocessableEntityException({
          manager: 'managerIsRequired',
        });
      }

      const manager = await this.memberService.findById(
        createBusinessDto.manager.id,
      );
      if (!manager) {
        throw new UnprocessableEntityException({ manager: 'managerNotExists' });
      }

      let service: Service | null | undefined;
      if (createBusinessDto.service?.id) {
        service = await this.serviceService.findById(
          createBusinessDto.service.id,
        );
      }

      // 3. Address: link the business to its address row (explicit one from
      //    the form, otherwise the selected contact's address) so the
      //    city/zone/localisation filters of the search page can match it.
      const address = await this.resolveBusinessAddress(
        createBusinessDto,
        contact,
        queryRunner.manager,
      );

      // 4. Map Files
      const flyer = await this.mapFile(createBusinessDto.flyer);

      // 5. Handle localisation creation within the transaction
      let savedLocalisation: any = null;
      if (createBusinessDto.localisation) {
        const { latitude, longitude } = createBusinessDto.localisation;
        if (
          latitude !== undefined &&
          latitude !== null &&
          longitude !== undefined &&
          longitude !== null
        ) {
          const localisationRepo =
            queryRunner.manager.getRepository('localisation');
          const newLocEntity = localisationRepo.create({
            latitude: parseFloat(String(latitude)),
            longitude: parseFloat(String(longitude)),
          });
          savedLocalisation = await localisationRepo.save(newLocEntity);
        }
      }

      const {
        owner: _o,
        contact: _c,
        service: _s,
        localisation: _loc,
        Address: _addr,
        ...restOfDto
      } = createBusinessDto;

      // 6. Save via Repository passing the Transaction Manager
      const result = await this.businessRepository.create(
        {
          ...restOfDto,
          owner,
          contact,
          service,
          Address: address,
          flyer,
          localisation: savedLocalisation,
          audioAr: await this.mapFile(createBusinessDto.audioAr),
          audioFr: await this.mapFile(createBusinessDto.audioFr),
          audioEn: await this.mapFile(createBusinessDto.audioEn),
          videoAr: await this.mapFile(createBusinessDto.videoAr),
          videoFr: await this.mapFile(createBusinessDto.videoFr),
          videoEn: await this.mapFile(createBusinessDto.videoEn),
          manager,
        } as any,
        queryRunner.manager,
      );

      await queryRunner.commitTransaction();
      return result;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async update(id: Business['id'], updateBusinessDto: UpdateBusinessDto) {
    const currentBusiness = await this.findById(id);
    if (!currentBusiness) {
      throw new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        errors: { business: 'notExists' },
      });
    }

    let contact: Contact | null | undefined = undefined;
    if (updateBusinessDto.contact) {
      const contactObject = await this.contactService.findById(
        updateBusinessDto.contact.id as any,
      );
      if (!contactObject) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: { contact: 'notExists' },
        });
      }
      contact = contactObject;
    } else if (updateBusinessDto.contact === null) {
      contact = null;
    }

    // Keep the business address in sync: an explicit address wins, otherwise
    // follow the (possibly new) contact so address filters keep matching.
    let address: Address | null | undefined = undefined;
    if (updateBusinessDto.Address !== undefined) {
      address =
        updateBusinessDto.Address === null
          ? null
          : await this.resolveBusinessAddress(updateBusinessDto, null);
    } else if (contact !== undefined) {
      address = contact?.id ? await this.findContactAddress(contact.id) : null;
    }

    let service: Service | null | undefined = undefined;
    if (updateBusinessDto.service) {
      const serviceObject = await this.serviceService.findById(
        updateBusinessDto.service.id,
      );
      if (!serviceObject) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: { service: 'notExists' },
        });
      }
      service = serviceObject;
    } else if (updateBusinessDto.service === null) {
      service = null;
    }

    const flyer = await this.mapFile(updateBusinessDto.flyer);
    const audioAr = await this.mapFile(updateBusinessDto.audioAr);
    const audioFr = await this.mapFile(updateBusinessDto.audioFr);
    const audioEn = await this.mapFile(updateBusinessDto.audioEn);
    const videoAr = await this.mapFile(updateBusinessDto.videoAr);
    const videoFr = await this.mapFile(updateBusinessDto.videoFr);
    const videoEn = await this.mapFile(updateBusinessDto.videoEn);

    let owner: Member | undefined = undefined;
    if (updateBusinessDto.owner) {
      const ownerObject = await this.memberService.findById(
        updateBusinessDto.owner.id,
      );
      if (!ownerObject) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: { owner: 'ownerNotExists' },
        });
      }
      owner = ownerObject;
    }

    let manager: Member | undefined = undefined;
    if (updateBusinessDto.manager) {
      const managerObject = await this.memberService.findById(
        updateBusinessDto.manager.id,
      );
      if (!managerObject) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: { manager: 'managerNotExists' },
        });
      }
      manager = managerObject;
    }

    const {
      owner: _o,
      contact: _c,
      service: _s,
      flyer: _f,
      audioAr: _aAr,
      audioFr: _aFr,
      audioEn: _aEn,
      videoAr: _vAr,
      videoFr: _vFr,
      videoEn: _vEn,
      manager: _m,
      Address: _addr,
      ...restOfDto
    } = updateBusinessDto;

    return this.businessRepository.update(id, {
      ...restOfDto,
      contact,
      Address: address,
      service,
      owner,
      manager,
      flyer,
      audioAr,
      audioFr,
      audioEn,
      videoAr,
      videoFr,
      videoEn,
    });
  }

  async findAllWithPagination({
    paginationOptions,
    filterOptions,
    relations,
  }: {
    paginationOptions: IPaginationOptions;
    filterOptions?: BusinessFilterOptions;
    relations?: string;
  }): Promise<BusinessListResult> {
    // Drop inactive criteria so omitted/blank filters keep the original unfiltered behaviour
    const normalize = (value?: string) => {
      const trimmed = value?.trim();
      return trimmed ? trimmed : undefined;
    };

    const cleanFilters = {
      cityId: normalize(filterOptions?.cityId),
      zoneId: normalize(filterOptions?.zoneId),
      serviceId: normalize(filterOptions?.serviceId),
    };

    const hasActiveFilter = Object.values(cleanFilters).some(Boolean);

    return this.businessRepository.findAllWithPagination({
      paginationOptions,
      filterOptions: hasActiveFilter ? cleanFilters : undefined,
      relations,
    });
  }

  async findById(id: Business['id']): Promise<Business | null> {
    return this.businessRepository.findById(id);
  }

  async remove(id: Business['id']): Promise<void> {
    return this.businessRepository.remove(id);
  }
}
