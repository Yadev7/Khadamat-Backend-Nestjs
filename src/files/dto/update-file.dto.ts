import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateFileDto {
  @ApiProperty({ required: false, nullable: true })
  @IsOptional()
  @IsString()
  fileDescription?: string | null;
}
