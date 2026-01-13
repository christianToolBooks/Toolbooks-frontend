import {
  X,
  FileText,
  ImageIcon,
  Code,
  File,
  Video,
  Music,
  Archive,
} from 'lucide-react';

export const getFileCategory = (extension: string): string => {
  const ext = extension.toLowerCase();

  const categoryMap: Record<string, string> = {
    png: 'image',
    jpg: 'image',
    jpeg: 'image',
    gif: 'image',
    webp: 'image',
    bmp: 'image',

    pdf: 'pdf',

    svg: 'svg',

    mp4: 'video',
    avi: 'video',
    mov: 'video',
    wmv: 'video',
    flv: 'video',
    webm: 'video',

    mp3: 'audio',
    wav: 'audio',
    flac: 'audio',
    aac: 'audio',
    ogg: 'audio',

    docx: 'document',
    doc: 'document',
    xlsx: 'document',
    xls: 'document',
    pptx: 'document',
    ppt: 'document',

    zip: 'archive',
    rar: 'archive',
    '7z': 'archive',
    tar: 'archive',
    gz: 'archive',

    js: 'code',
    ts: 'code',
    jsx: 'code',
    tsx: 'code',
    css: 'code',
    html: 'code',
    json: 'code',
    xml: 'code',
  };

  return categoryMap[ext] || ext;
};

export const getCategoryDisplayName = (category: string): string => {
  const nameMap: Record<string, string> = {
    image: 'Images',
    pdf: 'PDFs',
    svg: 'SVGs',
    video: 'Videos',
    audio: 'Audio',
    document: 'Documents',
    archive: 'Archives',
    code: 'Code',
  };

  return nameMap[category] || category.toUpperCase() + 's';
};

export const getCategoryIcon = (category: string) => {
  const iconMap: Record<string, any> = {
    image: ImageIcon,
    pdf: FileText,
    svg: Code,
    video: Video,
    audio: Music,
    document: FileText,
    archive: Archive,
    code: Code,
  };

  return iconMap[category] || File;
};
