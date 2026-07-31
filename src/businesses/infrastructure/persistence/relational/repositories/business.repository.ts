import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In, EntityManager } from 'typeorm';
import { BusinessEntity } from '../entities/business.entity';
import { Business } from '../../../../domain/business';
import { BusinessRepository } from '../../business.repository';
import { BusinessMapper } from '../mappers/business.mapper';
import { IPaginationOptions } from '../../../../../utils/types/pagination-options';
import { DeepPartial } from 'src/utils/types/deep-partial.type';

@Injectable()
export class BusinessRelationalRepository implements BusinessRepository {
  constructor(
    @InjectRepository(BusinessEntity)
    private readonly repository: Repository<BusinessEntity>,
  ) {}

  async create(data: Business, transactionManager?: EntityManager): Promise<Business> {
    const persistenceModel = BusinessMapper.toPersistence(data);
    const repo = transactionManager ? transactionManager.getRepository(BusinessEntity) : this.repository;
    const newEntity = await repo.save(repo.create(persistenceModel));
    return BusinessMapper.toDomain(newEntity);
  }

  async findById(id: string): Promise<Business | null> {
    const entity = await this.repository.findOne({
      where: { id },
      relations: {
        service: true,
        flyer: true,
        audioAr: true, 
        audioFr: true, 
        audioEn: true, 
        videoAr: true, 
        videoFr: true, 
        videoEn: true, 
        contact: { address: { localisation: true, city: true, zone: true } },
        localisation: true,
        owner: true,
        manager: true,
      }
    });

    if (!entity) return null;

    // تحويل الكيان إلى Domain Model
    const domain = BusinessMapper.toDomain(entity);

    // ⚠️ حماية حاسمة: دمج العلاقات المتداخلة يدوياً لضمان عدم ضياعها بسبب قيود الـ Mapper
    // هذه الخطوة تضمن وصول بيانات الموقع (localisation) والعنوان للـ Frontend
    (domain as any).contact = entity.contact;
    (domain as any).localisation = entity.localisation;
    (domain as any).service = entity.service;
    (domain as any).owner = entity.owner;
    (domain as any).manager = entity.manager;

    (domain as any).audioAr = entity.audioAr;
    (domain as any).audioFr = entity.audioFr;
    (domain as any).audioEn = entity.audioEn;
    (domain as any).videoAr = entity.videoAr;
    (domain as any).videoFr = entity.videoFr;
    (domain as any).videoEn = entity.videoEn;

    return domain;
  }





  async findAllWithPagination({
  paginationOptions,
  filterOptions,
}: {
  paginationOptions: IPaginationOptions;
  filterOptions?: { cityId?: string; zoneId?: string; serviceId?: string };
}): Promise<Business[]> {
  const queryBuilder = this.repository
    .createQueryBuilder('business')
    .leftJoinAndSelect('business.service', 'service')
    .leftJoinAndSelect('business.flyer', 'flyer')
    .leftJoinAndSelect('business.contact', 'contact')
    .leftJoinAndSelect('contact.address', 'address')
    .leftJoinAndSelect('address.localisation', 'addressLocalisation')
    .leftJoinAndSelect('business.localisation', 'localisation');

  // ONLY filter by Service for now
  if (filterOptions?.serviceId) {
    queryBuilder.andWhere('service.id = :serviceId', {
      serviceId: filterOptions.serviceId,
    });
  }

  const entities = await queryBuilder
    .skip((paginationOptions.page - 1) * paginationOptions.limit)
    .take(paginationOptions.limit)
    .getMany();

  return entities.map((entity) => BusinessMapper.toDomain(entity));
}


  // async findAllWithPagination({
  //   paginationOptions,
  //   filterOptions,
  // }: {
  //   paginationOptions: IPaginationOptions;
  //   filterOptions?: { cityId?: string; zoneId?: string; serviceId?: string };
  // }): Promise<Business[]> {
  //   const queryBuilder = this.repository
  //     .createQueryBuilder('business')
  //     .leftJoinAndSelect('business.service', 'service')
  //     .leftJoinAndSelect('business.flyer', 'flyer')
  //     .leftJoinAndSelect('business.contact', 'contact')
  //     .leftJoinAndSelect('contact.address', 'address')
  //     .leftJoinAndSelect('address.city', 'city')     // Ensure city relation exists on address
  //     .leftJoinAndSelect('address.zone', 'zone')     // Ensure zone relation exists on address
  //     .leftJoinAndSelect('address.localisation', 'addressLocalisation')
  //     .leftJoinAndSelect('business.localisation', 'localisation');
  //   // 1. Filter by Service (Mandatory)
  //   if (filterOptions?.serviceId) {
  //     queryBuilder.andWhere('service.id = :serviceId', {
  //       serviceId: filterOptions.serviceId,
  //     });
  //   }

