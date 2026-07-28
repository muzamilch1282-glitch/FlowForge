import { Project, CreateProjectDTO, UpdateProjectDTO } from '../types/project';
import { getSupabaseClient } from '../lib/supabase';

export const projectService = {
  async getProjects(): Promise<Project[]> {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('updated_at', { ascending: false });

    if (error) throw new Error(error.message);
    return data || [];
  },

  async getProjectsByWorkspace(workspaceId: string): Promise<Project[]> {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('workspace_id', workspaceId)
      .order('updated_at', { ascending: false });

    if (error) throw new Error(error.message);
    return data || [];
  },

  async getProjectById(id: string): Promise<Project> {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw new Error(error.message);
    return data;
  },

  async createProject(project: CreateProjectDTO, userId: string): Promise<Project> {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from('projects')
      .insert({
        ...project,
        owner_id: userId,
      })
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  },

  async updateProject(id: string, updates: UpdateProjectDTO): Promise<Project> {
    const supabase = getSupabaseClient();
    
    // Create an object with only defined values to avoid updating with undefined
    const cleanUpdates = Object.fromEntries(
      Object.entries(updates).filter(([_, v]) => v !== undefined)
    );

    const { data, error } = await supabase
      .from('projects')
      .update(cleanUpdates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  },

  async deleteProject(id: string): Promise<void> {
    const supabase = getSupabaseClient();
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', id);

    if (error) throw new Error(error.message);
  }
};
