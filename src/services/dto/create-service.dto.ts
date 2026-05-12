import { ApiProperty } from '@nestjs/swagger';
import {
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { FileDto } from '../../files/dto/file.dto';

export class CreateServiceDto {
  // @ApiProperty({ type: () => FileDto, required: false })
  // @IsOptional()
  // @ValidateNested()
  // @Type(() => FileDto) // This matches the { id: "..." } from frontend
  // image?: FileDto | null;

  @ApiProperty({ type: () => FileDto, required: false })
  @IsOptional()
  @IsObject() // Add this to ensure it's treated as an object
  @ValidateNested()
  @Type(() => FileDto)
  image?: FileDto | null;

  @ApiProperty({ type: String, required: false })
  @IsOptional()
  @IsString()
  nameServAr?: string;

  @ApiProperty({ type: () => FileDto, required: false })
  @IsOptional()
  @ValidateNested()
  @Type(() => FileDto)
  video?: FileDto | null;

  // @ApiProperty({ type: String, required: false })
  // @IsOptional()
  // @IsString()
  // nameServAr?: string;

  @ApiProperty({ type: String, required: false })
  @IsOptional()
  @IsString()
  nameServFr?: string;

  // ... same for other string fields ...
  @IsOptional() @IsString() nameServEn?: string | null;
  @IsOptional() @IsString() descrAr?: string | null;
  @IsOptional() @IsString() descrFr?: string | null;
  @IsOptional() @IsString() descrEn?: string | null;
}
