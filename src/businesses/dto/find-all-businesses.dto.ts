// src/businesses/dto/find-all-businesses.dto.ts
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class FindAllBusinessesDto {
  @ApiPropertyOptional()
  @IsOptional()
  page?: number;

  @ApiPropertyOptional()
  @IsOptional()
  limit?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  service?: string; // Captures ?service=UUID from URL

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  cityId?: string;   // Captures ?cityId=UUID from URL

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  zoneId?: string;   // Captures ?zoneId=UUID from URL
  city: string | undefined;
  zone: string | undefined;
}