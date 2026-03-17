// src/businesses/businesses.module.ts

import { Module, forwardRef } from '@nestjs/common';
import { BusinessesService } from './businesses.service';
import { BusinessesController } from './businesses.controller';
import { ContactsModule } from '../contacts/contacts.module';
import { ServicesModule } from '../services/services.module';
import { MembersModule } from '../members/members.module';
import { FilesModule } from 'src/files/files.module'; // 1. Import FilesModule
import { RelationalBusinessPersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module';

@Module({
  imports: [
    ContactsModule,
    ServicesModule,
    FilesModule, // 2. Add FilesModule here
    forwardRef(() => MembersModule),
    RelationalBusinessPersistenceModule,
  ],
  controllers: [BusinessesController],
  providers: [BusinessesService],
  exports: [BusinessesService, RelationalBusinessPersistenceModule],
})
export class BusinessesModule {}
