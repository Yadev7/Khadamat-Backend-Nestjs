import { FileDto } from '../../files/dto/file.dto';

import { BusinessDto } from '../../businesses/dto/business.dto';

import {
  // decorators here
  Type,
} from 'class-transformer';

import {
  // decorators here

  ValidateNested,
  IsNotEmptyObject,
  IsOptional,
} from 'class-validator';

import {
  // decorators here
  ApiProperty,
} from '@nestjs/swagger';

export class CreateImagesBusinessDto {
  @ApiProperty({
    required: false,
    type: () => FileDto,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => FileDto)
  @IsNotEmptyObject()
  file?: FileDto | null;

  @ApiProperty({
    required: false,
    type: () => BusinessDto,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => BusinessDto)
  @IsNotEmptyObject()
  business?: BusinessDto | null;

  // Don't forget to use the class-validator decorators in the DTO properties.
}
