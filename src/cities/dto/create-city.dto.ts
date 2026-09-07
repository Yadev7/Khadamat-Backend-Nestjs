import { CountryDto } from '../../countries/dto/country.dto';

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

export class CreateCityDto {
  @ApiProperty({
    required: false,
    type: () => CountryDto,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => CountryDto)
  @IsNotEmptyObject()
  country?: CountryDto | null;

  @ApiProperty({
    required: false,
    type: () => CountryDto,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => CountryDto)
  @IsNotEmptyObject()
  idCountry?: CountryDto | null;

  @ApiProperty({
    required: false,
    type: () => String,
  })
  @IsOptional()
  @IsString()
  nameEn?: string | null;

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

  @ApiProperty({
    required: false,
    type: () => Object,
  })
  @IsOptional()
  localisation?: any | null;

  // Don't forget to use the class-validator decorators in the DTO properties.
}
