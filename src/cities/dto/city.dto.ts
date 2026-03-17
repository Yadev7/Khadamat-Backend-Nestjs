import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
export class CityDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  id!: string;
}
