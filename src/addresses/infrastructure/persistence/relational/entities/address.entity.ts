import { LocalisationEntity } from '../../../../../localisations/infrastructure/persistence/relational/entities/localisation.entity';

import { CityEntity } from '../../../../../cities/infrastructure/persistence/relational/entities/city.entity';
import { CountryEntity } from '../../../../../countries/infrastructure/persistence/relational/entities/country.entity';
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
  name: 'address',
})
export class AddressEntity extends EntityRelationalHelper {
  @OneToOne(() => LocalisationEntity, { eager: false, nullable: true })
  @JoinColumn()
  localisation?: LocalisationEntity | null;

  @ManyToOne(() => CityEntity, { eager: false, nullable: true })
  city?: CityEntity | null;

  @ManyToOne(() => CountryEntity, { eager: false, nullable: true })
  country?: CountryEntity | null;

  @Column({
    nullable: true,
    type: String,
  })
  lineAddressAr?: string | null;

  @Column({
    nullable: true,
    type: String,
  })
  lineAddressFr?: string | null;

  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
