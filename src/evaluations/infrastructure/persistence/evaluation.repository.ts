import { DeepPartial } from '../../../utils/types/deep-partial.type';
import { NullableType } from '../../../utils/types/nullable.type';
import { IPaginationOptions } from '../../../utils/types/pagination-options';
import { Evaluation } from '../../domain/evaluation';

export abstract class EvaluationRepository {
  abstract create(
    data: Omit<Evaluation, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<Evaluation>;

  abstract findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<Evaluation[]>;

  abstract findById(id: Evaluation['id']): Promise<NullableType<Evaluation>>;

  abstract findByIds(ids: Evaluation['id'][]): Promise<Evaluation[]>;

  abstract update(
    id: Evaluation['id'],
    payload: DeepPartial<Evaluation>,
  ): Promise<Evaluation | null>;

  abstract remove(id: Evaluation['id']): Promise<void>;
}
