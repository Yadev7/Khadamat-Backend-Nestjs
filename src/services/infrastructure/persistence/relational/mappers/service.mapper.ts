import { Service } from '../../../../domain/service';
import { FileMapper } from '../../../../../files/infrastructure/persistence/relational/mappers/file.mapper';

import { ServiceEntity } from '../entities/service.entity';

export class ServiceMapper {
  static toDomain(raw: ServiceEntity): Service {
    const domainEntity = new Service();
    if (raw.image) {
      domainEntity.image = FileMapper.toDomain(raw.image);
    } else if (raw.image === null) {
      domainEntity.image = null;
    }

    domainEntity.descrEn = raw.descrEn;

    domainEntity.descrAr = raw.descrAr;

    domainEntity.descrFr = raw.descrFr;

    domainEntity.nameServEn = raw.nameServEn;

    domainEntity.nameServAr = raw.nameServAr;

    domainEntity.nameServFr = raw.nameServFr;

    domainEntity.id = raw.id;
    domainEntity.createdAt = raw.createdAt;
    domainEntity.updatedAt = raw.updatedAt;

    return domainEntity;
  }

  static toPersistence(domainEntity: Service): ServiceEntity {
    const persistenceEntity = new ServiceEntity();
    if (domainEntity.image) {
      persistenceEntity.image = FileMapper.toPersistence(domainEntity.image);
    } else if (domainEntity.image === null) {
      persistenceEntity.image = null;
    }

    persistenceEntity.descrEn = domainEntity.descrEn;

    persistenceEntity.descrAr = domainEntity.descrAr;

    persistenceEntity.descrFr = domainEntity.descrFr;

    persistenceEntity.nameServEn = domainEntity.nameServEn;

    persistenceEntity.nameServAr = domainEntity.nameServAr;

    persistenceEntity.nameServFr = domainEntity.nameServFr;

    if (domainEntity.id) {
      persistenceEntity.id = domainEntity.id;
    }
    persistenceEntity.createdAt = domainEntity.createdAt;
    persistenceEntity.updatedAt = domainEntity.updatedAt;

    return persistenceEntity;
  }
}
