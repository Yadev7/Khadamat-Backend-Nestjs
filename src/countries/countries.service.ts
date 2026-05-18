import {
  // common
  Injectable,
} from '@nestjs/common';
import { CreateCountryDto } from './dto/create-country.dto';
import { UpdateCountryDto } from './dto/update-country.dto';
import { CountryRepository } from './infrastructure/persistence/country.repository';
import { IPaginationOptions } from '../utils/types/pagination-options';
import { Country } from './domain/country';
import { LocalisationsService } from '../localisations/localisations.service';
import { Localisation } from '../localisations/domain/localisation';
import { HttpStatus, UnprocessableEntityException } from '@nestjs/common';

@Injectable()
export class CountriesService {
  constructor(
    private readonly countryRepository: CountryRepository,
    private readonly localisationService: LocalisationsService,
  ) {}

  async create(createCountryDto: CreateCountryDto) {
    let localisation: Localisation | null | undefined = undefined;

    if (createCountryDto.latitude !== undefined && createCountryDto.longitude !== undefined) {
      localisation = {
        latitude: Number(createCountryDto.latitude),
        longitude: Number(createCountryDto.longitude),
      } as Localisation;
    } else if (createCountryDto.localisation) {
      const localisationObject = await this.localisationService.findById(
        createCountryDto.localisation.id,
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
    } else if (createCountryDto.localisation === null) {
      localisation = null;
    }

    return this.countryRepository.create({
      flagImg: createCountryDto.flagImg,
      nameEn: createCountryDto.nameEn,
      nameAr: createCountryDto.nameAr,
      nameFr: createCountryDto.nameFr,
      countryCode: createCountryDto.countryCode,
      localisation,
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
    const currentCountry = await this.countryRepository.findById(id);
    if (!currentCountry) {
      throw new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        errors: { country: 'notExists' },
      });
    }

    let localisation: any = undefined;
    if (updateCountryDto.latitude !== undefined && updateCountryDto.longitude !== undefined) {
      localisation = {
        id: currentCountry.localisation?.id || undefined,
        latitude: Number(updateCountryDto.latitude),
        longitude: Number(updateCountryDto.longitude),
      };
    } else if (updateCountryDto.latitude === null || updateCountryDto.longitude === null) {
      localisation = null;
    } else {
      localisation = currentCountry.localisation;
    }

    return this.countryRepository.update(id, {
      ...currentCountry,
      flagImg: updateCountryDto.flagImg,
      nameEn: updateCountryDto.nameEn,
      nameAr: updateCountryDto.nameAr,
      nameFr: updateCountryDto.nameFr,
      countryCode: updateCountryDto.countryCode,
      localisation,
    });
  }

  async remove(id: Country['id']) {
    // Load the country first so we can grab the orphaned localisationId
    const country = await this.countryRepository.findById(id);

    await this.countryRepository.remove(id);

    // After the country row is gone, delete its orphaned localisation
    if (country?.localisation?.id) {
      await this.localisationService.remove(country.localisation.id);
    }
  }
}
