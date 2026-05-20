// src/cities/infrastructure/persistence/relational/entities/city.entity.ts

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
import { LocalisationEntity } from 'src/localisations/infrastructure/persistence/relational/entities/localisation.entity';

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

  // 1. تعريف العمود الصريح في جدول المدينة لتخزين الـ UUID الخاص بالموقع
  @Column({ name: 'localisationId', nullable: true, type: 'uuid' })
  localisationId?: string | null;

  // 2. إعداد العلاقة مع الإشارة إلى العمود أعلاه كمفتاح خارجي (Foreign Key)
  @OneToOne(() => LocalisationEntity, {
    eager: true,
    cascade: true, // يسمح بحفظ السطر في جدول localisation تلقائياً عند حفظ المدينة
    nullable: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'localisationId' }) // يربط العلاقة بالعمود localisationId في جدول city
  localisation?: LocalisationEntity | null;

  @Column({ nullable: true, type: String })
  nameEn?: string | null;

  @Column({ nullable: true, type: String })
  nameAr?: string | null;

  @Column({ nullable: true, type: String })
  nameFr?: string | null;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
