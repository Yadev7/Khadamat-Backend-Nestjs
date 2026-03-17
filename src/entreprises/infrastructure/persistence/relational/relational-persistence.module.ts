import { Module } from '@nestjs/common';
import { EntrepriseRepository } from '../entreprise.repository';
import { EntrepriseRelationalRepository } from './repositories/entreprise.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EntrepriseEntity } from './entities/entreprise.entity';

@Module({
  imports: [TypeOrmModule.forFeature([EntrepriseEntity])],
  providers: [
    {
      provide: EntrepriseRepository,
      useClass: EntrepriseRelationalRepository,
    },
  ],
  exports: [EntrepriseRepository],
})
export class RelationalEntreprisePersistenceModule {}
