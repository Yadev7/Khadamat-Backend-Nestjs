import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { SelectedBusinessEntity } from '../entities/selected-business.entity';
import { NullableType } from '../../../../../utils/types/nullable.type';
import { SelectedBusiness } from '../../../../domain/selected-business';
import { SelectedBusinessRepository } from '../../selected-business.repository';
import { SelectedBusinessMapper } from '../mappers/selected-business.mapper';
import { IPaginationOptions } from '../../../../../utils/types/pagination-options';

@Injectable()
export class SelectedBusinessRelationalRepository
  implements SelectedBusinessRepository
{
  constructor(
    @InjectRepository(SelectedBusinessEntity)
    private readonly selectedBusinessRepository: Repository<SelectedBusinessEntity>,
  ) {}

  // FIX 1: Add the count method for the Service's <20 check
  async count(): Promise<number> {
    return this.selectedBusinessRepository.count();
  }

  async create(data: SelectedBusiness): Promise<SelectedBusiness> {
    const persistenceModel = SelectedBusinessMapper.toPersistence(data);
    const newEntity = await this.selectedBusinessRepository.save(
      this.selectedBusinessRepository.create(persistenceModel),
    );
    return SelectedBusinessMapper.toDomain(newEntity);
  }

  async findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<SelectedBusiness[]> {
    const entities = await this.selectedBusinessRepository.find({
      // FIX 2: Load business relation so Mapper can see it
      relations: ['business'],
      skip: (paginationOptions.page - 1) * paginationOptions.limit,
      take: paginationOptions.limit,
    });

    return entities.map((entity) => SelectedBusinessMapper.toDomain(entity));
  }

  async findById(
    id: SelectedBusiness['id'],
  ): Promise<NullableType<SelectedBusiness>> {
    const entity = await this.selectedBusinessRepository.findOne({
      where: { id },
      relations: ['business'], // FIX 3: Load here too
    });

    return entity ? SelectedBusinessMapper.toDomain(entity) : null;
  }

  async findByIds(ids: SelectedBusiness['id'][]): Promise<SelectedBusiness[]> {
    const entities = await this.selectedBusinessRepository.find({
      where: { id: In(ids) },
      relations: ['business'],
    });

    return entities.map((entity) => SelectedBusinessMapper.toDomain(entity));
  }

  async update(
    id: SelectedBusiness['id'],
    payload: Partial<SelectedBusiness>,
  ): Promise<SelectedBusiness> {
    const entity = await this.selectedBusinessRepository.findOne({
      where: { id },
      relations: ['business'],
    });

    if (!entity) {
      throw new Error('Record not found');
    }

    const updatedEntity = await this.selectedBusinessRepository.save(
      this.selectedBusinessRepository.create(
        SelectedBusinessMapper.toPersistence({
          ...SelectedBusinessMapper.toDomain(entity),
          ...payload,
        }),
      ),
    );

    return SelectedBusinessMapper.toDomain(updatedEntity);
  }

  async remove(id: SelectedBusiness['id']): Promise<void> {
    await this.selectedBusinessRepository.delete(id!);
  }
}