  //   // 2. Filter by Zone (if provided)
  //    if (filterOptions?.zoneId) {
  //     queryBuilder.andWhere('(zone.id = :zoneId OR address.zoneId = :zoneId)', {
  //       zoneId: filterOptions.zoneId,
  //     });
  //   } 
  //   // 3. Filter by City (if zone is not selected, but city is)
  //   else if (filterOptions?.cityId) {
  //     queryBuilder.andWhere('(city.id = :cityId OR address.cityId = :cityId)', {
  //       cityId: filterOptions.cityId,
  //     });
  //   }

  //   // Pagination execution
  //   const entities = await queryBuilder
  //     .skip((paginationOptions.page - 1) * paginationOptions.limit)
  //     .take(paginationOptions.limit)
  //     .getMany();

  //   return entities.map((entity) => {
  //     const domain = BusinessMapper.toDomain(entity);
  //     (domain as any).contact = entity.contact;
  //     (domain as any).localisation = entity.localisation;
  //     (domain as any).service = entity.service;
  //     (domain as any).flyer = entity.flyer;
  //     return domain;
  //   });
  // }



  // async findAllWithPagination({
  //   paginationOptions,
  //   filterOptions,
  // }: {
  //   paginationOptions: IPaginationOptions;
  //   filterOptions?: { cityId?: string; zoneId?: string; serviceId?: string };
  // }): Promise<Business[]> {
  //   const queryBuilder = this.repository
  //     .createQueryBuilder('business')
  //     .leftJoinAndSelect('business.service', 'service')
  //     .leftJoinAndSelect('business.flyer', 'flyer')
  //     .leftJoinAndSelect('business.contact', 'contact')
  //     .leftJoinAndSelect('contact.address', 'address')
  //     .leftJoinAndSelect('address.city', 'city')
  //     .leftJoinAndSelect('address.zone', 'zone')
  //     .leftJoinAndSelect('address.localisation', 'addressLocalisation')
  //     .leftJoinAndSelect('business.localisation', 'localisation');

  //   // 1. Filter by Service (Mandatory)
  //   if (filterOptions?.serviceId) {
  //     queryBuilder.andWhere('service.id = :serviceId', {
  //       serviceId: filterOptions.serviceId,
  //     });
  //   }

  //   // 2. Filter by Zone (checking via contact.address.zone or zone relation)
  //   if (filterOptions?.zoneId) {
  //     queryBuilder.andWhere('(zone.id = :zoneId OR address.zoneId = :zoneId)', {
  //       zoneId: filterOptions.zoneId,
  //     });
  //   } 
  //   // 3. Filter by City (checking via contact.address.city or city relation)
  //   else if (filterOptions?.cityId) {
  //     queryBuilder.andWhere('(city.id = :cityId OR address.cityId = :cityId)', {
  //       cityId: filterOptions.cityId,
  //     });
  //   }

  //   // Pagination execution
  //   const entities = await queryBuilder
  //     .skip((paginationOptions.page - 1) * paginationOptions.limit)
  //     .take(paginationOptions.limit)
  //     .getMany();

