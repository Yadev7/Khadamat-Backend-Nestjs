import { Business } from '../../businesses/domain/business';
import { ApiProperty } from '@nestjs/swagger';

export class Call {
  @ApiProperty({
    type: () => Business,
    nullable: true,
  })
  business?: Business | null;

  @ApiProperty({
    type: () => String,
    nullable: true,
  })
  callType?: string | null;

  @ApiProperty({
    type: () => String,
    nullable: true,
  })
  time?: string | null;

  @ApiProperty({
    type: () => Date,
    nullable: true,
  })
  date?: Date | null;

  @ApiProperty({
    type: String,
  })
  id: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
