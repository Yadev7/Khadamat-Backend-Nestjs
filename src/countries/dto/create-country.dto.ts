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
    type: () => String,
  })
  @IsOptional()
  @IsString()
  flagImg?: string | null;

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

  // Don't forget to use the class-validator decorators in the DTO properties.
}