  //   return entities.map((entity) => {
  //     const domain = BusinessMapper.toDomain(entity);
  //     (domain as any).contact = entity.contact;
  //     (domain as any).localisation = entity.localisation;
  //     (domain as any).service = entity.service;
  //     (domain as any).flyer = entity.flyer;
  //     return domain;
  //   });
  // }


//   async findAllWithPagination({
//   paginationOptions,
//   filterOptions,
// }: {
//   paginationOptions: IPaginationOptions;
//   filterOptions?: { cityId?: string; zoneId?: string; serviceId?: string };
// }): Promise<Business[]> {
//   const queryBuilder = this.repository
//     .createQueryBuilder('business')
//     .leftJoinAndSelect('business.service', 'service')
//     .leftJoinAndSelect('business.flyer', 'flyer')
//     .leftJoinAndSelect('business.contact', 'contact')
//     .leftJoinAndSelect('contact.address', 'address')
//     .leftJoinAndSelect('address.localisation', 'addressLocalisation')
//     .leftJoinAndSelect('business.localisation', 'localisation');

//   // 1. Filter by Service (Mandatory / Core filter)
//   if (filterOptions?.serviceId) {
//     queryBuilder.andWhere('service.id = :serviceId', {
//       serviceId: filterOptions.serviceId,
//     });
//   }

//   // 2. Filter by Zone (if selected, find businesses whose address/localisation matches the zone or is near it)
//   if (filterOptions?.zoneId) {
//     // Assuming your Zone entity is linked or you can fetch zone bounds, 
//     // or if address has a zone relation:
//     queryBuilder.andWhere('address.zone.id = :zoneId', {
//       zoneId: filterOptions.zoneId,
//     });
//   } 
//   // 3. Filter by City (if zone is not selected, but city is)
//   else if (filterOptions?.cityId) {
//     queryBuilder.andWhere('address.city.id = :cityId', {
//       cityId: filterOptions.cityId,
//     });
//   }

//   // Pagination execution
//   const entities = await queryBuilder
//     .skip((paginationOptions.page - 1) * paginationOptions.limit)
//     .take(paginationOptions.limit)
//     .getMany();

//   return entities.map((entity) => {
//     const domain = BusinessMapper.toDomain(entity);
//     // تأمين تمرير البيانات للـ Frontend
//     (domain as any).contact = entity.contact;
//     (domain as any).localisation = entity.localisation;
//     (domain as any).service = entity.service;
//     (domain as any).flyer = entity.flyer;
//     return domain;
//   });
// }

  // async findAllWithPagination({
  //   paginationOptions,
  //   filterOptions,
  // }: {
  //   paginationOptions: IPaginationOptions;
  //   filterOptions?: { cityId?: string; zoneId?: string; serviceId?: string };
  // }): Promise<Business[]> {
  //   const query = this.repository
  //     .createQueryBuilder('business')
  //     .leftJoinAndSelect('business.owner', 'owner')
  //     .leftJoinAndSelect('business.service', 'service')
  //     .leftJoinAndSelect('business.flyer', 'flyer')
  //     .leftJoinAndSelect('business.localisation', 'localisation')
  //     .leftJoinAndSelect('business.contact', 'contact')
  //     .leftJoinAndSelect('contact.address', 'address')
  //     .leftJoinAndSelect('address.city', 'city')
  //     .leftJoinAndSelect('address.zone', 'zone')
  //     .leftJoinAndSelect('address.localisation', 'addressLocalisation');

  //   if (filterOptions?.serviceId) {
  //     query.andWhere('business.serviceId = :serviceId', { serviceId: filterOptions.serviceId });
  //   }
  //   if (filterOptions?.cityId) {
  //     query.andWhere('(address.cityId = :cityId OR city.id = :cityId)', { cityId: filterOptions.cityId });
  //   }
  //   if (filterOptions?.zoneId) {
  //     query.andWhere('(address.zoneId = :zoneId OR zone.id = :zoneId)', { zoneId: filterOptions.zoneId });
  //   }

  //   query.orderBy('business.createdAt', 'DESC')
  //        .skip((paginationOptions.page - 1) * paginationOptions.limit)
  //        .take(paginationOptions.limit);

  //   const entities = await query.getMany();

  //   return entities.map((entity) => {
  //     const domain = BusinessMapper.toDomain(entity);
  //     // تأمين تمرير البيانات للـ Frontend
  //     (domain as any).contact = entity.contact;
  //     (domain as any).localisation = entity.localisation;
  //     return domain;
  //   });
  // }

  async update(id: Business['id'], payload: DeepPartial<Business>, transactionManager?: EntityManager): Promise<Business | null> {
    const repo = transactionManager ? transactionManager.getRepository(BusinessEntity) : this.repository;
    const entity = await repo.findOne({ where: { id: id as string } });

    if (!entity) return null;

    const updatedEntity = await repo.save(
      repo.merge(entity, BusinessMapper.toPersistence(payload as Business)),
    );

    return BusinessMapper.toDomain(updatedEntity);
  }

  async remove(id: Business['id']): Promise<void> {
    await this.repository.delete(id);
  }

  async findByIds(ids: Business['id'][]): Promise<Business[]> {
    const entities = await this.repository.find({ where: { id: In(ids as string[]) } });
    return entities.map((entity) => BusinessMapper.toDomain(entity));
  }
}