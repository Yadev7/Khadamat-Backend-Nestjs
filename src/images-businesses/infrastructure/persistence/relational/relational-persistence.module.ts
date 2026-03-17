import { Module } from '@nestjs/common';
import { ImagesBusinessRepository } from '../images-business.repository';
import { ImagesBusinessRelationalRepository } from './repositories/images-business.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ImagesBusinessEntity } from './entities/images-business.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ImagesBusinessEntity])],
  providers: [
    {
      provide: ImagesBusinessRepository,
      useClass: ImagesBusinessRelationalRepository,
    },
  ],
  exports: [ImagesBusinessRepository],
})
export class RelationalImagesBusinessPersistenceModule {}
