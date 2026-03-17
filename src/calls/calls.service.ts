import { BusinessesService } from '../businesses/businesses.service';
import { Business } from '../businesses/domain/business';

import {
  // common
  Injectable,
  HttpStatus,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CreateCallDto } from './dto/create-call.dto';
import { UpdateCallDto } from './dto/update-call.dto';
import { CallRepository } from './infrastructure/persistence/call.repository';
import { IPaginationOptions } from '../utils/types/pagination-options';
import { Call } from './domain/call';

@Injectable()
export class CallsService {
  constructor(
    private readonly businessService: BusinessesService,

    // Dependencies here
    private readonly callRepository: CallRepository,
  ) {}

  async create(createCallDto: CreateCallDto) {
    // Do not remove comment below.
    // <creating-property />
    let business: Business | null | undefined = undefined;

    if (createCallDto.business) {
      const businessObject = await this.businessService.findById(
        createCallDto.business.id,
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
    } else if (createCallDto.business === null) {
      business = null;
    }

    return this.callRepository.create({
      // Do not remove comment below.
      // <creating-property-payload />
      business,

      callType: createCallDto.callType,

      time: createCallDto.time,

      date: createCallDto.date,
    });
  }

  findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }) {
    return this.callRepository.findAllWithPagination({
      paginationOptions: {
        page: paginationOptions.page,
        limit: paginationOptions.limit,
      },
    });
  }

  findById(id: Call['id']) {
    return this.callRepository.findById(id);
  }

  findByIds(ids: Call['id'][]) {
    return this.callRepository.findByIds(ids);
  }

  async update(
    id: Call['id'],

    updateCallDto: UpdateCallDto,
  ) {
    // Do not remove comment below.
    // <updating-property />
    let business: Business | null | undefined = undefined;

    if (updateCallDto.business) {
      const businessObject = await this.businessService.findById(
        updateCallDto.business.id,
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
    } else if (updateCallDto.business === null) {
      business = null;
    }

    return this.callRepository.update(id, {
      // Do not remove comment below.
      // <updating-property-payload />
      business,

      callType: updateCallDto.callType,

      time: updateCallDto.time,

      date: updateCallDto.date,
    });
  }

  remove(id: Call['id']) {
    return this.callRepository.remove(id);
  }
}
