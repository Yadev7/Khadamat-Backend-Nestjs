import { ContactEntity } from '../../../../../contacts/infrastructure/persistence/relational/entities/contact.entity';

import { ServiceEntity } from '../../../../../services/infrastructure/persistence/relational/entities/service.entity';

import {
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToOne,
  OneToMany,
} from 'typeorm';
import { EntityRelationalHelper } from '../../../../../utils/relational-entity-helper';
import { MemberEntity } from 'src/members/infrastructure/persistence/relational/entities/member.entity';
import { FileEntity } from 'src/files/infrastructure/persistence/relational/entities/file.entity';
import { EvaluationEntity } from 'src/evaluations/infrastructure/persistence/relational/entities/evaluation.entity';
import { CallEntity } from 'src/calls/infrastructure/persistence/relational/entities/call.entity';
import { ReportEntity } from 'src/reports/infrastructure/persistence/relational/entities/report.entity';

@Entity({
  name: 'business',
})
export class BusinessEntity extends EntityRelationalHelper {
  // src/businesses/infrastructure/persistence/relational/entities/business.entity.ts

  @OneToOne(() => FileEntity, { nullable: true })
  @JoinColumn({ name: 'audioFrId' })
  audioFr?: FileEntity | null;

  @OneToOne(() => FileEntity, { nullable: true })
  @JoinColumn({ name: 'audioArId' })
  audioAr?: FileEntity | null;

  @OneToOne(() => FileEntity, { nullable: true })
  @JoinColumn({ name: 'audioEnId' })
  audioEn?: FileEntity | null;

  @OneToOne(() => FileEntity, { nullable: true })
  @JoinColumn({ name: 'videoFrId' })
  videoFr?: FileEntity | null;

  @OneToOne(() => FileEntity, { nullable: true })
  @JoinColumn({ name: 'videoArId' })
  videoAr?: FileEntity | null;

  @OneToOne(() => FileEntity, { nullable: true })
  @JoinColumn({ name: 'videoEnId' })
  videoEn?: FileEntity | null;

  @OneToOne(() => FileEntity, { eager: false, nullable: true })
  @JoinColumn({ name: 'flyerId' }) // Maps to your #flyerId requirement
  flyer?: FileEntity | null;

  @ManyToOne(() => MemberEntity, { eager: false, nullable: false })
  @JoinColumn({ name: 'ownerId' }) // The legal owner
  owner?: MemberEntity;

  @ManyToOne(() => MemberEntity, { eager: false, nullable: false })
  @JoinColumn({ name: 'managerId' }) // The person managing the listing
  manager?: MemberEntity;

  @OneToOne(() => ContactEntity, { eager: false, nullable: false })
  @JoinColumn({ name: 'contactId' }) // Directly implements your #contactId requirement
  contact!: ContactEntity;

  @ManyToOne(() => ServiceEntity, { eager: false, nullable: true })
  service?: ServiceEntity | null;

  @OneToMany(() => CallEntity, (call) => call.business)
  calls?: CallEntity[];

  @OneToMany(() => ReportEntity, (report) => report.business)
  reports?: ReportEntity[];

  @OneToMany(() => EvaluationEntity, (evaluation) => evaluation.business)
  evaluations?: EvaluationEntity[];

  @Column({
    nullable: true,
    type: String,
  })
  socialMedia?: string | null;

  @Column({
    nullable: true,
    type: String,
  })
  businessUrlSite?: string | null;

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
