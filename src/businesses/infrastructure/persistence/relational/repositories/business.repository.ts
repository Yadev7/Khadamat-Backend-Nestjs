import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In, EntityManager } from 'typeorm';
import { BusinessEntity } from '../entities/business.entity';
import { NullableType } from '../../../../../utils/types/nullable.type';
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

  async create(
    data: Business,
    transactionManager?: EntityManager,
  ): Promise<Business> {
    const persistenceModel = BusinessMapper.toPersistence(data);
    const repo = transactionManager
      ? transactionManager.getRepository(BusinessEntity)
      : this.repository;

    const newEntity = await repo.save(repo.create(persistenceModel));
    return BusinessMapper.toDomain(newEntity);
  }

  async findAllWithPagination({
    paginationOptions,
    filterOptions,
  }: {
    paginationOptions: IPaginationOptions;
    filterOptions?: { cityId?: string; zoneId?: string; serviceId?: string };
  }): Promise<Business[]> {
    const query = this.repository
      .createQueryBuilder('business')
      .leftJoinAndSelect('business.owner', 'owner')
      .leftJoinAndSelect('business.contact', 'contact')
      .leftJoinAndSelect('contact.address', 'address')
      .leftJoinAndSelect('business.service', 'service')
      .leftJoinAndSelect('business.flyer', 'flyer');

    if (filterOptions?.serviceId) {
      query.andWhere('service.id = :serviceId', {
        serviceId: filterOptions.serviceId,
      });
    }

    if (filterOptions?.cityId) {
      // نفترض أن العلاقة هي address -> city
      query.andWhere('address.cityId = :cityId', {
        cityId: filterOptions.cityId,
      });
    }

    if (filterOptions?.zoneId) {
      query.andWhere('address.zoneId = :zoneId', {
        zoneId: filterOptions.zoneId,
      });
    }

    query
      .skip((paginationOptions.page - 1) * paginationOptions.limit)
      .take(paginationOptions.limit);

    const entities = await query.getMany();
    return entities.map((entity) => BusinessMapper.toDomain(entity));
  }

  async findById(id: Business['id']): Promise<NullableType<Business>> {
    const entity = await this.repository.findOne({
      where: { id: id as string },
      relations: ['owner', 'contact', 'contact.address', 'service', 'flyer'],
    });

    return entity ? BusinessMapper.toDomain(entity) : null;
  }

  async update(
    id: Business['id'],
    payload: DeepPartial<Business>,
    transactionManager?: EntityManager, // أضفنا هذا لدعم التحديث داخل Transaction
  ): Promise<Business | null> {
    const repo = transactionManager
      ? transactionManager.getRepository(BusinessEntity)
      : this.repository;

    const entity = await repo.findOne({
      where: { id: id as string },
    });

    if (!entity) return null;

    // نقوم بعمل merge للبيانات الجديدة مع الكيان الحالي
    const updatedEntity = await repo.save(
      repo.merge(entity, BusinessMapper.toPersistence(payload as Business)),
    );

    return BusinessMapper.toDomain(updatedEntity);
  }

  async remove(id: Business['id']): Promise<void> {
    await this.repository.delete(id);
  }

  async findByIds(ids: Business['id'][]): Promise<Business[]> {
    const entities = await this.repository.find({
      where: { id: In(ids as string[]) },
    });
    return entities.map((entity) => BusinessMapper.toDomain(entity));
  }
}
