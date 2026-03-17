import { ApiProperty } from '@nestjs/swagger';

export class Country {
  @ApiProperty({
    type: () => String,
    nullable: true,
  })
  flagImg?: string | null;

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

  @ApiProperty()
  createdAt?: Date;

  @ApiProperty()
  updatedAt?: Date;
}
