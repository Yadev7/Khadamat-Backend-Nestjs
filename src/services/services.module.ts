import { FilesModule } from '../files/files.module';
import {
  // do not remove this comment
  Module,
} from '@nestjs/common';
import { ServicesService } from './services.service';
import { ServicesController } from './services.controller';
import { RelationalServicePersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module';

@Module({
  imports: [
    FilesModule,

    // do not remove this comment
    RelationalServicePersistenceModule,
  ],
  controllers: [ServicesController],
  providers: [ServicesService],
  exports: [ServicesService, RelationalServicePersistenceModule],
})
export class ServicesModule {}
