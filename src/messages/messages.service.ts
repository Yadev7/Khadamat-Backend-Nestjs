import { BusinessesService } from '../businesses/businesses.service';
import { Business } from '../businesses/domain/business';

import {
  // common
  Injectable,
  HttpStatus,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { MessageRepository } from './infrastructure/persistence/message.repository';
import { IPaginationOptions } from '../utils/types/pagination-options';
import { Message } from './domain/message';

@Injectable()
export class MessagesService {
  constructor(
    private readonly businessService: BusinessesService,

    // Dependencies here
    private readonly messageRepository: MessageRepository,
  ) {}

  async create(createMessageDto: CreateMessageDto) {
    // Do not remove comment below.
    // <creating-property />
    let business: Business | null | undefined = undefined;

    if (createMessageDto.business) {
      const businessObject = await this.businessService.findById(
        createMessageDto.business.id,
      );
      if (!businessObject) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            business: 'notExists',
          },
        });
      }
      business = businessObject;
    } else if (createMessageDto.business === null) {
      business = null;
    }

    return this.messageRepository.create({
      // Do not remove comment below.
      // <creating-property-payload />
      business,

      emailContact: createMessageDto.emailContact,

      phoneContact: createMessageDto.phoneContact,

      audio: createMessageDto.audio,

      textAr: createMessageDto.textAr,

      textFr: createMessageDto.textFr,

      textEn: createMessageDto.textEn,

      titleAr: createMessageDto.titleAr,

      titleFr: createMessageDto.titleFr,
    });
  }

  findAllWithPagination({
    paginationOptions,
    filterOptions,
  }: {
    paginationOptions: IPaginationOptions;
    filterOptions?: { businessId?: string };
  }) {
    return this.messageRepository.findAllWithPagination({
      paginationOptions: {
        page: paginationOptions.page,
        limit: paginationOptions.limit,
      },
      filterOptions: {
        businessId: filterOptions?.businessId,
      },
    });
  }

  findById(id: Message['id']) {
    return this.messageRepository.findById(id);
  }

  findByIds(ids: Message['id'][]) {
    return this.messageRepository.findByIds(ids);
  }

  async update(
    id: Message['id'],

    updateMessageDto: UpdateMessageDto,
  ) {
    // Do not remove comment below.
    // <updating-property />
    let business: Business | null | undefined = undefined;

    if (updateMessageDto.business) {
      const businessObject = await this.businessService.findById(
        updateMessageDto.business.id,
      );
      if (!businessObject) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            business: 'notExists',
          },
        });
      }
      business = businessObject;
    } else if (updateMessageDto.business === null) {
      business = null;
    }

    return this.messageRepository.update(id, {
      // Do not remove comment below.
      // <updating-property-payload />
      business,

      emailContact: updateMessageDto.emailContact,

      phoneContact: updateMessageDto.phoneContact,

      audio: updateMessageDto.audio,

      textAr: updateMessageDto.textAr,

      textFr: updateMessageDto.textFr,

      textEn: updateMessageDto.textEn,

      titleAr: updateMessageDto.titleAr,

      titleFr: updateMessageDto.titleFr,
    });
  }

  remove(id: Message['id']) {
    return this.messageRepository.remove(id);
  }
}
