import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { EvaluationEntity } from '../entities/evaluation.entity';
import { NullableType } from '../../../../../utils/types/nullable.type';
import { Evaluation } from '../../../../domain/evaluation';
import { EvaluationRepository } from '../../evaluation.repository';
import { EvaluationMapper } from '../mappers/evaluation.mapper';
import { IPaginationOptions } from '../../../../../utils/types/pagination-options';

@Injectable()
export class EvaluationRelationalRepository implements EvaluationRepository {
  constructor(
    @InjectRepository(EvaluationEntity)
    private readonly evaluationRepository: Repository<EvaluationEntity>,
  ) {}

  async create(data: Evaluation): Promise<Evaluation> {
    const persistenceModel = EvaluationMapper.toPersistence(data);
    const newEntity = await this.evaluationRepository.save(
      this.evaluationRepository.create(persistenceModel),
    );
    return EvaluationMapper.toDomain(newEntity);
  }

  async findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<Evaluation[]> {
    const entities = await this.evaluationRepository.find({
      skip: (paginationOptions.page - 1) * paginationOptions.limit,
      take: paginationOptions.limit,
    });

    return entities.map((entity) => EvaluationMapper.toDomain(entity));
  }

  async findById(id: Evaluation['id']): Promise<NullableType<Evaluation>> {
    const entity = await this.evaluationRepository.findOne({
      where: { id },
    });

    return entity ? EvaluationMapper.toDomain(entity) : null;
  }

  async findByIds(ids: Evaluation['id'][]): Promise<Evaluation[]> {
    const entities = await this.evaluationRepository.find({
      where: { id: In(ids) },
    });

    return entities.map((entity) => EvaluationMapper.toDomain(entity));
  }

  async update(
    id: Evaluation['id'],
    payload: Partial<Evaluation>,
  ): Promise<Evaluation> {
    const entity = await this.evaluationRepository.findOne({
      where: { id },
    });

    if (!entity) {
      throw new Error('Record not found');
    }

    const updatedEntity = await this.evaluationRepository.save(
      this.evaluationRepository.create(
        EvaluationMapper.toPersistence({
          ...EvaluationMapper.toDomain(entity),
          ...payload,
        }),
      ),
    );

    return EvaluationMapper.toDomain(updatedEntity);
  }

  async remove(id: Evaluation['id']): Promise<void> {
    await this.evaluationRepository.delete(id as string);
  }
}
