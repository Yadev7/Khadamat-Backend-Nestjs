import { UserDto } from '../../users/dto/user.dto';

import { EntrepriseDto } from '../../entreprises/dto/entreprise.dto';

import { ContactDto } from '../../contacts/dto/contact.dto';

import {
  // decorators here

  IsString,
  IsOptional,
  ValidateNested,
  IsNotEmptyObject,
} from 'class-validator';

import {
  // decorators here
  ApiProperty,
} from '@nestjs/swagger';

import {
  // decorators here
  Type,
} from 'class-transformer';

export class CreateMemberDto {
  @ApiProperty({
    required: false,
    type: () => UserDto,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => UserDto)
  @IsNotEmptyObject()
  user?: UserDto | null;

  @ApiProperty({
    required: false,
    type: () => EntrepriseDto,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => EntrepriseDto)
  @IsNotEmptyObject()
  entreprise?: EntrepriseDto | null;

  @ApiProperty({
    required: false,
    type: () => ContactDto,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => ContactDto)
  @IsNotEmptyObject()
  contact?: ContactDto | null;

  @ApiProperty({
    required: false,
    type: () => String,
  })
  @IsOptional()
  @IsString()
  typeMember?: string | null;

  // Don't forget to use the class-validator decorators in the DTO properties.
}
