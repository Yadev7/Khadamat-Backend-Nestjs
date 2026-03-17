import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { CityEntity } from '../entities/city.entity';
import { NullableType } from '../../../../../utils/types/nullable.type';
import { City } from '../../../../domain/city';
import { CityRepository } from '../../city.repository';
import { CityMapper } from '../mappers/city.mapper';
import { IPaginationOptions } from '../../../../../utils/types/pagination-options';
@Injectable()
export class CityRelationalRepository implements CityRepository {
  constructor(
    @InjectRepository(CityEntity)
    private readonly cityRepository: Repository<CityEntity>,
  ) {}
  async create(data: City): Promise<City> {
    const persistenceModel = CityMapper.toPersistence(data);
    const newEntity = await this.cityRepository.save(
      this.cityRepository.create(persistenceModel),
    );
    return CityMapper.toDomain(newEntity);
  }

  async findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<City[]> {
    const entities = await this.cityRepository.find({
      skip: (paginationOptions.page - 1) * paginationOptions.limit,
      take: paginationOptions.limit,
    });

    return entities.map((entity) => CityMapper.toDomain(entity));
  }

  async findById(id: City['id']): Promise<NullableType<City>> {
    const entity = await this.cityRepository.findOne({
      where: { id },
    });

    return entity ? CityMapper.toDomain(entity) : null;
  }

  async findByIds(ids: City['id'][]): Promise<City[]> {
    const entities = await this.cityRepository.find({
      where: { id: In(ids) },
    });

    return entities.map((entity) => CityMapper.toDomain(entity));
  }

  async update(id: City['id'], payload: Partial<City>): Promise<City> {
    const entity = await this.cityRepository.findOne({
      where: { id },
    });

    if (!entity) {
      throw new Error('Record not found');
    }

    const updatedEntity = await this.cityRepository.save(
      this.cityRepository.create(
        CityMapper.toPersistence({
          ...CityMapper.toDomain(entity),
          ...payload,
        }),
      ),
    );

    return CityMapper.toDomain(updatedEntity);
  }

  async remove(id: City['id']): Promise<void> {
    await this.cityRepository.delete(id!);
  }
}
