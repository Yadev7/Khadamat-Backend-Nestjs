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
  name: 'report',
})
export class ReportEntity extends EntityRelationalHelper {
  @ManyToOne(() => BusinessEntity, {
    nullable: false, // Mandatory (1,1)
    onDelete: 'CASCADE', // If the business is deleted, the report is too
    eager: false,
  })
  @JoinColumn({ name: 'businessId' })
  business?: BusinessEntity;

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
