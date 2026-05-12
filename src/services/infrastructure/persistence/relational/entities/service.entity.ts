import { FileEntity } from '../../../../../files/infrastructure/persistence/relational/entities/file.entity';

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
  name: 'service',
})
export class ServiceEntity extends EntityRelationalHelper {
  // @ManyToOne(() => FileEntity, {
  //   eager: true,
  //   nullable: true,
  //   onDelete: 'CASCADE',
  // })
  // video?: FileEntity | null;

  //   @ManyToOne(() => FileEntity, {
  //   eager: true, // Crucial for getting the image back in GET requests
  //   nullable: true,
  //   onDelete: 'CASCADE',
  //   })
  //   @JoinColumn({ name: 'imageId' }) // Forces the DB column name to be 'imageId'
  //   image?: FileEntity | null;

  // @Column({ type: 'uuid', nullable: true })
  // imageId?: string | null;

  // // 2. Map the relationship to that specific column
  // @ManyToOne(() => FileEntity, {
  //   eager: true,
  //   nullable: true,
  //   onDelete: 'SET NULL', // Better for debugging than CASCADE
  // })
  // @JoinColumn({ name: 'imageId' })
  // image?: FileEntity | null;

  @Column({ type: 'uuid', nullable: true })
  imageId?: string | null;

  @ManyToOne(() => FileEntity, { eager: true, nullable: true })
  @JoinColumn({ name: 'imageId' })
  image?: FileEntity | null;

  // Repeat for video if needed
  @Column({ nullable: true })
  videoId?: string | null;

  @ManyToOne(() => FileEntity, {
    eager: true,
    nullable: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'videoId' })
  video?: FileEntity | null;

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
