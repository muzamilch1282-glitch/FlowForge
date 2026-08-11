'use client';

import { useAppStore } from '@/store';
import { usePermissions } from '@/hooks/usePermissions';
import { teamService } from '@/services/team.service';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Loader2, UserPlus, Trash2 } from 'lucide-react';
import Link from 'next/link';

export function MembersSettings() {
  const activeWorkspaceId = useAppStore((state) => state.activeWorkspaceId);
  const { canInviteMember, canRemoveMember } = usePermissions();
  const queryClient = useQueryClient();

  const { data: members, isLoading } = useQuery({
    queryKey: ['members', activeWorkspaceId],
    queryFn: () => {
      if (!activeWorkspaceId) return [];
      return teamService.getMembers(activeWorkspaceId);
    },
    enabled: !!activeWorkspaceId,
  });

  const updateRoleMutation = useMutation({
    mutationFn: ({ memberId, role }: { memberId: string; role: 'admin' | 'member' }) => {
      return teamService.updateMemberRole(memberId, role);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['members', activeWorkspaceId] });
      toast.success('Role updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update role');
    },
  });

  const removeMemberMutation = useMutation({
    mutationFn: (memberId: string) => {
      return teamService.removeMember(memberId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['members', activeWorkspaceId] });
      toast.success('Member removed successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to remove member');
    },
  });

  if (!activeWorkspaceId) {
    return (
      <div className="p-8 text-center text-muted-foreground">
        Select a workspace to manage members.
      </div>
    );
  }

  const canInvite = canInviteMember();
  const canRemove = canRemoveMember();

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <div>
          <CardTitle>Team Members</CardTitle>
          <CardDescription>
            Manage who has access to this workspace.
          </CardDescription>
        </div>
        {canInvite && (
          <Button asChild size="sm">
            <Link href="/dashboard/team/invite">
              <UserPlus className="mr-2 h-4 w-4" />
              Invite Member
            </Link>
          </Button>
        )}
      </CardHeader>
      <CardContent>
        {!canInvite && (
          <p className="text-sm text-muted-foreground mb-4">
            Only workspace admins can manage members.
          </p>
        )}

        {isLoading ? (
          <div className="flex justify-center p-8">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <div className="space-y-4">
            {members?.map((member) => (
              <div key={member.id} className="flex items-center justify-between p-4 border rounded-lg bg-card">
                <div className="flex items-center space-x-4">
                  <Avatar>
                    <AvatarImage src={member.profile?.avatar_url || ''} />
                    <AvatarFallback>
                      {member.profile?.full_name?.charAt(0) || member.profile?.email?.charAt(0) || '?'}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium leading-none">
                      {member.profile?.full_name || 'Unknown User'}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {member.profile?.email}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Joined {new Date(member.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  {canInvite ? (
                    <Select
                      defaultValue={member.role}
                      disabled={updateRoleMutation.isPending}
                      onValueChange={(value: 'admin' | 'member') => 
                        updateRoleMutation.mutate({ memberId: member.id, role: value })
                      }
                    >
                      <SelectTrigger className="w-[110px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="member">Member</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <Badge variant={member.role === 'admin' ? 'default' : 'secondary'}>
                      {member.role}
                    </Badge>
                  )}

                  {canRemove && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      disabled={removeMemberMutation.isPending}
                      onClick={() => {
                        if (window.confirm('Are you sure you want to remove this member?')) {
                          removeMemberMutation.mutate(member.id);
                        }
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
            
            {members?.length === 0 && (
              <p className="text-center text-sm text-muted-foreground py-4">
                No members found.
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
