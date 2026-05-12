import { IsEnum } from 'class-validator';
import { FileCategory } from '../file-category.enum';
import { ApiProperty } from '@nestjs/swagger';

export class FindFilesByCategoryDto {
  @ApiProperty({ enum: FileCategory })
  @IsEnum(FileCategory)
  category: FileCategory;
}
