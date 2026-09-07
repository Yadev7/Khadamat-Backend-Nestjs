import { ContactDto } from '../../contacts/dto/contact.dto';

import { ServiceDto } from '../../services/dto/service.dto';

import { FileDto } from '../../files/dto/file.dto';

import {
  IsString,
  IsOptional,
  ValidateNested,
  IsNotEmptyObject,
  IsNotEmpty,
  IsNumber,
} from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

import { Type } from 'class-transformer';
import { MemberDto } from 'src/members/dto/member.dto';
import { CreateLocalisationDto } from 'src/localisations/dto/create-localisation.dto';

export class CreateBusinessDto {
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
    type: () => ServiceDto,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => ServiceDto)
  @IsNotEmptyObject()
  service?: ServiceDto | null;

  @ApiProperty({
    required: false,
    type: () => CreateLocalisationDto,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => CreateLocalisationDto)
  localisation?: CreateLocalisationDto | null;

  @ApiProperty({
    required: false,
    type: () => String,
  })
  @IsOptional()
  @IsString()
  socialMedia?: string | null;

  @ApiProperty({
    required: false,
    type: () => String,
  })
  @IsOptional()
  @IsString()
  businessUrlSite?: string | null;

  // @ApiProperty({
  //   required: false,
  //   type: () => String,
  // })
  // @IsOptional()
  // @IsString()
  // audioAr?: string | null;

  // @ApiProperty({
  //   required: false,
  //   type: () => String,
  // })
  // @IsOptional()
  // @IsString()
  // audioAn?: string | null;

  // @ApiProperty({
  //   required: false,
  //   type: () => String,
  // })
  // @IsOptional()
  // @IsString()
  // audioFr?: string | null;

  @ApiProperty({ type: () => FileDto, nullable: true })
  @IsOptional()
  audioAr?: FileDto | null;

  @ApiProperty({ type: () => FileDto, nullable: true })
  @IsOptional()
  audioFr?: FileDto | null;

  @ApiProperty({ type: () => FileDto, nullable: true })
  @IsOptional()
  audioEn?: FileDto | null;

  @ApiProperty({
    required: false,
    type: () => String,
  })
  @IsOptional()
  @IsString()
  descrEn?: string | null;

  @ApiProperty({
    required: false,
    type: () => String,
  })
  @IsOptional()
  @IsString()
  descrAr?: string | null;

  @ApiProperty({
    required: false,
    type: () => String,
  })
  @IsOptional()
  @IsString()
  descrFr?: string | null;

  @ApiProperty({
    required: false,
    type: () => String,
  })
  @IsOptional()
  @IsString()
  nameEn?: string | null;

  @ApiProperty({
    required: false,
    type: () => String,
  })
  @IsOptional()
  @IsString()
  nameAr?: string | null;

  @ApiProperty({
    required: false,
    type: () => String,
  })
  @IsOptional()
  @IsString()
  nameFr?: string | null;

  @ApiProperty({ type: MemberDto })
  @IsNotEmpty()
  owner?: MemberDto;

  @ApiProperty({ type: MemberDto })
  @IsNotEmpty()
  manager?: MemberDto;

  @ApiProperty({
    required: false,
    type: () => FileDto,
    description: 'Marketing flyer image or document',
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => FileDto)
  flyer?: FileDto | null;
  @ApiProperty({ type: () => FileDto, nullable: true })
  @IsOptional()
  videoAr?: FileDto | null;

  @ApiProperty({ type: () => FileDto, nullable: true })
  @IsOptional()
  videoFr?: FileDto | null;

  @ApiProperty({ type: () => FileDto, nullable: true })
  @IsOptional()
  videoEn?: FileDto | null;

  // Don't forget to use the class-validator decorators in the DTO properties.
}
