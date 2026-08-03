import { supabase } from '@/lib/supabase';
import { TeamMember, InviteMemberDTO, UpdateMemberRoleDTO } from '@/types/team';

export const teamService = {
  async getMembers(workspaceId: string): Promise<TeamMember[]> {
    const { data, error } = await supabase
      .from('team_members')
      .select('*, profile:profiles(*)')
      .eq('workspace_id', workspaceId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data as TeamMember[];
  },

  async getMemberById(id: string): Promise<TeamMember> {
    const { data, error } = await supabase
      .from('team_members')
      .select('*, profile:profiles(*)')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data as TeamMember;
  },

  async createMember({ email, workspace_id, role }: InviteMemberDTO): Promise<TeamMember> {
    // 1. Check if the user exists in profiles by email
    const { data: profiles, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('email', email)
      .limit(1);

    if (profileError) throw profileError;

    if (!profiles || profiles.length === 0) {
      throw new Error(`No user found with email ${email}. They must sign up first.`);
    }

    const userProfile = profiles[0];

    // 2. Check if already a member
    const { data: existingMember } = await supabase
      .from('team_members')
      .select('id')
      .eq('workspace_id', workspace_id)
      .eq('user_id', userProfile.id)
      .single();
      
    if (existingMember) {
      throw new Error('User is already a member of this workspace.');
    }

    // 3. Create the team member record
    const { data, error } = await supabase
      .from('team_members')
      .insert([{
        workspace_id,
        user_id: userProfile.id,
        role
      }])
      .select('*, profile:profiles(*)')
      .single();

    if (error) throw error;
    return data as TeamMember;
  },

  async updateMemberRole({ id, role }: UpdateMemberRoleDTO): Promise<TeamMember> {
    const { data, error } = await supabase
      .from('team_members')
      .update({ role, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select('*, profile:profiles(*)')
      .single();

    if (error) throw error;
    return data as TeamMember;
  },

  async removeMember(id: string): Promise<void> {
    const { error } = await supabase
      .from('team_members')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
};
