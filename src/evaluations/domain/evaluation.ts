import { ApiProperty } from '@nestjs/swagger';

export class Evaluation {
  @ApiProperty({
    type: () => Boolean,
    nullable: true,
  })
  isValid?: boolean | null;

  @ApiProperty({
    type: () => String,
    nullable: true,
  })
  textAr?: string | null;

  @ApiProperty({
    type: () => String,
    nullable: true,
  })
  textFr?: string | null;

  @ApiProperty({
    type: () => Number,
    nullable: true,
  })
  stars?: number | null;

  @ApiProperty({
    type: () => String,
    nullable: true,
  })
  EvalCode?: string | null;

  @ApiProperty({
    type: String,
  })
  id?: string;

  @ApiProperty()
  createdAt?: Date;

  @ApiProperty()
  updatedAt?: Date;
}
