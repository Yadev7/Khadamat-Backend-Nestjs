import { FileEntity } from '../../../../../files/infrastructure/persistence/relational/entities/file.entity';

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
  name: 'service',
})
export class ServiceEntity extends EntityRelationalHelper {
  @ManyToOne(() => FileEntity, { eager: false, nullable: true })
  image?: FileEntity | null;

  @Column({
    nullable: true,
    type: String,
  })
  descrEn?: string | null;

  @Column({
    nullable: true,
    type: String,
  })
  descrAr?: string | null;

  @Column({
    nullable: true,
    type: String,
  })
  descrFr?: string | null;

  @Column({
    nullable: true,
    type: String,
  })
  nameServEn?: string | null;

  @Column({
    nullable: true,
    type: String,
  })
  nameServAr?: string | null;

  @Column({
    nullable: true,
    type: String,
  })
  nameServFr?: string | null;

  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
