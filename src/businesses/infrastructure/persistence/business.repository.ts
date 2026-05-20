import { EntityManager } from 'typeorm';
import { DeepPartial } from '../../../utils/types/deep-partial.type';
import { NullableType } from '../../../utils/types/nullable.type';
import { IPaginationOptions } from '../../../utils/types/pagination-options';
import { Business } from '../../domain/business';

export abstract class BusinessRepository {
  // abstract create(
  //   data: Omit<Business, 'id' | 'createdAt' | 'updatedAt'>,
  //   manager?: any,
  // ): Promise<Business>;

  abstract create(
    data: Business,
    transactionManager?: EntityManager, // Add this
  ): Promise<Business>;

  abstract findAllWithPagination({
    paginationOptions,
    filterOptions,
  }: {
    paginationOptions: IPaginationOptions;
    filterOptions?: { cityId?: string; zoneId?: string; serviceId?: string };
  }): Promise<Business[]>;

  abstract findById(id: Business['id']): Promise<NullableType<Business>>;

  abstract findByIds(ids: Business['id'][]): Promise<Business[]>;

  abstract update(
    id: Business['id'],
    payload: DeepPartial<Business>,
  ): Promise<Business | null>;

  abstract remove(id: Business['id']): Promise<void>;
}
