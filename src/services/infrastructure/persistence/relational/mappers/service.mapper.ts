import { Service } from '../../../../domain/service';
import { FileMapper } from '../../../../../files/infrastructure/persistence/relational/mappers/file.mapper';
import { ServiceEntity } from '../entities/service.entity';
import { FileEntity } from '../../../../../files/infrastructure/persistence/relational/entities/file.entity';

export class ServiceMapper {
  static toDomain(raw: ServiceEntity): Service {
    const domainEntity = new Service();

    if (raw.video) {
      domainEntity.video = FileMapper.toDomain(raw.video);
    } else {
      domainEntity.video = null;
    }

    if (raw.image) {
      domainEntity.image = FileMapper.toDomain(raw.image);
    } else {
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

    // Mapping Video
    if (domainEntity.video && domainEntity.video.id) {
      const videoEntity = new FileEntity();
      videoEntity.id = domainEntity.video.id;
      persistenceEntity.video = videoEntity;
      // Force the physical column value
      persistenceEntity.videoId = domainEntity.video.id as string;
    } else if (domainEntity.video === null) {
      persistenceEntity.video = null;
      persistenceEntity.videoId = null;
    }

    // Mapping Image (Fixes empty imageId in pgAdmin)
    if (domainEntity.image && domainEntity.image.id) {
      const imageEntity = new FileEntity();
      imageEntity.id = domainEntity.image.id;
      persistenceEntity.image = imageEntity;
      // Force the physical column value for Postgres
      persistenceEntity.imageId = domainEntity.image.id as string;
    } else if (domainEntity.image === null) {
      persistenceEntity.image = null;
      persistenceEntity.imageId = null;
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

    return persistenceEntity;
  }
}
