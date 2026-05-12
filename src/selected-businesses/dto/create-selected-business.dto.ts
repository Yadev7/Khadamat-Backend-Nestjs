import { BusinessDto } from '../../businesses/dto/business.dto';

import {
  // decorators here

  Transform,
  Type,
} from 'class-transformer';

import {
  // decorators here

  IsOptional,
  IsDate,
  ValidateNested,
  IsNotEmptyObject,
} from 'class-validator';

import {
  // decorators here
  ApiProperty,
} from '@nestjs/swagger';

export class CreateSelectedBusinessDto {
  @ApiProperty({
    required: false,
    type: () => BusinessDto,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => BusinessDto)
  @IsNotEmptyObject()
  business?: BusinessDto | null;

  @ApiProperty({
    required: false,
    type: () => Date,
  })
  @IsOptional()
  @Transform(({ value }) => new Date(value))
  @IsDate()
  dateFin?: Date | null;

  @ApiProperty({
    required: false,
    type: () => Date,
  })
  @IsOptional()
  @Transform(({ value }) => new Date(value))
  @IsDate()
  dateDeb?: Date | null;

  // Don't forget to use the class-validator decorators in the DTO properties.
}
