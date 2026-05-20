import { Country } from '../../../../domain/country';

import { CountryEntity } from '../entities/country.entity';
import { LocalisationMapper } from '../../../../../localisations/infrastructure/persistence/relational/mappers/localisation.mapper';
import { FileMapper } from '../../../../../files/infrastructure/persistence/relational/mappers/file.mapper';

export class CountryMapper {
  static toDomain(raw: CountryEntity): Country {
    const domainEntity = new Country();
    if (raw.flagImg) {
      domainEntity.flagImg = FileMapper.toDomain(raw.flagImg);
    } else if (raw.flagImg === null) {
      domainEntity.flagImg = null;
    }

    domainEntity.nameEn = raw.nameEn;

    domainEntity.nameAr = raw.nameAr;

    domainEntity.nameFr = raw.nameFr;

    domainEntity.countryCode = raw.countryCode;

    if (raw.localisation) {
      domainEntity.localisation = LocalisationMapper.toDomain(raw.localisation);
    } else if (raw.localisation === null) {
      domainEntity.localisation = null;
    }

    domainEntity.id = raw.id;
    domainEntity.createdAt = raw.createdAt;
    domainEntity.updatedAt = raw.updatedAt;

    return domainEntity;
  }

  static toPersistence(domainEntity: Country): CountryEntity {
    const persistenceEntity = new CountryEntity();
    if (domainEntity.flagImg) {
      persistenceEntity.flagImg = FileMapper.toPersistence(
        domainEntity.flagImg,
      );
    } else if (domainEntity.flagImg === null) {
      persistenceEntity.flagImg = null;
    }

    persistenceEntity.nameEn = domainEntity.nameEn;

    persistenceEntity.nameAr = domainEntity.nameAr;

    persistenceEntity.nameFr = domainEntity.nameFr;

    persistenceEntity.countryCode = domainEntity.countryCode;

    if (domainEntity.localisation) {
      persistenceEntity.localisation = LocalisationMapper.toPersistence(
        domainEntity.localisation,
      );
    } else if (domainEntity.localisation === null) {
      persistenceEntity.localisation = null;
    }

    if (domainEntity.id) {
      persistenceEntity.id = domainEntity.id;
    }
    persistenceEntity.createdAt = domainEntity.createdAt ?? new Date();
    persistenceEntity.updatedAt = domainEntity.updatedAt ?? new Date();

    return persistenceEntity;
  }
}
