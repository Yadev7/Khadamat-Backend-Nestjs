import { BusinessesModule } from '../businesses/businesses.module';
import {
  // do not remove this comment
  Module,
} from '@nestjs/common';
import { MessagesService } from './messages.service';
import { MessagesController } from './messages.controller';
import { RelationalMessagePersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module';
import { MailModule } from '../mail/mail.module';

@Module({
  imports: [
    BusinessesModule,
    MailModule,

    // do not remove this comment
    RelationalMessagePersistenceModule,
  ],
  controllers: [MessagesController],
  providers: [MessagesService],
  exports: [MessagesService, RelationalMessagePersistenceModule],
})
export class MessagesModule {}
