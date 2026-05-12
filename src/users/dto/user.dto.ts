import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class UserDto {
  @ApiProperty({
    type: String,
    example: 'userId',
  })
  @IsOptional()
  @IsNotEmpty()
  id?: string | number;
}
