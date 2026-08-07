import { useQuery } from '@tanstack/react-query';
import { activityService } from '@/services/activity.service';

export const useWorkspaceActivity = (workspaceId: string | undefined) => {
  return useQuery({
    queryKey: ['activity', 'workspace', workspaceId],
    queryFn: () => activityService.getWorkspaceActivity(workspaceId!),
    enabled: !!workspaceId,
  });
};

export const useProjectActivity = (projectId: string | undefined) => {
  return useQuery({
    queryKey: ['activity', 'project', projectId],
    queryFn: () => activityService.getProjectActivity(projectId!),
    enabled: !!projectId,
  });
};

export const useTaskActivity = (taskId: string | undefined) => {
  return useQuery({
    queryKey: ['activity', 'task', taskId],
    queryFn: () => activityService.getTaskActivity(taskId!),
    enabled: !!taskId,
  });
};
