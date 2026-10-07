import { DeepPartial } from '../../../utils/types/deep-partial.type';
import { NullableType } from '../../../utils/types/nullable.type';
import { IPaginationOptions } from '../../../utils/types/pagination-options';
import { Business } from '../../domain/business';

export type BusinessFilterOptions = {
  cityId?: string;
  zoneId?: string;
  serviceId?: string;
};

export type BusinessListResult = {
  items: Business[];
  total: number;
};

export abstract class BusinessRepository {
  abstract create(data: Business, transactionManager?: any): Promise<Business>;

  abstract findAllWithPagination({
    paginationOptions,
    filterOptions,
    relations,
  }: {
    paginationOptions: IPaginationOptions;
    filterOptions?: BusinessFilterOptions;
    relations?: string;
  }): Promise<BusinessListResult>;

  abstract findById(id: Business['id']): Promise<NullableType<Business>>;

  abstract findByIds(ids: Business['id'][]): Promise<Business[]>;

  abstract update(
    id: Business['id'],
    payload: DeepPartial<Business>,
  ): Promise<Business | null>;

  abstract remove(id: Business['id']): Promise<void>;
}
