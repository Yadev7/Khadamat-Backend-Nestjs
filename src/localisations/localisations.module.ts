import {
  // do not remove this comment
  Module,
} from '@nestjs/common';
import { LocalisationsService } from './localisations.service';
import { LocalisationsController } from './localisations.controller';
import { RelationalLocalisationPersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module';

@Module({
  imports: [
    // do not remove this comment
    RelationalLocalisationPersistenceModule,
  ],
  controllers: [LocalisationsController],
  providers: [LocalisationsService],
  exports: [LocalisationsService, RelationalLocalisationPersistenceModule],
})
export class LocalisationsModule {}
