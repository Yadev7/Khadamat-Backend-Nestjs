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
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => CountryEntity, {
    eager: false,
    nullable: true,
    onDelete: 'CASCADE',
  })
  country?: CountryEntity | null;

  @Column({ nullable: true, type: String })
  nameEn?: string | null;

  @Column({ nullable: true, type: String })
  nameAr?: string | null;

  @Column({ nullable: true, type: String })
  nameFr?: string | null;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 8,
    nullable: true,
    // يضمن الـ transformer تحويل السلسلة النصية القادمة من DB إلى رقم تلقائياً
    transformer: {
      to: (value: number) => value,
      from: (value: string) => (value ? parseFloat(value) : null),
    },
  })
  lat?: number | null;

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
  lng?: number | null;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
