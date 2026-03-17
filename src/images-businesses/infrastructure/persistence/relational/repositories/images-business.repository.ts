import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { ImagesBusinessEntity } from '../entities/images-business.entity';
import { NullableType } from '../../../../../utils/types/nullable.type';
import { ImagesBusiness } from '../../../../domain/images-business';
import { ImagesBusinessRepository } from '../../images-business.repository';
import { ImagesBusinessMapper } from '../mappers/images-business.mapper';
import { IPaginationOptions } from '../../../../../utils/types/pagination-options';

@Injectable()
export class ImagesBusinessRelationalRepository
  implements ImagesBusinessRepository
{
  constructor(
    @InjectRepository(ImagesBusinessEntity)
    private readonly imagesBusinessRepository: Repository<ImagesBusinessEntity>,
  ) {}

  async create(data: ImagesBusiness): Promise<ImagesBusiness> {
    const persistenceModel = ImagesBusinessMapper.toPersistence(data);
    const newEntity = await this.imagesBusinessRepository.save(
      this.imagesBusinessRepository.create(persistenceModel),
    );
    return ImagesBusinessMapper.toDomain(newEntity);
  }

  async findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<ImagesBusiness[]> {
    const entities = await this.imagesBusinessRepository.find({
      skip: (paginationOptions.page - 1) * paginationOptions.limit,
      take: paginationOptions.limit,
    });

    return entities.map((entity) => ImagesBusinessMapper.toDomain(entity));
  }

  async findById(
    id: ImagesBusiness['id'],
  ): Promise<NullableType<ImagesBusiness>> {
    const entity = await this.imagesBusinessRepository.findOne({
      where: { id },
    });

    return entity ? ImagesBusinessMapper.toDomain(entity) : null;
  }

  async findByIds(ids: ImagesBusiness['id'][]): Promise<ImagesBusiness[]> {
    const entities = await this.imagesBusinessRepository.find({
      where: { id: In(ids) },
    });

    return entities.map((entity) => ImagesBusinessMapper.toDomain(entity));
  }

  async update(
    id: ImagesBusiness['id'],
    payload: Partial<ImagesBusiness>,
  ): Promise<ImagesBusiness> {
    const entity = await this.imagesBusinessRepository.findOne({
      where: { id },
    });

    if (!entity) {
      throw new Error('Record not found');
    }

    const updatedEntity = await this.imagesBusinessRepository.save(
      this.imagesBusinessRepository.create(
        ImagesBusinessMapper.toPersistence({
          ...ImagesBusinessMapper.toDomain(entity),
          ...payload,
        }),
      ),
    );

    return ImagesBusinessMapper.toDomain(updatedEntity);
  }

  async remove(id: ImagesBusiness['id']): Promise<void> {
    await this.imagesBusinessRepository.delete(id);
  }
}
