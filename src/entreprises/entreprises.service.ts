import { AddressesService } from '../addresses/addresses.service';
import { Address } from '../addresses/domain/address';

import {
  // common
  Injectable,
  HttpStatus,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CreateEntrepriseDto } from './dto/create-entreprise.dto';
import { UpdateEntrepriseDto } from './dto/update-entreprise.dto';
import { EntrepriseRepository } from './infrastructure/persistence/entreprise.repository';
import { IPaginationOptions } from '../utils/types/pagination-options';
import { Entreprise } from './domain/entreprise';

@Injectable()
export class EntreprisesService {
  constructor(
    private readonly addressService: AddressesService,

    // Dependencies here
    private readonly entrepriseRepository: EntrepriseRepository,
  ) {}

  async create(createEntrepriseDto: CreateEntrepriseDto) {
    // Do not remove comment below.
    // <creating-property />
    let headOffice: Address | null | undefined = undefined;

    if (createEntrepriseDto.headOffice) {
      const headOfficeObject = await this.addressService.findById(
        createEntrepriseDto.headOffice.id,
      );
      if (!headOfficeObject) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            headOffice: 'notExists',
          },
        });
      }
      headOffice = headOfficeObject;
    } else if (createEntrepriseDto.headOffice === null) {
      headOffice = null;
    }

    return this.entrepriseRepository.create({
      // Do not remove comment below.
      // <creating-property-payload />
      headOffice,

      nameEn: createEntrepriseDto.nameEn,

      nameAr: createEntrepriseDto.nameAr,

      nameFr: createEntrepriseDto.nameFr,
    });
  }

  findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }) {
    return this.entrepriseRepository.findAllWithPagination({
      paginationOptions: {
        page: paginationOptions.page,
        limit: paginationOptions.limit,
      },
    });
  }

  findById(id: Entreprise['id']) {
    return this.entrepriseRepository.findById(id);
  }

  findByIds(ids: Entreprise['id'][]) {
    return this.entrepriseRepository.findByIds(ids);
  }

  async update(
    id: Entreprise['id'],

    updateEntrepriseDto: UpdateEntrepriseDto,
  ) {
    // Do not remove comment below.
    // <updating-property />
    let headOffice: Address | null | undefined = undefined;

    if (updateEntrepriseDto.headOffice) {
      const headOfficeObject = await this.addressService.findById(
        updateEntrepriseDto.headOffice.id,
      );
      if (!headOfficeObject) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            headOffice: 'notExists',
          },
        });
      }
      headOffice = headOfficeObject;
    } else if (updateEntrepriseDto.headOffice === null) {
      headOffice = null;
    }

    return this.entrepriseRepository.update(id, {
      // Do not remove comment below.
      // <updating-property-payload />
      headOffice,

      nameEn: updateEntrepriseDto.nameEn,

      nameAr: updateEntrepriseDto.nameAr,

      nameFr: updateEntrepriseDto.nameFr,
    });
  }

  remove(id: Entreprise['id']) {
    return this.entrepriseRepository.remove(id);
  }
}
