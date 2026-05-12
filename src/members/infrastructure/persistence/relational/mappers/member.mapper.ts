import { Member } from '../../../../domain/member';
import { UserMapper } from '../../../../../users/infrastructure/persistence/relational/mappers/user.mapper';

import { EntrepriseMapper } from '../../../../../entreprises/infrastructure/persistence/relational/mappers/entreprise.mapper';

import { ContactMapper } from '../../../../../contacts/infrastructure/persistence/relational/mappers/contact.mapper';

import { MemberEntity } from '../entities/member.entity';

export class MemberMapper {
  static toDomain(raw: MemberEntity): Member {
    const domainEntity = new Member();
    if (raw.user) {
      domainEntity.user = UserMapper.toDomain(raw.user);
    } else if (raw.user === null) {
      domainEntity.user = null;
    }

    if (raw.entreprise) {
      domainEntity.entreprise = EntrepriseMapper.toDomain(raw.entreprise);
    } else if (raw.entreprise === null) {
      domainEntity.entreprise = null;
    }

    if (raw.contact) {
      domainEntity.contact = ContactMapper.toDomain(raw.contact);
    } else if (raw.contact === null) {
      domainEntity.contact = null;
    }

    domainEntity.typeMember = raw.typeMember;
    domainEntity.status = raw.status ?? 'ACTIVE';

    domainEntity.id = raw.id as string;
    domainEntity.createdAt = raw.createdAt as Date;
    domainEntity.updatedAt = raw.updatedAt as Date;

    return domainEntity;
  }

  static toPersistence(domainEntity: Member): MemberEntity {
    const persistenceEntity = new MemberEntity();
    if (domainEntity.user) {
      persistenceEntity.user = UserMapper.toPersistence(domainEntity.user);
    } else if (domainEntity.user === null) {
      persistenceEntity.user = undefined;
    }

    if (domainEntity.entreprise) {
      persistenceEntity.entreprise = EntrepriseMapper.toPersistence(
        domainEntity.entreprise,
      );
    } else if (domainEntity.entreprise === null) {
      persistenceEntity.entreprise = null;
    }

    if (domainEntity.contact) {
      persistenceEntity.contact = ContactMapper.toPersistence(
        domainEntity.contact,
      );
    } else if (domainEntity.contact === null) {
      persistenceEntity.contact = undefined;
    }

    persistenceEntity.typeMember = domainEntity.typeMember;
    persistenceEntity.status = domainEntity.status ?? 'ACTIVE';

    if (domainEntity.id) {
      persistenceEntity.id = domainEntity.id as string;
    }
    persistenceEntity.createdAt = domainEntity.createdAt;
    persistenceEntity.updatedAt = domainEntity.updatedAt;

    return persistenceEntity;
  }
}
