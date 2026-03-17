import { LocalisationsService } from '../localisations/localisations.service';
import { Localisation } from '../localisations/domain/localisation';
import { CitiesService } from '../cities/cities.service';
import {
  Injectable,
  HttpStatus,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CreateCityAreaDto } from './dto/create-city-area.dto';
import { UpdateCityAreaDto } from './dto/update-city-area.dto';
import { CityAreaRepository } from './infrastructure/persistence/city-area.repository';
import { IPaginationOptions } from '../utils/types/pagination-options';
import { CityArea } from './domain/city-area';
import { City } from '../cities/domain/city'; // Make sure to import the City domain

@Injectable()
export class CityAreasService {
  constructor(
    private readonly localisationService: LocalisationsService,

    private readonly cityService: CitiesService,
    private readonly cityAreaRepository: CityAreaRepository,
  ) {}

  async create(createCityAreaDto: CreateCityAreaDto) {
    let localisation: Localisation | null | undefined = undefined;

    if (createCityAreaDto.localisation) {
      const localisationObject = await this.localisationService.findById(
        createCityAreaDto.localisation.id,
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
    } else if (createCityAreaDto.localisation === null) {
      localisation = null;
    }

    // 1. Initialize the city variable
    let city: City | null | undefined = undefined;

    // 2. Validate if the city exists
    if (createCityAreaDto.city) {
      const cityObject = await this.cityService.findById(
        createCityAreaDto.city.id,
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
    } else if (createCityAreaDto.city === null) {
      city = null;
    }

    // 3. Pass the city object to the repository
    return this.cityAreaRepository.create({
      localisation,
      city, // This was missing in your create method
      nameAr: createCityAreaDto.nameAr,
      nameFr: createCityAreaDto.nameFr,
    });
  }

  findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }) {
    return this.cityAreaRepository.findAllWithPagination({
      paginationOptions: {
        page: paginationOptions.page,
        limit: paginationOptions.limit,
      },
    });
  }

  findById(id: CityArea['id']) {
    return this.cityAreaRepository.findById(id);
  }

  findByIds(ids: CityArea['id'][]) {
    return this.cityAreaRepository.findByIds(ids);
  }

  async update(id: CityArea['id'], updateCityAreaDto: UpdateCityAreaDto) {
    let city: City | null | undefined = undefined;

    if (updateCityAreaDto.city) {
      const cityObject = await this.cityService.findById(
        updateCityAreaDto.city.id,
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
    } else if (updateCityAreaDto.city === null) {
      city = null;
    }

    return this.cityAreaRepository.update(id, {
      city,
      nameAr: updateCityAreaDto.nameAr,
      nameFr: updateCityAreaDto.nameFr,
    });
  }

  remove(id: CityArea['id']) {
    return this.cityAreaRepository.remove(id);
  }
}
