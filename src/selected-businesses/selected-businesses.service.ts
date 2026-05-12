import { BusinessesService } from '../businesses/businesses.service';
import { Business } from '../businesses/domain/business';

import {
  // common
  Injectable,
  HttpStatus,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CreateSelectedBusinessDto } from './dto/create-selected-business.dto';
import { UpdateSelectedBusinessDto } from './dto/update-selected-business.dto';
import { SelectedBusinessRepository } from './infrastructure/persistence/selected-business.repository';
import { IPaginationOptions } from '../utils/types/pagination-options';
import { SelectedBusiness } from './domain/selected-business';

@Injectable()
export class SelectedBusinessesService {
  constructor(
    private readonly businessService: BusinessesService,

    // Dependencies here
    private readonly selectedBusinessRepository: SelectedBusinessRepository,
  ) {}

  async create(createSelectedBusinessDto: CreateSelectedBusinessDto) {
    // Do not remove comment below.
    // <creating-property />
    let business: Business | null | undefined = undefined;

    if (createSelectedBusinessDto.business) {
      const businessObject = await this.businessService.findById(
        createSelectedBusinessDto.business.id,
      );
      if (!businessObject) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            business: 'notExists',
          },
        });
      }
      business = businessObject;
    } else if (createSelectedBusinessDto.business === null) {
      business = null;
    }

    return this.selectedBusinessRepository.create({
      // Do not remove comment below.
      // <creating-property-payload />
      business,

      dateFin: createSelectedBusinessDto.dateFin,

      dateDeb: createSelectedBusinessDto.dateDeb,
    });
  }

  findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }) {
    return this.selectedBusinessRepository.findAllWithPagination({
      paginationOptions: {
        page: paginationOptions.page,
        limit: paginationOptions.limit,
      },
    });
  }

  findById(id: SelectedBusiness['id']) {
    return this.selectedBusinessRepository.findById(id);
  }

  findByIds(ids: SelectedBusiness['id'][]) {
    return this.selectedBusinessRepository.findByIds(ids);
  }

  async update(
    id: SelectedBusiness['id'],

    updateSelectedBusinessDto: UpdateSelectedBusinessDto,
  ) {
    // Do not remove comment below.
    // <updating-property />
    let business: Business | null | undefined = undefined;

    if (updateSelectedBusinessDto.business) {
      const businessObject = await this.businessService.findById(
        updateSelectedBusinessDto.business.id,
      );
      if (!businessObject) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            business: 'notExists',
          },
        });
      }
      business = businessObject;
    } else if (updateSelectedBusinessDto.business === null) {
      business = null;
    }

    return this.selectedBusinessRepository.update(id, {
      // Do not remove comment below.
      // <updating-property-payload />
      business,

      dateFin: updateSelectedBusinessDto.dateFin,

      dateDeb: updateSelectedBusinessDto.dateDeb,
    });
  }

  remove(id: SelectedBusiness['id']) {
    return this.selectedBusinessRepository.remove(id);
  }
}
