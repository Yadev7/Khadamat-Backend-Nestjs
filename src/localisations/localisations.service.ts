import {
  // common
  Injectable,
} from '@nestjs/common';
import { CreateLocalisationDto } from './dto/create-localisation.dto';
import { UpdateLocalisationDto } from './dto/update-localisation.dto';
import { LocalisationRepository } from './infrastructure/persistence/localisation.repository';
import { IPaginationOptions } from '../utils/types/pagination-options';
import { Localisation } from './domain/localisation';

@Injectable()
export class LocalisationsService {
  constructor(
    // Dependencies here
    private readonly localisationRepository: LocalisationRepository,
  ) {}

  async create(createLocalisationDto: CreateLocalisationDto) {
    // Do not remove comment below.
    // <creating-property />

    return this.localisationRepository.create({
      // Do not remove comment below.
      // <creating-property-payload />
      latitude: createLocalisationDto.latitude,

      longitude: createLocalisationDto.longitude,
    });
  }

  findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }) {
    return this.localisationRepository.findAllWithPagination({
      paginationOptions: {
        page: paginationOptions.page,
        limit: paginationOptions.limit,
      },
    });
  }

  findById(id: Localisation['id']) {
    return this.localisationRepository.findById(id);
  }

  findByIds(ids: Localisation['id'][]) {
    return this.localisationRepository.findByIds(ids);
  }

  async update(
    id: Localisation['id'],

    updateLocalisationDto: UpdateLocalisationDto,
  ) {
    // Do not remove comment below.
    // <updating-property />

    return this.localisationRepository.update(id, {
      // Do not remove comment below.
      // <updating-property-payload />
      latitude: updateLocalisationDto.latitude,

      longitude: updateLocalisationDto.longitude,
    });
  }

  remove(id: Localisation['id']) {
    return this.localisationRepository.remove(id);
  }
}
