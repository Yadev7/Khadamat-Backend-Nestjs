import { Module } from '@nestjs/common';
import { EvaluationRepository } from '../evaluation.repository';
import { EvaluationRelationalRepository } from './repositories/evaluation.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EvaluationEntity } from './entities/evaluation.entity';

@Module({
  imports: [TypeOrmModule.forFeature([EvaluationEntity])],
  providers: [
    {
      provide: EvaluationRepository,
      useClass: EvaluationRelationalRepository,
    },
  ],
  exports: [EvaluationRepository],
})
export class RelationalEvaluationPersistenceModule {}
