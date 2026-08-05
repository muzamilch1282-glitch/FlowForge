import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { commentService } from '@/services/comment.service';
import { CreateCommentDTO, UpdateCommentDTO } from '@/types/comment';
import { toast } from 'sonner';

export const useComments = (taskId: string) => {
  const queryClient = useQueryClient();
  const queryKey = ['comments', taskId];

  const {
    data: comments = [],
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey,
    queryFn: () => commentService.getComments(taskId),
    enabled: !!taskId,
  });

  const { mutate: createComment, isPending: isCreating } = useMutation({
    mutationFn: (data: Omit<CreateCommentDTO, 'task_id'>) => 
      commentService.createComment({ ...data, task_id: taskId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
      toast.success('Comment added successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to add comment');
    }
  });

  const { mutate: updateComment, isPending: isUpdating } = useMutation({
    mutationFn: (data: UpdateCommentDTO) => commentService.updateComment(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
      toast.success('Comment updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update comment');
    }
  });

  const { mutate: deleteComment, isPending: isDeleting } = useMutation({
    mutationFn: (id: string) => commentService.deleteComment(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
      toast.success('Comment deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to delete comment');
    }
  });

  return {
    comments,
    isLoading,
    error,
    createComment,
    isCreating,
    updateComment,
    isUpdating,
    deleteComment,
    isDeleting,
    refetch
  };
};
