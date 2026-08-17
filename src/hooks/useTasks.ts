import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { taskService } from '@/services/task.service';
import { CreateTaskDTO, UpdateTaskDTO } from '@/types/task';
import { toast } from 'sonner';

export function useTaskById(id: string) {
  return useQuery({
    queryKey: ['task', id],
    queryFn: () => taskService.getTaskById(id),
    enabled: !!id,
  });
}

export function useTasksByProject(projectId: string) {
  const queryClient = useQueryClient();
  const query = useQuery({
    queryKey: ['tasks', 'project', projectId],
    queryFn: () => taskService.getTasksByProject(projectId),
    enabled: !!projectId,
  });

  useEffect(() => {
    if (!projectId) return;
    const channel = supabase
      .channel(`public:tasks:project_id=${projectId}-${Math.random().toString(36).substring(7)}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'tasks', filter: `project_id=eq.${projectId}` },
        () => {
          queryClient.invalidateQueries({ queryKey: ['tasks', 'project', projectId] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [projectId, queryClient]);

  return query;
}

export function useTasksByWorkspace(workspaceId?: string) {
  const queryClient = useQueryClient();
  const query = useQuery({
    queryKey: ['tasks', 'workspace', workspaceId],
    queryFn: () => workspaceId ? taskService.getTasksByWorkspace(workspaceId) : [],
    enabled: !!workspaceId,
  });

  useEffect(() => {
    if (!workspaceId) return;
    // Note: We can't easily filter by workspace_id on the realtime subscription for tasks
    // because workspace_id is on the projects table. So we listen to all task changes
    // and let React Query handle the rest, or just invalidate on any task change.
    const channel = supabase
      .channel(`public:tasks:workspace_id=${workspaceId}-${Math.random().toString(36).substring(7)}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'tasks' },
        () => {
          queryClient.invalidateQueries({ queryKey: ['tasks', 'workspace', workspaceId] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [workspaceId, queryClient]);

  return query;
}

export function useTasks() {
  const queryClient = useQueryClient();

  const tasksQuery = useQuery({
    queryKey: ['tasks'],
    queryFn: () => taskService.getTasks(),
  });

  useEffect(() => {
    const channel = supabase
      .channel(`public:tasks-${Math.random().toString(36).substring(7)}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'tasks' },
        (payload) => {
          queryClient.invalidateQueries({ queryKey: ['tasks'] });
          if (payload.new && (payload.new as any).id) {
            queryClient.invalidateQueries({ queryKey: ['task', (payload.new as any).id] });
          }
          if (payload.new && (payload.new as any).project_id) {
            queryClient.invalidateQueries({ queryKey: ['tasks', 'project', (payload.new as any).project_id] });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  const createMutation = useMutation({
    mutationFn: (data: CreateTaskDTO) => taskService.createTask(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['activity'] });
      toast.success('Task created successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to create task: ${error.message}`);
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateTaskDTO }) => 
      taskService.updateTask(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['task', data.id] });
      queryClient.invalidateQueries({ queryKey: ['activity'] });
      toast.success('Task updated successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to update task: ${error.message}`);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => taskService.deleteTask(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['activity'] });
      toast.success('Task deleted successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete task: ${error.message}`);
    }
  });

  return {
    tasks: tasksQuery.data || [],
    isLoading: tasksQuery.isLoading,
    error: tasksQuery.error,
    createTask: createMutation.mutate,
    isCreating: createMutation.isPending,
    updateTask: updateMutation.mutate,
    isUpdating: updateMutation.isPending,
    deleteTask: deleteMutation.mutate,
    isDeleting: deleteMutation.isPending,
  };
}
