import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServiceSeedService } from './services-seed.service';
import { ServiceEntity } from 'src/services/infrastructure/persistence/relational/entities/service.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ServiceEntity])],
  providers: [ServiceSeedService],
  exports: [ServiceSeedService],
})
export class ServicesSeedModule {}
