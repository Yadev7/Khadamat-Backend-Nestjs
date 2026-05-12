import { DeepPartial } from '../../../utils/types/deep-partial.type';
import { NullableType } from '../../../utils/types/nullable.type';
import { IPaginationOptions } from '../../../utils/types/pagination-options';
import { Contact } from '../../domain/contact';
import { ContactMapper } from './relational/mappers/contact.mapper';

export abstract class ContactRepository {
  contactEntityRepository: any;
  find(arg0: { skip: number; take: number; relations: string[]; }) {
    throw new Error('Method not implemented.');
  }
  abstract create(
    data: Omit<Contact, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<Contact>;

  // abstract findAllWithPagination({
  //   paginationOptions,
  // }: {
  //   paginationOptions: IPaginationOptions;
  // }): Promise<Contact[]>;

  // Example fix in contact.repository.ts
async findAllWithPagination({
  paginationOptions,
}: {
  paginationOptions: IPaginationOptions;
}): Promise<Contact[]> {
  const entities = await this.contactEntityRepository.find({
    skip: (paginationOptions.page - 1) * paginationOptions.limit,
    take: paginationOptions.limit,
    relations: ['address'], // <--- THIS LINE IS THE KEY
  });

  return entities.map((entity) => ContactMapper.toDomain(entity));
}

  abstract findById(id: Contact['id']): Promise<NullableType<Contact>>;

  abstract findByIds(ids: Contact['id'][]): Promise<Contact[]>;

  abstract update(
    id: Contact['id'],
    payload: DeepPartial<Contact>,
  ): Promise<Contact | null>;

  abstract remove(id: Contact['id']): Promise<void>;
}
