import {
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  Column,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { EntityRelationalHelper } from '../../../../../utils/relational-entity-helper';
import { BusinessEntity } from 'src/businesses/infrastructure/persistence/relational/entities/business.entity';

@Entity({
  name: 'evaluation',
})
export class EvaluationEntity extends EntityRelationalHelper {
  @Column({
    nullable: false,
    type: Boolean,
  })
  isValid?: boolean | null;

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
    type: Number,
  })
  stars?: number | null;

  @Column({
    nullable: true,
    type: String,
  })
  evalCode?: string | null;

  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @CreateDateColumn()
  createdAt?: Date;

  @UpdateDateColumn()
  updatedAt?: Date;

  @ManyToOne(() => BusinessEntity, (business) => business.evaluations, {
    nullable: false, // Ensures an Evaluation always has a Business
    onDelete: 'CASCADE', // If the Business is deleted, its reviews are too
  })
  @JoinColumn({ name: 'businessId' })
  business?: BusinessEntity;
}
