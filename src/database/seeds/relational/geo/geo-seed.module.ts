import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GeoSeedService } from './geo-seed.service';
import { CountryEntity } from 'src/countries/infrastructure/persistence/relational/entities/country.entity';
import { CityEntity } from 'src/cities/infrastructure/persistence/relational/entities/city.entity';
import { CityAreaEntity } from 'src/city-areas/infrastructure/persistence/relational/entities/city-area.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([CountryEntity, CityEntity, CityAreaEntity]),
  ],
  providers: [GeoSeedService],
  exports: [GeoSeedService],
})
export class GeoSeedModule {}
