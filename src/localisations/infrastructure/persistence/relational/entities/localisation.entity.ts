import {
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  Column,
} from 'typeorm';
import { EntityRelationalHelper } from '../../../../../utils/relational-entity-helper';

@Entity({
  name: 'localisation',
})
export class LocalisationEntity extends EntityRelationalHelper {
  @Column({
    nullable: true,
    type: Number,
  })
  latitude?: number | null;

  @Column({
    nullable: true,
    type: Number,
  })
  longitude?: number | null;

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
