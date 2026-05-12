import { CountriesService } from '../countries/countries.service';
import { Country } from '../countries/domain/country';

import {
  // common
  Injectable,
  HttpStatus,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CreateCityDto } from './dto/create-city.dto';
import { UpdateCityDto } from './dto/update-city.dto';
import { CityRepository } from './infrastructure/persistence/city.repository';
import { IPaginationOptions } from '../utils/types/pagination-options';
import { City } from './domain/city';

@Injectable()
export class CitiesService {
  constructor(
    private readonly countryService: CountriesService,

    // Dependencies here
    private readonly cityRepository: CityRepository,
  ) {}

  async create(createCityDto: CreateCityDto) {
    // Do not remove comment below.
    // <creating-property />
    let country: Country | null | undefined = undefined;

    if (createCityDto.country) {
      const countryObject = await this.countryService.findById(
        createCityDto.country.id,
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
    } else if (createCityDto.country === null) {
      country = null;
    }

    let idCountry: Country | null | undefined = undefined;

    if (createCityDto.idCountry) {
      const idCountryObject = await this.countryService.findById(
        createCityDto.idCountry.id,
      );
      if (!idCountryObject) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            idCountry: 'notExists',
          },
        });
      }
      idCountry = idCountryObject;
    } else if (createCityDto.idCountry === null) {
      idCountry = null;
    }

    return this.cityRepository.create({
      // Do not remove comment below.
      // <creating-property-payload />
      country,

      idCountry,

      nameEn: createCityDto.nameEn,

      nameAr: createCityDto.nameAr,

      nameFr: createCityDto.nameFr,

      lat: createCityDto.lat,

      lng: createCityDto.lng,
    });
  }

  findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }) {
    return this.cityRepository.findAllWithPagination({
      paginationOptions: {
        page: paginationOptions.page,
        limit: paginationOptions.limit,
      },
    });
  }

  findById(id: City['id']) {
    return this.cityRepository.findById(id);
  }

  findByIds(ids: City['id'][]) {
    return this.cityRepository.findByIds(ids);
  }

  async update(
    id: City['id'],

    updateCityDto: UpdateCityDto,
  ) {
    // Do not remove comment below.
    // <updating-property />
    let country: Country | null | undefined = undefined;

    if (updateCityDto.country) {
      const countryObject = await this.countryService.findById(
        updateCityDto.country.id,
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
    } else if (updateCityDto.country === null) {
      country = null;
    }

    let idCountry: Country | null | undefined = undefined;

    if (updateCityDto.idCountry) {
      const idCountryObject = await this.countryService.findById(
        updateCityDto.idCountry.id,
      );
      if (!idCountryObject) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            idCountry: 'notExists',
          },
        });
      }
      idCountry = idCountryObject;
    } else if (updateCityDto.idCountry === null) {
      idCountry = null;
    }

    return this.cityRepository.update(id, {
      // Do not remove comment below.
      // <updating-property-payload />
      country,

      idCountry,

      nameEn: updateCityDto.nameEn,

      nameAr: updateCityDto.nameAr,

      nameFr: updateCityDto.nameFr,

      lat: updateCityDto.lat,

      lng: updateCityDto.lng,
    });
  }

  remove(id: City['id']) {
    return this.cityRepository.remove(id);
  }
}
