import { DeepPartial } from '../../../utils/types/deep-partial.type';
import { NullableType } from '../../../utils/types/nullable.type';
import { IPaginationOptions } from '../../../utils/types/pagination-options';
import { SelectedBusiness } from '../../domain/selected-business';

export abstract class SelectedBusinessRepository {
  abstract create(
    data: Omit<SelectedBusiness, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<SelectedBusiness>;

  abstract findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<SelectedBusiness[]>;

  abstract findById(
    id: SelectedBusiness['id'],
  ): Promise<NullableType<SelectedBusiness>>;

  abstract findByIds(
    ids: SelectedBusiness['id'][],
  ): Promise<SelectedBusiness[]>;

  abstract update(
    id: SelectedBusiness['id'],
    payload: DeepPartial<SelectedBusiness>,
  ): Promise<SelectedBusiness | null>;

  abstract remove(id: SelectedBusiness['id']): Promise<void>;
}
