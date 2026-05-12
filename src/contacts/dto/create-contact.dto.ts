import { CreateAddressDto } from '../../addresses/dto/create-address.dto'; // Ensure this path is correct
import {
  IsString,
  IsOptional,
  IsNumber,
  ValidateNested,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type, Transform } from 'class-transformer'; // Added Transform here

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

  @ApiProperty({ required: false, example: 212537000000 }) // Keep ApiProperty so it shows in Swagger
  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => (value ? Number(value) : null)) // Handles null/empty safely
  phoneGround?: number | null;

  @ApiProperty({ required: false, example: 212661000000 }) // Keep ApiProperty so it shows in Swagger
  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => (value ? Number(value) : null))
  phoneCell?: number | null;

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
