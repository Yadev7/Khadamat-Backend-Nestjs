import { Business } from '../../businesses/domain/business';
import { ApiProperty } from '@nestjs/swagger';

export class Message {
  @ApiProperty({
    type: () => Business,
    nullable: true,
  })
  business?: Business | null;

  @ApiProperty({
    type: () => String,
    nullable: true,
  })
  emailContact?: string | null;

  @ApiProperty({
    type: () => Number,
    nullable: true,
  })
  phoneContact?: number | null;

  @ApiProperty({
    type: () => String,
    nullable: true,
  })
  audio?: string | null;

  @ApiProperty({
    type: () => String,
    nullable: true,
  })
  textAr?: string | null;

  @ApiProperty({
    type: () => String,
    nullable: true,
  })
  textFr?: string | null;

  @ApiProperty({
    type: () => String,
    nullable: true,
  })
  textEn?: string | null;

  @ApiProperty({
    type: () => String,
    nullable: true,
  })
  titleAr?: string | null;

  @ApiProperty({
    type: () => String,
    nullable: true,
  })
  titleFr?: string | null;

  @ApiProperty({
    type: String,
  })
  id: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
