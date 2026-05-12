import { FileType } from '../../domain/file';
import { FileCategory } from '../../file-category.enum';

export abstract class FileRepository {
  abstract create(data: Omit<FileType, 'id'>): Promise<FileType>;

  abstract findById(id: FileType['id']): Promise<FileType | null>;

  // NEW
  abstract findByCategory(category: FileCategory): Promise<FileType[]>;

  abstract findByIds(ids: FileType['id'][]): Promise<FileType[]>;
}
