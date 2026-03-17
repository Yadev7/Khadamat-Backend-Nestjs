import { UserEntity } from '../../../../../users/infrastructure/persistence/relational/entities/user.entity';

import { EntrepriseEntity } from '../../../../../entreprises/infrastructure/persistence/relational/entities/entreprise.entity';

import { ContactEntity } from '../../../../../contacts/infrastructure/persistence/relational/entities/contact.entity';

import {
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  Column,
  JoinColumn,
  OneToOne,
} from 'typeorm';
import { EntityRelationalHelper } from '../../../../../utils/relational-entity-helper';

@Entity({
  name: 'member',
})
export class MemberEntity extends EntityRelationalHelper {
  @OneToOne(() => UserEntity, { eager: false, nullable: false })
  @JoinColumn({ name: 'userId' }) // This fulfills your #userId requirement
  user?: UserEntity;

  @OneToOne(() => EntrepriseEntity, { eager: false, nullable: false })
  @JoinColumn({ name: 'entrepriseId' }) // Ensures the DB column is #entrepriseId
  entreprise?: EntrepriseEntity | null;

  @OneToOne(() => ContactEntity, { eager: false, nullable: false })
  @JoinColumn({ name: 'contactId' })
  contact?: ContactEntity;

  @Column({
    nullable: false,
    type: String,
  })
  typeMember?: string | null;

  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @CreateDateColumn()
  createdAt?: Date;

  @UpdateDateColumn()
  updatedAt?: Date;
}
