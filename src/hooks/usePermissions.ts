import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from './useAuth';
import { useAppStore } from '@/store/app-store';
import { useWorkspace } from './useWorkspace';
import { getSupabaseClient } from '@/lib/supabase';
import { Role, ROLES } from '@/lib/roles';
import { PERMISSIONS, Permission, hasPermission as checkPermission } from '@/lib/permissions';

export function usePermissions() {
  const { user } = useAuth();
  const { activeWorkspaceId } = useAppStore();
  const { workspaces, isLoading: isWorkspacesLoading } = useWorkspace();

  const activeWorkspace = useMemo(() => 
    workspaces.find(w => w.id === activeWorkspaceId),
    [workspaces, activeWorkspaceId]
  );

  const isOwner = Boolean(user?.id && activeWorkspace?.owner_id === user.id);

  // Fetch role if not owner
  const { data: teamRole, isLoading: isRoleLoading } = useQuery({
    queryKey: ['user_workspace_role', activeWorkspaceId, user?.id],
    queryFn: async () => {
      if (!activeWorkspaceId || !user?.id) return null;
      const supabase = getSupabaseClient();
      const { data, error } = await supabase
        .from('team_members')
        .select('role')
        .eq('workspace_id', activeWorkspaceId)
        .eq('user_id', user.id)
        .single();
        
      if (error && error.code !== 'PGRST116') {
        console.error('Failed to fetch role:', error);
      }
      return (data?.role as Role) || null;
    },
    enabled: !!activeWorkspaceId && !!user?.id && !isOwner,
    staleTime: 5 * 60 * 1000, // cache for 5 mins
  });

  const isLoading = isWorkspacesLoading || (!!activeWorkspaceId && !isOwner && isRoleLoading);

  // Determine current effective role
  const role: Role = useMemo(() => {
    if (isOwner) return ROLES.ADMIN;
    return teamRole || ROLES.MEMBER;
  }, [isOwner, teamRole]);

  const hasPermission = (permission: Permission): boolean => {
    return checkPermission(role, permission);
  };

  return {
    role,
    isLoading,
    hasPermission,
    
    // Convenience Methods
    isAdmin: () => role === ROLES.ADMIN,
    isMember: () => role === ROLES.MEMBER,
    
    canEditWorkspace: () => hasPermission(PERMISSIONS.WORKSPACE_EDIT),
    canDeleteWorkspace: () => hasPermission(PERMISSIONS.WORKSPACE_DELETE),
    
    canCreateProject: () => hasPermission(PERMISSIONS.PROJECT_CREATE),
    canDeleteProject: () => hasPermission(PERMISSIONS.PROJECT_DELETE),
    
    canCreateTask: () => hasPermission(PERMISSIONS.TASK_CREATE),
    canDeleteTask: () => hasPermission(PERMISSIONS.TASK_DELETE),
    
    canInviteMember: () => hasPermission(PERMISSIONS.MEMBER_INVITE),
    canRemoveMember: () => hasPermission(PERMISSIONS.MEMBER_REMOVE),
  };
}
