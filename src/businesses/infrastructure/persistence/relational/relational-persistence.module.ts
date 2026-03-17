import { Module } from '@nestjs/common';
import { BusinessRepository } from '../business.repository';
import { BusinessRelationalRepository } from './repositories/business.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BusinessEntity } from './entities/business.entity';

@Module({
  imports: [TypeOrmModule.forFeature([BusinessEntity])],
  providers: [
    {
      provide: BusinessRepository,
      useClass: BusinessRelationalRepository,
    },
  ],
  exports: [BusinessRepository],
})
export class RelationalBusinessPersistenceModule {}
