import {
  // decorators here
  IsString,
  IsOptional,
} from 'class-validator';
import {
  // decorators here
  ApiProperty,
} from '@nestjs/swagger';

export class CreateCountryDto {
  @ApiProperty({
    required: false,
  })
  @IsOptional()
  flagImg?: any | null;

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
    type: () => String,
  })
  @IsOptional()
  @IsString()
  countryCode?: string | null;

  @ApiProperty({ required: false, type: Number })
  @IsOptional()
  latitude?: number | null;

  @ApiProperty({ required: false, type: Number })
  @IsOptional()
  longitude?: number | null;

  @ApiProperty({ required: false })
  @IsOptional()
  localisation?: any;

  // Don't forget to use the class-validator decorators in the DTO properties.
}
