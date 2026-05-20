import { Localisation } from 'src/localisations/domain/localisation';
import { Country } from '../../countries/domain/country';
import { ApiProperty } from '@nestjs/swagger';
export class City {
  @ApiProperty({
    type: () => Country,
    nullable: true,
  })
  country?: Country | null;

  @ApiProperty({
    type: () => Country,
    nullable: true,
  })
  idCountry?: Country | null;

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
  id?: string;

  @ApiProperty()
  createdAt?: Date;

  @ApiProperty()
  updatedAt?: Date;
  // localisation: any;

  @ApiProperty({
    type: () => Localisation,
    nullable: true,
  })
  localisation?: Localisation;
}
