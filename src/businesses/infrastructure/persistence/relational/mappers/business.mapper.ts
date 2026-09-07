import { Business } from '../../../../domain/business';
import { ContactMapper } from '../../../../../contacts/infrastructure/persistence/relational/mappers/contact.mapper';
import { ServiceMapper } from '../../../../../services/infrastructure/persistence/relational/mappers/service.mapper';
import { MemberMapper } from '../../../../../members/infrastructure/persistence/relational/mappers/member.mapper';
import { FileMapper } from '../../../../../files/infrastructure/persistence/relational/mappers/file.mapper';
import { BusinessEntity } from '../entities/business.entity';
import { FileEntity } from '../../../../../files/infrastructure/persistence/relational/entities/file.entity';
import { LocalisationMapper } from 'src/localisations/infrastructure/persistence/relational/mappers/localisation.mapper';

export class BusinessMapper {
  static toDomain(raw: BusinessEntity): Business {
    const domainEntity = new Business();

    // Core Relationships
    if (raw.localisation) {
      domainEntity.localisation = LocalisationMapper.toDomain(raw.localisation);
    }

    if (raw.contact) {
      domainEntity.contact = ContactMapper.toDomain(raw.contact);
    }
    if (raw.service) {
      domainEntity.service = ServiceMapper.toDomain(raw.service);
    }
    if (raw.flyer) {
      domainEntity.flyer = FileMapper.toDomain(raw.flyer);
    }

    // Special Member Relationships (Mandatory)
    if (raw.owner) {
      domainEntity.owner = MemberMapper.toDomain(raw.owner);
    }
    if (raw.manager) {
      domainEntity.manager = MemberMapper.toDomain(raw.manager);
    }

    // Multimedia Relationships (Audio/Video)
    // FIX: Removed ?.id because domainEntity expects the full FileType object, not a string
    if (raw.audioAr) domainEntity.audioAr = FileMapper.toDomain(raw.audioAr);
    if (raw.audioFr) domainEntity.audioFr = FileMapper.toDomain(raw.audioFr);
    if (raw.audioEn) domainEntity.audioEn = FileMapper.toDomain(raw.audioEn);

    if (raw.videoAr) domainEntity.videoAr = FileMapper.toDomain(raw.videoAr);
    if (raw.videoFr) domainEntity.videoFr = FileMapper.toDomain(raw.videoFr);
    if (raw.videoEn) domainEntity.videoEn = FileMapper.toDomain(raw.videoEn);

    // Metadata & Strings
    domainEntity.socialMedia = raw.socialMedia;
    domainEntity.businessUrlSite = raw.businessUrlSite;
    domainEntity.descrEn = raw.descrEn;
    domainEntity.descrAr = raw.descrAr;
    domainEntity.descrFr = raw.descrFr;
    domainEntity.nameEn = raw.nameEn;
    domainEntity.nameAr = raw.nameAr;
    domainEntity.nameFr = raw.nameFr;

    domainEntity.id = raw.id;
    domainEntity.createdAt = raw.createdAt;
    domainEntity.updatedAt = raw.updatedAt;

    return domainEntity;
  }

  static toPersistence(domainEntity: Business): BusinessEntity {
    const persistenceEntity = new BusinessEntity();

    // Relationships to Persistence (Core)
    if (domainEntity.localisation) {
      persistenceEntity.localisation = LocalisationMapper.toPersistence(
        domainEntity.localisation,
      );
    }

    // Relationships to Persistence
    if (domainEntity.contact) {
      persistenceEntity.contact = ContactMapper.toPersistence(
        domainEntity.contact,
      );
    }

    if (domainEntity.service) {
      persistenceEntity.service = ServiceMapper.toPersistence(
        domainEntity.service,
      );
    }

    // Special Member Mapping
    if (domainEntity.owner) {
      persistenceEntity.owner = MemberMapper.toPersistence(domainEntity.owner);
    }
    if (domainEntity.manager) {
      persistenceEntity.manager = MemberMapper.toPersistence(
        domainEntity.manager,
      );
    }

    // File Mapping helper
    const mapFile = (file: any) =>
      file ? ({ id: file.id } as FileEntity) : undefined;

    persistenceEntity.flyer = mapFile(domainEntity.flyer);
    persistenceEntity.audioAr = mapFile(domainEntity.audioAr);
    persistenceEntity.audioFr = mapFile(domainEntity.audioFr);
    persistenceEntity.audioEn = mapFile(domainEntity.audioEn);
    persistenceEntity.videoAr = mapFile(domainEntity.videoAr);
    persistenceEntity.videoFr = mapFile(domainEntity.videoFr);
    persistenceEntity.videoEn = mapFile(domainEntity.videoEn);

    // Strings
    persistenceEntity.socialMedia = domainEntity.socialMedia;
    persistenceEntity.businessUrlSite = domainEntity.businessUrlSite;
    persistenceEntity.descrEn = domainEntity.descrEn;
    persistenceEntity.descrAr = domainEntity.descrAr;
    persistenceEntity.descrFr = domainEntity.descrFr;
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
