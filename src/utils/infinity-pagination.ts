import { IPaginationOptions } from './types/pagination-options';
import { InfinityPaginationResponseDto } from './dto/infinity-pagination-response.dto';

/**
 * Page size ceiling for "lookup" endpoints (cities, city areas, services).
 * These tables are small reference data that the search UI has to load in full,
 * so they allow a much bigger page than the default 50 used elsewhere.
 */
export const LOOKUP_MAX_LIMIT = 500;

/** Default page size ceiling for regular collection endpoints. */
export const DEFAULT_MAX_LIMIT = 50;

export const infinityPagination = <T>(
  data: T[],
  options: IPaginationOptions,
  meta?: { total?: number },
): InfinityPaginationResponseDto<T> => {
  return {
    data,
    hasNextPage: data.length === options.limit,
    ...(meta?.total !== undefined ? { meta: { total: meta.total } } : {}),
  };
};
