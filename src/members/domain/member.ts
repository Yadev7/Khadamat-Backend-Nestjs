import { User } from '../../users/domain/user';
import { Entreprise } from '../../entreprises/domain/entreprise';
import { Contact } from '../../contacts/domain/contact';
import { ApiProperty } from '@nestjs/swagger';

export class Member {
  @ApiProperty({
    type: () => User,
    nullable: true,
  })
  user?: User | null;

  @ApiProperty({
    type: () => Entreprise,
    nullable: true,
  })
  entreprise?: Entreprise | null;

  @ApiProperty({
    type: () => Contact,
    nullable: true,
  })
  contact?: Contact | null;

  @ApiProperty({
    type: () => String,
    nullable: true,
  })
  typeMember?: string | null;

  @ApiProperty({
    type: () => String,
    enum: ['ACTIVE', 'BLOCKED'],
    nullable: true,
  })
  status?: 'ACTIVE' | 'BLOCKED' | null;

  @ApiProperty({
    type: String,
  })
  id?: string;

  @ApiProperty()
  createdAt?: Date;

  @ApiProperty()
  updatedAt?: Date;
}
