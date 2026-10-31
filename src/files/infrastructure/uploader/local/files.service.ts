import {
  HttpStatus,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FileRepository } from '../../persistence/file.repository';
import { AllConfigType } from '../../../../config/config.type';
import { FileType } from '../../../domain/file';
import { detectFileCategory } from '../../../utils/detect-file-category.util';
import { basename } from 'path';

@Injectable()
export class FilesLocalService {
  constructor(
    private readonly configService: ConfigService<AllConfigType>,
    private readonly fileRepository: FileRepository,
  ) {}

  async create(
    file: Express.Multer.File,
    fileDescription: string | null = null,
  ): Promise<{ file: FileType }> {
    if (!file) {
      throw new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        errors: {
          file: 'selectFile',
        },
      });
    }

    // Extract only the clean filename
    const cleanFilename = basename(file.path.replace(/\\/g, '/'));

    // Store the relative API path so the automatic transformer results in the full URL
    const relativePath = `api/v1/files/${cleanFilename}`;

    return {
      file: await this.fileRepository.create({
        path: relativePath,
        fileCategory: detectFileCategory(file.originalname),
        fileDescription,
      }),
    };
  }
}
