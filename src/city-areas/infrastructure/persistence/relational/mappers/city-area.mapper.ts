import { CityArea } from '../../../../domain/city-area';
import { LocalisationMapper } from '../../../../../localisations/infrastructure/persistence/relational/mappers/localisation.mapper';

import { CityMapper } from '../../../../../cities/infrastructure/persistence/relational/mappers/city.mapper';

import { CityAreaEntity } from '../entities/city-area.entity';

export class CityAreaMapper {
  static toDomain(raw: CityAreaEntity): CityArea {
    const domainEntity = new CityArea();
    if (raw.localisation) {
      domainEntity.localisation = LocalisationMapper.toDomain(raw.localisation);
    } else if (raw.localisation === null) {
      domainEntity.localisation = null;
    }

    if (raw.localisation) {
      domainEntity.localisation = LocalisationMapper.toDomain(raw.localisation);
    } else if (raw.localisation === null) {
      domainEntity.localisation = null;
    }

    if (raw.city) {
      domainEntity.city = CityMapper.toDomain(raw.city);
    } else if (raw.city === null) {
      domainEntity.city = null;
    }

    domainEntity.nameAr = raw.nameAr;

    domainEntity.nameFr = raw.nameFr;

    domainEntity.id = raw.id;
    domainEntity.createdAt = raw.createdAt;
    domainEntity.updatedAt = raw.updatedAt;

    return domainEntity;
  }

  static toPersistence(domainEntity: CityArea): CityAreaEntity {
    const persistenceEntity = new CityAreaEntity();
    if (domainEntity.localisation) {
      persistenceEntity.localisation = LocalisationMapper.toPersistence(
        domainEntity.localisation,
      );
    } else if (domainEntity.localisation === null) {
      persistenceEntity.localisation = null;
    }

    if (domainEntity.localisation) {
      persistenceEntity.localisation = LocalisationMapper.toPersistence(
        domainEntity.localisation,
      );
    } else if (domainEntity.localisation === null) {
      persistenceEntity.localisation = null;
    }

    if (domainEntity.city) {
      persistenceEntity.city = CityMapper.toPersistence(domainEntity.city);
    } else if (domainEntity.city === null) {
      persistenceEntity.city = null;
    }

    persistenceEntity.nameAr = domainEntity.nameAr;

    persistenceEntity.nameFr = domainEntity.nameFr;

    if (domainEntity.id) {
      persistenceEntity.id = domainEntity.id;
    }
    persistenceEntity.createdAt = domainEntity.createdAt;
    persistenceEntity.updatedAt = domainEntity.updatedAt;

    return persistenceEntity;
  }
}
