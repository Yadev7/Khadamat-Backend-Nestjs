import { LocalisationsModule } from '../localisations/localisations.module';
import { CitiesModule } from '../cities/cities.module';
import { CityAreasModule } from '../city-areas/city-areas.module';
import { CountriesModule } from '../countries/countries.module';
import {
  // do not remove this comment
  Module,
} from '@nestjs/common';
import { AddressesService } from './addresses.service';
import { AddressesController } from './addresses.controller';
import { RelationalAddressPersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module';

@Module({
  imports: [
    LocalisationsModule,

    CitiesModule,

    CityAreasModule,

    CountriesModule,

    // do not remove this comment
    RelationalAddressPersistenceModule,
  ],
  controllers: [AddressesController],
  providers: [AddressesService],
  exports: [AddressesService, RelationalAddressPersistenceModule],
})
export class AddressesModule {}
