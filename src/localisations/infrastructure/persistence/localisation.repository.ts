import { DeepPartial } from '../../../utils/types/deep-partial.type';
import { NullableType } from '../../../utils/types/nullable.type';
import { IPaginationOptions } from '../../../utils/types/pagination-options';
import { Localisation } from '../../domain/localisation';

export abstract class LocalisationRepository {
  abstract create(
    data: Omit<Localisation, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<Localisation>;

  abstract findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<Localisation[]>;

  abstract findById(
    id: Localisation['id'],
  ): Promise<NullableType<Localisation>>;

  abstract findByIds(ids: Localisation['id'][]): Promise<Localisation[]>;

  abstract update(
    id: Localisation['id'],
    payload: DeepPartial<Localisation>,
  ): Promise<Localisation | null>;

  abstract remove(id: Localisation['id']): Promise<void>;
}
