import { Address } from '../../../../domain/address';
import { CityMapper } from '../../../../../cities/infrastructure/persistence/relational/mappers/city.mapper';
import { LocalisationMapper } from '../../../../../localisations/infrastructure/persistence/relational/mappers/localisation.mapper';

import { CountryMapper } from '../../../../../countries/infrastructure/persistence/relational/mappers/country.mapper';

import { AddressEntity } from '../entities/address.entity';

export class AddressMapper {
  static toDomain(raw: AddressEntity): Address {
    const domainEntity = new Address();
    if (raw.localisation) {
      domainEntity.localisation = LocalisationMapper.toDomain(raw.localisation);
    } else if (raw.localisation === null) {
      domainEntity.localisation = null;
    }

    if (raw.city) {
      domainEntity.city = CityMapper.toDomain(raw.city);
    } else if (raw.city === null) {
      domainEntity.city = null;
    }

    if (raw.country) {
      domainEntity.country = CountryMapper.toDomain(raw.country);
    } else if (raw.country === null) {
      domainEntity.country = null;
    }

    domainEntity.lineAddressAr = raw.lineAddressAr;

    domainEntity.lineAddressFr = raw.lineAddressFr;

    domainEntity.id = raw.id;
    domainEntity.createdAt = raw.createdAt;
    domainEntity.updatedAt = raw.updatedAt;

    return domainEntity;
  }

  static toPersistence(domainEntity: Address): AddressEntity {
    const persistenceEntity = new AddressEntity();
    if (domainEntity.city) {
      if (domainEntity.localisation) {
        persistenceEntity.localisation = LocalisationMapper.toPersistence(
          domainEntity.localisation,
        );
      } else if (domainEntity.localisation === null) {
        persistenceEntity.localisation = null;
      }

      persistenceEntity.city = CityMapper.toPersistence(domainEntity.city);
    } else if (domainEntity.city === null) {
      persistenceEntity.city = null;
    }

    if (domainEntity.country) {
      persistenceEntity.country = CountryMapper.toPersistence(
        domainEntity.country,
      );
    } else if (domainEntity.country === null) {
      persistenceEntity.country = null;
    }

    persistenceEntity.lineAddressAr = domainEntity.lineAddressAr;

    persistenceEntity.lineAddressFr = domainEntity.lineAddressFr;

    if (domainEntity.id) {
      persistenceEntity.id = domainEntity.id;
    }
    persistenceEntity.createdAt = domainEntity.createdAt;
    persistenceEntity.updatedAt = domainEntity.updatedAt;

    return persistenceEntity;
  }
}
