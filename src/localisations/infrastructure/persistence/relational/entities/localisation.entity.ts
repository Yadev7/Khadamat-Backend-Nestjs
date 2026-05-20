// src/localisations/infrastructure/persistence/relational/entities/localisation.entity.ts

import {
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  Column,
  OneToOne,
} from 'typeorm';
import { EntityRelationalHelper } from '../../../../../utils/relational-entity-helper';
import { CityEntity } from 'src/cities/infrastructure/persistence/relational/entities/city.entity';
import { CityAreaEntity } from 'src/city-areas/infrastructure/persistence/relational/entities/city-area.entity';
import { CountryEntity } from 'src/countries/infrastructure/persistence/relational/entities/country.entity';

@Entity({
  name: 'localisation',
})
export class LocalisationEntity extends EntityRelationalHelper {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 8,
    nullable: true,
    transformer: {
      to: (value: number) => value,
      from: (value: string) => (value ? parseFloat(value) : null),
    },
  })
  latitude?: number | null;

  @Column({
    type: 'decimal',
    precision: 11,
    scale: 8,
    nullable: true,
    transformer: {
      to: (value: number) => value,
      from: (value: string) => (value ? parseFloat(value) : null),
    },
  })
  longitude?: number | null;

  // العلاقة العكسية (Inverse Side) - لا تنشئ أي عمود في جدول localisation
  @OneToOne(() => CityEntity, (city) => city.localisation, {
    onDelete: 'CASCADE',
  })
  city?: CityEntity;

  @OneToOne(() => CityAreaEntity, (cityArea) => cityArea.localisation, {
    onDelete: 'CASCADE',
  })
  cityArea?: CityAreaEntity;

  @OneToOne(() => CountryEntity, (country) => country.localisation, {
    onDelete: 'CASCADE',
  })
  country?: CountryEntity;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
