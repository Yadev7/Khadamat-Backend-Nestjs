import { AddressEntity } from '../../../../../addresses/infrastructure/persistence/relational/entities/address.entity';

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
  name: 'contact',
})
export class ContactEntity extends EntityRelationalHelper {
  @OneToOne(() => AddressEntity, { eager: false, nullable: true })
  @JoinColumn()
  address?: AddressEntity | null;

  @Column({
    nullable: true,
    type: String,
  })
  email?: string | null;

  @Column({
    nullable: true,
    type: String,
  })
  phoneGround?: string | null;

  @Column({
    nullable: true,
    type: String,
  })
  phoneCell?: string | null;

  @Column({
    nullable: true,
    type: String,
  })
  lastNameAr?: string | null;

  @Column({
    nullable: true,
    type: String,
  })
  lastName?: string | null;

  @Column({
    nullable: true,
    type: String,
  })
  firstNameAr?: string | null;

  @Column({
    nullable: true,
    type: String,
  })
  firstName?: string | null;

  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
