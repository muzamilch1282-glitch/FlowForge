import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { notificationService } from '@/services/notification.service';
import { toast } from 'sonner';

export const useNotifications = () => {
  const queryClient = useQueryClient();
  const queryKey = ['notifications'];

  const {
    data: notifications = [],
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey,
    queryFn: () => notificationService.getNotifications(),
  });

  const { mutateAsync: markAsRead } = useMutation({
    mutationFn: notificationService.markAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
    }
  });

  const { mutateAsync: markAllAsRead, isPending: isMarkingAllRead } = useMutation({
    mutationFn: notificationService.markAllAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
      toast.success('All notifications marked as read');
    }
  });

  const { mutateAsync: deleteNotification } = useMutation({
    mutationFn: notificationService.deleteNotification,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
    }
  });

  const unreadCount = notifications.filter(n => !n.is_read).length;

  return {
    notifications,
    unreadCount,
    isLoading,
    error,
    markAsRead,
    markAllAsRead,
    isMarkingAllRead,
    deleteNotification,
    refetch
  };
};
