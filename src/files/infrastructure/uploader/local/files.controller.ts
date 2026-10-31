import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Response,
  UploadedFile,
  UseInterceptors,
  StreamableFile,
  NotFoundException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiExcludeEndpoint,
  ApiTags,
} from '@nestjs/swagger';
import { FilesLocalService } from './files.service';
import { FileResponseDto } from './dto/file-response.dto';
import { Public } from 'src/auth/decorators/public.decorator';
import { createReadStream, existsSync } from 'fs';
import { join, basename } from 'path';

@ApiTags('Files')
@Controller({
  path: 'files',
  version: '1',
})
export class FilesLocalController {
  constructor(private readonly filesService: FilesLocalService) {}

  @ApiCreatedResponse({ type: FileResponseDto })
  @Public()
  @Post('upload')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
        fileDescription: {
          type: 'string',
          nullable: true,
          description: 'Optional file description',
        },
      },
      required: ['file'],
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Body('fileDescription') fileDescription?: string,
  ): Promise<FileResponseDto> {
    return this.filesService.create(file, fileDescription ?? null);
  }

  @Public()
  @Get(':path')
  @ApiExcludeEndpoint()
  download(
    @Param('path') rawPath: string,
    @Response({ passthrough: true }) response,
  ) {
    // Sanitize and extract ONLY the filename to protect against path traversal and backslash bugs
    const fileName = basename(rawPath.replace(/\\/g, '/'));
    const filePath = join(process.cwd(), 'files', fileName);

    if (!existsSync(filePath)) {
      throw new NotFoundException(`File not found: ${fileName}`);
    }

    // Determine correct MIME type dynamically
    let mimeType = 'application/octet-stream';
    if (fileName.endsWith('.mp3')) mimeType = 'audio/mpeg';
    else if (fileName.endsWith('.mp4')) mimeType = 'video/mp4';
    else if (fileName.match(/\.(jpg|jpeg|png|gif|webp)$/i))
      mimeType = 'image/jpeg';

    response.set({
      'Content-Type': mimeType,
      'Content-Disposition': `inline; filename="${fileName}"`,
    });

    return new StreamableFile(createReadStream(filePath));
  }
}
