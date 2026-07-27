import { getSupabaseClient } from '@/lib/supabase';
import { Workspace, CreateWorkspaceDTO, UpdateWorkspaceDTO } from '@/types/workspace';

export const workspaceService = {
  async getWorkspaces(): Promise<Workspace[]> {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from('workspaces')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw new Error(error.message);
    return data || [];
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
