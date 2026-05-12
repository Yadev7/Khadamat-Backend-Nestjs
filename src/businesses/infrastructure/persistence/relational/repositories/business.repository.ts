import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { BusinessEntity } from '../entities/business.entity';
import { NullableType } from '../../../../../utils/types/nullable.type';
import { Business } from '../../../../domain/business';
import { BusinessRepository } from '../../business.repository';
import { BusinessMapper } from '../mappers/business.mapper';
import { IPaginationOptions } from '../../../../../utils/types/pagination-options';

@Injectable()
export class BusinessRelationalRepository implements BusinessRepository {
  constructor(
    @InjectRepository(BusinessEntity)
    private readonly businessRepository: Repository<BusinessEntity>,
  ) { }

  private readonly relations = [
    'contact',
    'contact.address',
    'service',
    'owner',
    'owner.contact',
    'owner.user',
    'manager',
    'flyer',
  ];


  async create(data: Business): Promise<Business> {
    const persistenceModel = BusinessMapper.toPersistence(data);
    const newEntity = await this.businessRepository.save(
      this.businessRepository.create(persistenceModel),
    );
    // Fetch again to get the full relations for the Domain object
    return this.findById(newEntity.id) as Promise<Business>;
  }

  // async findAllWithPagination({
  //   paginationOptions,
  //   filterOptions,
  // }: {
  //   paginationOptions: IPaginationOptions;
  //   filterOptions?: { cityId?: string; zoneId?: string; serviceId?: string };
  // }): Promise<Business[]> {
  //   const entities = await this.businessRepository.find({
  //     skip: (paginationOptions.page - 1) * paginationOptions.limit,
  //     take: paginationOptions.limit,
  //     relations: this.relations, // CRITICAL: Load the owner and manager
  //   });

  //   return entities.map((entity) => BusinessMapper.toDomain(entity));
  // }


  // business.repository.ts (النسخة العلائقية / Relational)

  // async findAllWithPagination({
  //   paginationOptions,
  //   filterOptions,
  // }: {
  //   paginationOptions: IPaginationOptions;
  //   filterOptions?: { cityId?: string; zoneId?: string; serviceId?: string };
  // }): Promise<Business[]> {
  //   const query = this.businessRepository
  //     .createQueryBuilder('business')
  //     .leftJoinAndSelect('business.service', 'business_service')
  //     .leftJoinAndSelect('business.contact', 'contact')
  //     .leftJoinAndSelect('contact.address', 'address')
  //     .leftJoinAndSelect('address.localisation', 'localisation')
  //     .leftJoinAndSelect('address.city', 'city')
  //     .leftJoinAndSelect('address.zone', 'zone')
  //     .leftJoinAndSelect('business.owner', 'owner')
  //     .leftJoinAndSelect('owner.contact', 'ownerContact')
  //     .leftJoinAndSelect('business.flyer', 'flyer');

  //   // --- تفعيل الفلترة الحقيقية ---

  //   if (filterOptions?.serviceId) {
  //     query.andWhere('business_service.id = :serviceId', { serviceId: filterOptions.serviceId });
  //   }

  //   if (filterOptions?.cityId) {
  //     query.andWhere('city.id = :cityId', { cityId: filterOptions.cityId });
  //   }

  //   if (filterOptions?.zoneId) {
  //     query.andWhere('zone.id = :zoneId', { zoneId: filterOptions.zoneId });
  //   }

  //   // الترتيب والصفحات
  //   query
  //     .skip((paginationOptions.page - 1) * paginationOptions.limit)
  //     .take(paginationOptions.limit);

  //   const entities = await query.getMany();

  //   // تحويل النتائج إلى Domain Objects باستخدام الـ Mapper الخاص بك
  //   return entities.map((entity) => BusinessMapper.toDomain(entity));
  // }


  // businesses/infrastructure/persistence/relational/repositories/business.repository.ts

  async findAllWithPagination({
    paginationOptions,
    filterOptions,
  }: {
    paginationOptions: IPaginationOptions;
    filterOptions?: { cityId?: string; zoneId?: string; serviceId?: string };
  }): Promise<Business[]> {
    const query = this.businessRepository.createQueryBuilder('business')
      .leftJoinAndSelect('business.service', 'service')
      .leftJoinAndSelect('business.flyer', 'flyer')
      .leftJoinAndSelect('business.contact', 'contact')
      .leftJoinAndSelect('contact.address', 'address')
      .leftJoinAndSelect('address.localisation', 'localisation');

    if (filterOptions?.serviceId) {
      query.andWhere('service.id = :serviceId', { serviceId: filterOptions.serviceId });
    }

    if (filterOptions?.cityId) {
      // Assuming your Address entity has a city relationship
      query.andWhere('address.cityId = :cityId', { cityId: filterOptions.cityId });
    }

    if (filterOptions?.zoneId) {
      // Assuming your Address entity has a zone/area relationship
      query.andWhere('address.zoneId = :zoneId', { zoneId: filterOptions.zoneId });
    }

    query
      .skip((paginationOptions.page - 1) * paginationOptions.limit)
      .take(paginationOptions.limit);

    const entities = await query.getMany();
    return entities.map((entity) => BusinessMapper.toDomain(entity));
  }

  async findById(id: Business['id']): Promise<NullableType<Business>> {
    const entity = await this.businessRepository.findOne({
      where: { id: id as string },
      relations: this.relations, // CRITICAL: Load the owner and manager
    });

    return entity ? BusinessMapper.toDomain(entity) : null;
  }

  async findByIds(ids: Business['id'][]): Promise<Business[]> {
    const entities = await this.businessRepository.find({
      where: { id: In(ids as string[]) },
      relations: this.relations,
    });

    return entities.map((entity) => BusinessMapper.toDomain(entity));
  }

  async update(
    id: Business['id'],
    payload: Partial<Business>,
  ): Promise<Business> {
    const entity = await this.businessRepository.findOne({
      where: { id: id as string },
      relations: this.relations,
    });

    if (!entity) {
      throw new Error('Record not found');
    }

    const updatedEntity = await this.businessRepository.save(
      this.businessRepository.create(
        BusinessMapper.toPersistence({
          ...BusinessMapper.toDomain(entity),
          ...payload,
        }),
      ),
    );

    return BusinessMapper.toDomain(updatedEntity);
  }

  async remove(id: Business['id']): Promise<void> {
    await this.businessRepository.delete(id);
  }
}
