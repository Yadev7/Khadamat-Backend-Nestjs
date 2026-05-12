import { FileType } from '../../../../domain/file';
import { FileEntity } from '../entities/file.entity';

export class FileMapper {
  static toDomain(raw: FileEntity): FileType {
    const file = new FileType();
    file.id = raw.id;
    file.path = raw.path;
    file.fileCategory = raw.fileCategory;
    file.fileDescription = raw.fileDescription;
    return file;
  }

  static toPersistence(domain: FileType): FileEntity {
    const entity = new FileEntity();
    entity.id = domain.id;
    entity.path = domain.path;
    entity.fileCategory = domain.fileCategory;
    entity.fileDescription = domain.fileDescription;
    return entity;
  }
}
