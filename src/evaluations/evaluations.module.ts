import {
  // do not remove this comment
  Module,
} from '@nestjs/common';
import { EvaluationsService } from './evaluations.service';
import { EvaluationsController } from './evaluations.controller';
import { RelationalEvaluationPersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module';

@Module({
  imports: [
    // do not remove this comment
    RelationalEvaluationPersistenceModule,
  ],
  controllers: [EvaluationsController],
  providers: [EvaluationsService],
  exports: [EvaluationsService, RelationalEvaluationPersistenceModule],
})
export class EvaluationsModule {}
