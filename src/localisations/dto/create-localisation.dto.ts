import {
  // decorators here

  IsNumber,
  IsOptional,
} from 'class-validator';

import {
  // decorators here
  ApiProperty,
} from '@nestjs/swagger';

export class CreateLocalisationDto {
  latitude: number | null | undefined;
  longitude: number | null | undefined;
  // @ApiProperty({
  //   required: false,
  //   type: () => Number,
  // })
  // @IsOptional()
  // @IsNumber()
  // latitude?: number | null;

  // @ApiProperty({
  //   required: false,
  //   type: () => Number,
  // })
  // @IsOptional()
  // @IsNumber()
  // longitude?: number | null;

  // Don't forget to use the class-validator decorators in the DTO properties.
}
