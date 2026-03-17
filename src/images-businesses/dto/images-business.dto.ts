import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class ImagesBusinessDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  id: string;
}
