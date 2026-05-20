import { CreateAddressDto } from '../../addresses/dto/create-address.dto'; // Ensure this path is correct
import { IsString, IsOptional, ValidateNested } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateContactDto {
  @ApiProperty({ required: false, type: () => CreateAddressDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => CreateAddressDto)
  address?: CreateAddressDto | null;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  email?: string | null;

  @ApiProperty({ required: false, example: '212537000000' })
  @IsOptional()
  @IsString()
  phoneGround?: string | null;

  @ApiProperty({ required: false, example: '212661000000' })
  @IsOptional()
  @IsString()
  phoneCell?: string | null;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  lastNameAr?: string | null;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  lastName?: string | null;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  firstNameAr?: string | null;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  firstName?: string | null;
}
