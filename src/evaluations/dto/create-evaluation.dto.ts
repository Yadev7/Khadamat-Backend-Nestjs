import {
  // decorators here

  IsString,
  IsOptional,
  IsNumber,
  IsBoolean,
  IsNotEmpty,
  IsNumberString,
} from 'class-validator';

import {
  // decorators here
  ApiProperty,
} from '@nestjs/swagger';

export class CreateEvaluationDto {
  @ApiProperty({
    required: false,
    type: () => Boolean,
  })
  @IsOptional()
  @IsBoolean()
  isValid?: boolean | null;

  @ApiProperty({
    required: false,
    type: () => String,
  })
  @IsOptional()
  @IsString()
  textAr?: string | null;

  @ApiProperty({
    required: false,
    type: () => String,
  })
  @IsOptional()
  @IsString()
  textFr?: string | null;

  @ApiProperty({
    required: false,
    type: () => Number,
  })
  @IsOptional()
  @IsNumber()
  stars?: number | null;

  @ApiProperty({
    required: false,
    type: () => String,
  })
  @IsOptional()
  @IsString()
  EvalCode?: string | null;

  @ApiProperty({ required: true, type: () => String })
  //  @IsString({ message: 'businessId must be a string' })
  // @IsNotEmpty({ message: 'businessId should not be empty' })
  // businessId!: string;
  @IsNumberString({}, { message: 'businessId must be a valid number string' })
  @IsNotEmpty({ message: 'businessId should not be empty' })
  businessId: string;

  // Don't forget to use the class-validator decorators in the DTO properties.
}
