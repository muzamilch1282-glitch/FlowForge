import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { attachmentService } from '@/services/attachment.service';
import { TaskAttachment } from '@/types/attachment';
import { toast } from 'sonner';

export const useAttachments = (taskId: string) => {
  const queryClient = useQueryClient();
  const queryKey = ['attachments', taskId];

  const {
    data: attachments = [],
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey,
    queryFn: () => attachmentService.getAttachments(taskId),
    enabled: !!taskId,
  });

  useEffect(() => {
    if (!taskId) return;

    const channel = supabase
      .channel(`public:task_attachments:task_id=${taskId}-${Math.random().toString(36).substring(7)}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'task_attachments',
          filter: `task_id=eq.${taskId}`,
        },
        () => {
          queryClient.invalidateQueries({ queryKey });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [taskId, queryClient]);

  const { mutateAsync: uploadFile, isPending: isUploading } = useMutation({
    mutationFn: (file: File) => attachmentService.uploadFile(taskId, file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
      toast.success('File uploaded successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to upload file');
    }
  });

  const { mutateAsync: deleteAttachment, isPending: isDeleting } = useMutation({
    mutationFn: (attachment: TaskAttachment) => attachmentService.deleteAttachment(attachment),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
      toast.success('Attachment deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to delete attachment');
    }
  });

  const downloadAttachment = async (attachment: TaskAttachment) => {
    try {
      toast.info('Starting download...');
      await attachmentService.downloadAttachment(attachment);
    } catch (error: any) {
      toast.error(error.message || 'Failed to download attachment');
    }
  };

  const getPublicUrl = (fileUrl: string) => {
    return attachmentService.getPublicUrl(fileUrl);
  };

  return {
    attachments,
    isLoading,
    error,
    uploadFile,
    isUploading,
    deleteAttachment,
    isDeleting,
    downloadAttachment,
    getPublicUrl,
    refetch
  };
};
