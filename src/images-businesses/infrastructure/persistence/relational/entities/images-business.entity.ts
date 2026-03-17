import { FileEntity } from '../../../../../files/infrastructure/persistence/relational/entities/file.entity';

import { BusinessEntity } from '../../../../../businesses/infrastructure/persistence/relational/entities/business.entity';

import {
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';
import { EntityRelationalHelper } from '../../../../../utils/relational-entity-helper';

@Entity({
  name: 'images_business',
})
export class ImagesBusinessEntity extends EntityRelationalHelper {
  @ManyToOne(() => FileEntity, { eager: false, nullable: true })
  file?: FileEntity | null;

  @ManyToOne(() => BusinessEntity, { eager: false, nullable: true })
  business?: BusinessEntity | null;

  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @CreateDateColumn()
  createdAt?: Date;

  @UpdateDateColumn()
  updatedAt?: Date;
}
