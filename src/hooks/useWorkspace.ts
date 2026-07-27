import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { workspaceService } from '@/services/workspace.service';
import { useAuth } from '@/hooks/useAuth';
import { CreateWorkspaceDTO, UpdateWorkspaceDTO } from '@/types/workspace';
import { toast } from 'sonner';

export function useWorkspaceById(id: string) {
  return useQuery({
    queryKey: ['workspace', id],
    queryFn: () => workspaceService.getWorkspaceById(id),
    enabled: !!id,
  });
}

export function useWorkspace() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const workspacesQuery = useQuery({
    queryKey: ['workspaces', user?.id],
    queryFn: () => workspaceService.getWorkspaces(),
    enabled: !!user?.id,
  });

  const createMutation = useMutation({
    mutationFn: (data: CreateWorkspaceDTO) => {
      if (!user?.id) throw new Error('Not authenticated');
      return workspaceService.createWorkspace(data, user.id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workspaces'] });
      toast.success('Workspace created successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to create workspace: ${error.message}`);
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateWorkspaceDTO }) => 
      workspaceService.updateWorkspace(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['workspaces'] });
      queryClient.invalidateQueries({ queryKey: ['workspace', data.id] });
      toast.success('Workspace updated successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to update workspace: ${error.message}`);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => workspaceService.deleteWorkspace(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workspaces'] });
      toast.success('Workspace deleted successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete workspace: ${error.message}`);
    }
  });

  return {
    workspaces: workspacesQuery.data || [],
    isLoading: workspacesQuery.isLoading,
    error: workspacesQuery.error,
    createWorkspace: createMutation.mutate,
    isCreating: createMutation.isPending,
    updateWorkspace: updateMutation.mutate,
    isUpdating: updateMutation.isPending,
    deleteWorkspace: deleteMutation.mutate,
    isDeleting: deleteMutation.isPending,
  };
}
