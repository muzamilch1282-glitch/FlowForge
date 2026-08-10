'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { PageHeader, Button } from '@/components/shared';
import { useAuth } from '@/hooks/useAuth';
import { useWorkspace } from '@/hooks/useWorkspace';
import { useTeam } from '@/hooks/useTeam';
import { usePermissions } from '@/hooks/usePermissions';
import { TeamRole } from '@/types/team';
import { ArrowLeft, UserPlus, ShieldAlert } from 'lucide-react';

export default function InviteMemberPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { workspaces, isLoading: workspacesLoading } = useWorkspace();
  const [activeWorkspaceId, setActiveWorkspaceId] = React.useState('');
  
  const [email, setEmail] = React.useState('');
  const [role, setRole] = React.useState<TeamRole>('member');
  const [error, setError] = React.useState('');

  // Auto-select first workspace if none selected
  React.useEffect(() => {
    if (workspaces.length > 0 && !activeWorkspaceId) {
      setActiveWorkspaceId(workspaces[0].id);
    }
  }, [workspaces, activeWorkspaceId]);

  const { inviteMember, isInviting } = useTeam(activeWorkspaceId);
  const { canInviteMember, isLoading: permissionsLoading } = usePermissions(activeWorkspaceId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !activeWorkspaceId) {
      setError('Please fill out all required fields.');
      return;
    }
    
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    setError('');
    inviteMember(
      { email, workspace_id: activeWorkspaceId, role },
      {
        onSuccess: () => {
          router.push('/dashboard/team');
        }
      }
    );
  };

  const isLoading = workspacesLoading || permissionsLoading;

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" size="icon" onClick={() => router.back()} className="rounded-full">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <PageHeader
          title="Invite Member"
          description="Add a new member to your workspace."
        />
      </div>

        <div className="rounded-xl border border-border bg-card shadow-sm p-6">
          {isLoading ? (
            <div className="space-y-4 animate-pulse">
              <div className="h-4 bg-muted rounded w-1/4"></div>
              <div className="h-10 bg-muted rounded w-full"></div>
              <div className="h-4 bg-muted rounded w-1/4"></div>
              <div className="h-10 bg-muted rounded w-full"></div>
            </div>
          ) : workspaces.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-sm text-muted-foreground">You must have a workspace before inviting members.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground" htmlFor="email">
                  Email Address <span className="text-destructive">*</span>
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  placeholder="colleague@example.com"
                />
                <p className="text-xs text-muted-foreground">
                  The user must already have an account with FlowForge.
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground" htmlFor="workspace_id">
                  Workspace <span className="text-destructive">*</span>
                </label>
                <select
                  id="workspace_id"
                  required
                  value={activeWorkspaceId}
                  onChange={e => setActiveWorkspaceId(e.target.value)}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
                >
                  <option value="" disabled>Select a workspace</option>
                  {workspaces.map(w => (
                    <option key={w.id} value={w.id}>{w.name}</option>
                  ))}
                </select>
              </div>

              {!canInviteMember() ? (
                <div className="p-4 bg-muted/50 border border-border rounded-lg flex items-start gap-3">
                  <ShieldAlert className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Permission Denied</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      You must be an administrator of this workspace to invite new members.
                    </p>
                  </div>
                </div>
              ) : (
                <>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground" htmlFor="role">
                      Role
                    </label>
                    <select
                      id="role"
                      value={role}
                      onChange={e => setRole(e.target.value as TeamRole)}
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
                    >
                      <option value="member">Member - Can edit and create items</option>
                      <option value="admin">Admin - Full access including team management</option>
                    </select>
                  </div>

                  {error && (
                    <div className="p-3 bg-destructive/10 border border-destructive/20 text-destructive text-sm rounded-md">
                      {error}
                    </div>
                  )}

                  <div className="flex justify-end gap-3 pt-4 border-t border-border">
                    <Button type="button" variant="outline" onClick={() => router.back()} disabled={isInviting}>
                      Cancel
                    </Button>
                    <Button type="submit" disabled={isInviting} className="gap-2">
                      <UserPlus className="h-4 w-4" />
                      {isInviting ? 'Sending Invite...' : 'Invite Member'}
                    </Button>
                  </div>
                </>
              )}
            </form>
          )}
        </div>
      </div>
  );
}
