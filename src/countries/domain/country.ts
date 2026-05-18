import { ApiProperty } from '@nestjs/swagger';

export class Country {
  @ApiProperty({
    nullable: true,
  })
  flagImg?: any | null;

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
    type: () => String,
    nullable: true,
  })
  countryCode?: string | null;

  @ApiProperty({
    type: String,
  })
  id?: string;

  @ApiProperty({ required: false })
  localisation?: any | null;

  @ApiProperty()
  createdAt?: Date;

  @ApiProperty()
  updatedAt?: Date;
}
