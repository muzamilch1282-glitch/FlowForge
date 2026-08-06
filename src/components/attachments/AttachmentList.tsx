import React from 'react';
import { TaskAttachment } from '@/types/attachment';
import { AttachmentCard } from './AttachmentCard';
import { AttachmentSkeleton } from './AttachmentSkeleton';
import { EmptyAttachments } from './EmptyAttachments';
import { useAttachments } from '@/hooks/useAttachments';

interface AttachmentListProps {
  taskId: string;
}

export function AttachmentList({ taskId }: AttachmentListProps) {
  const {
    attachments,
    isLoading,
    deleteAttachment,
    isDeleting,
    downloadAttachment,
    getPublicUrl
  } = useAttachments(taskId);

  if (isLoading) {
    return (
      <div className="space-y-3 mt-4">
        <AttachmentSkeleton />
        <AttachmentSkeleton />
      </div>
    );
  }

  if (attachments.length === 0) {
    return (
      <div className="mt-4">
        <EmptyAttachments />
      </div>
    );
  }

  return (
    <div className="space-y-3 mt-4">
      {attachments.map((attachment) => (
        <AttachmentCard
          key={attachment.id}
          attachment={attachment}
          publicUrl={getPublicUrl(attachment.file_url)}
          onDownload={downloadAttachment}
          onDelete={deleteAttachment}
          isDeleting={isDeleting}
        />
      ))}
    </div>
  );
}
