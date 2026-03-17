import { ApiProperty } from '@nestjs/swagger';

export class Localisation {
  @ApiProperty({
    type: () => Number,
    nullable: true,
  })
  latitude?: number | null;

  @ApiProperty({
    type: () => Number,
    nullable: true,
  })
  longitude?: number | null;

  @ApiProperty({
    type: String,
  })
  id: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
