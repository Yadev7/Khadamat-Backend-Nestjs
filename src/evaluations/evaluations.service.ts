import { Injectable } from '@nestjs/common';
import { CreateEvaluationDto } from './dto/create-evaluation.dto';
import { UpdateEvaluationDto } from './dto/update-evaluation.dto';
import { EvaluationRepository } from './infrastructure/persistence/evaluation.repository';
import { IPaginationOptions } from '../utils/types/pagination-options';
import { Evaluation } from './domain/evaluation';

@Injectable()
export class EvaluationsService {
  constructor(private readonly evaluationRepository: EvaluationRepository) {}

  async create(createEvaluationDto: CreateEvaluationDto) {
    const evalCode =
      createEvaluationDto.EvalCode ||
      `EVAL-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;

    return this.evaluationRepository.create({
      isValid: createEvaluationDto.isValid ?? true,
      textAr: createEvaluationDto.textAr,
      textFr: createEvaluationDto.textFr,
      stars: createEvaluationDto.stars,
      EvalCode: evalCode,
      business: { id: createEvaluationDto.businessId } as any,
    });
  }

  findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }) {
    return this.evaluationRepository.findAllWithPagination({
      paginationOptions: {
        page: paginationOptions.page,
        limit: paginationOptions.limit,
      },
    });
  }

  findById(id: Evaluation['id']) {
    return this.evaluationRepository.findById(id);
  }

  findByIds(ids: Evaluation['id'][]) {
    return this.evaluationRepository.findByIds(ids);
  }

  async update(id: Evaluation['id'], updateEvaluationDto: UpdateEvaluationDto) {
    return this.evaluationRepository.update(id, {
      isValid: updateEvaluationDto.isValid,
      textAr: updateEvaluationDto.textAr,
      textFr: updateEvaluationDto.textFr,
      stars: updateEvaluationDto.stars,
      EvalCode: updateEvaluationDto.EvalCode,
      ...(updateEvaluationDto.businessId && {
        business: { id: updateEvaluationDto.businessId } as any,
      }),
    });
  }

  remove(id: Evaluation['id']) {
    return this.evaluationRepository.remove(id);
  }
}
