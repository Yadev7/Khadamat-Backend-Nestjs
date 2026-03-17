import { Module } from '@nestjs/common';
import { CityAreaRepository } from '../city-area.repository';
import { CityAreaRelationalRepository } from './repositories/city-area.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CityAreaEntity } from './entities/city-area.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CityAreaEntity])],
  providers: [
    {
      provide: CityAreaRepository,
      useClass: CityAreaRelationalRepository,
    },
  ],
  exports: [CityAreaRepository],
})
export class RelationalCityAreaPersistenceModule {}
