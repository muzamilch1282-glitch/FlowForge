import { getSupabaseClient } from '@/lib/supabase';
import { Workspace, CreateWorkspaceDTO, UpdateWorkspaceDTO } from '@/types/workspace';

export const workspaceService = {
  async getWorkspaces(): Promise<Workspace[]> {
    const supabase = getSupabaseClient();
    const { data: workspaces, error } = await supabase
      .from('workspaces')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw new Error(error.message);
    if (!workspaces || workspaces.length === 0) return [];

    const workspaceIds = workspaces.map((w: any) => w.id);

    // Fetch projects count safely
    const { data: projects } = await supabase
      .from('projects')
      .select('workspace_id')
      .in('workspace_id', workspaceIds);

    // Fetch members count safely
    const { data: members } = await supabase
      .from('team_members')
      .select('workspace_id')
      .in('workspace_id', workspaceIds);

    return workspaces.map((w: any) => {
      const projectCount = projects?.filter((p: any) => p.workspace_id === w.id).length || 0;
      const memberCount = members?.filter((m: any) => m.workspace_id === w.id).length || 0;
      
      // If the workspace has no members explicitly returned by the query, 
      // but it exists, the owner is inherently a member. We should ensure at least 1.
      return {
        ...w,
        project_count: projectCount,
        member_count: Math.max(memberCount, 1)
      } as Workspace;
    });
  },

  async getWorkspaceById(id: string): Promise<Workspace | null> {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from('workspaces')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null; // not found
      throw new Error(error.message);
    }
    return data;
  },

  async createWorkspace(workspace: CreateWorkspaceDTO, userId: string): Promise<Workspace> {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from('workspaces')
      .insert({
        ...workspace,
        owner_id: userId,
      })
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  },

  async updateWorkspace(id: string, updates: UpdateWorkspaceDTO): Promise<Workspace> {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from('workspaces')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  },

  async deleteWorkspace(id: string): Promise<void> {
    const supabase = getSupabaseClient();
    const { error } = await supabase
      .from('workspaces')
      .delete()
      .eq('id', id);

    if (error) throw new Error(error.message);
  }
};
