import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CountryDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  id?: string;
}
