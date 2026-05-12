import {
  IsString,
  IsOptional,
  ValidateNested,
  IsNotEmptyObject,
  IsEnum,
  IsEmail,
  IsObject,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { CreateContactDto } from '../../contacts/dto/create-contact.dto';
import { CreateEntrepriseDto } from '../../entreprises/dto/create-entreprise.dto';

// Create a small internal DTO for the User part to allow email/photo nested creation
class NestedUserDto {
  @IsEmail()
  email!: string;

  @IsOptional()
  @IsObject()
  photo?: { id: string } | null;

  @IsOptional()
  id?: string | number;
}

export class CreateMemberDto {
  @ApiProperty({
    required: false,
    type: () => NestedUserDto,
    description: 'User details for INDIVIDUAL or existing User ID',
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => NestedUserDto)
  user?: NestedUserDto | null;

  @ApiProperty({
    required: false,
    type: () => CreateEntrepriseDto,
    description: 'Enterprise details - Required only for ENTERPRISE type',
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => CreateEntrepriseDto)
  entreprise!: CreateEntrepriseDto;

  @ApiProperty({ required: true, type: () => CreateContactDto })
  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => CreateContactDto)
  contact!: CreateContactDto;

  @ApiProperty({
    enum: ['INDIVIDUAL', 'ENTERPRISE'],
    example: 'INDIVIDUAL',
  })
  @IsString()
  @IsEnum(['INDIVIDUAL', 'ENTERPRISE'])
  typeMember!: string;

  @ApiProperty({
    enum: ['ACTIVE', 'BLOCKED'],
    required: false,
    example: 'ACTIVE',
  })
  @IsOptional()
  @IsString()
  @IsEnum(['ACTIVE', 'BLOCKED'])
  status?: 'ACTIVE' | 'BLOCKED';
}
