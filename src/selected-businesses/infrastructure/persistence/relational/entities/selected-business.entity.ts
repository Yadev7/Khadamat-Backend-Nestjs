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
  name: 'selected_business',
})
export class SelectedBusinessEntity extends EntityRelationalHelper {
  @ManyToOne(() => BusinessEntity, { eager: true, nullable: true })
  @JoinColumn({ name: 'businessId' })
  business?: BusinessEntity | null;

  @Column({
    nullable: true,
    type: Date,
  })
  dateFin?: Date | null;

  @Column({
    nullable: true,
    type: Date,
  })
  dateDeb?: Date | null;

  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @CreateDateColumn()
  createdAt?: Date;

  @UpdateDateColumn()
  updatedAt?: Date;
}
