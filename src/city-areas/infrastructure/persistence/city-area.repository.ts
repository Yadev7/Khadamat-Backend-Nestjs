import { DeepPartial } from '../../../utils/types/deep-partial.type';
import { NullableType } from '../../../utils/types/nullable.type';
import { IPaginationOptions } from '../../../utils/types/pagination-options';
import { CityArea } from '../../domain/city-area';

export abstract class CityAreaRepository {
  abstract create(
    data: Omit<CityArea, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<CityArea>;

  abstract findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<CityArea[]>;

  abstract findById(id: CityArea['id']): Promise<NullableType<CityArea>>;

  abstract findByIds(ids: CityArea['id'][]): Promise<CityArea[]>;

  abstract update(
    id: CityArea['id'],
    payload: DeepPartial<CityArea>,
  ): Promise<CityArea | null>;

  abstract remove(id: CityArea['id']): Promise<void>;
}
