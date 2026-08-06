import { supabase } from '@/lib/supabase';
import { TaskAttachment, UploadResponse } from '@/types/attachment';

export const attachmentService = {
  async getAttachments(taskId: string): Promise<TaskAttachment[]> {
    const { data, error } = await supabase
      .from('task_attachments')
      .select(`
        *,
        profile:profiles(*)
      `)
      .eq('task_id', taskId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    
    return data.map((attachment: any) => ({
      ...attachment,
      profile: Array.isArray(attachment.profile) ? attachment.profile[0] : attachment.profile
    })) as TaskAttachment[];
  },

  async uploadFile(taskId: string, file: File): Promise<UploadResponse> {
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError || !userData.user) throw new Error('Not authenticated');

    // Create a unique file path: taskId/timestamp-filename
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
    const filePath = `${taskId}/${fileName}`;

    // Upload to Storage
    const { error: uploadError } = await supabase.storage
      .from('task-files')
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    // Save metadata to database
    const { data: attachmentData, error: dbError } = await supabase
      .from('task_attachments')
      .insert({
        task_id: taskId,
        file_name: file.name,
        file_url: filePath,
        file_size: file.size,
        file_type: file.type || 'application/octet-stream',
        uploaded_by: userData.user.id
      })
      .select(`
        *,
        profile:profiles(*)
      `)
      .single();

    if (dbError) throw dbError;

    const attachment = {
      ...attachmentData,
      profile: Array.isArray(attachmentData.profile) ? attachmentData.profile[0] : attachmentData.profile
    } as TaskAttachment;

    const publicUrl = this.getPublicUrl(attachment.file_url);

    return { attachment, publicUrl };
  },

  async deleteAttachment(attachment: TaskAttachment): Promise<void> {
    // Delete from database first (RLS applies)
    const { error: dbError } = await supabase
      .from('task_attachments')
      .delete()
      .eq('id', attachment.id);

    if (dbError) throw dbError;

    // Delete from storage
    const { error: storageError } = await supabase.storage
      .from('task-files')
      .remove([attachment.file_url]);

    if (storageError) {
      console.error('Failed to delete file from storage', storageError);
      // We don't throw here to ensure the UI updates, the DB record is already gone.
    }
  },

  getPublicUrl(filePath: string): string {
    const { data } = supabase.storage
      .from('task-files')
      .getPublicUrl(filePath);
      
    return data.publicUrl;
  },
  
  async downloadAttachment(attachment: TaskAttachment): Promise<void> {
    const { data, error } = await supabase.storage
      .from('task-files')
      .download(attachment.file_url);
      
    if (error) throw error;
    
    // Create a download link
    const url = URL.createObjectURL(data);
    const link = document.createElement('a');
    link.href = url;
    link.download = attachment.file_name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
};
