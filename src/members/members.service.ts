import { UsersService } from '../users/users.service';
import { User } from '../users/domain/user';
import { UserEntity } from '../users/infrastructure/persistence/relational/entities/user.entity';
import { EntreprisesService } from '../entreprises/entreprises.service';
import { Entreprise } from '../entreprises/domain/entreprise';
import { EntrepriseEntity } from '../entreprises/infrastructure/persistence/relational/entities/entreprise.entity';
import { ContactsService } from '../contacts/contacts.service';
import { Contact } from '../contacts/domain/contact';
import { ContactEntity } from '../contacts/infrastructure/persistence/relational/entities/contact.entity';
import { MemberEntity } from './infrastructure/persistence/relational/entities/member.entity';
import { MemberMapper } from './infrastructure/persistence/relational/mappers/member.mapper';

import {
  Injectable,
  HttpStatus,
  UnprocessableEntityException,
} from '@nestjs/common';
import { DataSource } from 'typeorm';
import { CreateMemberDto } from './dto/create-member.dto';
import { UpdateMemberDto } from './dto/update-member.dto';
import { MemberRepository } from './infrastructure/persistence/member.repository';
import { IPaginationOptions } from '../utils/types/pagination-options';
import { Member } from './domain/member';
import * as bcrypt from 'bcryptjs';
@Injectable()
export class MembersService {
  constructor(
    private readonly userService: UsersService,
    private readonly entrepriseService: EntreprisesService,
    private readonly contactService: ContactsService,
    private readonly memberRepository: MemberRepository,
    // Inject DataSource to handle manual transactional blocks safely
    private readonly dataSource: DataSource,
  ) {}

  // async create(createMemberDto: CreateMemberDto): Promise<Member> {
  //   // <creating-property />

  //   const queryRunner = this.dataSource.createQueryRunner();
  //   await queryRunner.connect();
  //   await queryRunner.startTransaction();

  //   try {
  //     let userEntity: UserEntity | null = null;
  //     let entrepriseEntity: EntrepriseEntity | null = null;

  //     // 1. Conditional Logic: Create User Account for INDIVIDUALS
  //     if (createMemberDto.typeMember === 'INDIVIDUAL') {
  //       const dtoUser = (createMemberDto as any).user;
  //       if (!dtoUser?.email) {
  //         throw new Error('Email is required for individual member creation.');
  //       }

  //       const userInstance = queryRunner.manager.create(UserEntity, {
  //         email: dtoUser.email,
  //         password: 'DefaultPassword123!', // Ensure your architecture handles hashing upstream or inside a subscriber
  //         role: { id: 2 },
  //         status: { id: 1 },
  //       });
  //       userEntity = await queryRunner.manager.save(UserEntity, userInstance);
  //     }

  //     // 2. Conditional Logic: Create Corporate Record for ENTERPRISES
  //     else if (createMemberDto.typeMember === 'ENTERPRISE') {
  //       if (!createMemberDto.entreprise) {
  //         throw new Error('Enterprise details are required for corporate member creation.');
  //       }

  //       const entrepriseInstance = queryRunner.manager.create(
  //         EntrepriseEntity,
  //         createMemberDto.entreprise,
  //       );
  //       entrepriseEntity = await queryRunner.manager.save(EntrepriseEntity, entrepriseInstance);
  //     }

  //     // 3. Always create the Contact record within the transactional context
  //     if (!createMemberDto.contact) {
  //       throw new Error('Contact details are mandatory to establish a Member profile.');
  //     }

  //     const contactInstance = queryRunner.manager.create(ContactEntity, createMemberDto.contact);
  //     const savedContactEntity = await queryRunner.manager.save(ContactEntity, contactInstance);

  //     // 4. Construct and tie everything together inside the Member relational row
  //     const memberInstance = queryRunner.manager.create(MemberEntity, {
  //       typeMember: createMemberDto.typeMember,
  //       user: userEntity,
  //       entreprise: entrepriseEntity,
  //       contact: savedContactEntity,
  //     });

  //     const savedMemberEntity = await queryRunner.manager.save(MemberEntity, memberInstance);

  //     // Atomically write all changes to your PostgreSQL instance
  //     await queryRunner.commitTransaction();

  //     // Convert the database entity layer safely back to your Domain Model layer
  //     return MemberMapper.toDomain(savedMemberEntity);

  //   } catch (error) {
  //     // Instantly wipe database changes on failure to prevent rogue ghost profiles
  //     await queryRunner.rollbackTransaction();

