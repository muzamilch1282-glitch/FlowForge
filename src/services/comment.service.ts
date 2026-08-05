import { supabase } from '@/lib/supabase';
import { TaskComment, CreateCommentDTO, UpdateCommentDTO } from '@/types/comment';

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
