import { UsersService } from '../users/users.service';
import { User } from '../users/domain/user';
import { EntreprisesService } from '../entreprises/entreprises.service';
import { Entreprise } from '../entreprises/domain/entreprise';
import { ContactsService } from '../contacts/contacts.service';
import { Contact } from '../contacts/domain/contact';
import {
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
    private readonly memberRepository: MemberRepository,
  ) {}

  // async create(createMemberDto: CreateMemberDto) {
  //   let user: User | null | undefined = undefined;

  //   // Use type assertion to handle the 'user' property if it's not in the DTO
  //   const dtoUser = (createMemberDto as any).user;
  //   if (dtoUser && dtoUser.id) {
  //     const userObject = await this.userService.findById(dtoUser.id);
  //     if (!userObject) {
  //       throw new UnprocessableEntityException({
  //         status: HttpStatus.UNPROCESSABLE_ENTITY,
  //         errors: { user: 'notExists' },
  //       });
  //     }
  //     user = userObject;
  //   }

  //   let entreprise: Entreprise | null | undefined = undefined;
  //   if (createMemberDto.entreprise) {
  //     const entId = (createMemberDto.entreprise as any).id;
  //     if (entId) {
  //       const entrepriseObject = await this.entrepriseService.findById(entId);
  //       if (!entrepriseObject) {
  //         throw new UnprocessableEntityException({
  //           status: HttpStatus.UNPROCESSABLE_ENTITY,
  //           errors: { entreprise: 'notExists' },
  //         });
  //       }
  //       entreprise = entrepriseObject;
  //     }
  //   }

  //   let contact: Contact | null | undefined = undefined;
  //   if (createMemberDto.contact) {
  //     const contactId = (createMemberDto.contact as any).id;
  //     if (contactId) {
  //       const contactObject = await this.contactService.findById(contactId);
  //       if (!contactObject) {
  //         throw new UnprocessableEntityException({
  //           status: HttpStatus.UNPROCESSABLE_ENTITY,
  //           errors: { contact: 'notExists' },
  //         });
  //       }
  //       contact = contactObject;
  //     } else {
  //       // Create the contact if no ID is passed
  //       contact = await this.contactService.create(createMemberDto.contact as any);
  //     }
  //   }

  //   return this.memberRepository.create({
  //     user,
  //     entreprise,
  //     contact,
  //     typeMember: createMemberDto.typeMember,
  //   });
  // }

  // async create(createMemberDto: CreateMemberDto) {
  //   let user: User | null | undefined = undefined;

  //   const dtoUser = (createMemberDto as any).user;
  //   if (dtoUser) {
  //     if (dtoUser.id) {
  //       // Logic for existing user
  //       const userObject = await this.userService.findById(dtoUser.id);
  //       if (!userObject) {
  //         throw new UnprocessableEntityException({
  //           status: HttpStatus.UNPROCESSABLE_ENTITY,
  //           errors: { user: 'notExists' },
  //         });
  //       }
  //       user = userObject;
  //     } else {
  //       // --- THE FIX: Create NEW user automatically ---
  //       // We pass the user data (email, photo, etc.) to the UserService
  //       user = await this.userService.create({
  //         email: dtoUser.email,
  //         password: 'DefaultPassword123!', // You should probably send a random one or use a "Welcome" password
  //         role: { id: 2 }, // Default 'User' role ID
  //         status: { id: 1 }, // Default 'Active' status ID
  //         photo: dtoUser.photo, // Links the photo uploaded from frontend
  //       });
  //     }
  //   }

  //   // ... (Keep your existing Entreprise logic)

  //   let contact: Contact | null | undefined = undefined;
  //   if (createMemberDto.contact) {
  //     const contactId = (createMemberDto.contact as any).id;
  //     if (contactId) {
  //       const contactObject = await this.contactService.findById(contactId);
  //       if (!contactObject) {
  //         throw new UnprocessableEntityException({
  //           status: HttpStatus.UNPROCESSABLE_ENTITY,
  //           errors: { contact: 'notExists' },
  //         });
  //       }
  //       contact = contactObject;
  //     } else {
  //       // Automatically creates contact (and address)
  //       contact = await this.contactService.create(createMemberDto.contact as any);
  //     }
  //   }

  //   return this.memberRepository.create({
  //     user, // Now guaranteed to have a value!
  //     contact,
  //     typeMember: createMemberDto.typeMember,
  //   });
  // }

  // members.service.ts

  async create(createMemberDto: CreateMemberDto) {
    let user: User | null = null;
    let entreprise: Entreprise | null = null;

    // 1. Logic for INDIVIDUAL
    if (createMemberDto.typeMember === 'INDIVIDUAL') {
      // Create the User (Login account)
      const dtoUser = (createMemberDto as any).user;
      user = await this.userService.create({
        email: dtoUser.email,
        password: 'DefaultPassword123!',
        role: { id: 2 },
        status: { id: 1 },
      });
      // Ensure entreprise stays null
      entreprise = null;
    }

    // 2. Logic for ENTERPRISE
    else if (createMemberDto.typeMember === 'ENTERPRISE') {
      // Create the Enterprise record
      entreprise = await this.entrepriseService.create(
        createMemberDto.entreprise,
      );
      // Ensure user stays null (or link a representative if needed)
      user = null;
    }

    // 3. Always create the Contact
    const contact = await this.contactService.create(createMemberDto.contact);

    return this.memberRepository.create({
      typeMember: createMemberDto.typeMember,
      user,
      entreprise,
      contact,
    });
  }

  async update(id: Member['id'], updateMemberDto: UpdateMemberDto) {
    let user: User | null | undefined = undefined;

    const dtoUser = (updateMemberDto as any).user;
    if (dtoUser) {
      if (dtoUser.id) {
        const userObject = await this.userService.findById(dtoUser.id);
        if (!userObject) {
          throw new UnprocessableEntityException({
            status: HttpStatus.UNPROCESSABLE_ENTITY,
            errors: { user: 'notExists' },
          });
        }
        user = userObject;
      }
    } else if (dtoUser === null) {
      user = null;
    }

    let entreprise: Entreprise | null | undefined = undefined;
    if (updateMemberDto.entreprise) {
      const entId = (updateMemberDto.entreprise as any).id;
      if (entId) {
        const entrepriseObject = await this.entrepriseService.findById(entId);
        if (!entrepriseObject) {
          throw new UnprocessableEntityException({
            status: HttpStatus.UNPROCESSABLE_ENTITY,
            errors: { entreprise: 'notExists' },
          });
        }
        entreprise = entrepriseObject;
      }
    } else if (updateMemberDto.entreprise === null) {
      entreprise = null;
    }

    let contact: Contact | null | undefined = undefined;
    if (updateMemberDto.contact) {
      const contactId = (updateMemberDto.contact as any).id;
      if (contactId) {
        const contactObject = await this.contactService.findById(contactId);
        if (!contactObject) {
          throw new UnprocessableEntityException({
            status: HttpStatus.UNPROCESSABLE_ENTITY,
            errors: { contact: 'notExists' },
          });
        }
        contact = contactObject;
      } else {
        contact = await this.contactService.create(
          updateMemberDto.contact as any,
        );
      }
    } else if (updateMemberDto.contact === null) {
      contact = null;
    }

    return this.memberRepository.update(id, {
      user,
      entreprise,
      contact,
      typeMember: updateMemberDto.typeMember,
      status: updateMemberDto.status,
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

  remove(id: Member['id']) {
    return this.memberRepository.remove(id);
  }
}
