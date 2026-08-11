import React from 'react';
import { UploadDropzone } from './UploadDropzone';
import { AttachmentList } from './AttachmentList';
import { useAttachments } from '@/hooks/useAttachments';
import { Paperclip } from 'lucide-react';

interface FileUploadProps {
  taskId: string;
}

export function FileUpload({ taskId }: FileUploadProps) {
  const { uploadFile, isUploading } = useAttachments(taskId);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <Paperclip className="h-5 w-5 text-muted-foreground" />
        <h3 className="font-semibold text-foreground">Attachments</h3>
      </div>
      
      <UploadDropzone onUpload={async (file) => { await uploadFile(file); }} isUploading={isUploading} />
      <AttachmentList taskId={taskId} />
    </div>
  );
}
