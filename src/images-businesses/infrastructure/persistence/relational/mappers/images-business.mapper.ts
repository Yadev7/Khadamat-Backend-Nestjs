import { ImagesBusiness } from '../../../../domain/images-business';
import { FileMapper } from '../../../../../files/infrastructure/persistence/relational/mappers/file.mapper';

import { BusinessMapper } from '../../../../../businesses/infrastructure/persistence/relational/mappers/business.mapper';

import { ImagesBusinessEntity } from '../entities/images-business.entity';

export class ImagesBusinessMapper {
  static toDomain(raw: ImagesBusinessEntity): ImagesBusiness {
    const domainEntity = new ImagesBusiness();

    if (raw.file) {
      domainEntity.file = FileMapper.toDomain(raw.file);
    } else if (raw.file === null) {
      domainEntity.file = null;
    }

    if (raw.business) {
      domainEntity.business = BusinessMapper.toDomain(raw.business);
    } else if (raw.business === null) {
      domainEntity.business = null;
    }

    // FIX: Use type casting to match mandatory domain fields
    domainEntity.id = raw.id as string;
    domainEntity.createdAt = raw.createdAt as Date;
    domainEntity.updatedAt = raw.updatedAt as Date;

    return domainEntity;
  }

  static toPersistence(domainEntity: ImagesBusiness): ImagesBusinessEntity {
    const persistenceEntity = new ImagesBusinessEntity();

    if (domainEntity.file) {
      persistenceEntity.file = FileMapper.toPersistence(domainEntity.file);
    }

    if (domainEntity.business) {
      persistenceEntity.business = BusinessMapper.toPersistence(
        domainEntity.business,
      );
    }

    if (domainEntity.id) {
      persistenceEntity.id = domainEntity.id;
    }

    persistenceEntity.createdAt = domainEntity.createdAt;
    persistenceEntity.updatedAt = domainEntity.updatedAt;

    return persistenceEntity;
  }
}
