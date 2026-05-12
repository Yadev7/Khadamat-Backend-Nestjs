import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { ServiceEntity } from '../entities/service.entity';
import { NullableType } from '../../../../../utils/types/nullable.type';
import { Service } from '../../../../domain/service';
import { ServiceRepository } from '../../service.repository';
import { ServiceMapper } from '../mappers/service.mapper';
import { IPaginationOptions } from '../../../../../utils/types/pagination-options';
import path from 'node:path';
import { promises as fs } from 'node:fs';
import fsSync from 'node:fs';
import { FileEntity } from 'src/files/infrastructure/persistence/relational/entities/file.entity';

@Injectable()
export class ServiceRelationalRepository implements ServiceRepository {
  constructor(
    @InjectRepository(ServiceEntity)
    private readonly serviceRepository: Repository<ServiceEntity>,
    @InjectRepository(FileEntity)
    private readonly fileRepository: Repository<FileEntity>,
  ) {}

  async create(data: Service): Promise<Service> {
    const persistenceModel = ServiceMapper.toPersistence(data);

    // DEBUG LOG: Verify imageId is present before SQL INSERT
    console.log('--- ATTEMPTING DB INSERT ---');
    console.log('imageId to be saved:', persistenceModel.imageId);
    console.log('videoId to be saved:', persistenceModel.videoId);

    const newEntity = await this.serviceRepository.save(persistenceModel);
    return ServiceMapper.toDomain(newEntity);
  }

  async findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<Service[]> {
    const entities = await this.serviceRepository.find({
      skip: (paginationOptions.page - 1) * paginationOptions.limit,
      take: paginationOptions.limit,
    });

    return entities.map((entity) => ServiceMapper.toDomain(entity));
  }

  async findById(id: Service['id']): Promise<NullableType<Service>> {
    const entity = await this.serviceRepository.findOne({
      where: { id },
    });

    return entity ? ServiceMapper.toDomain(entity) : null;
  }

  async findByIds(ids: Service['id'][]): Promise<Service[]> {
    const entities = await this.serviceRepository.find({
      where: { id: In(ids) },
    });

    return entities.map((entity) => ServiceMapper.toDomain(entity));
  }

  async update(id: Service['id'], payload: Partial<Service>): Promise<Service> {
    const entity = await this.serviceRepository.findOne({
      where: { id },
    });

    if (!entity) {
      throw new Error('Service not found');
    }

    const updatedPersistenceModel = ServiceMapper.toPersistence({
      ...ServiceMapper.toDomain(entity),
      ...payload,
    });

    // DEBUG LOG: Verify imageId during update
    console.log('--- ATTEMPTING DB UPDATE ---');
    console.log('Updated imageId:', updatedPersistenceModel.imageId);

    const updatedEntity = await this.serviceRepository.save(
      updatedPersistenceModel,
    );

    return ServiceMapper.toDomain(updatedEntity);
  }

  // async remove(id: Service['id']): Promise<void> {
  //   await this.serviceRepository.delete(id);
  // }

  // service.repository.ts

  async remove(id: Service['id']): Promise<void> {
    // 1. Find the service first to get image/video relations
    const service = await this.serviceRepository.findOne({
      where: { id },
      relations: ['image', 'video'], // Ensure relations are loaded
    });

    if (!service) return;

    // 2. Delete the Service record first
    await this.serviceRepository.delete(id);

    // 3. Cleanup Image
    if (service.image) {
      await this.cleanupFile(service.image);
    }

    // 4. Cleanup Video
    if (service.video) {
      await this.cleanupFile(service.video);
    }
  }

  private async cleanupFile(file: FileEntity) {
    try {
      // Delete physical file (You might need to inject FilesService to use its logic)
      // Extract filename from path (e.g., "/api/v1/files/abc.jpg" -> "abc.jpg")
      const fileName = file.path?.split('/').pop();
      const filePath = path.join(process.cwd(), 'files', fileName || '');

      if (fsSync.existsSync(filePath)) {
        await fs.unlink(filePath);
      }

      // Delete database record in 'file' table
      // Note: You'll need to inject the FileEntity repository here too
      if (file.id) {
        await this.fileRepository.delete(file.id);
      }
    } catch (error) {
      console.error('Cleanup failed:', error);
    }
  }
}
