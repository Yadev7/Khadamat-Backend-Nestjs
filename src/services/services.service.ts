import {
  Injectable,
  HttpStatus,
  UnprocessableEntityException,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { FilesService } from '../files/files.service';
import { FileType } from '../files/domain/file';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { ServiceRepository } from './infrastructure/persistence/service.repository';
import { IPaginationOptions } from '../utils/types/pagination-options';
import { Service } from './domain/service';

@Injectable()
export class ServicesService {
  constructor(
    private readonly fileService: FilesService,
    private readonly serviceRepository: ServiceRepository,
  ) {}

  async create(createServiceDto: CreateServiceDto) {
    // معالجة الفيديو عند الإنشاء
    let video: FileType | null | undefined = undefined;
    if (createServiceDto.video) {
      const videoObject = await this.fileService.findById(
        createServiceDto.video.id,
      );
      if (!videoObject) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: { video: 'notExists' },
        });
      }
      video = videoObject;
    } else if (createServiceDto.video === null) {
      video = null;
    }

    // معالجة الصورة عند الإنشاء
    let image: FileType | null | undefined = undefined;
    if (createServiceDto.image) {
      const imageObject = await this.fileService.findById(
        createServiceDto.image.id,
      );
      if (!imageObject) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: { image: 'notExists' },
        });
      }
      image = imageObject;
    } else if (createServiceDto.image === null) {
      image = null;
    }

    return this.serviceRepository.create({
      video,
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

  async update(id: Service['id'], updateServiceDto: UpdateServiceDto) {
    // 1. معالجة الفيديو (التحقق من وجوده في جدول الملفات)
    let video: FileType | null | undefined = undefined;
    if (updateServiceDto.video) {
      const videoObject = await this.fileService.findById(
        updateServiceDto.video.id,
      );
      if (!videoObject) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: { video: 'notExists' },
        });
      }
      video = videoObject;
    } else if (updateServiceDto.video === null) {
      video = null;
    }

    // 2. معالجة الصورة (إصلاح الخطأ السابق: الآن المتغير معرف)
    let image: FileType | null | undefined = undefined;
    if (updateServiceDto.image) {
      const imageObject = await this.fileService.findById(
        updateServiceDto.image.id,
      );
      if (!imageObject) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: { image: 'notExists' },
        });
      }
      image = imageObject;
    } else if (updateServiceDto.image === null) {
      image = null;
    }

    return this.serviceRepository.update(id, {
      video,
      image,
      descrEn: updateServiceDto.descrEn,
      descrAr: updateServiceDto.descrAr,
      descrFr: updateServiceDto.descrFr,
      nameServEn: updateServiceDto.nameServEn,
      nameServAr: updateServiceDto.nameServAr,
      nameServFr: updateServiceDto.nameServFr,
    });
  }

  async remove(id: Service['id']) {
    try {
      const service = await this.serviceRepository.findById(id);
      if (!service) {
        throw new NotFoundException(`Service with ID ${id} not found`);
      }

      await this.serviceRepository.remove(id);
      return { status: 'deleted', id };
    } catch (error) {
      // إذا كان الخطأ متعلق بقيود قاعدة البيانات (Foreign Key)
      if (error.code === '23503') {
        // كود الخطأ لـ PostgreSQL مثلاً
        throw new InternalServerErrorException(
          'Cannot delete service: It is referenced by other records (e.g. bookings).',
        );
      }
      throw error;
    }
  }
}
