import { supabase } from '@/lib/supabase';
import { ActivityLog, CreateActivityDTO } from '@/types/activity';
import { toast } from 'sonner';

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
      console.error('Supabase raw error for activity_logs:', JSON.stringify(error, null, 2));
      toast.error(`Activity Log Error: ${error.message}`);
      throw new Error(`Supabase Error ${error.code}: ${error.message} - ${error.details || ''}`);
    }
  },

  async getWorkspaceActivity(workspaceId: string): Promise<ActivityLog[]> {
    const { data, error } = await supabase
      .from('activity_logs')
      .select('*')
      .eq('workspace_id', workspaceId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Fetch Activity Error:', error);
      toast.error(`Fetch Activity Error: ${error.message}`);
      throw error;
    }
    
    // Manually join profiles to bypass Supabase schema relation cache issues
    const userIds = [...new Set(data.map((log: any) => log.user_id).filter(Boolean))];
    const { data: profiles } = userIds.length > 0 
      ? await supabase.from('profiles').select('*').in('id', userIds)
      : { data: [] };
    const profileMap = Object.fromEntries((profiles || []).map((p: any) => [p.id, p]));
    
    return data.map((log: any) => ({
      ...log,
      profile: profileMap[log.user_id] || null
    })) as ActivityLog[];
  },

  async getProjectActivity(projectId: string): Promise<ActivityLog[]> {
    const { data, error } = await supabase
      .from('activity_logs')
      .select('*')
      .eq('project_id', projectId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Fetch Activity Error:', error);
      toast.error(`Fetch Activity Error: ${error.message}`);
      throw error;
    }
    
    const userIds = [...new Set(data.map((log: any) => log.user_id).filter(Boolean))];
    const { data: profiles } = userIds.length > 0 
      ? await supabase.from('profiles').select('*').in('id', userIds)
      : { data: [] };
    const profileMap = Object.fromEntries((profiles || []).map((p: any) => [p.id, p]));
    
    return data.map((log: any) => ({
      ...log,
      profile: profileMap[log.user_id] || null
    })) as ActivityLog[];
  },

  async getTaskActivity(taskId: string): Promise<ActivityLog[]> {
    const { data, error } = await supabase
      .from('activity_logs')
      .select('*')
      .eq('task_id', taskId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Fetch Activity Error:', error);
      toast.error(`Fetch Activity Error: ${error.message}`);
      throw error;
    }
    
    const userIds = [...new Set(data.map((log: any) => log.user_id).filter(Boolean))];
    const { data: profiles } = userIds.length > 0 
      ? await supabase.from('profiles').select('*').in('id', userIds)
      : { data: [] };
    const profileMap = Object.fromEntries((profiles || []).map((p: any) => [p.id, p]));
    
    return data.map((log: any) => ({
      ...log,
      profile: profileMap[log.user_id] || null
    })) as ActivityLog[];
  }
};
