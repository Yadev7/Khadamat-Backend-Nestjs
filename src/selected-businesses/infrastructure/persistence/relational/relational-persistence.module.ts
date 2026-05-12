import { Module } from '@nestjs/common';
import { SelectedBusinessRepository } from '../selected-business.repository';
import { SelectedBusinessRelationalRepository } from './repositories/selected-business.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SelectedBusinessEntity } from './entities/selected-business.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SelectedBusinessEntity])],
  providers: [
    {
      provide: SelectedBusinessRepository,
      useClass: SelectedBusinessRelationalRepository,
    },
  ],
  exports: [SelectedBusinessRepository],
})
export class RelationalSelectedBusinessPersistenceModule {}
