import { DeepPartial } from '../../../utils/types/deep-partial.type';
import { NullableType } from '../../../utils/types/nullable.type';
import { IPaginationOptions } from '../../../utils/types/pagination-options';
import { Service } from '../../domain/service';

export abstract class ServiceRepository {
  abstract create(
    data: Omit<Service, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<Service>;

  abstract findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<Service[]>;

  abstract findById(id: Service['id']): Promise<NullableType<Service>>;

  abstract findByIds(ids: Service['id'][]): Promise<Service[]>;

  abstract update(
    id: Service['id'],
    payload: DeepPartial<Service>,
  ): Promise<Service | null>;

  abstract remove(id: Service['id']): Promise<void>;
}
