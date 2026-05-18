import {
  Injectable,
  HttpStatus,
  UnprocessableEntityException,
  forwardRef,
  Inject,
} from '@nestjs/common';
import { CreateBusinessDto } from './dto/create-business.dto';
import { UpdateBusinessDto } from './dto/update-business.dto';
import { BusinessRepository } from './infrastructure/persistence/business.repository';
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


import { DataSource } from 'typeorm';

@Injectable()
export class BusinessesService {
  constructor(
    private readonly contactService: ContactsService,
    private readonly serviceService: ServicesService,
    @Inject(forwardRef(() => MembersService))
    private readonly memberService: MembersService,
    private readonly filesService: FilesService,
    private readonly businessRepository: BusinessRepository,
    private dataSource: DataSource,
  ) { }


  private async mapFile(
    fileDto?: { id: string } | null,
  ): Promise<FileType | null | undefined> {
    if (fileDto === null) return null;
    if (!fileDto?.id) return undefined;
    const file = await this.filesService.findById(fileDto.id);
    return file ? FileMapper.toDomain(file as FileEntity) : undefined;
  }

  // async create(createBusinessDto: CreateBusinessDto): Promise<Business> {

  //   if (!createBusinessDto.owner?.id) {
  //     throw new UnprocessableEntityException({
  //       status: HttpStatus.UNPROCESSABLE_ENTITY,
  //       errors: { owner: 'ownerIsRequired' },
  //     });
  //   }

  //   const owner = await this.memberService.findById(createBusinessDto.owner.id);
  //   if (!owner) {
  //     throw new UnprocessableEntityException({
  //       status: HttpStatus.UNPROCESSABLE_ENTITY,
  //       errors: { owner: 'ownerNotExists' },
  //     });
  //   }


  //   let contact: Contact | undefined;
  //   if (createBusinessDto.contact?.id) {
  //     const contactObj = await this.contactService.findById(
  //       createBusinessDto.contact.id as any,
  //     );
  //     if (contactObj) contact = contactObj;
  //   }

  //   let service: Service | undefined;
  //   if (createBusinessDto.service?.id) {
  //     const serviceObj = await this.serviceService.findById(
  //       createBusinessDto.service.id,
  //     );
  //     if (serviceObj) service = serviceObj;
  //   }


  //   const flyer = await this.mapFile(createBusinessDto.flyer);
  //   const audioAr = await this.mapFile(createBusinessDto.audioAr);
  //   const audioFr = await this.mapFile(createBusinessDto.audioFr);
  //   const audioEn = await this.mapFile(createBusinessDto.audioEn);
  //   const videoAr = await this.mapFile(createBusinessDto.videoAr);
  //   const videoFr = await this.mapFile(createBusinessDto.videoFr);
  //   const videoEn = await this.mapFile(createBusinessDto.videoEn);


  //   const {
  //     owner: _o,
  //     contact: _c,
  //     service: _s,
  //     flyer: _f,
  //     audioAr: _aAr,
  //     audioFr: _aFr,
  //     audioEn: _aEn,
  //     videoAr: _vAr,
  //     videoFr: _vFr,
  //     videoEn: _vEn,
  //     manager: _m,
  //     ...restOfDto
  //   } = createBusinessDto;


  //   return this.businessRepository.create({
  //     ...restOfDto,
  //     owner,
  //     contact,
  //     service,
  //     flyer,
  //     audioAr,
  //     audioFr,
  //     audioEn,
  //     videoAr,
  //     videoFr,
  //     videoEn,
  //     manager: owner,
  //   });
  // }

  async create(createBusinessDto: CreateBusinessDto): Promise<Business> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // 1. Validations (Keep these inside try for safety)
      if (!createBusinessDto.owner?.id) {
        throw new UnprocessableEntityException({ owner: 'ownerIsRequired' });
      }

      const owner = await this.memberService.findById(createBusinessDto.owner.id);
      if (!owner) throw new UnprocessableEntityException({ owner: 'ownerNotExists' });

      // 2. Fetch Relations
      let contact: Contact | null | undefined;
      if (createBusinessDto.contact?.id) {
        contact = await this.contactService.findById(createBusinessDto.contact.id as any);
      }

      let service: Service | null | undefined;
      if (createBusinessDto.service?.id) {
        service = await this.serviceService.findById(createBusinessDto.service.id);
      }

      // 3. Map Files
      const flyer = await this.mapFile(createBusinessDto.flyer);
      // ... map your other files (audio, video) here ...

      const { owner: _o, contact: _c, service: _s, ...restOfDto } = createBusinessDto;

      // 4. Save via Repository passing the Transaction Manager
      // We modify the repository to accept the manager
      const result = await this.businessRepository.create(
        {
          ...restOfDto,
          owner,
          contact,
          service,
          flyer,
          audioAr: await this.mapFile(createBusinessDto.audioAr),
          audioFr: await this.mapFile(createBusinessDto.audioFr),
          audioEn: await this.mapFile(createBusinessDto.audioEn),
          videoAr: await this.mapFile(createBusinessDto.videoAr),
          videoFr: await this.mapFile(createBusinessDto.videoFr),
          videoEn: await this.mapFile(createBusinessDto.videoEn),
          manager: owner,
        } as any, // Cast to any to bypass the structural mismatch for now
        queryRunner.manager, // Pass the transactional manager
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
      ...restOfDto
    } = updateBusinessDto;


    return this.businessRepository.update(id, {
      ...restOfDto,
      contact,
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
  }: {
    paginationOptions: IPaginationOptions;
    filterOptions?: { cityId?: string; zoneId?: string; serviceId?: string };
  }) {
    return this.businessRepository.findAllWithPagination({
      paginationOptions,
      filterOptions,
    });
  }

  async findById(id: Business['id']): Promise<Business | null> {
    return this.businessRepository.findById(id);
  }

  async remove(id: Business['id']): Promise<void> {
    return this.businessRepository.remove(id);
  }
}
