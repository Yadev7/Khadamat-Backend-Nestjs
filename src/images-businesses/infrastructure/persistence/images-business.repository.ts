import { DeepPartial } from '../../../utils/types/deep-partial.type';
import { NullableType } from '../../../utils/types/nullable.type';
import { IPaginationOptions } from '../../../utils/types/pagination-options';
import { ImagesBusiness } from '../../domain/images-business';

export abstract class ImagesBusinessRepository {
  abstract create(
    data: Omit<ImagesBusiness, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<ImagesBusiness>;

  abstract findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<ImagesBusiness[]>;

  abstract findById(
    id: ImagesBusiness['id'],
  ): Promise<NullableType<ImagesBusiness>>;

  abstract findByIds(ids: ImagesBusiness['id'][]): Promise<ImagesBusiness[]>;

  abstract update(
    id: ImagesBusiness['id'],
    payload: DeepPartial<ImagesBusiness>,
  ): Promise<ImagesBusiness | null>;

  abstract remove(id: ImagesBusiness['id']): Promise<void>;
}
