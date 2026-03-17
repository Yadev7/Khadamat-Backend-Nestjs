// Don't forget to use the class-validator decorators in the DTO properties.
// import { Allow } from 'class-validator';

import { PartialType } from '@nestjs/swagger';
import { CreateImagesBusinessDto } from './create-images-business.dto';

export class UpdateImagesBusinessDto extends PartialType(
  CreateImagesBusinessDto,
) {}
