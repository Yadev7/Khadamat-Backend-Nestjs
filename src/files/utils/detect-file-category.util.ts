import { FileCategory } from '../file-category.enum';

const CATEGORY_MAP: Record<FileCategory, string[]> = {
  [FileCategory.IMAGE]: [
    'jpg',
    'jpeg',
    'png',
    'gif',
    'webp',
    'svg',
    'bmp',
    'tiff',
    'ico',
  ],
  [FileCategory.VIDEO]: [
    'mp4',
    'avi',
    'mov',
    'mkv',
    'webm',
    'flv',
    'wmv',
    'm4v',
  ],
  [FileCategory.AUDIO]: ['mp3', 'wav', 'ogg', 'flac', 'aac', 'm4a', 'wma'],
  [FileCategory.DOCUMENT]: [
    'pdf',
    'doc',
    'docx',
    'xls',
    'xlsx',
    'ppt',
    'pptx',
    'txt',
    'csv',
    'odt',
  ],
  [FileCategory.ARCHIVE]: ['zip', 'rar', 'tar', 'gz', '7z', 'bz2'],
  [FileCategory.OTHER]: [],
};

export function detectFileCategory(filename: string): FileCategory {
  const ext = filename.split('.').pop()?.toLowerCase() ?? '';

  for (const [category, extensions] of Object.entries(CATEGORY_MAP)) {
    if (extensions.includes(ext)) {
      return category as FileCategory;
    }
  }
  return FileCategory.OTHER;
}
