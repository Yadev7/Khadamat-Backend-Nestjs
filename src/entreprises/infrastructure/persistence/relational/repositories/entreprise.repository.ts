import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { EntrepriseEntity } from '../entities/entreprise.entity';
import { NullableType } from '../../../../../utils/types/nullable.type';
import { Entreprise } from '../../../../domain/entreprise';
import { EntrepriseRepository } from '../../entreprise.repository';
import { EntrepriseMapper } from '../mappers/entreprise.mapper';
import { IPaginationOptions } from '../../../../../utils/types/pagination-options';

@Injectable()
export class EntrepriseRelationalRepository implements EntrepriseRepository {
  constructor(
    @InjectRepository(EntrepriseEntity)
    private readonly entrepriseRepository: Repository<EntrepriseEntity>,
  ) {}

  async create(data: Entreprise): Promise<Entreprise> {
    const persistenceModel = EntrepriseMapper.toPersistence(data);
    const newEntity = await this.entrepriseRepository.save(
      this.entrepriseRepository.create(persistenceModel),
    );
    return EntrepriseMapper.toDomain(newEntity);
  }

  async findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<Entreprise[]> {
    const entities = await this.entrepriseRepository.find({
      skip: (paginationOptions.page - 1) * paginationOptions.limit,
      take: paginationOptions.limit,
    });

    return entities.map((entity) => EntrepriseMapper.toDomain(entity));
  }

  async findById(id: Entreprise['id']): Promise<NullableType<Entreprise>> {
    const entity = await this.entrepriseRepository.findOne({
      where: { id },
    });

    return entity ? EntrepriseMapper.toDomain(entity) : null;
  }

  async findByIds(ids: Entreprise['id'][]): Promise<Entreprise[]> {
    const entities = await this.entrepriseRepository.find({
      where: { id: In(ids) },
    });

    return entities.map((entity) => EntrepriseMapper.toDomain(entity));
  }

  async update(
    id: Entreprise['id'],
    payload: Partial<Entreprise>,
  ): Promise<Entreprise> {
    const entity = await this.entrepriseRepository.findOne({
      where: { id },
    });

    if (!entity) {
      throw new Error('Record not found');
    }

    const updatedEntity = await this.entrepriseRepository.save(
      this.entrepriseRepository.create(
        EntrepriseMapper.toPersistence({
          ...EntrepriseMapper.toDomain(entity),
          ...payload,
        }),
      ),
    );

    return EntrepriseMapper.toDomain(updatedEntity);
  }

  async remove(id: Entreprise['id']): Promise<void> {
    await this.entrepriseRepository.delete(id);
  }
}
