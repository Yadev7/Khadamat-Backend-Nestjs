import { FileType } from '../../files/domain/file';
import { Business } from '../../businesses/domain/business';
import { ApiProperty } from '@nestjs/swagger';

export class ImagesBusiness {
  @ApiProperty({
    type: () => FileType,
    nullable: true,
  })
  file?: FileType | null;

  @ApiProperty({
    type: () => Business,
    nullable: true,
  })
  business?: Business | null;

  @ApiProperty({
    type: String,
  })
  id: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
