import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Response,
  UploadedFile,
  UseInterceptors,
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

import { StreamableFile } from '@nestjs/common';
import { createReadStream } from 'fs';
import { join, basename } from 'path';

import { NotFoundException } from '@nestjs/common';
import { existsSync } from 'fs';

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
  download(@Param('path') path: string, @Response() response) {
    return response.sendFile(path, { root: './files' });
  }
}

//   @Get(':path')
// @ApiExcludeEndpoint()
// async download(@Param('path') path: string, @Response({ passthrough: true }) response) {
//   const normalizedPath = path.replace(/\\/g, '/');
//   // Adjust this path if your images are in a different folder than your audio
//   const filePath = join(process.cwd(), 'files', normalizedPath);

//   if (!existsSync(filePath)) {
//     throw new NotFoundException('File not found');
//   }

//   const mimeType = normalizedPath.endsWith('.mp3') ? 'audio/mpeg' : 
//                    normalizedPath.endsWith('.mp4') ? 'video/mp4' : 
//                    'image/jpeg'; // Default to image if not mp3/mp4

//   response.set({
//     'Content-Type': mimeType,
//     'Content-Disposition': `inline; filename="${normalizedPath}"`,
//   });

//   const file = createReadStream(filePath);
//   return new StreamableFile(file);
// }


// @Get(':path')
// @ApiExcludeEndpoint()
// async download(@Param('path') path: string, @Response({ passthrough: true }) response) {
//   // Extract ONLY the filename (e.g., 'e795...mp3')
//   const fileName = basename(path.replace(/\\/g, '/'));
//   const filePath = join(process.cwd(), 'files', fileName);

//   if (!existsSync(filePath)) {
//     throw new NotFoundException(`File not found: ${fileName}`);
//   }

//   // Determine MIME type
//   let mimeType = 'application/octet-stream';
//   if (fileName.endsWith('.mp3')) mimeType = 'audio/mpeg';
//   else if (fileName.endsWith('.mp4')) mimeType = 'video/mp4';
//   else if (fileName.match(/\.(jpg|jpeg|png|gif)$/i)) mimeType = 'image/jpeg';

//   response.set({
//     'Content-Type': mimeType,
//     'Content-Disposition': `inline; filename="${fileName}"`,
//   });

//   return new StreamableFile(createReadStream(filePath));
// }


