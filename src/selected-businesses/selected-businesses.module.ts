import { BusinessesModule } from '../businesses/businesses.module';
import {
  // do not remove this comment
  Module,
} from '@nestjs/common';
import { SelectedBusinessesService } from './selected-businesses.service';
import { SelectedBusinessesController } from './selected-businesses.controller';
import { RelationalSelectedBusinessPersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module';

@Module({
  imports: [
    BusinessesModule,

    // do not remove this comment
    RelationalSelectedBusinessPersistenceModule,
  ],
  controllers: [SelectedBusinessesController],
  providers: [SelectedBusinessesService],
  exports: [
    SelectedBusinessesService,
    RelationalSelectedBusinessPersistenceModule,
  ],
})
export class SelectedBusinessesModule {}
