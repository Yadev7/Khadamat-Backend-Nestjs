import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class ServiceDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  id!: string;
}
