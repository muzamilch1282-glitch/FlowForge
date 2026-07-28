import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { projectService } from '@/services/project.service';
import { CreateProjectDTO, UpdateProjectDTO } from '@/types/project';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

export function useProjectById(id: string) {
  return useQuery({
    queryKey: ['project', id],
    queryFn: () => projectService.getProjectById(id),
    enabled: !!id,
  });
}

export function useProjectsByWorkspace(workspaceId: string) {
  return useQuery({
    queryKey: ['projects', 'workspace', workspaceId],
    queryFn: () => projectService.getProjectsByWorkspace(workspaceId),
    enabled: !!workspaceId,
  });
}

export function useProjects() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const projectsQuery = useQuery({
    queryKey: ['projects', user?.id],
    queryFn: () => projectService.getProjects(),
    enabled: !!user?.id,
  });

  const createMutation = useMutation({
    mutationFn: (data: CreateProjectDTO) => {
      if (!user?.id) throw new Error('Not authenticated');
      return projectService.createProject(data, user.id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      toast.success('Project created successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to create project: ${error.message}`);
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateProjectDTO }) => 
      projectService.updateProject(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      queryClient.invalidateQueries({ queryKey: ['project', data.id] });
      toast.success('Project updated successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to update project: ${error.message}`);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => projectService.deleteProject(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      toast.success('Project deleted successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete project: ${error.message}`);
    }
  });

  return {
    projects: projectsQuery.data || [],
    isLoading: projectsQuery.isLoading,
    error: projectsQuery.error,
    createProject: createMutation.mutate,
    isCreating: createMutation.isPending,
    updateProject: updateMutation.mutate,
    isUpdating: updateMutation.isPending,
    deleteProject: deleteMutation.mutate,
    isDeleting: deleteMutation.isPending,
  };
}
