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
  name: 'entreprise',
})
export class EntrepriseEntity extends EntityRelationalHelper {
  @OneToOne(() => AddressEntity, { eager: false, nullable: true })
  @JoinColumn()
  headOffice?: AddressEntity | null;

  @Column({
    nullable: true,
    type: String,
  })
  nameEn?: string | null;

  @Column({
    nullable: true,
    type: String,
  })
  nameAr?: string | null;

  @Column({
    nullable: true,
    type: String,
  })
  nameFr?: string | null;

  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
