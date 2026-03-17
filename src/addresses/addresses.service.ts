import { LocalisationsService } from '../localisations/localisations.service';
import { Localisation } from '../localisations/domain/localisation';

import { CitiesService } from '../cities/cities.service';
import { City } from '../cities/domain/city';

import { CountriesService } from '../countries/countries.service';
import { Country } from '../countries/domain/country';

import {
  // common
  Injectable,
  HttpStatus,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { AddressRepository } from './infrastructure/persistence/address.repository';
import { IPaginationOptions } from '../utils/types/pagination-options';
import { Address } from './domain/address';

@Injectable()
export class AddressesService {
  constructor(
    private readonly localisationService: LocalisationsService,

    private readonly cityService: CitiesService,

    private readonly countryService: CountriesService,

    // Dependencies here
    private readonly addressRepository: AddressRepository,
  ) {}

  async create(createAddressDto: CreateAddressDto) {
    // Do not remove comment below.
    // <creating-property />
    let localisation: Localisation | null | undefined = undefined;

    if (createAddressDto.localisation) {
      const localisationObject = await this.localisationService.findById(
        createAddressDto.localisation.id,
      );
      if (!localisationObject) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            localisation: 'notExists',
          },
        });
      }
      localisation = localisationObject;
    } else if (createAddressDto.localisation === null) {
      localisation = null;
    }

    let city: City | null | undefined = undefined;

    if (createAddressDto.city) {
      const cityObject = await this.cityService.findById(
        createAddressDto.city.id,
      );
      if (!cityObject) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            city: 'notExists',
          },
        });
      }
      city = cityObject;
    } else if (createAddressDto.city === null) {
      city = null;
    }

    let country: Country | null | undefined = undefined;

    if (createAddressDto.country) {
      const countryObject = await this.countryService.findById(
        createAddressDto.country.id,
      );
      if (!countryObject) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            country: 'notExists',
          },
        });
      }
      country = countryObject;
    } else if (createAddressDto.country === null) {
      country = null;
    }

    return this.addressRepository.create({
      // Do not remove comment below.
      // <creating-property-payload />
      localisation,

      city,

      country,

      lineAddressAr: createAddressDto.lineAddressAr,

      lineAddressFr: createAddressDto.lineAddressFr,
    });
  }

  findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }) {
    return this.addressRepository.findAllWithPagination({
      paginationOptions: {
        page: paginationOptions.page,
        limit: paginationOptions.limit,
      },
    });
  }

  findById(id: Address['id']) {
    return this.addressRepository.findById(id);
  }

  findByIds(ids: Address['id'][]) {
    return this.addressRepository.findByIds(ids);
  }

  async update(
    id: Address['id'],

    updateAddressDto: UpdateAddressDto,
  ) {
    // Do not remove comment below.
    // <updating-property />
    let city: City | null | undefined = undefined;
    let localisation: Localisation | null | undefined = undefined;

    if (updateAddressDto.localisation) {
      const localisationObject = await this.localisationService.findById(
        updateAddressDto.localisation.id,
      );
      if (!localisationObject) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            localisation: 'notExists',
          },
        });
      }
      localisation = localisationObject;
    } else if (updateAddressDto.localisation === null) {
      localisation = null;
    }

    if (updateAddressDto.city) {
      const cityObject = await this.cityService.findById(
        updateAddressDto.city.id,
      );
      if (!cityObject) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            city: 'notExists',
          },
        });
      }
      city = cityObject;
    } else if (updateAddressDto.city === null) {
      city = null;
    }

    let country: Country | null | undefined = undefined;

    if (updateAddressDto.country) {
      const countryObject = await this.countryService.findById(
        updateAddressDto.country.id,
      );
      if (!countryObject) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            country: 'notExists',
          },
        });
      }
      country = countryObject;
    } else if (updateAddressDto.country === null) {
      country = null;
    }

    return this.addressRepository.update(id, {
      // Do not remove comment below.
      // <updating-property-payload />
      city,
      localisation,

      country,

      lineAddressAr: updateAddressDto.lineAddressAr,

      lineAddressFr: updateAddressDto.lineAddressFr,
    });
  }

  remove(id: Address['id']) {
    return this.addressRepository.remove(id);
  }
}
