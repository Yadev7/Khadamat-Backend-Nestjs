import { CountriesModule } from '../countries/countries.module';

import {
  // do not remove this comment
  Module,
} from '@nestjs/common';
import { CitiesService } from './cities.service';
import { CitiesController } from './cities.controller';
import { RelationalCityPersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module';

@Module({
  imports: [
    CountriesModule,

    // do not remove this comment
    RelationalCityPersistenceModule,
  ],
  controllers: [CitiesController],
  providers: [CitiesService],
  exports: [CitiesService, RelationalCityPersistenceModule],
})
export class CitiesModule {}
