import { Contact } from '../../../../domain/contact';
import { AddressMapper } from '../../../../../addresses/infrastructure/persistence/relational/mappers/address.mapper';

import { ContactEntity } from '../entities/contact.entity';

export class ContactMapper {
  static toDomain(raw: ContactEntity): Contact {
    const domainEntity = new Contact();
    if (raw.address) {
      domainEntity.address = AddressMapper.toDomain(raw.address);
    } else if (raw.address === null) {
      domainEntity.address = null;
    }

    domainEntity.email = raw.email;

    domainEntity.phoneGround = raw.phoneGround;

    domainEntity.phoneCell = raw.phoneCell;

    domainEntity.lastNameAr = raw.lastNameAr;

    domainEntity.lastName = raw.lastName;

    domainEntity.firstNameAr = raw.firstNameAr;

    domainEntity.firstName = raw.firstName;

    domainEntity.id = raw.id;
    domainEntity.createdAt = raw.createdAt;
    domainEntity.updatedAt = raw.updatedAt;

    return domainEntity;
  }

  static toPersistence(domainEntity: Contact): ContactEntity {
    const persistenceEntity = new ContactEntity();
    if (domainEntity.address) {
      persistenceEntity.address = AddressMapper.toPersistence(
        domainEntity.address,
      );
    } else if (domainEntity.address === null) {
      persistenceEntity.address = null;
    }

    persistenceEntity.email = domainEntity.email;

    persistenceEntity.phoneGround = domainEntity.phoneGround;

    persistenceEntity.phoneCell = domainEntity.phoneCell;

    persistenceEntity.lastNameAr = domainEntity.lastNameAr;

    persistenceEntity.lastName = domainEntity.lastName;

    persistenceEntity.firstNameAr = domainEntity.firstNameAr;

    persistenceEntity.firstName = domainEntity.firstName;

    if (domainEntity.id) {
      persistenceEntity.id = domainEntity.id;
    }
    persistenceEntity.createdAt = domainEntity.createdAt;
    persistenceEntity.updatedAt = domainEntity.updatedAt;

    return persistenceEntity;
  }
}
