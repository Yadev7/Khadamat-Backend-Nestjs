import {
  HttpStatus,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { FileRepository } from '../../persistence/file.repository';
import { AllConfigType } from '../../../../config/config.type';
import { FileType } from '../../../domain/file';

@Injectable()
export class FilesLocalService {
  constructor(
    private readonly configService: ConfigService<AllConfigType>,
    private readonly fileRepository: FileRepository,
  ) {}

  // async create(file: Express.Multer.File): Promise<{ file: FileType }> {
  //   if (!file) {
  //     throw new UnprocessableEntityException({
  //       status: HttpStatus.UNPROCESSABLE_ENTITY,
  //       errors: {
  //         file: 'selectFile',
  //       },
  //     });
  //   }

  //   return {
  //     file: await this.fileRepository.create({
  //       path: `/${this.configService.get('app.apiPrefix', {
  //         infer: true,
  //       })}/api/v1/${file.path}`,
  //     }),
  //   };
  // }

  async create(file: Express.Multer.File): Promise<{ file: FileType }> {
    if (!file) {
      throw new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        errors: {
          file: 'selectFile',
        },
      });
    }

    // 1. استخراج الـ prefix (غالباً هو 'api')
    const prefix = this.configService.get('app.apiPrefix', { infer: true });

    // 2. تنظيف المسار:
    // - إزالة التكرار: نستخدم الـ prefix مباشرة مع /v1/
    // - تحويل الـ Backslashes (\\) إلى Forward Slashes (/) لدعم المتصفحات
    const cleanPath = `/${prefix}/v1/${file.path.replace(/\\/g, '/')}`;

    return {
      file: await this.fileRepository.create({
        path: cleanPath,
      }),
    };
  }
}
