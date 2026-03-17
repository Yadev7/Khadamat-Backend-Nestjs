import { BusinessesService } from '../businesses/businesses.service';
import { Business } from '../businesses/domain/business';

import {
  // common
  Injectable,
  HttpStatus,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CreateReportDto } from './dto/create-report.dto';
import { UpdateReportDto } from './dto/update-report.dto';
import { ReportRepository } from './infrastructure/persistence/report.repository';
import { IPaginationOptions } from '../utils/types/pagination-options';
import { Report } from './domain/report';

@Injectable()
export class ReportsService {
  constructor(
    private readonly businessService: BusinessesService,

    // Dependencies here
    private readonly reportRepository: ReportRepository,
  ) {}

  async create(createReportDto: CreateReportDto) {
    // Do not remove comment below.
    // <creating-property />
    let business: Business | null | undefined = undefined;

    if (createReportDto.business) {
      const businessObject = await this.businessService.findById(
        createReportDto.business.id,
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
    } else if (createReportDto.business === null) {
      business = null;
    }

    return this.reportRepository.create({
      // Do not remove comment below.
      // <creating-property-payload />
      business,

      audio: createReportDto.audio,

      textAr: createReportDto.textAr,

      textFr: createReportDto.textFr,

      titleAr: createReportDto.titleAr,

      titleFr: createReportDto.titleFr,
    });
  }

  findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }) {
    return this.reportRepository.findAllWithPagination({
      paginationOptions: {
        page: paginationOptions.page,
        limit: paginationOptions.limit,
      },
    });
  }

  findById(id: Report['id']) {
    return this.reportRepository.findById(id);
  }

  findByIds(ids: Report['id'][]) {
    return this.reportRepository.findByIds(ids);
  }

  async update(
    id: Report['id'],

    updateReportDto: UpdateReportDto,
  ) {
    // Do not remove comment below.
    // <updating-property />
    let business: Business | null | undefined = undefined;

    if (updateReportDto.business) {
      const businessObject = await this.businessService.findById(
        updateReportDto.business.id,
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
    } else if (updateReportDto.business === null) {
      business = null;
    }

    return this.reportRepository.update(id, {
      // Do not remove comment below.
      // <updating-property-payload />
      business,

      audio: updateReportDto.audio,

      textAr: updateReportDto.textAr,

      textFr: updateReportDto.textFr,

      titleAr: updateReportDto.titleAr,

      titleFr: updateReportDto.titleFr,
    });
  }

  remove(id: Report['id']) {
    return this.reportRepository.remove(id);
  }
}
