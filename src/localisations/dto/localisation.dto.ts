import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class LocalisationDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  id: string;
}
