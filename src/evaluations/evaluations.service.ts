import {
  // common
  Injectable,
} from '@nestjs/common';
import { CreateEvaluationDto } from './dto/create-evaluation.dto';
import { UpdateEvaluationDto } from './dto/update-evaluation.dto';
import { EvaluationRepository } from './infrastructure/persistence/evaluation.repository';
import { IPaginationOptions } from '../utils/types/pagination-options';
import { Evaluation } from './domain/evaluation';

@Injectable()
export class EvaluationsService {
  constructor(
    // Dependencies here
    private readonly evaluationRepository: EvaluationRepository,
  ) {}

  async create(createEvaluationDto: CreateEvaluationDto) {
    // Do not remove comment below.
    // <creating-property />

    return this.evaluationRepository.create({
      // Do not remove comment below.
      // <creating-property-payload />
      isValid: createEvaluationDto.isValid,

      textAr: createEvaluationDto.textAr,

      textFr: createEvaluationDto.textFr,

      stars: createEvaluationDto.stars,

      EvalCode: createEvaluationDto.EvalCode,
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

  async update(
    id: Evaluation['id'],

    updateEvaluationDto: UpdateEvaluationDto,
  ) {
    // Do not remove comment below.
    // <updating-property />

    return this.evaluationRepository.update(id, {
      // Do not remove comment below.
      // <updating-property-payload />
      isValid: updateEvaluationDto.isValid,

      textAr: updateEvaluationDto.textAr,

      textFr: updateEvaluationDto.textFr,

      stars: updateEvaluationDto.stars,

      EvalCode: updateEvaluationDto.EvalCode,
    });
  }

  remove(id: Evaluation['id']) {
    return this.evaluationRepository.remove(id);
  }
}
