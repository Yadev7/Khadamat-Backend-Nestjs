import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { CityEntity } from '../entities/city.entity';
import { NullableType } from '../../../../../utils/types/nullable.type';
import { City } from '../../../../domain/city';
import { CityRepository } from '../../city.repository';
import { CityMapper } from '../mappers/city.mapper';
import { IPaginationOptions } from '../../../../../utils/types/pagination-options';
import { LocalisationEntity } from '../../../../../localisations/infrastructure/persistence/relational/entities/localisation.entity';

@Injectable()
export class CityRelationalRepository implements CityRepository {
  constructor(
    @InjectRepository(CityEntity)
    private readonly cityRepository: Repository<CityEntity>,
  ) { }
  // async create(data: City): Promise<City> {
  //   const persistenceModel = CityMapper.toPersistence(data);
  //   const newEntity = await this.cityRepository.save(
  //     this.cityRepository.create(persistenceModel),
  //   );
  //   return CityMapper.toDomain(newEntity);
  // }

  async create(data: City): Promise<City> {
    const persistenceModel = CityMapper.toPersistence(data);
    const newEntity = await this.cityRepository.save(
      this.cityRepository.create(persistenceModel), // 👈 هنا المشكلة الكامنة!
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
    // 1. جلب الـ Entity الحالية شاملة العلاقات من قاعدة البيانات
    const entity = await this.cityRepository.findOne({
      where: { id },
      relations: ['localisation', 'country'], // تأكيد جلب العلاقات لمنع تجاوزها بـ null
    });

    if (!entity) {
      throw new Error('Record not found');
    }

    // 2. تحويل الـ Payload القادم من السيرفيس إلى شكل Persistence Entity
    // ندمج أولاً على مستوى الدومين للتأكد من سلامة منطق البزنس
    const mergedDomain = {
      ...CityMapper.toDomain(entity),
      ...payload,
    };
    const persistenceModel = CityMapper.toPersistence(mergedDomain);

    // 3. دمج التغييرات الجديدة مباشرة فوق كائن الـ Entity المُجلب لتحديثه بذكاء
    Object.assign(entity, persistenceModel);

    // إذا تم إرسال كائن موقع محدث، ندمجه مع كائن الموقع التابع للـ Entity الأصلية
    if (persistenceModel.localisation) {
      entity.localisation = Object.assign(entity.localisation || new LocalisationEntity(), persistenceModel.localisation);
    } else if (persistenceModel.localisation === null) {
      entity.localisation = null;
    }

    // 4. الحفظ النهائي، سيتولى TypeORM تحديث جدول city وجدول localisation بالتتابع الذكي
    const updatedEntity = await this.cityRepository.save(entity);

    return CityMapper.toDomain(updatedEntity);
  }

  async remove(id: City['id']): Promise<void> {
    await this.cityRepository.delete(id!);
  }
}
