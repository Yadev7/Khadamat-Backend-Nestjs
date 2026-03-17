import { UsersModule } from '../users/users.module';
import { EntreprisesModule } from '../entreprises/entreprises.module';
import { ContactsModule } from '../contacts/contacts.module';
import { forwardRef, Module } from '@nestjs/common';
import { MembersService } from './members.service';
import { MembersController } from './members.controller';
import { RelationalMemberPersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module';

@Module({
  imports: [
    forwardRef(() => UsersModule),

    EntreprisesModule,

    ContactsModule,

    // do not remove this comment
    RelationalMemberPersistenceModule,
  ],
  controllers: [MembersController],
  providers: [MembersService],
  exports: [MembersService, RelationalMemberPersistenceModule],
})
export class MembersModule {}
