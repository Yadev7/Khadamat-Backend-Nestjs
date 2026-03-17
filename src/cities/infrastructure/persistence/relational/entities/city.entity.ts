import { CountryEntity } from '../../../../../countries/infrastructure/persistence/relational/entities/country.entity';

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
  name: 'city',
})
export class CityEntity extends EntityRelationalHelper {
  @ManyToOne(() => CountryEntity, { eager: false, nullable: true })
  country?: CountryEntity | null;

  @Column({
    nullable: true,
    type: String,
  })
  nameEn?: string | null;

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
