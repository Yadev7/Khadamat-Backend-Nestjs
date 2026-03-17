import { Contact } from '../../contacts/domain/contact';
import { Service } from '../../services/domain/service';
import { Member } from '../../members/domain/member';
import { FileType } from 'src/files/domain/file';
import { ApiProperty } from '@nestjs/swagger';

export class Business {
  @ApiProperty({ type: () => Contact, nullable: true })
  contact?: Contact | null;

  @ApiProperty({ type: () => Service, nullable: true })
  service?: Service | null;

  // Special Member Relationships
  @ApiProperty({ type: () => Member })
  owner!: Member;

  @ApiProperty({ type: () => Member })
  manager!: Member;

  // Multimedia Relationships
  @ApiProperty({ type: () => FileType, nullable: true })
  flyer?: FileType | null;

  @ApiProperty({ type: () => FileType, nullable: true })
  audioAr?: FileType | null;

  @ApiProperty({ type: () => FileType, nullable: true })
  audioFr?: FileType | null;

  @ApiProperty({ type: () => FileType, nullable: true })
  audioEn?: FileType | null;

  @ApiProperty({ type: () => FileType, nullable: true })
  videoAr?: FileType | null;

  @ApiProperty({ type: () => FileType, nullable: true })
  videoFr?: FileType | null;

  @ApiProperty({ type: () => FileType, nullable: true })
  videoEn?: FileType | null;

  // Basic Information Strings
  @ApiProperty({ type: () => String, nullable: true })
  socialMedia?: string | null;

  @ApiProperty({ type: () => String, nullable: true })
  businessUrlSite?: string | null;

  @ApiProperty({ type: () => String, nullable: true })
  descrEn?: string | null;

  @ApiProperty({ type: () => String, nullable: true })
  descrAr?: string | null;

  @ApiProperty({ type: () => String, nullable: true })
  descrFr?: string | null;

  @ApiProperty({ type: () => String, nullable: true })
  nameEn?: string | null;

  @ApiProperty({ type: () => String, nullable: true })
  nameAr?: string | null;

  @ApiProperty({ type: () => String, nullable: true })
  nameFr?: string | null;

  @ApiProperty({ type: String })
  id!: string;

  @ApiProperty()
  createdAt!: Date;

  @ApiProperty()
  updatedAt!: Date;
}
