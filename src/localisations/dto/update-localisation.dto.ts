// Don't forget to use the class-validator decorators in the DTO properties.
// import { Allow } from 'class-validator';

import { PartialType } from '@nestjs/swagger';
import { CreateLocalisationDto } from './create-localisation.dto';
import { DeepPartial } from 'typeorm';

export class UpdateLocalisationDto extends PartialType(CreateLocalisationDto) {
  latitude: DeepPartial<number | null | undefined>;
  longitude: DeepPartial<number | null | undefined>;
}
