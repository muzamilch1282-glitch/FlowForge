import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { taskDependencyService } from '../services/task-dependency.service';
import { toast } from 'sonner';

export function useTaskDependencies(taskId: string) {
  const queryClient = useQueryClient();

  const blockedByQuery = useQuery({
    queryKey: ['task_dependencies', 'blocked_by', taskId],
    queryFn: () => taskDependencyService.getDependencies(taskId),
    enabled: !!taskId,
  });

  const blocksQuery = useQuery({
    queryKey: ['task_dependencies', 'blocks', taskId],
    queryFn: () => taskDependencyService.getDependentTasks(taskId),
    enabled: !!taskId,
  });

  const addDependencyMutation = useMutation({
    mutationFn: ({ dependsOnTaskId, projectId }: { dependsOnTaskId: string, projectId: string }) => 
      taskDependencyService.addDependency(taskId, dependsOnTaskId, projectId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['task_dependencies', 'blocked_by', taskId] });
      queryClient.invalidateQueries({ queryKey: ['task_dependencies', 'blocks', taskId] });
      // Might also need to invalidate the other task's queries, but realtime should handle that if active
      toast.success('Dependency added successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to add dependency');
    }
  });

  const removeDependencyMutation = useMutation({
    mutationFn: (dependencyId: string) => taskDependencyService.removeDependency(dependencyId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['task_dependencies', 'blocked_by', taskId] });
      queryClient.invalidateQueries({ queryKey: ['task_dependencies', 'blocks', taskId] });
      toast.success('Dependency removed');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to remove dependency');
    }
  });

  return {
    blockedBy: blockedByQuery.data || [],
    isLoadingBlockedBy: blockedByQuery.isLoading,
    blocks: blocksQuery.data || [],
    isLoadingBlocks: blocksQuery.isLoading,
    addDependency: addDependencyMutation.mutate,
    isAddingDependency: addDependencyMutation.isPending,
    removeDependency: removeDependencyMutation.mutate,
    isRemovingDependency: removeDependencyMutation.isPending,
  };
}
