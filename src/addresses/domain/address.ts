import { Localisation } from '../../localisations/domain/localisation';
import { City } from '../../cities/domain/city';
import { Country } from '../../countries/domain/country';
import { ApiProperty } from '@nestjs/swagger';

export class Address {
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
    type: () => Country,
    nullable: true,
  })
  country?: Country | null;

  @ApiProperty({
    type: () => String,
    nullable: true,
  })
  lineAddressAr?: string | null;

  @ApiProperty({
    type: () => String,
    nullable: true,
  })
  lineAddressFr?: string | null;

  @ApiProperty({
    type: String,
  })
  id: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
