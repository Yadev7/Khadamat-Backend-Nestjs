import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In, EntityManager, SelectQueryBuilder } from 'typeorm';
import { BusinessEntity } from '../entities/business.entity';
import { Business } from '../../../../domain/business';
import {
  BusinessFilterOptions,
  BusinessListResult,
  BusinessRepository,
} from '../../business.repository';
import { BusinessMapper } from '../mappers/business.mapper';
import { IPaginationOptions } from '../../../../../utils/types/pagination-options';
import { DeepPartial } from 'src/utils/types/deep-partial.type';

const BUSINESS_RELATION_JOINS: Record<string, string> = {
  service: 'business.service',
  flyer: 'business.flyer',
  localisation: 'business.localisation',
  contact: 'business.contact',
  address: 'contact.address',
  city: 'address.city',
  zone: 'address.zone',
  country: 'address.country',
  addressLocalisation: 'address.localisation',
  businessAddress: 'business.Address',
  businessAddressCity: 'businessAddress.city',
  businessAddressZone: 'businessAddress.zone',
  businessAddressCountry: 'businessAddress.country',
  businessAddressLocalisation: 'businessAddress.localisation',
  owner: 'business.owner',
  manager: 'business.manager',
  audioAr: 'business.audioAr',
  audioFr: 'business.audioFr',
  audioEn: 'business.audioEn',
  videoAr: 'business.videoAr',
  videoFr: 'business.videoFr',
  videoEn: 'business.videoEn',
};

const BUSINESS_RELATION_ALIASES: Record<string, string[]> = {
  service: ['service'],
  flyer: ['flyer'],
  localisation: ['localisation'],
  contact: ['contact'],
  Address: ['businessAddress'],
  'Address.city': ['businessAddress', 'businessAddressCity'],
  'Address.zone': ['businessAddress', 'businessAddressZone'],
  'Address.country': ['businessAddress', 'businessAddressCountry'],
  'Address.localisation': ['businessAddress', 'businessAddressLocalisation'],
  'contact.address': ['contact', 'address'],
  'contact.address.city': ['contact', 'address', 'city'],
  'contact.address.zone': ['contact', 'address', 'zone'],
  'contact.address.country': ['contact', 'address', 'country'],
  'contact.address.localisation': ['contact', 'address', 'addressLocalisation'],
  owner: ['owner'],
  manager: ['manager'],
  audioAr: ['audioAr'],
  audioFr: ['audioFr'],
  audioEn: ['audioEn'],
  videoAr: ['videoAr'],
  videoFr: ['videoFr'],
  videoEn: ['videoEn'],
};

const FILTER_ALIASES: Record<'cityId' | 'zoneId', string[]> = {
  cityId: [
    'contact',
    'address',
    'city',
    'businessAddress',
    'businessAddressCity',
  ],
  zoneId: [
    'contact',
    'address',
    'zone',
    'businessAddress',
    'businessAddressZone',
  ],
};

const getJoinLevel = (key: string): number => {
  if (['service', 'flyer', 'localisation', 'contact', 'businessAddress', 'owner', 'manager', 'audioAr', 'audioFr', 'audioEn', 'videoAr', 'videoFr', 'videoEn'].includes(key)) {
    return 1;
  }
  if (['address', 'businessAddressCity', 'businessAddressZone', 'businessAddressCountry', 'businessAddressLocalisation'].includes(key)) {
    return 2;
  }
  return 3;
};

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
        Address: {
          localisation: true,
          city: true,
          zone: true,
          country: true,
        },
        localisation: true,
        owner: true,
        manager: true,
      },
    });

    if (!entity) return null;

    return BusinessMapper.toDomain(entity);
  }

  async findAllWithPagination({
    paginationOptions,
    filterOptions,
    relations,
  }: {
    paginationOptions: IPaginationOptions;
    filterOptions?: BusinessFilterOptions;
    relations?: string;
  }): Promise<BusinessListResult> {
    const cityId = filterOptions?.cityId?.trim() || undefined;
    const zoneId = filterOptions?.zoneId?.trim() || undefined;
    const serviceId = 
      filterOptions?.serviceId?.trim() || 
      (filterOptions as any)?.service?.trim() || 
      undefined;

    const selectedAliases = new Set<string>();
    const joinedAliases = new Set<string>();

    const join = (alias: string, select: boolean) => {
      joinedAliases.add(alias);
      if (select) selectedAliases.add(alias);
    };

    const requested = (relations ?? '')
      .split(',')
      .map((name) => name.trim())
      .filter(Boolean);

    for (const name of requested) {
      const aliases = BUSINESS_RELATION_ALIASES[name];
      if (!aliases) continue;
      for (const alias of aliases) join(alias, true);
    }

    if (serviceId) join('service', false);
    join('localisation', false);
    join('businessAddress', false);
    join('businessAddressLocalisation', false);
    if (cityId) for (const alias of FILTER_ALIASES.cityId) join(alias, false);
    if (zoneId) for (const alias of FILTER_ALIASES.zoneId) join(alias, false);

    const queryBuilder: SelectQueryBuilder<BusinessEntity> =
      this.repository.createQueryBuilder('business');

    const orderedJoins = Array.from(joinedAliases).sort(
      (a, b) => getJoinLevel(a) - getJoinLevel(b),
    );

    for (const alias of orderedJoins) {
      const path = BUSINESS_RELATION_JOINS[alias];
      if (!path) continue;
      if (selectedAliases.has(alias)) {
        queryBuilder.leftJoinAndSelect(path, alias);
      } else {
        queryBuilder.leftJoin(path, alias);
      }
    }

    if (serviceId) {
      queryBuilder.andWhere('service.id = :serviceId', { serviceId });
    }

    if (cityId) {
      queryBuilder.andWhere(
        '(city.id = :cityId OR businessAddressCity.id = :cityId)',
        { cityId },
      );
    }

    if (zoneId) {
      const zoneClause = cityId
        ? '(zone.id = :zoneId OR businessAddressZone.id = :zoneId OR ((zone.id IS NULL) AND (businessAddressZone.id IS NULL) AND (city.id = :cityId OR businessAddressCity.id = :cityId)))'
        : '(zone.id = :zoneId OR businessAddressZone.id = :zoneId)';
      queryBuilder.andWhere(zoneClause, { zoneId, cityId });
    }

    queryBuilder
      .orderBy('business.createdAt', 'DESC')
      .addOrderBy('business.id', 'ASC');

    const [entities, total] = await queryBuilder
      .skip((paginationOptions.page - 1) * paginationOptions.limit)
      .take(paginationOptions.limit)
      .getManyAndCount();

    return {
      items: entities.map((entity) => BusinessMapper.toDomain(entity)),
      total,
    };
  }

  async update(
    id: Business['id'],
    payload: DeepPartial<Business>,
    transactionManager?: EntityManager,
  ): Promise<Business | null> {
    const repo = transactionManager
      ? transactionManager.getRepository(BusinessEntity)
      : this.repository;
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
    const entities = await this.repository.find({
      where: { id: In(ids as string[]) },
    });
    return entities.map((entity) => BusinessMapper.toDomain(entity));
  }
}