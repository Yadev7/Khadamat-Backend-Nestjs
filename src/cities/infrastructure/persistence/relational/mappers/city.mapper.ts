import { City } from '../../../../domain/city';
import { CountryMapper } from '../../../../../countries/infrastructure/persistence/relational/mappers/country.mapper';

import { CityEntity } from '../entities/city.entity';

export class CityMapper {
  static toDomain(raw: CityEntity): City {
    const domainEntity = new City();
    if (raw.country) {
      domainEntity.country = CountryMapper.toDomain(raw.country);
    } else if (raw.country === null) {
      domainEntity.country = null;
    }

    domainEntity.nameEn = raw.nameEn;

    domainEntity.nameAr = raw.nameAr;

    domainEntity.nameFr = raw.nameFr;

    domainEntity.lat = raw.lat;
    domainEntity.lng = raw.lng;

    domainEntity.id = raw.id;
    domainEntity.createdAt = raw.createdAt;
    domainEntity.updatedAt = raw.updatedAt;
    return domainEntity;
  }

  static toPersistence(domainEntity: City): CityEntity {
    const persistenceEntity = new CityEntity();
    if (domainEntity.country) {
      persistenceEntity.country = CountryMapper.toPersistence(
        domainEntity.country,
      );
    } else if (domainEntity.country === null) {
      persistenceEntity.country = null;
    }

    persistenceEntity.nameEn = domainEntity.nameEn;

    persistenceEntity.nameAr = domainEntity.nameAr;

    persistenceEntity.nameFr = domainEntity.nameFr;

    persistenceEntity.lat = domainEntity.lat;
    persistenceEntity.lng = domainEntity.lng;

    if (domainEntity.id) {
      persistenceEntity.id = domainEntity.id;
    }
    persistenceEntity.createdAt = domainEntity.createdAt!;
    persistenceEntity.updatedAt = domainEntity.updatedAt!;
    return persistenceEntity;
  }
}
