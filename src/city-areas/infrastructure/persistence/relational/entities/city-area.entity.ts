import { LocalisationEntity } from '../../../../../localisations/infrastructure/persistence/relational/entities/localisation.entity';

import { CityEntity } from '../../../../../cities/infrastructure/persistence/relational/entities/city.entity';

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
  name: 'city_area',
})
export class CityAreaEntity extends EntityRelationalHelper {
  @ManyToOne(() => LocalisationEntity, { eager: false, nullable: true })
  localisation?: LocalisationEntity | null;

  @ManyToOne(() => CityEntity, { eager: false, nullable: true })
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
