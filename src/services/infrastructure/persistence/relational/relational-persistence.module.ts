import { Module } from '@nestjs/common';
import { ServiceRepository } from '../service.repository';
import { ServiceRelationalRepository } from './repositories/service.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServiceEntity } from './entities/service.entity';
import { FileEntity } from 'src/files/infrastructure/persistence/relational/entities/file.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ServiceEntity, FileEntity])],
  providers: [
    {
      provide: ServiceRepository,
      useClass: ServiceRelationalRepository,
    },
  ],
  exports: [ServiceRepository],
})
export class RelationalServicePersistenceModule {}
