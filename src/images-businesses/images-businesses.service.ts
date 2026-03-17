import { FilesService } from '../files/files.service';
import { FileType } from '../files/domain/file';

import { BusinessesService } from '../businesses/businesses.service';
import { Business } from '../businesses/domain/business';

import {
  // common
  Injectable,
  HttpStatus,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CreateImagesBusinessDto } from './dto/create-images-business.dto';
import { UpdateImagesBusinessDto } from './dto/update-images-business.dto';
import { ImagesBusinessRepository } from './infrastructure/persistence/images-business.repository';
import { IPaginationOptions } from '../utils/types/pagination-options';
import { ImagesBusiness } from './domain/images-business';

@Injectable()
export class ImagesBusinessesService {
  constructor(
    private readonly fileService: FilesService,

    private readonly businessService: BusinessesService,

    // Dependencies here
    private readonly imagesBusinessRepository: ImagesBusinessRepository,
  ) {}

  async create(createImagesBusinessDto: CreateImagesBusinessDto) {
    // Do not remove comment below.
    // <creating-property />
    let file: FileType | null | undefined = undefined;

    if (createImagesBusinessDto.file) {
      const fileObject = await this.fileService.findById(
        createImagesBusinessDto.file.id,
      );
      if (!fileObject) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            file: 'notExists',
          },
        });
      }
      file = fileObject;
    } else if (createImagesBusinessDto.file === null) {
      file = null;
    }

    let business: Business | null | undefined = undefined;

    if (createImagesBusinessDto.business) {
      const businessObject = await this.businessService.findById(
        createImagesBusinessDto.business.id,
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
    } else if (createImagesBusinessDto.business === null) {
      business = null;
    }

    return this.imagesBusinessRepository.create({
      // Do not remove comment below.
      // <creating-property-payload />
      file,

      business,
    });
  }

  findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }) {
    return this.imagesBusinessRepository.findAllWithPagination({
      paginationOptions: {
        page: paginationOptions.page,
        limit: paginationOptions.limit,
      },
    });
  }

  findById(id: ImagesBusiness['id']) {
    return this.imagesBusinessRepository.findById(id);
  }

  findByIds(ids: ImagesBusiness['id'][]) {
    return this.imagesBusinessRepository.findByIds(ids);
  }

  async update(
    id: ImagesBusiness['id'],

    updateImagesBusinessDto: UpdateImagesBusinessDto,
  ) {
    // Do not remove comment below.
    // <updating-property />
    let file: FileType | null | undefined = undefined;

    if (updateImagesBusinessDto.file) {
      const fileObject = await this.fileService.findById(
        updateImagesBusinessDto.file.id,
      );
      if (!fileObject) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            file: 'notExists',
          },
        });
      }
      file = fileObject;
    } else if (updateImagesBusinessDto.file === null) {
      file = null;
    }

    let business: Business | null | undefined = undefined;

    if (updateImagesBusinessDto.business) {
      const businessObject = await this.businessService.findById(
        updateImagesBusinessDto.business.id,
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
    } else if (updateImagesBusinessDto.business === null) {
      business = null;
    }

    return this.imagesBusinessRepository.update(id, {
      // Do not remove comment below.
      // <updating-property-payload />
      file,

      business,
    });
  }

  remove(id: ImagesBusiness['id']) {
    return this.imagesBusinessRepository.remove(id);
  }
}
