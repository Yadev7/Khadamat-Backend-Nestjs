import { Report } from '../../../../domain/report';
import { BusinessMapper } from '../../../../../businesses/infrastructure/persistence/relational/mappers/business.mapper';

import { ReportEntity } from '../entities/report.entity';

export class ReportMapper {
  static toDomain(raw: ReportEntity): Report {
    const domainEntity = new Report();
    if (raw.business) {
      domainEntity.business = BusinessMapper.toDomain(raw.business);
    } else if (raw.business === null) {
      domainEntity.business = null;
    }

    // Multimedia and Text fields
    domainEntity.audio = raw.audio;
    domainEntity.textAr = raw.textAr;
    domainEntity.textFr = raw.textFr;
    domainEntity.titleAr = raw.titleAr;
    domainEntity.titleFr = raw.titleFr;

    // FIX: Cast to mandatory Domain types
    domainEntity.id = raw.id as string;
    domainEntity.createdAt = raw.createdAt as Date;
    domainEntity.updatedAt = raw.updatedAt as Date;

    return domainEntity;
  }

  static toPersistence(domainEntity: Report): ReportEntity {
    const persistenceEntity = new ReportEntity();
    if (domainEntity.business) {
      persistenceEntity.business = BusinessMapper.toPersistence(
        domainEntity.business,
      );
    }

    persistenceEntity.audio = domainEntity.audio;
    persistenceEntity.textAr = domainEntity.textAr;
    persistenceEntity.textFr = domainEntity.textFr;
    persistenceEntity.titleAr = domainEntity.titleAr;
    persistenceEntity.titleFr = domainEntity.titleFr;

    if (domainEntity.id) {
      persistenceEntity.id = domainEntity.id;
    }

    // Timestamps can be passed directly back to persistence
    persistenceEntity.createdAt = domainEntity.createdAt;
    persistenceEntity.updatedAt = domainEntity.updatedAt;

    return persistenceEntity;
  }
}
