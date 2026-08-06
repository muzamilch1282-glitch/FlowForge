import React from 'react';
import { 
  File, 
  FileText, 
  FileImage, 
  FileArchive, 
  FileSpreadsheet 
} from 'lucide-react';

interface FileIconProps {
  fileType: string;
  className?: string;
}

export function FileIcon({ fileType, className }: FileIconProps) {
  if (fileType.includes('image')) return <FileImage className={className} />;
  if (fileType.includes('pdf')) return <FileText className={className} />;
  if (fileType.includes('spreadsheet') || fileType.includes('excel') || fileType.includes('csv')) return <FileSpreadsheet className={className} />;
  if (fileType.includes('zip') || fileType.includes('compressed')) return <FileArchive className={className} />;
  if (fileType.includes('document') || fileType.includes('word')) return <FileText className={className} />;
  
  return <File className={className} />;
}
