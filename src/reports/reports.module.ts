import { BusinessesModule } from '../businesses/businesses.module';
import {
  // do not remove this comment
  Module,
} from '@nestjs/common';
import { ReportsService } from './reports.service';
import { ReportsController } from './reports.controller';
import { RelationalReportPersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module';

@Module({
  imports: [
    BusinessesModule,

    // do not remove this comment
    RelationalReportPersistenceModule,
  ],
  controllers: [ReportsController],
  providers: [ReportsService],
  exports: [ReportsService, RelationalReportPersistenceModule],
})
export class ReportsModule {}
