import { BusinessEntity } from '../../../../../businesses/infrastructure/persistence/relational/entities/business.entity';

import {
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { EntityRelationalHelper } from '../../../../../utils/relational-entity-helper';

@Entity({
  name: 'call',
})
export class CallEntity extends EntityRelationalHelper {
  @ManyToOne(() => BusinessEntity, (business) => business.calls, {
    eager: false,
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'businessId' })
  business?: BusinessEntity;

  @Column({
    nullable: true,
    type: String,
  })
  callType?: string | null;

  @Column({
    nullable: true,
    type: String,
  })
  time?: string | null;

  @Column({
    nullable: true,
    type: Date,
  })
  date?: Date | null;

  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt?: Date;

  @UpdateDateColumn()
  updatedAt?: Date;
}
