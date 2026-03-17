import { DeepPartial } from '../../../utils/types/deep-partial.type';
import { NullableType } from '../../../utils/types/nullable.type';
import { IPaginationOptions } from '../../../utils/types/pagination-options';
import { Entreprise } from '../../domain/entreprise';

export abstract class EntrepriseRepository {
  abstract create(
    data: Omit<Entreprise, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<Entreprise>;

  abstract findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<Entreprise[]>;

  abstract findById(id: Entreprise['id']): Promise<NullableType<Entreprise>>;

  abstract findByIds(ids: Entreprise['id'][]): Promise<Entreprise[]>;

  abstract update(
    id: Entreprise['id'],
    payload: DeepPartial<Entreprise>,
  ): Promise<Entreprise | null>;

  abstract remove(id: Entreprise['id']): Promise<void>;
}
