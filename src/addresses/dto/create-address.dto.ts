import { LocalisationDto } from '../../localisations/dto/localisation.dto';

import { CityDto } from '../../cities/dto/city.dto';

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

export class CreateAddressDto {
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
    type: () => CountryDto,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => CountryDto)
  @IsNotEmptyObject()
  country?: CountryDto | null;

  @ApiProperty({
    required: false,
    type: () => String,
  })
  @IsOptional()
  @IsString()
  lineAddressAr?: string | null;

  @ApiProperty({
    required: false,
    type: () => String,
  })
  @IsOptional()
  @IsString()
  lineAddressFr?: string | null;

  // Don't forget to use the class-validator decorators in the DTO properties.
}
