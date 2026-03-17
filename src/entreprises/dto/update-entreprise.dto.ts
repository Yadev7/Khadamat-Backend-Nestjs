// Don't forget to use the class-validator decorators in the DTO properties.
// import { Allow } from 'class-validator';

import { PartialType } from '@nestjs/swagger';
import { CreateEntrepriseDto } from './create-entreprise.dto';

export class UpdateEntrepriseDto extends PartialType(CreateEntrepriseDto) {}
