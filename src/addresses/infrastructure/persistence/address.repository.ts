import { DeepPartial } from '../../../utils/types/deep-partial.type';
import { NullableType } from '../../../utils/types/nullable.type';
import { IPaginationOptions } from '../../../utils/types/pagination-options';
import { Address } from '../../domain/address';

export abstract class AddressRepository {
  abstract create(
    data: Omit<Address, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<Address>;

  abstract findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<Address[]>;

  abstract findById(id: Address['id']): Promise<NullableType<Address>>;

  abstract findByIds(ids: Address['id'][]): Promise<Address[]>;

  abstract update(
    id: Address['id'],
    payload: DeepPartial<Address>,
  ): Promise<Address | null>;

  abstract remove(id: Address['id']): Promise<void>;
}
