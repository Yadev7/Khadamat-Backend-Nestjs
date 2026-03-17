import { DeepPartial } from '../../../utils/types/deep-partial.type';
import { NullableType } from '../../../utils/types/nullable.type';
import { IPaginationOptions } from '../../../utils/types/pagination-options';
import { Member } from '../../domain/member';

export abstract class MemberRepository {
  abstract create(
    data: Omit<Member, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<Member>;

  abstract findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<Member[]>;

  abstract findById(id: Member['id']): Promise<NullableType<Member>>;

  abstract findByIds(ids: Member['id'][]): Promise<Member[]>;

  abstract update(
    id: Member['id'],
    payload: DeepPartial<Member>,
  ): Promise<Member | null>;

  abstract remove(id: Member['id']): Promise<void>;
}
