import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { teamService } from '@/services/team.service';
import { InviteMemberDTO, UpdateMemberRoleDTO } from '@/types/team';
import { toast } from 'sonner';

export function useTeam(workspaceId?: string) {
  const queryClient = useQueryClient();

  const membersQuery = useQuery({
    queryKey: ['team_members', workspaceId],
    queryFn: () => teamService.getMembers(workspaceId!),
    enabled: !!workspaceId,
  });

  const inviteMutation = useMutation({
    mutationFn: (data: InviteMemberDTO) => teamService.createMember(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['team_members', workspaceId] });
      toast.success('Team member invited successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to invite team member');
    }
  });

  const updateRoleMutation = useMutation({
    mutationFn: (data: UpdateMemberRoleDTO) => teamService.updateMemberRole(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['team_members', workspaceId] });
      toast.success('Member role updated successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update member role');
    }
  });

  const removeMemberMutation = useMutation({
    mutationFn: (id: string) => teamService.removeMember(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['team_members', workspaceId] });
      toast.success('Team member removed successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to remove team member');
    }
  });

  return {
    members: membersQuery.data || [],
    isLoading: membersQuery.isLoading,
    error: membersQuery.error,
    inviteMember: inviteMutation.mutate,
    isInviting: inviteMutation.isPending,
    updateRole: updateRoleMutation.mutate,
    isUpdating: updateRoleMutation.isPending,
    removeMember: removeMemberMutation.mutate,
    isRemoving: removeMemberMutation.isPending,
  };
}
