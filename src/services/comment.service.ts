import { supabase } from '@/lib/supabase';
import { TaskComment, CreateCommentDTO, UpdateCommentDTO } from '@/types/comment';
import { activityService } from './activity.service';
import { notificationService } from './notification.service';

export const commentService = {
  async getComments(taskId: string): Promise<TaskComment[]> {
    const { data, error } = await supabase
      .from('task_comments')
      .select('*')
      .eq('task_id', taskId)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Supabase raw error (getComments):', JSON.stringify(error, null, 2));
      throw new Error(`Supabase Error ${error.code}: ${error.message} - ${error.details || ''}`);
    }
    
    // Manually fetch profiles to bypass relation cache issues
    const userIds = [...new Set(data.map((c: any) => c.user_id).filter(Boolean))];
    const { data: profiles } = userIds.length > 0 
      ? await supabase.from('profiles').select('*').in('id', userIds)
      : { data: [] };
    const profileMap = Object.fromEntries((profiles || []).map((p: any) => [p.id, p]));
    
    return data.map((comment: any) => ({
      ...comment,
      profile: profileMap[comment.user_id] || null
    })) as TaskComment[];
  },

  async getCommentById(id: string): Promise<TaskComment> {
    const { data, error } = await supabase
      .from('task_comments')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;

    // Manually fetch profile to avoid relation cache issues
    const { data: profile } = await supabase.from('profiles').select('*').eq('id', data.user_id).single();

    return {
      ...data,
      profile: profile || null
    } as TaskComment;
  },

  async createComment(payload: CreateCommentDTO): Promise<TaskComment> {
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError || !userData.user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('task_comments')
      .insert({
        task_id: payload.task_id,
        user_id: userData.user.id,
        comment: payload.comment
      })
      .select('*')
      .single();

    if (error) throw error;

    // Log activity and notify
    (async () => {
      try {
        const { data: task } = await supabase.from('tasks').select('title, project_id, assigned_to').eq('id', payload.task_id).single();
        if (task) {
          const { data: project } = await supabase.from('projects').select('workspace_id').eq('id', task.project_id).single();
          if (project) {
            await activityService.createActivity({
              workspace_id: project.workspace_id,
              project_id: task.project_id,
              task_id: payload.task_id,
              action: 'created',
              entity_type: 'comment',
              entity_name: `on task "${task.title}"`
            });

            // Notify assignee if it's not the comment author
            if (task.assigned_to && task.assigned_to !== userData.user.id) {
              await notificationService.createNotification({
                user_id: task.assigned_to,
                type: 'comment_added',
                title: 'New Comment',
                message: `New comment on task: ${task.title}`
              });
            }
          }
        }
      } catch (e) {
        console.error('Failed to log activity for comment creation', e);
      }
    })();

    // Manually fetch profile
    const { data: profile } = await supabase.from('profiles').select('*').eq('id', data.user_id).single();

    return {
      ...data,
      profile: profile || null
    } as TaskComment;
  },

  async updateComment(payload: UpdateCommentDTO): Promise<TaskComment> {
    const { data, error } = await supabase
      .from('task_comments')
      .update({
        comment: payload.comment,
        updated_at: new Date().toISOString()
      })
      .eq('id', payload.id)
      .select('*')
      .single();

    if (error) throw error;
    // Manually fetch profile
    const { data: profile } = await supabase.from('profiles').select('*').eq('id', data.user_id).single();

    return {
      ...data,
      profile: profile || null
    } as TaskComment;
  },

  async deleteComment(id: string): Promise<void> {
    const { error } = await supabase
      .from('task_comments')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
};
