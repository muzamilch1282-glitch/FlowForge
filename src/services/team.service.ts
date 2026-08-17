import { supabase } from '@/lib/supabase';
import { TeamMember, InviteMemberDTO, UpdateMemberRoleDTO, TeamRole } from '@/types/team';
import { notificationService } from './notification.service';

export const teamService = {
  async getMembers(workspaceId: string): Promise<TeamMember[]> {
    const { data: members, error } = await supabase
      .from('team_members')
      .select('*')
      .eq('workspace_id', workspaceId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    if (!members || members.length === 0) return [];

    const userIds = members.map(m => m.user_id);
    const { data: profiles } = await supabase
      .from('profiles')
      .select('*')
      .in('id', userIds);

    return members.map(m => ({
      ...m,
      profile: profiles?.find(p => p.id === m.user_id) || null
    })) as TeamMember[];
  },

  async getAllMembers(): Promise<TeamMember[]> {
    const { data: members, error } = await supabase
      .from('team_members')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    if (!members || members.length === 0) return [];

    const userIds = members.map(m => m.user_id);
    const { data: profiles } = await supabase
      .from('profiles')
      .select('*')
      .in('id', userIds);

    return members.map(m => ({
      ...m,
      profile: profiles?.find(p => p.id === m.user_id) || null
    })) as TeamMember[];
  },

  async getMemberById(id: string): Promise<TeamMember> {
    const { data: member, error } = await supabase
      .from('team_members')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;

    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', member.user_id)
      .single();

    return {
      ...member,
      profile: profile || null
    } as TeamMember;
  },

  async createMember({ email, workspace_id, role }: InviteMemberDTO): Promise<TeamMember> {
    // 1. Check if the user exists in profiles by email
    const { data: user, error: userError } = await supabase
      .from('profiles')
      .select('*')
      .eq('email', email)
      .single();

    if (userError || !user) {
      throw new Error(`No user found with email ${email}. They must sign up first.`);
    }

    // 2. Check if already a member
    const { data: existingMember } = await supabase
      .from('team_members')
      .select('id')
      .eq('workspace_id', workspace_id)
      .eq('user_id', user.id)
      .single();
      
    if (existingMember) {
      throw new Error('User is already a member of this workspace.');
    }

    // 3. Get current user for invited_by
    const { data: { user: currentUser } } = await supabase.auth.getUser();

    // 4. Create the team member record
    const { data: member, error } = await supabase
      .from('team_members')
      .insert([{
        workspace_id,
        user_id: user.id,
        role,
        invited_by: currentUser?.id
      }])
      .select('*')
      .single();

    if (error) throw error;

    // Send a notification to the invited user
    try {
      const workspaceName = (await supabase.from('workspaces').select('name').eq('id', workspace_id).single()).data?.name || 'a workspace';
      await notificationService.createNotification({
        user_id: user.id,
        type: 'member_invited',
        title: 'Workspace Invitation',
        message: `You have been invited to join ${workspaceName} as an ${role}.`
      });
    } catch (notifError) {
      console.error('Failed to create notification for invited member:', notifError);
    }

    return {
      ...member,
      profile: user
    } as TeamMember;
  },

  async updateMemberRole(id: string, role: TeamRole): Promise<TeamMember> {
    const { data: member, error } = await supabase
      .from('team_members')
      .update({ role, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select('*')
      .single();

    if (error) throw error;
    
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', member.user_id)
      .single();

    return {
      ...member,
      profile: profile || null
    } as TeamMember;
  },

  async removeMember(id: string): Promise<void> {
    const { error } = await supabase
      .from('team_members')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
};
