import { ContactsService } from '../contacts/contacts.service';
import { Contact } from '../contacts/domain/contact';
import { ServicesService } from '../services/services.service';
import { Service } from '../services/domain/service';
import { MembersService } from '../members/members.service';
import { Member } from '../members/domain/member';
import { FilesService } from 'src/files/files.service'; // Ensure this is imported

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
import { FileEntity } from 'src/files/infrastructure/persistence/relational/entities/file.entity';

@Injectable()
export class BusinessesService {
  constructor(
    private readonly contactService: ContactsService, // index 0
    private readonly serviceService: ServicesService, // index 1
    @Inject(forwardRef(() => MembersService))
    private readonly memberService: MembersService, // index 2
    private readonly filesService: FilesService, // index 3 <--- This matches the error!
    private readonly businessRepository: BusinessRepository, // index 4
  ) {}

  async create(createBusinessDto: CreateBusinessDto) {
    // 1. Validate Contact
    let contact: Contact | null | undefined = undefined;
    if (createBusinessDto.contact) {
      const contactObject = await this.contactService.findById(
        createBusinessDto.contact.id,
      );
      if (!contactObject) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: { contact: 'notExists' },
        });
      }
      contact = contactObject;
    }

    // 2. Validate Service Category
    let service: Service | null | undefined = undefined;
    if (createBusinessDto.service) {
      const serviceObject = await this.serviceService.findById(
        createBusinessDto.service.id,
      );
      if (!serviceObject) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: { service: 'notExists' },
        });
      }
      service = serviceObject;
    }

    // 3. Validate Flyer (New)
    let flyer: FileEntity | null | undefined = undefined;
    if (createBusinessDto.flyer) {
      const fileObject = await this.filesService.findById(
        createBusinessDto.flyer.id,
      );
      if (!fileObject) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: { flyer: 'fileNotExists' },
        });
      }
      flyer = fileObject as FileEntity;
    }

    // 4. Validate Owner (Mandatory)
    if (!createBusinessDto.owner) {
      throw new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        errors: { owner: 'ownerIsRequired' },
      });
    }
    const owner = await this.memberService.findById(createBusinessDto.owner.id);
    if (!owner) {
      throw new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        errors: { owner: 'ownerNotExists' },
      });
    }

    // 5. Validate Manager (Defaults to Owner)
    let manager = owner;
    if (
      createBusinessDto.manager &&
      createBusinessDto.manager.id !== createBusinessDto.owner.id
    ) {
      const managerObject = await this.memberService.findById(
        createBusinessDto.manager.id,
      );
      if (!managerObject) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: { manager: 'managerNotExists' },
        });
      }
      manager = managerObject;
    }

    return this.businessRepository.create({
      ...createBusinessDto,
      contact,
      service,
      owner,
      manager,
      flyer, // Added to payload
    });
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
        updateBusinessDto.contact.id,
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

    // Handle Flyer Update
    let flyer: FileEntity | null | undefined = undefined;
    if (updateBusinessDto.flyer) {
      const fileObject = await this.filesService.findById(
        updateBusinessDto.flyer.id,
      );
      if (!fileObject) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: { flyer: 'fileNotExists' },
        });
      }
      flyer = fileObject as FileEntity;
    } else if (updateBusinessDto.flyer === null) {
      flyer = null;
    }

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

    return this.businessRepository.update(id, {
      ...updateBusinessDto,
      contact,
      service,
      owner,
      manager,
      flyer,
    });
  }

  async findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }) {
    return this.businessRepository.findAllWithPagination({
      paginationOptions: {
        page: paginationOptions.page,
        limit: paginationOptions.limit,
      },
    });
  }

  async findById(id: Business['id']): Promise<Business | null> {
    return this.businessRepository.findById(id);
  }

  async remove(id: Business['id']): Promise<void> {
    return this.businessRepository.remove(id);
  }
}
