import { FilesModule } from '../files/files.module';
import { BusinessesModule } from '../businesses/businesses.module';
import {
  // do not remove this comment
  Module,
} from '@nestjs/common';
import { ImagesBusinessesService } from './images-businesses.service';
import { ImagesBusinessesController } from './images-businesses.controller';
import { RelationalImagesBusinessPersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module';

@Module({
  imports: [
    FilesModule,

    BusinessesModule,

    // do not remove this comment
    RelationalImagesBusinessPersistenceModule,
  ],
  controllers: [ImagesBusinessesController],
  providers: [ImagesBusinessesService],
  exports: [ImagesBusinessesService, RelationalImagesBusinessPersistenceModule],
})
export class ImagesBusinessesModule {}
