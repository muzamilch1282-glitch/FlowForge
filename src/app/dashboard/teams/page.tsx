'use client';

import * as React from 'react';
import { PageHeader, Button } from '@/components/shared';
import { UserPlus } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useWorkspace } from '@/hooks/useWorkspace';
import { useTeam } from '@/hooks/useTeam';
import { usePermissions } from '@/hooks/usePermissions';
import { PERMISSIONS } from '@/lib/permissions';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { PermissionGuard } from '@/components/auth/PermissionGuard';
import { TeamMemberCard } from '@/components/team/team-member-card';
import { InviteMemberModal } from '@/components/team/invite-member-modal';
import { TeamSearch } from '@/components/team/team-search';
import { TeamFilters } from '@/components/team/team-filters';
import { EmptyMembers } from '@/components/team/empty-members';
import { TeamSkeleton } from '@/components/team/team-skeleton';

export default function TeamsPage() {
  const { user } = useAuth();
  const { workspaces, isLoading: workspacesLoading } = useWorkspace();
  const [activeWorkspaceId, setActiveWorkspaceId] = React.useState('');

  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedRole, setSelectedRole] = React.useState('all');
  const [isInviteModalOpen, setIsInviteModalOpen] = React.useState(false);

  // Auto-select first workspace if none selected
  React.useEffect(() => {
    if (workspaces.length > 0 && !activeWorkspaceId) {
      setActiveWorkspaceId(workspaces[0].id);
    }
  }, [workspaces, activeWorkspaceId]);

  const { 
    members, 
    isLoading: teamLoading, 
    inviteMember, 
    isInviting, 
    updateRole, 
    isUpdating, 
    removeMember, 
    isRemoving 
  } = useTeam(activeWorkspaceId);

  const { isAdmin, canInviteMember, isLoading: permissionsLoading } = usePermissions();

  // Derived state for filtered members
  const filteredMembers = React.useMemo(() => {
    let result = [...members];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(m => 
        m.profile?.full_name.toLowerCase().includes(q) || 
        m.profile?.email.toLowerCase().includes(q)
      );
    }

    if (selectedRole !== 'all') {
      result = result.filter(m => m.role === selectedRole);
    }

    // Always put current user at the top, then admins, then others
    result.sort((a, b) => {
      if (a.user_id === user?.id) return -1;
      if (b.user_id === user?.id) return 1;
      
      const roleWeight = { admin: 2, member: 1 };
      if (roleWeight[a.role] !== roleWeight[b.role]) {
        return roleWeight[b.role] - roleWeight[a.role];
      }
      
      return (a.profile?.full_name || '').localeCompare(b.profile?.full_name || '');
    });

    return result;
  }, [members, searchQuery, selectedRole, user?.id]);

  const handleInvite = (data: { email: string; workspace_id: string; role: 'admin' | 'member' }) => {
    inviteMember(data, {
      onSuccess: () => setIsInviteModalOpen(false)
    });
  };

  const isLoading = workspacesLoading || (teamLoading && activeWorkspaceId !== '') || permissionsLoading;

  return (
    <ProtectedRoute permission={PERMISSIONS.WORKSPACE_VIEW}>
      <div className="space-y-6">
        <PageHeader
          title="Team Management"
          description="Manage your team members and their roles."
        >
          <PermissionGuard permission={PERMISSIONS.MEMBER_INVITE}>
            <Button 
              onClick={() => setIsInviteModalOpen(true)} 
              disabled={!activeWorkspaceId} 
              className="gap-2"
            >
              <UserPlus className="h-4 w-4" />
              Invite Member
            </Button>
          </PermissionGuard>
        </PageHeader>

        {workspaces.length > 0 && (
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="flex h-9 items-center gap-2 rounded-md border border-input bg-background px-3 shadow-sm">
              <span className="text-sm text-muted-foreground whitespace-nowrap">Workspace:</span>
              <select
                value={activeWorkspaceId}
                onChange={(e) => setActiveWorkspaceId(e.target.value)}
                className="bg-transparent text-sm font-medium text-foreground focus:outline-none appearance-none pr-2 cursor-pointer max-w-[200px] truncate"
              >
                {workspaces.map(w => (
                  <option key={w.id} value={w.id}>{w.name}</option>
                ))}
              </select>
            </div>
            
            <div className="sm:ml-auto flex items-center gap-2">
              <TeamSearch value={searchQuery} onChange={setSearchQuery} className="w-full sm:w-[250px]" />
              <TeamFilters selectedRole={selectedRole} onRoleChange={setSelectedRole} />
            </div>
          </div>
        )}

        {!workspacesLoading && workspaces.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card p-12 text-center">
            <p className="text-sm text-muted-foreground">You don't belong to any workspaces yet.</p>
          </div>
        ) : isLoading ? (
          <TeamSkeleton />
        ) : filteredMembers.length > 0 ? (
          <div className="grid gap-4">
            {filteredMembers.map((member) => (
              <TeamMemberCard
                key={member.id}
                member={member}
                isAdmin={isAdmin()}
                isCurrentUser={member.user_id === user?.id}
                onRemove={removeMember}
                onUpdateRole={(id, role) => updateRole({ id, role })}
                isProcessing={isRemoving || isUpdating}
              />
            ))}
          </div>
        ) : (
          <EmptyMembers onInvite={() => setIsInviteModalOpen(true)} isAdmin={isAdmin()} />
        )}

        <InviteMemberModal
          isOpen={isInviteModalOpen}
          onClose={() => setIsInviteModalOpen(false)}
          workspaces={workspaces}
          activeWorkspaceId={activeWorkspaceId}
          onSubmit={handleInvite}
          isSubmitting={isInviting}
        />
      </div>
    </ProtectedRoute>
  );
}
