import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { CallEntity } from '../entities/call.entity';
import { NullableType } from '../../../../../utils/types/nullable.type';
import { Call } from '../../../../domain/call';
import { CallRepository } from '../../call.repository';
import { CallMapper } from '../mappers/call.mapper';
import { IPaginationOptions } from '../../../../../utils/types/pagination-options';

@Injectable()
export class CallRelationalRepository implements CallRepository {
  constructor(
    @InjectRepository(CallEntity)
    private readonly callRepository: Repository<CallEntity>,
  ) {}

  async create(data: Call): Promise<Call> {
    const persistenceModel = CallMapper.toPersistence(data);
    const newEntity = await this.callRepository.save(
      this.callRepository.create(persistenceModel),
    );
    return CallMapper.toDomain(newEntity);
  }

  async findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<Call[]> {
    const entities = await this.callRepository.find({
      skip: (paginationOptions.page - 1) * paginationOptions.limit,
      take: paginationOptions.limit,
    });

    return entities.map((entity) => CallMapper.toDomain(entity));
  }

  async findById(id: Call['id']): Promise<NullableType<Call>> {
    const entity = await this.callRepository.findOne({
      where: { id },
    });

    return entity ? CallMapper.toDomain(entity) : null;
  }

  async findByIds(ids: Call['id'][]): Promise<Call[]> {
    const entities = await this.callRepository.find({
      where: { id: In(ids) },
    });

    return entities.map((entity) => CallMapper.toDomain(entity));
  }

  async update(id: Call['id'], payload: Partial<Call>): Promise<Call> {
    const entity = await this.callRepository.findOne({
      where: { id },
    });

    if (!entity) {
      throw new Error('Record not found');
    }

    const updatedEntity = await this.callRepository.save(
      this.callRepository.create(
        CallMapper.toPersistence({
          ...CallMapper.toDomain(entity),
          ...payload,
        }),
      ),
    );

    return CallMapper.toDomain(updatedEntity);
  }

  async remove(id: Call['id']): Promise<void> {
    await this.callRepository.delete(id);
  }
}
