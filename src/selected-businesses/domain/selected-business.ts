import { Business } from '../../businesses/domain/business';
import { ApiProperty } from '@nestjs/swagger';

export class SelectedBusiness {
  @ApiProperty({
    type: () => Business,
    nullable: true,
  })
  business?: Business | null;

  @ApiProperty({
    type: () => Date,
    nullable: true,
  })
  dateFin?: Date | null;

  @ApiProperty({
    type: () => Date,
    nullable: true,
  })
  dateDeb?: Date | null;

  @ApiProperty({
    type: String,
  })
  id?: string;

  @ApiProperty()
  createdAt?: Date;

  @ApiProperty()
  updatedAt?: Date;
}
