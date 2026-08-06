import React, { useState } from 'react';
import { TaskAttachment } from '@/types/attachment';
import { FileIcon } from './FileIcon';
import { formatDistanceToNow, parseISO } from 'date-fns';
import { Download, Eye, Trash2, MoreHorizontal } from 'lucide-react';
import { Dropdown } from '@/components/shared';
import { useAuth } from '@/hooks/useAuth';
import { usePermissions } from '@/hooks/usePermissions';
import { ImagePreview } from './ImagePreview';
import { PdfPreview } from './PdfPreview';

interface AttachmentCardProps {
  attachment: TaskAttachment;
  publicUrl: string;
  onDownload: (attachment: TaskAttachment) => void;
  onDelete: (attachment: TaskAttachment) => void;
  isDeleting?: boolean;
}

const formatBytes = (bytes: number, decimals = 2) => {
  if (!+bytes) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
};

export function AttachmentCard({ attachment, publicUrl, onDownload, onDelete, isDeleting }: AttachmentCardProps) {
  const { user } = useAuth();
  const { isAdmin } = usePermissions();
  
  const [showImagePreview, setShowImagePreview] = useState(false);
  const [showPdfPreview, setShowPdfPreview] = useState(false);

  const isOwner = user?.id === attachment.uploaded_by;
  const canDelete = isOwner || isAdmin();
  
  const isImage = attachment.file_type.includes('image');
  const isPdf = attachment.file_type.includes('pdf');
  const canPreview = isImage || isPdf;

  const handlePreview = () => {
    if (isImage) setShowImagePreview(true);
    if (isPdf) setShowPdfPreview(true);
  };

  return (
    <>
      <div className={`flex items-center gap-3 p-3 rounded-lg border border-border bg-card transition-colors hover:bg-muted/30 ${isDeleting ? 'opacity-50 pointer-events-none' : ''}`}>
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded bg-primary/10 text-primary">
          <FileIcon fileType={attachment.file_type} className="h-5 w-5" />
        </div>
        
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-foreground truncate" title={attachment.file_name}>
            {attachment.file_name}
          </p>
          <div className="flex items-center gap-2 mt-0.5 text-xs text-muted-foreground">
            <span>{formatBytes(attachment.file_size)}</span>
            <span>•</span>
            <span>{attachment.profile?.full_name || 'Unknown'}</span>
            <span>•</span>
            <span suppressHydrationWarning>
              {formatDistanceToNow(parseISO(attachment.created_at), { addSuffix: true })}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          {canPreview && (
            <button
              onClick={handlePreview}
              className="p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground rounded transition-colors"
              title="Preview"
            >
              <Eye className="h-4 w-4" />
            </button>
          )}
          <button
            onClick={() => onDownload(attachment)}
            className="p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground rounded transition-colors"
            title="Download"
          >
            <Download className="h-4 w-4" />
          </button>
          
          {canDelete && (
            <Dropdown
              trigger={
                <button className="p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground rounded transition-colors">
                  <MoreHorizontal className="h-4 w-4" />
                </button>
              }
              items={[
                {
                  label: 'Delete File',
                  icon: Trash2,
                  onClick: () => onDelete(attachment),
                  danger: true,
                }
              ]}
              align="end"
            />
          )}
        </div>
      </div>

      {isImage && (
        <ImagePreview 
          url={publicUrl} 
          fileName={attachment.file_name} 
          open={showImagePreview} 
          onOpenChange={setShowImagePreview} 
        />
      )}
      
      {isPdf && (
        <PdfPreview 
          url={publicUrl} 
          fileName={attachment.file_name} 
          open={showPdfPreview} 
          onOpenChange={setShowPdfPreview} 
        />
      )}
    </>
  );
}
