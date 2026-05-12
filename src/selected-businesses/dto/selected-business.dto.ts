import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class SelectedBusinessDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  id: string;
}
