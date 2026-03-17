import {
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  Column,
} from 'typeorm';
import { EntityRelationalHelper } from '../../../../../utils/relational-entity-helper';

@Entity({
  name: 'country',
})
export class CountryEntity extends EntityRelationalHelper {
  @Column({
    nullable: true,
    type: String,
  })
  flagImg?: string | null;

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

  @Column({
    nullable: true,
    type: String,
  })
  countryCode?: string | null;

  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
