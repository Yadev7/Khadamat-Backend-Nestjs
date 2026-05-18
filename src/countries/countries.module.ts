import {
  // do not remove this comment
  Module,
} from '@nestjs/common';
import { LocalisationsModule } from '../localisations/localisations.module';
import { CountriesService } from './countries.service';
import { CountriesController } from './countries.controller';
import { RelationalCountryPersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module';

@Module({
  imports: [
    // do not remove this comment
    RelationalCountryPersistenceModule,
    LocalisationsModule,
  ],
  controllers: [CountriesController],
  providers: [CountriesService],
  exports: [CountriesService, RelationalCountryPersistenceModule],
})
export class CountriesModule {}
