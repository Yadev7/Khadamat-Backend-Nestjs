import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { ContactEntity } from '../entities/contact.entity';
import { NullableType } from '../../../../../utils/types/nullable.type';
import { Contact } from '../../../../domain/contact';
import { ContactRepository } from '../../contact.repository';
import { ContactMapper } from '../mappers/contact.mapper';
import { IPaginationOptions } from '../../../../../utils/types/pagination-options';

@Injectable()
export class ContactRelationalRepository implements ContactRepository {
  constructor(
    @InjectRepository(ContactEntity)
    private readonly contactRepository: Repository<ContactEntity>,
  ) { }
  contactEntityRepository: any;
  find(arg0: { skip: number; take: number; relations: string[]; }): void {
    throw new Error('Method not implemented.');
  }

  async create(data: Contact): Promise<Contact> {
    const persistenceModel = ContactMapper.toPersistence(data);
    const newEntity = await this.contactRepository.save(
      this.contactRepository.create(persistenceModel),
    );
    return ContactMapper.toDomain(newEntity);
  }

  // async findAllWithPagination({
  //   paginationOptions,
  // }: {
  //   paginationOptions: IPaginationOptions;
  // }): Promise<Contact[]> {
  //   const entities = await this.contactRepository.find({
  //     skip: (paginationOptions.page - 1) * paginationOptions.limit,
  //     take: paginationOptions.limit,
  //   });

  //   return entities.map((entity) => ContactMapper.toDomain(entity));
  // }

  async findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<Contact[]> {
    const entities = await this.contactRepository.find({
      skip: (paginationOptions.page - 1) * paginationOptions.limit,
      take: paginationOptions.limit,
      // CRITICAL: Add this line to include the address object
      relations: ['address'],
    });

    return entities.map((entity) => ContactMapper.toDomain(entity));
  }

  async findById(id: Contact['id']): Promise<NullableType<Contact>> {
    const entity = await this.contactRepository.findOne({
      where: { id },
    });

    return entity ? ContactMapper.toDomain(entity) : null;
  }

  async findByIds(ids: Contact['id'][]): Promise<Contact[]> {
    const entities = await this.contactRepository.find({
      where: { id: In(ids) },
    });

    return entities.map((entity) => ContactMapper.toDomain(entity));
  }

  async update(id: Contact['id'], payload: Partial<Contact>): Promise<Contact> {
    const entity = await this.contactRepository.findOne({
      where: { id },
    });

    if (!entity) {
      throw new Error('Record not found');
    }

    const updatedEntity = await this.contactRepository.save(
      this.contactRepository.create(
        ContactMapper.toPersistence({
          ...ContactMapper.toDomain(entity),
          ...payload,
        }),
      ),
    );

    return ContactMapper.toDomain(updatedEntity);
  }

  async remove(id: Contact['id']): Promise<void> {
    await this.contactRepository.delete(id);
  }
}
