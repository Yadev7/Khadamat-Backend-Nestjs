import { Call } from '../../../../domain/call';
import { BusinessMapper } from '../../../../../businesses/infrastructure/persistence/relational/mappers/business.mapper';

import { CallEntity } from '../entities/call.entity';

export class CallMapper {
  static toDomain(raw: CallEntity): Call {
    const domainEntity = new Call();
    if (raw.business) {
      domainEntity.business = BusinessMapper.toDomain(raw.business);
    } else if (raw.business === null) {
      domainEntity.business = null;
    }

    domainEntity.callType = raw.callType;

    domainEntity.time = raw.time;

    domainEntity.date = raw.date;

    domainEntity.id = raw.id as string;
    domainEntity.createdAt = raw.createdAt as Date;
    domainEntity.updatedAt = raw.updatedAt as Date;

    return domainEntity;
  }

  static toPersistence(domainEntity: Call): CallEntity {
    const persistenceEntity = new CallEntity();
    if (domainEntity.business) {
      persistenceEntity.business = BusinessMapper.toPersistence(
        domainEntity.business,
      );
    } else if (domainEntity.business === null) {
      persistenceEntity.business = undefined;
    }

    persistenceEntity.callType = domainEntity.callType;

    persistenceEntity.time = domainEntity.time;

    persistenceEntity.date = domainEntity.date;

    if (domainEntity.id) {
      persistenceEntity.id = domainEntity.id;
    }
    persistenceEntity.createdAt = domainEntity.createdAt;
    persistenceEntity.updatedAt = domainEntity.updatedAt;

    return persistenceEntity;
  }
}
