import { Entreprise } from '../../../../domain/entreprise';
import { AddressMapper } from '../../../../../addresses/infrastructure/persistence/relational/mappers/address.mapper';

import { EntrepriseEntity } from '../entities/entreprise.entity';

export class EntrepriseMapper {
  static toDomain(raw: EntrepriseEntity): Entreprise {
    const domainEntity = new Entreprise();
    if (raw.headOffice) {
      domainEntity.headOffice = AddressMapper.toDomain(raw.headOffice);
    } else if (raw.headOffice === null) {
      domainEntity.headOffice = null;
    }

    domainEntity.nameEn = raw.nameEn;

    domainEntity.nameAr = raw.nameAr;

    domainEntity.nameFr = raw.nameFr;

    domainEntity.id = raw.id;
    domainEntity.createdAt = raw.createdAt;
    domainEntity.updatedAt = raw.updatedAt;

    return domainEntity;
  }

  static toPersistence(domainEntity: Entreprise): EntrepriseEntity {
    const persistenceEntity = new EntrepriseEntity();
    if (domainEntity.headOffice) {
      persistenceEntity.headOffice = AddressMapper.toPersistence(
        domainEntity.headOffice,
      );
    } else if (domainEntity.headOffice === null) {
      persistenceEntity.headOffice = null;
    }

    persistenceEntity.nameEn = domainEntity.nameEn;

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
