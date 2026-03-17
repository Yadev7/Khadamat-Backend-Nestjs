import { Module } from '@nestjs/common';
import { CallRepository } from '../call.repository';
import { CallRelationalRepository } from './repositories/call.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CallEntity } from './entities/call.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CallEntity])],
  providers: [
    {
      provide: CallRepository,
      useClass: CallRelationalRepository,
    },
  ],
  exports: [CallRepository],
})
export class RelationalCallPersistenceModule {}
