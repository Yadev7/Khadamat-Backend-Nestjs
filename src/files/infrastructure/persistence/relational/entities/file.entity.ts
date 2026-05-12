import {
  // typeorm decorators here
  Column,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { EntityRelationalHelper } from '../../../../../utils/relational-entity-helper';
import { ApiProperty } from '@nestjs/swagger';
import { FileCategory } from 'src/files/file-category.enum';

@Entity({ name: 'file' })
export class FileEntity extends EntityRelationalHelper {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid') // ← auto-generated UUID
  id: string;

  @ApiProperty()
  @Column()
  path: string;

  @ApiProperty({ enum: FileCategory })
  @Column({
    type: 'enum',
    enum: FileCategory,
    default: FileCategory.OTHER,
  })
  fileCategory: FileCategory;

  @ApiProperty({ nullable: true })
  @Column({ type: 'varchar', nullable: true, default: null })
  fileDescription: string | null;
}
