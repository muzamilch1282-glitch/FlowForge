import React, { useCallback, useState } from 'react';
import { UploadCloud, File as FileIcon } from 'lucide-react';
import { useDropzone, FileRejection } from 'react-dropzone';
import { toast } from 'sonner';

interface UploadDropzoneProps {
  onUpload: (file: File) => Promise<void>;
  isUploading: boolean;
}

const MAX_SIZE = 20 * 1024 * 1024; // 20 MB

const ACCEPTED_TYPES = {
  'image/jpeg': ['.jpg', '.jpeg'],
  'image/png': ['.png'],
  'image/gif': ['.gif'],
  'image/webp': ['.webp'],
  'application/pdf': ['.pdf'],
  'application/msword': ['.doc'],
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
  'application/vnd.ms-excel': ['.xls'],
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
  'application/zip': ['.zip'],
  'application/x-zip-compressed': ['.zip']
};

export function UploadDropzone({ onUpload, isUploading }: UploadDropzoneProps) {
  const [dragProgress, setDragProgress] = useState(0);

  const onDrop = useCallback(async (acceptedFiles: File[], fileRejections: FileRejection[]) => {
    // Handle rejections
    if (fileRejections.length > 0) {
      fileRejections.forEach(({ file, errors }) => {
        errors.forEach(err => {
          if (err.code === 'file-too-large') {
            toast.error(`${file.name} is larger than 20MB`);
          } else if (err.code === 'file-invalid-type') {
            toast.error(`${file.name} has an unsupported format`);
          } else {
            toast.error(err.message);
          }
        });
      });
    }

    // Process accepted files sequentially
    if (acceptedFiles.length > 0) {
      for (const file of acceptedFiles) {
        try {
          await onUpload(file);
        } catch (error) {
          // Error handled by hook, but we catch it here to continue with next file
          console.error(error);
        }
      }
    }
  }, [onUpload]);

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    maxSize: MAX_SIZE,
    accept: ACCEPTED_TYPES,
    disabled: isUploading,
    multiple: true
  });

  return (
    <div
      {...getRootProps()}
      className={`
        relative overflow-hidden flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-xl transition-all cursor-pointer
        ${isDragActive ? 'border-primary bg-primary/5' : 'border-border bg-card/50 hover:bg-muted/50 hover:border-primary/50'}
        ${isDragReject ? 'border-destructive bg-destructive/5' : ''}
        ${isUploading ? 'opacity-70 pointer-events-none' : ''}
      `}
    >
      <input {...getInputProps()} />
      
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 mb-4">
        {isUploading ? (
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        ) : (
          <UploadCloud className={`h-6 w-6 ${isDragReject ? 'text-destructive' : 'text-primary'}`} />
        )}
      </div>
      
      <h3 className="text-sm font-medium text-foreground mb-1 text-center">
        {isUploading 
          ? 'Uploading files...' 
          : isDragActive 
            ? isDragReject ? 'Unsupported file format' : 'Drop files here'
            : 'Click or drag files to upload'
        }
      </h3>
      
      {!isUploading && (
        <p className="text-xs text-muted-foreground text-center max-w-[250px]">
          Supports JPG, PNG, PDF, DOC, XLS, ZIP (Max 20MB)
        </p>
      )}

      {/* Uploading progress overlay (simple indeterminate) */}
      {isUploading && (
        <div className="absolute bottom-0 left-0 h-1 bg-primary/20 w-full overflow-hidden">
          <div className="h-full bg-primary w-1/3 animate-progress-indeterminate rounded-r" />
        </div>
      )}
    </div>
  );
}
