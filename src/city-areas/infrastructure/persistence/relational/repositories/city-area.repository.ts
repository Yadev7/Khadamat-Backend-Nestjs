import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { CityAreaEntity } from '../entities/city-area.entity';
import { NullableType } from '../../../../../utils/types/nullable.type';
import { CityArea } from '../../../../domain/city-area';
import { CityAreaRepository } from '../../city-area.repository';
import { CityAreaMapper } from '../mappers/city-area.mapper';
import { IPaginationOptions } from '../../../../../utils/types/pagination-options';
import { LocalisationEntity } from '../../../../../localisations/infrastructure/persistence/relational/entities/localisation.entity';

@Injectable()
export class CityAreaRelationalRepository implements CityAreaRepository {
  constructor(
    @InjectRepository(CityAreaEntity)
    private readonly cityAreaRepository: Repository<CityAreaEntity>,
  ) {}

  async create(data: CityArea): Promise<CityArea> {
    const persistenceModel = CityAreaMapper.toPersistence(data);
    const newEntity = await this.cityAreaRepository.save(
      this.cityAreaRepository.create(persistenceModel),
    );
    return CityAreaMapper.toDomain(newEntity);
  }

  // async findAllWithPagination({
  //   paginationOptions,
  // }: {
  //   paginationOptions: IPaginationOptions;
  // }): Promise<CityArea[]> {
  //   const entities = await this.cityAreaRepository.find({
  //     skip: (paginationOptions.page - 1) * paginationOptions.limit,
  //     take: paginationOptions.limit,
  //   });

  //   return entities.map((entity) => CityAreaMapper.toDomain(entity));
  // }

  // src/city-areas/infrastructure/persistence/relational/repositories/city-area.repository.ts

  async findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<CityArea[]> {
    // هنا المستودع يمتلك الصلاحية للوصول لـ TypeORM
    const entities = await this.cityAreaRepository.find({
      skip: (paginationOptions.page - 1) * paginationOptions.limit,
      take: paginationOptions.limit,
      // --- هذا هو السطر المطلوب لحل مشكلة المناطق الفارغة ---
      relations: ['city', 'localisation'],
    });

    // الماپر يحول الكائنات من شكل قاعدة البيانات إلى شكل التطبيق
    return entities.map((entity) => CityAreaMapper.toDomain(entity));
  }

  async findById(id: CityArea['id']): Promise<NullableType<CityArea>> {
    const entity = await this.cityAreaRepository.findOne({
      where: { id },
      relations: ['city', 'localisation'],
    });

    return entity ? CityAreaMapper.toDomain(entity) : null;
  }

  async findByIds(ids: CityArea['id'][]): Promise<CityArea[]> {
    const entities = await this.cityAreaRepository.find({
      where: { id: In(ids) },
      relations: ['city', 'localisation'],
    });

    return entities.map((entity) => CityAreaMapper.toDomain(entity));
  }

  async update(
    id: CityArea['id'],
    payload: Partial<CityArea>,
  ): Promise<CityArea> {
    const entity = await this.cityAreaRepository.findOne({
      where: { id },
      relations: ['localisation', 'city'], // Load relations to merge correctly
    });

    if (!entity) {
      throw new Error('Record not found');
    }

    const mergedDomain = {
      ...CityAreaMapper.toDomain(entity),
      ...payload,
    };
    const persistenceModel = CityAreaMapper.toPersistence(mergedDomain);

    Object.assign(entity, persistenceModel);

    if (persistenceModel.localisation) {
      entity.localisation = Object.assign(
        entity.localisation || new LocalisationEntity(),
        persistenceModel.localisation,
      );
    } else if (persistenceModel.localisation === null) {
      entity.localisation = null;
    }

    const updatedEntity = await this.cityAreaRepository.save(entity);

    return CityAreaMapper.toDomain(updatedEntity);
  }

  async remove(id: CityArea['id']): Promise<void> {
    await this.cityAreaRepository.delete(id);
  }
}
