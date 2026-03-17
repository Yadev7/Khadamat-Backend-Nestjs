import { FileType } from '../../files/domain/file';
import { ApiProperty } from '@nestjs/swagger';

export class Service {
  @ApiProperty({
    type: () => FileType,
    nullable: true,
  })
  image?: FileType | null;

  @ApiProperty({
    type: () => String,
    nullable: true,
  })
  descrEn?: string | null;

  @ApiProperty({
    type: () => String,
    nullable: true,
  })
  descrAr?: string | null;

  @ApiProperty({
    type: () => String,
    nullable: true,
  })
  descrFr?: string | null;

  @ApiProperty({
    type: () => String,
    nullable: true,
  })
  nameServEn?: string | null;

  @ApiProperty({
    type: () => String,
    nullable: true,
  })
  nameServAr?: string | null;

  @ApiProperty({
    type: () => String,
    nullable: true,
  })
  nameServFr?: string | null;

  @ApiProperty({
    type: String,
  })
  id!: string;

  @ApiProperty()
  createdAt!: Date;

  @ApiProperty()
  updatedAt!: Date;
}
