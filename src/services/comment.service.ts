import { supabase } from '@/lib/supabase';
import { TaskComment, CreateCommentDTO, UpdateCommentDTO } from '@/types/comment';
import { activityService } from './activity.service';
import { notificationService } from './notification.service';

export const commentService = {
  async getComments(taskId: string): Promise<TaskComment[]> {
    const { data, error } = await supabase
      .from('task_comments')
      .select(`
        *,
        profile:profiles(*)
      `)
      .eq('task_id', taskId)
      .order('created_at', { ascending: true });

    if (error) throw error;
    
    // Transform single profile array/object into the expected UserProfile structure if necessary
    return data.map((comment: any) => ({
      ...comment,
      profile: Array.isArray(comment.profile) ? comment.profile[0] : comment.profile
    })) as TaskComment[];
  },

  async getCommentById(id: string): Promise<TaskComment> {
    const { data, error } = await supabase
      .from('task_comments')
      .select(`
        *,
        profile:profiles(*)
      `)
      .eq('id', id)
      .single();

    if (error) throw error;
    return {
      ...data,
      profile: Array.isArray(data.profile) ? data.profile[0] : data.profile
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
      .select(`
        *,
        profile:profiles(*)
      `)
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
                message: `New comment on task: ${task.title}`,
                entity_type: 'task',
                entity_id: payload.task_id
              });
            }
          }
        }
      } catch (e) {
        console.error('Failed to log activity for comment creation', e);
      }
    })();

    return {
      ...data,
      profile: Array.isArray(data.profile) ? data.profile[0] : data.profile
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
      .select(`
        *,
        profile:profiles(*)
      `)
      .single();

    if (error) throw error;
    return {
      ...data,
      profile: Array.isArray(data.profile) ? data.profile[0] : data.profile
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
