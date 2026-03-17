import { Address } from '../../addresses/domain/address';
import { ApiProperty } from '@nestjs/swagger';

export class Contact {
  @ApiProperty({
    type: () => Address,
    nullable: true,
  })
  address?: Address | null;

  @ApiProperty({
    type: () => String,
    nullable: true,
  })
  email?: string | null;

  @ApiProperty({
    type: () => Number,
    nullable: true,
  })
  phoneGround?: number | null;

  @ApiProperty({
    type: () => Number,
    nullable: true,
  })
  phoneCell?: number | null;

  @ApiProperty({
    type: () => String,
    nullable: true,
  })
  lastNameAr?: string | null;

  @ApiProperty({
    type: () => String,
    nullable: true,
  })
  lastName?: string | null;

  @ApiProperty({
    type: () => String,
    nullable: true,
  })
  firstNameAr?: string | null;

  @ApiProperty({
    type: () => String,
    nullable: true,
  })
  firstName?: string | null;

  @ApiProperty({
    type: String,
  })
  id: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
