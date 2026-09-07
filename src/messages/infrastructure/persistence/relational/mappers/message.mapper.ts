import { Message } from '../../../../domain/message';
import { BusinessMapper } from '../../../../../businesses/infrastructure/persistence/relational/mappers/business.mapper';

import { MessageEntity } from '../entities/message.entity';

export class MessageMapper {
  static toDomain(raw: MessageEntity): Message {
    const domainEntity = new Message();
    if (raw.business) {
      domainEntity.business = BusinessMapper.toDomain(raw.business);
    } else if (raw.business === null) {
      domainEntity.business = null;
    }

    domainEntity.emailContact = raw.emailContact;

    domainEntity.phoneContact = raw.phoneContact;

    domainEntity.audio = raw.audio;

    domainEntity.textAr = raw.textAr;

    domainEntity.textFr = raw.textFr;

    domainEntity.textEn = raw.textEn;

    domainEntity.titleAr = raw.titleAr;

    domainEntity.titleFr = raw.titleFr;

    domainEntity.titleEn = raw.titleEn;

    domainEntity.id = raw.id as string;
    domainEntity.createdAt = raw.createdAt as Date;
    domainEntity.updatedAt = raw.updatedAt as Date;

    return domainEntity;
  }

  static toPersistence(domainEntity: Message): MessageEntity {
    const persistenceEntity = new MessageEntity();
    if (domainEntity.business) {
      persistenceEntity.business = BusinessMapper.toPersistence(
        domainEntity.business,
      );
    } else if (domainEntity.business === null) {
      persistenceEntity.business = null;
    }

    persistenceEntity.emailContact = domainEntity.emailContact;

    persistenceEntity.phoneContact = domainEntity.phoneContact;

    persistenceEntity.audio = domainEntity.audio;

    persistenceEntity.textAr = domainEntity.textAr;

    persistenceEntity.textFr = domainEntity.textFr;

    persistenceEntity.textEn = domainEntity.textEn;

    persistenceEntity.titleAr = domainEntity.titleAr;

    persistenceEntity.titleFr = domainEntity.titleFr;

    persistenceEntity.titleEn = domainEntity.titleEn;

    if (domainEntity.id) {
      persistenceEntity.id = domainEntity.id;
    }
    persistenceEntity.createdAt = domainEntity.createdAt;
    persistenceEntity.updatedAt = domainEntity.updatedAt;

    return persistenceEntity;
  }
}
