import { Localisation } from '../../../../domain/localisation';

import { LocalisationEntity } from '../entities/localisation.entity';

export class LocalisationMapper {
  static toDomain(raw: LocalisationEntity): Localisation {
    const domainEntity = new Localisation();
    domainEntity.latitude = raw.latitude;
    domainEntity.longitude = raw.longitude;

    domainEntity.id = raw.id;
    domainEntity.createdAt = raw.createdAt;
    domainEntity.updatedAt = raw.updatedAt;

    return domainEntity;
  }

  static toPersistence(domainEntity: Localisation): LocalisationEntity {
    const persistenceEntity = new LocalisationEntity();
    persistenceEntity.latitude = domainEntity.latitude;
    persistenceEntity.longitude = domainEntity.longitude;

    if (domainEntity.id) {
      persistenceEntity.id = domainEntity.id;
    }
    persistenceEntity.createdAt = domainEntity.createdAt;
    persistenceEntity.updatedAt = domainEntity.updatedAt;

    return persistenceEntity;
  }
}
