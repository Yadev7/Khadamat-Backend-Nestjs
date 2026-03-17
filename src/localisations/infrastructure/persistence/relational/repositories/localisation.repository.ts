import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { LocalisationEntity } from '../entities/localisation.entity';
import { NullableType } from '../../../../../utils/types/nullable.type';
import { Localisation } from '../../../../domain/localisation';
import { LocalisationRepository } from '../../localisation.repository';
import { LocalisationMapper } from '../mappers/localisation.mapper';
import { IPaginationOptions } from '../../../../../utils/types/pagination-options';

@Injectable()
export class LocalisationRelationalRepository
  implements LocalisationRepository
{
  constructor(
    @InjectRepository(LocalisationEntity)
    private readonly localisationRepository: Repository<LocalisationEntity>,
  ) {}

  async create(data: Localisation): Promise<Localisation> {
    const persistenceModel = LocalisationMapper.toPersistence(data);
    const newEntity = await this.localisationRepository.save(
      this.localisationRepository.create(persistenceModel),
    );
    return LocalisationMapper.toDomain(newEntity);
  }

  async findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<Localisation[]> {
    const entities = await this.localisationRepository.find({
      skip: (paginationOptions.page - 1) * paginationOptions.limit,
      take: paginationOptions.limit,
    });

    return entities.map((entity) => LocalisationMapper.toDomain(entity));
  }

  async findById(id: Localisation['id']): Promise<NullableType<Localisation>> {
    const entity = await this.localisationRepository.findOne({
      where: { id },
    });

    return entity ? LocalisationMapper.toDomain(entity) : null;
  }

  async findByIds(ids: Localisation['id'][]): Promise<Localisation[]> {
    const entities = await this.localisationRepository.find({
      where: { id: In(ids) },
    });

    return entities.map((entity) => LocalisationMapper.toDomain(entity));
  }

  async update(
    id: Localisation['id'],
    payload: Partial<Localisation>,
  ): Promise<Localisation> {
    const entity = await this.localisationRepository.findOne({
      where: { id },
    });

    if (!entity) {
      throw new Error('Record not found');
    }

    const updatedEntity = await this.localisationRepository.save(
      this.localisationRepository.create(
        LocalisationMapper.toPersistence({
          ...LocalisationMapper.toDomain(entity),
          ...payload,
        }),
      ),
    );

    return LocalisationMapper.toDomain(updatedEntity);
  }

  async remove(id: Localisation['id']): Promise<void> {
    await this.localisationRepository.delete(id);
  }
}
