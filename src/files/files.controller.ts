import { Controller, Get, Query } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { FilesService } from './files.service';
import { FindFilesByCategoryDto } from './dto/find-files-by-category.dto';
import { FileType } from './domain/file';

@ApiTags('Files')
@Controller({
  path: 'files',
  version: '1',
})
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  // existing upload endpoint stays here untouched...

  @ApiOkResponse({ type: [FileType] }) // adjust to your response serializer if needed
  @Get('by-category')
  findByCategory(@Query() query: FindFilesByCategoryDto): Promise<FileType[]> {
    return this.filesService.findByCategory(query.category);
  }
}
