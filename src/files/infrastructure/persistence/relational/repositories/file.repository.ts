import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { FileEntity } from '../entities/file.entity';
import { FileType } from '../../../../domain/file';
import { FileRepository } from '../../file.repository';
import { FileMapper } from '../mappers/file.mapper';
import { FileCategory } from '../../../../file-category.enum';

@Injectable()
export class FilesRelationalRepository implements FileRepository {
  constructor(
    @InjectRepository(FileEntity)
    private readonly fileRepository: Repository<FileEntity>,
  ) {}

  async create(data: Omit<FileType, 'id'>): Promise<FileType> {
    const entity = this.fileRepository.create({
      path: data.path,
      fileCategory: data.fileCategory,
      fileDescription: data.fileDescription ?? null,
    });
    const saved = await this.fileRepository.save(entity);
    return FileMapper.toDomain(saved);
  }

  async findById(id: FileType['id']): Promise<FileType | null> {
    const entity = await this.fileRepository.findOne({ where: { id } });
    return entity ? FileMapper.toDomain(entity) : null;
  }

  // NEW
  async findByCategory(category: FileCategory): Promise<FileType[]> {
    const entities = await this.fileRepository.find({
      where: { fileCategory: category },
    });
    return entities.map(FileMapper.toDomain);
  }
  async findByIds(ids: FileType['id'][]): Promise<FileType[]> {
    const entities = await this.fileRepository.find({
      where: {
        id: In(ids),
      },
    });

    return entities.map((entity) => FileMapper.toDomain(entity));
  }
}
