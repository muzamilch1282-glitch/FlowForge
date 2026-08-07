import { supabase } from '@/lib/supabase';
import { ActivityLog, CreateActivityDTO } from '@/types/activity';

export const activityService = {
  async createActivity(dto: CreateActivityDTO): Promise<void> {
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError || !userData.user) {
      console.warn('Could not create activity log: Not authenticated');
      return;
    }

    const { error } = await supabase
      .from('activity_logs')
      .insert({
        ...dto,
        user_id: userData.user.id
      });

    if (error) {
      console.error('Failed to create activity log', error);
    }
  },

  async getWorkspaceActivity(workspaceId: string): Promise<ActivityLog[]> {
    const { data, error } = await supabase
      .from('activity_logs')
      .select(`
        *,
        profile:profiles(*)
      `)
      .eq('workspace_id', workspaceId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    
    return data.map((log: any) => ({
      ...log,
      profile: Array.isArray(log.profile) ? log.profile[0] : log.profile
    })) as ActivityLog[];
  },

  async getProjectActivity(projectId: string): Promise<ActivityLog[]> {
    const { data, error } = await supabase
      .from('activity_logs')
      .select(`
        *,
        profile:profiles(*)
      `)
      .eq('project_id', projectId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    
    return data.map((log: any) => ({
      ...log,
      profile: Array.isArray(log.profile) ? log.profile[0] : log.profile
    })) as ActivityLog[];
  },

  async getTaskActivity(taskId: string): Promise<ActivityLog[]> {
    const { data, error } = await supabase
      .from('activity_logs')
      .select(`
        *,
        profile:profiles(*)
      `)
      .eq('task_id', taskId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    
    return data.map((log: any) => ({
      ...log,
      profile: Array.isArray(log.profile) ? log.profile[0] : log.profile
    })) as ActivityLog[];
  }
};
