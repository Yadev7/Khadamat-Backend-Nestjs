import { FilesService } from '../files/files.service';
import { FileType } from '../files/domain/file';

import {
  // common
  Injectable,
  HttpStatus,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { ServiceRepository } from './infrastructure/persistence/service.repository';
import { IPaginationOptions } from '../utils/types/pagination-options';
import { Service } from './domain/service';

@Injectable()
export class ServicesService {
  constructor(
    private readonly fileService: FilesService,

    // Dependencies here
    private readonly serviceRepository: ServiceRepository,
  ) {}

  async create(createServiceDto: CreateServiceDto) {
    // Do not remove comment below.
    // <creating-property />
    let image: FileType | null | undefined = undefined;

    if (createServiceDto.image) {
      const imageObject = await this.fileService.findById(
        createServiceDto.image.id,
      );
      if (!imageObject) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            image: 'notExists',
          },
        });
      }
      image = imageObject;
    } else if (createServiceDto.image === null) {
      image = null;
    }

    return this.serviceRepository.create({
      // Do not remove comment below.
      // <creating-property-payload />
      image,

      descrEn: createServiceDto.descrEn,

      descrAr: createServiceDto.descrAr,

      descrFr: createServiceDto.descrFr,

      nameServEn: createServiceDto.nameServEn,

      nameServAr: createServiceDto.nameServAr,

      nameServFr: createServiceDto.nameServFr,
    });
  }

  findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }) {
    return this.serviceRepository.findAllWithPagination({
      paginationOptions: {
        page: paginationOptions.page,
        limit: paginationOptions.limit,
      },
    });
  }

  findById(id: Service['id']) {
    return this.serviceRepository.findById(id);
  }

  findByIds(ids: Service['id'][]) {
    return this.serviceRepository.findByIds(ids);
  }

  async update(
    id: Service['id'],

    updateServiceDto: UpdateServiceDto,
  ) {
    return this.serviceRepository.update(id, {
      // Do not remove comment below.
      // <updating-property-payload />
      image: updateServiceDto.image,

      descrEn: updateServiceDto.descrEn,

      descrAr: updateServiceDto.descrAr,

      descrFr: updateServiceDto.descrFr,

      nameServEn: updateServiceDto.nameServEn,

      nameServAr: updateServiceDto.nameServAr,

      nameServFr: updateServiceDto.nameServFr,
    });
  }

  remove(id: Service['id']) {
    return this.serviceRepository.remove(id);
  }
}
