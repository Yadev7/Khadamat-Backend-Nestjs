import { Localisation } from '../../localisations/domain/localisation';
import { City } from '../../cities/domain/city';
import { ApiProperty } from '@nestjs/swagger';

export class CityArea {
  @ApiProperty({
    type: () => Localisation,
    nullable: true,
  })
  localisation?: Localisation | null;

  @ApiProperty({
    type: () => City,
    nullable: true,
  })
  city?: City | null;

  @ApiProperty({
    type: () => City,
    nullable: true,
  })
  idCity?: City | null;

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
