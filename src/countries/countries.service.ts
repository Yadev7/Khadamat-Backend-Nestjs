import {
  // common
  Injectable,
} from '@nestjs/common';
import { CreateCountryDto } from './dto/create-country.dto';
import { UpdateCountryDto } from './dto/update-country.dto';
import { CountryRepository } from './infrastructure/persistence/country.repository';
import { IPaginationOptions } from '../utils/types/pagination-options';
import { Country } from './domain/country';

@Injectable()
export class CountriesService {
  constructor(
    // Dependencies here
    private readonly countryRepository: CountryRepository,
  ) {}

  async create(createCountryDto: CreateCountryDto) {
    // Do not remove comment below.
    // <creating-property />

    return this.countryRepository.create({
      // Do not remove comment below.
      // <creating-property-payload />
      flagImg: createCountryDto.flagImg,

      nameEn: createCountryDto.nameEn,

      nameAr: createCountryDto.nameAr,

      nameFr: createCountryDto.nameFr,

      countryCode: createCountryDto.countryCode,
    });
  }

  findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }) {
    return this.countryRepository.findAllWithPagination({
      paginationOptions: {
        page: paginationOptions.page,
        limit: paginationOptions.limit,
      },
    });
  }

  findById(id: Country['id']) {
    return this.countryRepository.findById(id);
  }

  findByIds(ids: Country['id'][]) {
    return this.countryRepository.findByIds(ids);
  }

  async update(
    id: Country['id'],

    updateCountryDto: UpdateCountryDto,
  ) {
    // Do not remove comment below.
    // <updating-property />

    return this.countryRepository.update(id, {
      // Do not remove comment below.
      // <updating-property-payload />
      flagImg: updateCountryDto.flagImg,

      nameEn: updateCountryDto.nameEn,

      nameAr: updateCountryDto.nameAr,

      nameFr: updateCountryDto.nameFr,

      countryCode: updateCountryDto.countryCode,
    });
  }

  remove(id: Country['id']) {
    return this.countryRepository.remove(id);
  }
}
