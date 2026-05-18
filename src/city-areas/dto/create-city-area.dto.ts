import { LocalisationDto } from '../../localisations/dto/localisation.dto';

import { CityDto } from '../../cities/dto/city.dto';

import {
  // decorators here

  IsString,
  IsOptional,
  ValidateNested,
  IsNotEmptyObject,
} from 'class-validator';

import {
  // decorators here
  ApiProperty,
} from '@nestjs/swagger';

import {
  // decorators here
  Type,
} from 'class-transformer';

export class CreateCityAreaDto {
  @ApiProperty({
    required: false,
    type: () => LocalisationDto,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => LocalisationDto)
  @IsNotEmptyObject()
  localisation?: LocalisationDto | null;

  @ApiProperty({
    required: false,
    type: () => CityDto,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => CityDto)
  @IsNotEmptyObject()
  city?: CityDto | null;

  @ApiProperty({
    required: false,
    type: () => CityDto,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => CityDto)
  @IsNotEmptyObject()
  idCity?: CityDto | null;

  @ApiProperty({
    required: false,
    type: () => String,
  })
  @IsOptional()
  @IsString()
  nameAr?: string | null;

  @ApiProperty({
    required: false,
    type: () => String,
  })
  @IsOptional()
  @IsString()
  nameFr?: string | null;

  @ApiProperty({
    required: false,
    type: () => Number,
  })
  @IsOptional()
  latitude?: number | null;

  @ApiProperty({
    required: false,
    type: () => Number,
  })
  @IsOptional()
  longitude?: number | null;

  // Don't forget to use the class-validator decorators in the DTO properties.
}
