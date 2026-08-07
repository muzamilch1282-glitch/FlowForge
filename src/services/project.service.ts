import { Project, CreateProjectDTO, UpdateProjectDTO } from '../types/project';
import { getSupabaseClient } from '../lib/supabase';
import { activityService } from './activity.service';

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

    // Log Activity
    activityService.createActivity({
      workspace_id: project.workspace_id,
      project_id: data.id,
      action: 'created',
      entity_type: 'project',
      entity_name: data.title
    }).catch(console.error);

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

    // Log Activity
    activityService.createActivity({
      workspace_id: data.workspace_id,
      project_id: data.id,
      action: 'updated',
      entity_type: 'project',
      entity_name: data.title
    }).catch(console.error);

    return data;
  },

  async deleteProject(id: string): Promise<void> {
    const supabase = getSupabaseClient();
    
    // Fetch info before delete to log it
    const { data: project } = await supabase.from('projects').select('*').eq('id', id).single();

    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', id);

    if (error) throw new Error(error.message);

    if (project) {
      activityService.createActivity({
        workspace_id: project.workspace_id,
        action: 'deleted',
        entity_type: 'project',
        entity_name: project.title
      }).catch(console.error);
    }
  }
};
