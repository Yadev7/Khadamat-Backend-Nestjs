import { AddressesModule } from '../addresses/addresses.module';
import {
  // do not remove this comment
  Module,
} from '@nestjs/common';
import { ContactsService } from './contacts.service';
import { ContactsController } from './contacts.controller';
import { RelationalContactPersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module';

@Module({
  imports: [
    AddressesModule,

    // do not remove this comment
    RelationalContactPersistenceModule,
  ],
  controllers: [ContactsController],
  providers: [ContactsService],
  exports: [ContactsService, RelationalContactPersistenceModule],
})
export class ContactsModule {}
