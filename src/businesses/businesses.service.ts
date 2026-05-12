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

// استيراد الخدمات والأنواع المطلوبة
import { ContactsService } from '../contacts/contacts.service';
import { Contact } from '../contacts/domain/contact';
import { ServicesService } from '../services/services.service';
import { Service } from '../services/domain/service';
import { MembersService } from '../members/members.service';
import { Member } from '../members/domain/member';
import { FilesService } from 'src/files/files.service';

// استيراد الـ Domain والـ Mapper الخاص بالملفات
import { FileType } from 'src/files/domain/file';
import { FileMapper } from 'src/files/infrastructure/persistence/relational/mappers/file.mapper';
import { FileEntity } from 'src/files/infrastructure/persistence/relational/entities/file.entity';

@Injectable()
export class BusinessesService {
  constructor(
    private readonly contactService: ContactsService,
    private readonly serviceService: ServicesService,
    @Inject(forwardRef(() => MembersService))
    private readonly memberService: MembersService,
    private readonly filesService: FilesService,
    private readonly businessRepository: BusinessRepository,
  ) {}

  // async create(createBusinessDto: CreateBusinessDto) {
  //   // 1. Validate Contact
  //   let contact: Contact | null | undefined = undefined;
  //   if (createBusinessDto.contact) {
  //     const contactObject = await this.contactService.findById(
  //       createBusinessDto.contact.id as any,
  //     );
  //     if (!contactObject) {
  //       throw new UnprocessableEntityException({
  //         status: HttpStatus.UNPROCESSABLE_ENTITY,
  //         errors: { contact: 'notExists' },
  //       });
  //     }
  //     contact = contactObject;
  //   }

  //   // 2. Validate Service Category
  //   let service: Service | null | undefined = undefined;
  //   if (createBusinessDto.service) {
  //     const serviceObject = await this.serviceService.findById(
  //       createBusinessDto.service.id,
  //     );
  //     if (!serviceObject) {
  //       throw new UnprocessableEntityException({
  //         status: HttpStatus.UNPROCESSABLE_ENTITY,
  //         errors: { service: 'notExists' },
  //       });
  //     }
  //     service = serviceObject;
  //   }

  //   // 3. Validate Flyer (تحويل باستخدام Mapper)
  //   let flyer: FileType | null | undefined = undefined;
  //   if (createBusinessDto.flyer) {
  //     const fileObject = await this.filesService.findById(
  //       createBusinessDto.flyer.id,
  //     );
  //     if (!fileObject) {
  //       throw new UnprocessableEntityException({
  //         status: HttpStatus.UNPROCESSABLE_ENTITY,
  //         errors: { flyer: 'fileNotExists' },
  //       });
  //     }
  //     // 🔥 تحويل من Entity إلى Domain لتجنب خطأ التعارض
  //     flyer = FileMapper.toDomain(fileObject as FileEntity);
  //   }

  //   // 4. Validate Owner
  //   if (!createBusinessDto.owner) {
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

  //   // 5. Validate Manager (Defaults to Owner)
  //   let manager = owner;
  //   if (
  //     createBusinessDto.manager &&
  //     createBusinessDto.manager.id !== createBusinessDto.owner.id
  //   ) {
  //     const managerObject = await this.memberService.findById(
  //       createBusinessDto.manager.id,
  //     );
  //     if (!managerObject) {
  //       throw new UnprocessableEntityException({
  //         status: HttpStatus.UNPROCESSABLE_ENTITY,
  //         errors: { manager: 'managerNotExists' },
  //       });
  //     }
  //     manager = managerObject;
  //   }

  //   return this.businessRepository.create({
  //     ...createBusinessDto,
  //     contact,
  //     service,
  //     owner,
  //     manager,
  //     flyer, // الآن النوع متوافق تماماً مع Business Domain
  //   });
  // }

  private async mapFile(
    fileDto?: { id: string } | null,
  ): Promise<FileType | null | undefined> {
    if (fileDto === null) return null;
    if (!fileDto?.id) return undefined;
    const file = await this.filesService.findById(fileDto.id);
    return file ? FileMapper.toDomain(file as FileEntity) : undefined;
  }

  async create(createBusinessDto: CreateBusinessDto): Promise<Business> {
    // 1. التحقق من وجود المالك
    if (!createBusinessDto.owner?.id) {
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

    // 2. معالجة العلاقات وتحويلها لـ Domain
    let contact: Contact | undefined;
    if (createBusinessDto.contact?.id) {
      const contactObj = await this.contactService.findById(
        createBusinessDto.contact.id as any,
      );
      if (contactObj) contact = contactObj;
    }

    let service: Service | undefined;
    if (createBusinessDto.service?.id) {
      const serviceObj = await this.serviceService.findById(
        createBusinessDto.service.id,
      );
      if (serviceObj) service = serviceObj;
    }

    // 3. تحويل جميع الملفات الممكنة
    const flyer = await this.mapFile(createBusinessDto.flyer);
    const audioAr = await this.mapFile(createBusinessDto.audioAr);
    const audioFr = await this.mapFile(createBusinessDto.audioFr);
    const audioEn = await this.mapFile(createBusinessDto.audioEn);
    const videoAr = await this.mapFile(createBusinessDto.videoAr);
    const videoFr = await this.mapFile(createBusinessDto.videoFr);
    const videoEn = await this.mapFile(createBusinessDto.videoEn);

    // 4. استخراج *كل* الحقول المتعارضة من الـ DTO لضمان عدم تمريرها للـ Repository كـ DTO
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
    } = createBusinessDto;

    // 5. الإرسال النهائي
    return this.businessRepository.create({
      ...restOfDto,
      owner,
      contact,
      service,
      flyer,
      audioAr,
      audioFr,
      audioEn,
      videoAr,
      videoFr,
      videoEn,
      manager: owner,
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

    // Update logic for Contact
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

    // Update logic for Service
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

    // Mapping all file fields
    const flyer = await this.mapFile(updateBusinessDto.flyer);
    const audioAr = await this.mapFile(updateBusinessDto.audioAr);
    const audioFr = await this.mapFile(updateBusinessDto.audioFr);
    const audioEn = await this.mapFile(updateBusinessDto.audioEn);
    const videoAr = await this.mapFile(updateBusinessDto.videoAr);
    const videoFr = await this.mapFile(updateBusinessDto.videoFr);
    const videoEn = await this.mapFile(updateBusinessDto.videoEn);

    // Update logic for Owner/Manager
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

    // Extract all potentially conflicting fields from DTO
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

  // async findAllWithPagination({
  //   paginationOptions,
  // }: {
  //   paginationOptions: IPaginationOptions;
  // }) {
  //   return this.businessRepository.findAllWithPagination({
  //     paginationOptions: {
  //       page: paginationOptions.page,
  //       limit: paginationOptions.limit,
  //     },
  //   });
  // }

  async findAllWithPagination({
  paginationOptions,
  filterOptions, // Add this
}: {
  paginationOptions: IPaginationOptions;
  filterOptions?: { cityId?: string; zoneId?: string; serviceId?: string };
}) {
  return this.businessRepository.findAllWithPagination({
    paginationOptions,
    filterOptions, // Ensure your Repository uses QueryBuilder to join address and localisation
  });
}

  async findById(id: Business['id']): Promise<Business | null> {
    return this.businessRepository.findById(id);
  }

  async remove(id: Business['id']): Promise<void> {
    return this.businessRepository.remove(id);
  }
}
