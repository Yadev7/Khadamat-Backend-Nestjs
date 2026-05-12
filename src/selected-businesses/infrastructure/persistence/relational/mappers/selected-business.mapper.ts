import { SelectedBusiness } from '../../../../domain/selected-business';
import { BusinessMapper } from '../../../../../businesses/infrastructure/persistence/relational/mappers/business.mapper';
import { SelectedBusinessEntity } from '../entities/selected-business.entity';

export class SelectedBusinessMapper {
  static toDomain(raw: SelectedBusinessEntity): SelectedBusiness {
    const domainEntity = new SelectedBusiness();

    if (raw.business) {
      domainEntity.business = BusinessMapper.toDomain(raw.business);
    } else {
      domainEntity.business = null;
    }

    domainEntity.dateFin = raw.dateFin;
    domainEntity.dateDeb = raw.dateDeb;

    if (raw.id) {
      domainEntity.id = raw.id;
    }

    // Assigning dates to domain (handling potential undefined from raw)
    domainEntity.createdAt = raw.createdAt ?? new Date();
    domainEntity.updatedAt = raw.updatedAt ?? new Date();

    return domainEntity;
  }

  static toPersistence(domainEntity: SelectedBusiness): SelectedBusinessEntity {
    const persistenceEntity = new SelectedBusinessEntity();

    if (domainEntity.business) {
      persistenceEntity.business = BusinessMapper.toPersistence(
        domainEntity.business,
      );
    } else {
      // Note: Ensure your Entity allows null for the business relation if needed
      persistenceEntity.business = null as any;
    }

    persistenceEntity.dateFin = domainEntity.dateFin;
    persistenceEntity.dateDeb = domainEntity.dateDeb;

    if (domainEntity.id) {
      persistenceEntity.id = domainEntity.id as string;
    }

    // FIX: This resolves the "Type 'undefined' is not assignable to type 'Date'" error
    // We provide a fallback because TypeORM requires these to be defined upon save/update
    persistenceEntity.createdAt = domainEntity.createdAt ?? new Date();
    persistenceEntity.updatedAt = domainEntity.updatedAt ?? new Date();

    return persistenceEntity;
  }
}
