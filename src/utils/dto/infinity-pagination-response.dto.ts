import { Type } from '@nestjs/common';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class InfinityPaginationMetaDto {
  @ApiPropertyOptional({
    type: Number,
    example: 42,
  })
  total?: number;
}

export class InfinityPaginationResponseDto<T> {
  data: T[];
  hasNextPage: boolean;
  meta?: InfinityPaginationMetaDto;
}

export function InfinityPaginationResponse<T>(classReference: Type<T>) {
  abstract class Pagination {
    @ApiProperty({ type: [classReference] })
    data!: T[];

    @ApiProperty({
      type: Boolean,
      example: true,
    })
    hasNextPage: boolean;

    @ApiPropertyOptional({ type: InfinityPaginationMetaDto })
    meta?: InfinityPaginationMetaDto;
  }

  Object.defineProperty(Pagination, 'name', {
    writable: false,
    value: `InfinityPagination${classReference.name}ResponseDto`,
  });

  return Pagination;
}