  //     throw new UnprocessableEntityException({
  //       status: HttpStatus.UNPROCESSABLE_ENTITY,
  //       errors: {
  //         database: 'Transaction failed, changes rolled back: ' + (error instanceof Error ? error.message : String(error)),
  //       },
  //     });
  //   } finally {
  //     // Always release query allocation connection back to the database pool
  //     await queryRunner.release();
  //   }
  // }

  // Inside MembersService.ts

  
  
  
  
  
  async create(createMemberDto: CreateMemberDto): Promise<Member> {
    return await this.dataSource.transaction(async (manager) => {
      let userEntity: UserEntity | null = null;
      let entrepriseEntity: EntrepriseEntity | null = null;

      // 1. Create User (Delegated to UsersService logic if possible, or handled here with hashing)
      if (createMemberDto.typeMember === 'INDIVIDUAL') {
        const dtoUser = (createMemberDto as any).user;
        if (!dtoUser?.email)
          throw new Error('Email is required for individuals.');

        // Proper way: Use bcrypt here or inject UsersService method that accepts 'manager'
        const hashedPassword = await bcrypt.hash('DefaultPassword123!', 10);

        userEntity = await manager.save(
          UserEntity,
          manager.create(UserEntity, {
            email: dtoUser.email,
            password: hashedPassword,
            role: { id: 2 },
            status: { id: 1 },
          }),
        );
      }

      // 2. Create Enterprise
      else if (createMemberDto.typeMember === 'ENTERPRISE') {
        if (!createMemberDto.entreprise)
          throw new Error('Enterprise details required.');
        entrepriseEntity = await manager.save(
          EntrepriseEntity,
          manager.create(EntrepriseEntity, createMemberDto.entreprise),
        );
      }

      // 3. Create Contact
      if (!createMemberDto.contact)
        throw new Error('Contact details are mandatory.');
      const contactEntity = await manager.save(
        ContactEntity,
        manager.create(ContactEntity, createMemberDto.contact),
      );

      // 4. Create Member
      const memberInstance = manager.create(MemberEntity, {
        typeMember: createMemberDto.typeMember,
        user: userEntity,
        entreprise: entrepriseEntity,
        contact: contactEntity,
      });

      const savedMember = await manager.save(MemberEntity, memberInstance);

      // Return the domain model
      return MemberMapper.toDomain(savedMember);
    });
  }

  // async getDashboardData() {
  //   // Implement your logic to fetch and return dashboard data for the member
  //   // This could involve aggregating data from various services or repositories
  //   // For example, you might want to fetch recent activities, notifications, etc.
  //   // Placeholder implementation:
  //   return {
  //     message: 'Dashboard data fetched successfully.',
  //     // Add more relevant data here
  //   };
  // }

  getDashboardData() {
    return {
      message: 'Dashboard data fetched successfully.',
    };
  }

  async update(id: Member['id'], updateMemberDto: UpdateMemberDto) {
    // <updating-property />

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      let user: User | null | undefined = undefined;
      const dtoUser = (updateMemberDto as any).user;

      if (dtoUser) {
        if (dtoUser.id) {
          const userObject = await this.userService.findById(dtoUser.id);
          if (!userObject) {
            throw new Error('User specified does not exist.');
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
            throw new Error('Enterprise specified does not exist.');
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
            throw new Error('Contact specified does not exist.');
          }
          contact = contactObject;
        } else {
          // Safe transactional contact addition if inline data creation happens during updates
          const contactInstance = queryRunner.manager.create(
            ContactEntity,
            updateMemberDto.contact as any,
          );
          const savedContactEntity = await queryRunner.manager.save(
            ContactEntity,
            contactInstance,
          );
          contact = savedContactEntity as unknown as Contact;
        }
      } else if (updateMemberDto.contact === null) {
        contact = null;
      }

      // Update parent target payload inside the runner wrapper
      const updatedMemberPayload = {
        ...(user !== undefined && { user }),
        ...(entreprise !== undefined && { entreprise }),
        ...(contact !== undefined && { contact }),
        typeMember: updateMemberDto.typeMember,
        status: updateMemberDto.status,
      };

      // <updating-property-payload />

      const updateResult = await this.memberRepository.update(
        id,
        updatedMemberPayload,
      );

      await queryRunner.commitTransaction();
      return updateResult;
    } catch (error) {
      await queryRunner.rollbackTransaction();

      throw new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        errors: {
          database:
            'Update transactional context failed: ' +
            (error instanceof Error ? error.message : String(error)),
        },
      });
    } finally {
      await queryRunner.release();
    }
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
