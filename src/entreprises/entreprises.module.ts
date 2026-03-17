import { AddressesModule } from '../addresses/addresses.module';
import {
  // do not remove this comment
  Module,
} from '@nestjs/common';
import { EntreprisesService } from './entreprises.service';
import { EntreprisesController } from './entreprises.controller';
import { RelationalEntreprisePersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module';

@Module({
  imports: [
    AddressesModule,

    // do not remove this comment
    RelationalEntreprisePersistenceModule,
  ],
  controllers: [EntreprisesController],
  providers: [EntreprisesService],
  exports: [EntreprisesService, RelationalEntreprisePersistenceModule],
})
export class EntreprisesModule {}
