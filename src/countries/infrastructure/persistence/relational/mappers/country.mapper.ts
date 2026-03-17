import { Country } from '../../../../domain/country';

import { CountryEntity } from '../entities/country.entity';

export class CountryMapper {
  static toDomain(raw: CountryEntity): Country {
    const domainEntity = new Country();
    domainEntity.flagImg = raw.flagImg;

    domainEntity.nameEn = raw.nameEn;

    domainEntity.nameAr = raw.nameAr;

    domainEntity.nameFr = raw.nameFr;

    domainEntity.countryCode = raw.countryCode;

    domainEntity.id = raw.id;
    domainEntity.createdAt = raw.createdAt;
    domainEntity.updatedAt = raw.updatedAt;

    return domainEntity;
  }

  static toPersistence(domainEntity: Country): CountryEntity {
    const persistenceEntity = new CountryEntity();
    persistenceEntity.flagImg = domainEntity.flagImg;

    persistenceEntity.nameEn = domainEntity.nameEn;

    persistenceEntity.nameAr = domainEntity.nameAr;

    persistenceEntity.nameFr = domainEntity.nameFr;

    persistenceEntity.countryCode = domainEntity.countryCode;

    if (domainEntity.id) {
      persistenceEntity.id = domainEntity.id;
    }
    persistenceEntity.createdAt = domainEntity.createdAt ?? new Date();
    persistenceEntity.updatedAt = domainEntity.updatedAt ?? new Date();

    return persistenceEntity;
  }
}
