import { LocalisationEntity } from '../../../../../localisations/infrastructure/persistence/relational/entities/localisation.entity';

import { CityEntity } from '../../../../../cities/infrastructure/persistence/relational/entities/city.entity';

import {
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToOne,
} from 'typeorm';
import { EntityRelationalHelper } from '../../../../../utils/relational-entity-helper';

@Entity({
  name: 'city_area',
})
export class CityAreaEntity extends EntityRelationalHelper {
  @Column({ name: 'localisationId', nullable: true, type: 'uuid' })
  localisationId?: string | null;

  @OneToOne(() => LocalisationEntity, {
    eager: true,
    cascade: true,
    nullable: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'localisationId' })
  localisation?: LocalisationEntity | null;

  // @ManyToOne(() => CityEntity, { eager: false, nullable: true, onDelete: 'CASCADE' })
  // city?: CityEntity | null;

  @Column({ nullable: true })
  cityId: string; // This will map to the actual UUID in the database

  @ManyToOne(() => CityEntity, {
    eager: false,
    nullable: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'cityId' }) // Link them explicitly
  city?: CityEntity | null;

  @Column({
    nullable: true,
    type: String,
  })
  nameAr?: string | null;

  @Column({
    nullable: true,
    type: String,
  })
  nameFr?: string | null;

  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
