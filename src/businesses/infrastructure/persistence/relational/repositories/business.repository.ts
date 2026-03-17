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
  ) {}

  // Centralize relations to keep code DRY
  private readonly relations = ['contact', 'service', 'owner', 'manager'];

  async create(data: Business): Promise<Business> {
    const persistenceModel = BusinessMapper.toPersistence(data);
    const newEntity = await this.businessRepository.save(
      this.businessRepository.create(persistenceModel),
    );
    // Fetch again to get the full relations for the Domain object
    return this.findById(newEntity.id) as Promise<Business>;
  }

  async findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<Business[]> {
    const entities = await this.businessRepository.find({
      skip: (paginationOptions.page - 1) * paginationOptions.limit,
      take: paginationOptions.limit,
      relations: this.relations, // CRITICAL: Load the owner and manager
    });

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
