// Don't forget to use the class-validator decorators in the DTO properties.
// import { Allow } from 'class-validator';

import { PartialType } from '@nestjs/swagger';
import { CreateCallDto } from './create-call.dto';

export class UpdateCallDto extends PartialType(CreateCallDto) {}
