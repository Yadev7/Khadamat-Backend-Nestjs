import { BusinessEntity } from '../../../../../businesses/infrastructure/persistence/relational/entities/business.entity';

import {
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  Column,
  ManyToOne,
} from 'typeorm';
import { EntityRelationalHelper } from '../../../../../utils/relational-entity-helper';

@Entity({
  name: 'message',
})
export class MessageEntity extends EntityRelationalHelper {
  @ManyToOne(() => BusinessEntity, { eager: true, nullable: true })
  business?: BusinessEntity | null;

  @Column({
    nullable: true,
    type: String,
  })
  emailContact?: string | null;

  @Column({
    nullable: true,
    type: Number,
  })
  phoneContact?: number | null;

  @Column({
    nullable: true,
    type: String,
  })
  audio?: string | null;

  @Column({
    nullable: true,
    type: String,
  })
  textAr?: string | null;

  @Column({
    nullable: true,
    type: String,
  })
  textFr?: string | null;

  @Column({
    nullable: true,
    type: String,
  })
  textEn?: string | null;

  @Column({
    nullable: true,
    type: String,
  })
  titleAr?: string | null;

  @Column({
    nullable: true,
    type: String,
  })
  titleFr?: string | null;

  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @CreateDateColumn()
  createdAt?: Date;

  @UpdateDateColumn()
  updatedAt?: Date;
}
