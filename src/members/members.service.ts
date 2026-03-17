import { UsersService } from '../users/users.service';
import { User } from '../users/domain/user';

import { EntreprisesService } from '../entreprises/entreprises.service';
import { Entreprise } from '../entreprises/domain/entreprise';

import { ContactsService } from '../contacts/contacts.service';
import { Contact } from '../contacts/domain/contact';

import {
  // common
  Injectable,
  HttpStatus,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CreateMemberDto } from './dto/create-member.dto';
import { UpdateMemberDto } from './dto/update-member.dto';
import { MemberRepository } from './infrastructure/persistence/member.repository';
import { IPaginationOptions } from '../utils/types/pagination-options';
import { Member } from './domain/member';

@Injectable()
export class MembersService {
  constructor(
    private readonly userService: UsersService,

    private readonly entrepriseService: EntreprisesService,

    private readonly contactService: ContactsService,

    // Dependencies here
    private readonly memberRepository: MemberRepository,
  ) {}

  async create(createMemberDto: CreateMemberDto) {
    // Do not remove comment below.
    // <creating-property />
    let user: User | null | undefined = undefined;

    if (createMemberDto.user) {
      const userObject = await this.userService.findById(
        createMemberDto.user.id,
      );
      if (!userObject) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            user: 'notExists',
          },
        });
      }
      user = userObject;
    } else if (createMemberDto.user === null) {
      user = null;
    }

    let entreprise: Entreprise | null | undefined = undefined;

    if (createMemberDto.entreprise) {
      const entrepriseObject = await this.entrepriseService.findById(
        createMemberDto.entreprise.id,
      );
      if (!entrepriseObject) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            entreprise: 'notExists',
          },
        });
      }
      entreprise = entrepriseObject;
    } else if (createMemberDto.entreprise === null) {
      entreprise = null;
    }

    let contact: Contact | null | undefined = undefined;

    if (createMemberDto.contact) {
      const contactObject = await this.contactService.findById(
        createMemberDto.contact.id,
      );
      if (!contactObject) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            contact: 'notExists',
          },
        });
      }
      contact = contactObject;
    } else if (createMemberDto.contact === null) {
      contact = null;
    }

    return this.memberRepository.create({
      // Do not remove comment below.
      // <creating-property-payload />
      user,

      entreprise,

      contact,

      typeMember: createMemberDto.typeMember,
    });
  }

  findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }) {
    return this.memberRepository.findAllWithPagination({
      paginationOptions: {
        page: paginationOptions.page,
        limit: paginationOptions.limit,
      },
    });
  }

  findById(id: Member['id']) {
    return this.memberRepository.findById(id);
  }

  findByIds(ids: Member['id'][]) {
    return this.memberRepository.findByIds(ids);
  }

  async update(
    id: Member['id'],

    updateMemberDto: UpdateMemberDto,
  ) {
    // Do not remove comment below.
    // <updating-property />
    let user: User | null | undefined = undefined;

    if (updateMemberDto.user) {
      const userObject = await this.userService.findById(
        updateMemberDto.user.id,
      );
      if (!userObject) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            user: 'notExists',
          },
        });
      }
      user = userObject;
    } else if (updateMemberDto.user === null) {
      user = null;
    }

    let entreprise: Entreprise | null | undefined = undefined;

    if (updateMemberDto.entreprise) {
      const entrepriseObject = await this.entrepriseService.findById(
        updateMemberDto.entreprise.id,
      );
      if (!entrepriseObject) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            entreprise: 'notExists',
          },
        });
      }
      entreprise = entrepriseObject;
    } else if (updateMemberDto.entreprise === null) {
      entreprise = null;
    }

    let contact: Contact | null | undefined = undefined;

    if (updateMemberDto.contact) {
      const contactObject = await this.contactService.findById(
        updateMemberDto.contact.id,
      );
      if (!contactObject) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            contact: 'notExists',
          },
        });
      }
      contact = contactObject;
    } else if (updateMemberDto.contact === null) {
      contact = null;
    }

    return this.memberRepository.update(id, {
      // Do not remove comment below.
      // <updating-property-payload />
      user,

      entreprise,

      contact,

      typeMember: updateMemberDto.typeMember,
    });
  }

  remove(id: Member['id']) {
    return this.memberRepository.remove(id);
  }
}
