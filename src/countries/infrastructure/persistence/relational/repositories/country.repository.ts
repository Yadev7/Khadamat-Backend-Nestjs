import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { CountryEntity } from '../entities/country.entity';
import { NullableType } from '../../../../../utils/types/nullable.type';
import { Country } from '../../../../domain/country';
import { CountryRepository } from '../../country.repository';
import { CountryMapper } from '../mappers/country.mapper';
import { IPaginationOptions } from '../../../../../utils/types/pagination-options';
import { LocalisationEntity } from '../../../../../localisations/infrastructure/persistence/relational/entities/localisation.entity';

@Injectable()
export class CountryRelationalRepository implements CountryRepository {
  constructor(
    @InjectRepository(CountryEntity)
    private readonly countryRepository: Repository<CountryEntity>,
  ) {}

  async create(data: Country): Promise<Country> {
    const persistenceModel = CountryMapper.toPersistence(data);
    const newEntity = await this.countryRepository.save(
      this.countryRepository.create(persistenceModel),
    );
    return CountryMapper.toDomain(newEntity);
  }

  async findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<Country[]> {
    const entities = await this.countryRepository.find({
      skip: (paginationOptions.page - 1) * paginationOptions.limit,
      take: paginationOptions.limit,
      relations: ['localisation', 'flagImg'],
    });

    return entities.map((entity) => CountryMapper.toDomain(entity));
  }

  async findById(id: Country['id']): Promise<NullableType<Country>> {
    const entity = await this.countryRepository.findOne({
      where: { id },
      relations: ['localisation', 'flagImg'],
    });

    return entity ? CountryMapper.toDomain(entity) : null;
  }

  async findByIds(ids: Country['id'][]): Promise<Country[]> {
    const entities = await this.countryRepository.find({
      where: { id: In(ids) },
      relations: ['localisation', 'flagImg'],
    });

    return entities.map((entity) => CountryMapper.toDomain(entity));
  }

  async update(id: Country['id'], payload: Partial<Country>): Promise<Country> {
    const entity = await this.countryRepository.findOne({
      where: { id },
      relations: ['localisation', 'flagImg'],
    });

    if (!entity) {
      throw new Error('Record not found');
    }

    const mergedDomain = {
      ...CountryMapper.toDomain(entity),
      ...payload,
    };
    const persistenceModel = CountryMapper.toPersistence(mergedDomain);

    Object.assign(entity, persistenceModel);

    if (persistenceModel.localisation) {
      entity.localisation = Object.assign(entity.localisation || new LocalisationEntity(), persistenceModel.localisation);
    } else if (persistenceModel.localisation === null) {
      entity.localisation = null;
    }

    const updatedEntity = await this.countryRepository.save(entity);

    return CountryMapper.toDomain(updatedEntity);
  }

  async remove(id: Country['id']): Promise<void> {
    if (!id) {
      throw new Error('Id is required');
    }
    await this.countryRepository.delete(id);
  }
}
