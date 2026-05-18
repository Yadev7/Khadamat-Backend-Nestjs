import { City } from '../../../../domain/city';
import { CountryMapper } from '../../../../../countries/infrastructure/persistence/relational/mappers/country.mapper';
import { CityEntity } from '../entities/city.entity';
// استيراد الـ Mapper الخاص بالموقع
import { LocalisationMapper } from '../../../../../localisations/infrastructure/persistence/relational/mappers/localisation.mapper';
import { LocalisationEntity } from 'src/localisations/infrastructure/persistence/relational/entities/localisation.entity';

export class CityMapper {
  static toDomain(raw: CityEntity): City {
    const domainEntity = new City();

    // ربط الدولة
    if (raw.country) {
      domainEntity.country = CountryMapper.toDomain(raw.country);
    } else if (raw.country === null) {
      domainEntity.country = null;
    }

    // 🚀 إضافة ربط الموقع من Persistence إلى Domain
    if (raw.localisation) {
      domainEntity.localisation = LocalisationMapper.toDomain(raw.localisation);
    } else if (raw.localisation === null) {
      domainEntity.localisation = undefined;
    }

    domainEntity.nameEn = raw.nameEn;
    domainEntity.nameAr = raw.nameAr;
    domainEntity.nameFr = raw.nameFr;

    domainEntity.id = raw.id;
    // domainEntity.createdAt = raw.createdAt;
    // domainEntity.updatedAt = raw.updatedAt;

    // نسخ الـ Timestamps
    if (raw.createdAt) {
      domainEntity.createdAt = raw.createdAt;
    }
    if (raw.updatedAt) {
      domainEntity.updatedAt = raw.updatedAt;
    }

    return domainEntity;
  }

  static toPersistence(domainEntity: City): CityEntity {
    const persistenceEntity = new CityEntity();

    if (domainEntity.id) {
      persistenceEntity.id = domainEntity.id;
    }

    persistenceEntity.nameEn = domainEntity.nameEn;
    persistenceEntity.nameAr = domainEntity.nameAr;
    persistenceEntity.nameFr = domainEntity.nameFr;

    // ربط الدولة
    if (domainEntity.country) {
      persistenceEntity.country = CountryMapper.toPersistence(domainEntity.country);
    } else if (domainEntity.country === null) {
      persistenceEntity.country = null;
    }

    // 🚀 الحماية القصوى والـ Cascade الصريح للموقع هنا:
    if (domainEntity.localisation) {
      const locEntity = new LocalisationEntity();
      
      // تأكد من مطابقة أسماء الحقول كما هي بجدول الـ localisation.entity.ts الخاص بك
      if (domainEntity.localisation.id) {
        locEntity.id = domainEntity.localisation.id;
      }
      locEntity.latitude = domainEntity.localisation.latitude;
      locEntity.longitude = domainEntity.localisation.longitude;

      persistenceEntity.localisation = locEntity; // إسناد الـ Entity الفعلي
    } else {
      persistenceEntity.localisation = null;
    }

    if (domainEntity.createdAt) persistenceEntity.createdAt = domainEntity.createdAt;
    if (domainEntity.updatedAt) persistenceEntity.updatedAt = domainEntity.updatedAt;

    return persistenceEntity;
  }

  // static toPersistence(domainEntity: City): CityEntity {
  //   const persistenceEntity = new CityEntity();

  //   // ربط الدولة
  //   if (domainEntity.country) {
  //     persistenceEntity.country = CountryMapper.toPersistence(
  //       domainEntity.country,
  //     );
  //   } else if (domainEntity.country === null) {
  //     persistenceEntity.country = null;
  //   }

  //   // 🚀 الجزء الأهم: تحويل الموقع إلى Persistence ليتم حفظه (Cascade)
  //   if (domainEntity.localisation) {
  //     persistenceEntity.localisation = LocalisationMapper.toPersistence(
  //       domainEntity.localisation,
  //     );
  //   } else if (domainEntity.localisation === undefined || domainEntity.localisation === null) {
  //     persistenceEntity.localisation = null;
  //   }

  //   persistenceEntity.nameEn = domainEntity.nameEn;
  //   persistenceEntity.nameAr = domainEntity.nameAr;
  //   persistenceEntity.nameFr = domainEntity.nameFr;

  //   if (domainEntity.id) {
  //     persistenceEntity.id = domainEntity.id as string;
  //   }

  //   // persistenceEntity.createdAt = domainEntity.createdAt!;
  //   // persistenceEntity.updatedAt = domainEntity.updatedAt!;


  //   // نسخ الـ Timestamps
  //   if (domainEntity.createdAt) {
  //     persistenceEntity.createdAt = domainEntity.createdAt;
  //   }
  //   if (domainEntity.updatedAt) {
  //     persistenceEntity.updatedAt = domainEntity.updatedAt;
  //   }

  //   return persistenceEntity;
  // }
}