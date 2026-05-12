import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';
import { Transform, Type } from 'class-transformer';

// export class FindAllBusinessesDto {
//   @ApiPropertyOptional()
//   @Transform(({ value }) => (value ? Number(value) : 1))
//   @IsNumber()
//   @IsOptional()
//   page?: number;

//   @ApiPropertyOptional()
//   @Transform(({ value }) => (value ? Number(value) : 10))
//   @IsNumber()
//   @IsOptional()
//   limit?: number;
//   cityId: string | undefined;
//   zoneId: string | undefined;
//   service: string | undefined;
// }

export class FindAllBusinessesDto {
  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  page?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  limit?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  cityId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  zoneId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  service?: string; // هذا ما نرسله من الفرونت إند
}
