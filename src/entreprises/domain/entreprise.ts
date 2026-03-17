import { Address } from '../../addresses/domain/address';
import { ApiProperty } from '@nestjs/swagger';

export class Entreprise {
  @ApiProperty({
    type: () => Address,
    nullable: true,
  })
  headOffice?: Address | null;

  @ApiProperty({
    type: () => String,
    nullable: true,
  })
  nameEn?: string | null;

  @ApiProperty({
    type: () => String,
    nullable: true,
  })
  nameAr?: string | null;

  @ApiProperty({
    type: () => String,
    nullable: true,
  })
  nameFr?: string | null;

  @ApiProperty({
    type: String,
  })
  id!: string;

  @ApiProperty()
  createdAt!: Date;

  @ApiProperty()
  updatedAt!: Date;
}
