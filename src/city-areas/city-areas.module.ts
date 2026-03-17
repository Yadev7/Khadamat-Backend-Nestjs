import { LocalisationsModule } from '../localisations/localisations.module';
import { CitiesModule } from '../cities/cities.module';
import {
  // do not remove this comment
  Module,
} from '@nestjs/common';
import { CityAreasService } from './city-areas.service';
import { CityAreasController } from './city-areas.controller';
import { RelationalCityAreaPersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module';

@Module({
  imports: [
    LocalisationsModule,

    CitiesModule,

    // do not remove this comment
    RelationalCityAreaPersistenceModule,
  ],
  controllers: [CityAreasController],
  providers: [CityAreasService],
  exports: [CityAreasService, RelationalCityAreaPersistenceModule],
})
export class CityAreasModule {}
