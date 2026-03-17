import { Module } from '@nestjs/common';
import { LocalisationRepository } from '../localisation.repository';
import { LocalisationRelationalRepository } from './repositories/localisation.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LocalisationEntity } from './entities/localisation.entity';

@Module({
  imports: [TypeOrmModule.forFeature([LocalisationEntity])],
  providers: [
    {
      provide: LocalisationRepository,
      useClass: LocalisationRelationalRepository,
    },
  ],
  exports: [LocalisationRepository],
})
export class RelationalLocalisationPersistenceModule {}
