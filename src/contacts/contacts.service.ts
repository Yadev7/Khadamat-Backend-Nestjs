import { AddressesService } from '../addresses/addresses.service';
import { Address } from '../addresses/domain/address';

import {
  // common
  Injectable,
  HttpStatus,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';
import { ContactRepository } from './infrastructure/persistence/contact.repository';
import { IPaginationOptions } from '../utils/types/pagination-options';
import { Contact } from './domain/contact';

@Injectable()
export class ContactsService {
  constructor(
    private readonly addressService: AddressesService,

    // Dependencies here
    private readonly contactRepository: ContactRepository,
  ) {}

  async create(createContactDto: CreateContactDto) {
    // Do not remove comment below.
    // <creating-property />
    let address: Address | null | undefined = undefined;

    if (createContactDto.address) {
      const addressObject = await this.addressService.findById(
        createContactDto.address.id,
      );
      if (!addressObject) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            address: 'notExists',
          },
        });
      }
      address = addressObject;
    } else if (createContactDto.address === null) {
      address = null;
    }

    return this.contactRepository.create({
      // Do not remove comment below.
      // <creating-property-payload />
      address,

      email: createContactDto.email,

      phoneGround: createContactDto.phoneGround,

      phoneCell: createContactDto.phoneCell,

      lastNameAr: createContactDto.lastNameAr,

      lastName: createContactDto.lastName,

      firstNameAr: createContactDto.firstNameAr,

      firstName: createContactDto.firstName,
    });
  }

  findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }) {
    return this.contactRepository.findAllWithPagination({
      paginationOptions: {
        page: paginationOptions.page,
        limit: paginationOptions.limit,
      },
    });
  }

  findById(id: Contact['id']) {
    return this.contactRepository.findById(id);
  }

  findByIds(ids: Contact['id'][]) {
    return this.contactRepository.findByIds(ids);
  }

  async update(
    id: Contact['id'],

    updateContactDto: UpdateContactDto,
  ) {
    // Do not remove comment below.
    // <updating-property />
    let address: Address | null | undefined = undefined;

    if (updateContactDto.address) {
      const addressObject = await this.addressService.findById(
        updateContactDto.address.id,
      );
      if (!addressObject) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            address: 'notExists',
          },
        });
      }
      address = addressObject;
    } else if (updateContactDto.address === null) {
      address = null;
    }

    return this.contactRepository.update(id, {
      // Do not remove comment below.
      // <updating-property-payload />
      address,

      email: updateContactDto.email,

      phoneGround: updateContactDto.phoneGround,

      phoneCell: updateContactDto.phoneCell,

      lastNameAr: updateContactDto.lastNameAr,

      lastName: updateContactDto.lastName,

      firstNameAr: updateContactDto.firstNameAr,

      firstName: updateContactDto.firstName,
    });
  }

  remove(id: Contact['id']) {
    return this.contactRepository.remove(id);
  }
}
