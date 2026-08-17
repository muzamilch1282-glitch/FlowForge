import { supabase } from '@/lib/supabase';
import { AppNotification, CreateNotificationDTO } from '@/types/notification';

export const notificationService = {
  async getNotifications(): Promise<AppNotification[]> {
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError || !userData.user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userData.user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    
    // Default preferences if none set
    const prefs = userData.user.user_metadata?.notification_preferences || {
      task_assigned: true,
      comment_added: true,
      due_date_reminder: true,
      mentions: true,
      activity_summary: true,
    };

    const notifications = data as AppNotification[];
    
    // Filter notifications based on preferences
    return notifications.filter(notif => {
      if (notif.type === 'task_assigned' && prefs.task_assigned === false) return false;
      if (notif.type === 'comment_added' && prefs.comment_added === false) return false;
      if (notif.type === 'due_date_reminder' && prefs.due_date_reminder === false) return false;
      // You can map other types here as well
      return true;
    });
  },

  async createNotification(dto: CreateNotificationDTO): Promise<void> {
    const { error } = await supabase
      .from('notifications')
      .insert(dto);

    if (error) {
      console.error('Supabase raw error:', JSON.stringify(error, null, 2));
      throw new Error(`Supabase Error ${error.code}: ${error.message} - ${error.details || ''}`);
    }
  },

  async markAsRead(notificationId: string): Promise<void> {
    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('id', notificationId);

    if (error) throw error;
  },

  async markAllAsRead(): Promise<void> {
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError || !userData.user) throw new Error('Not authenticated');

    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('user_id', userData.user.id)
      .eq('is_read', false);

    if (error) throw error;
  },

  async deleteNotification(notificationId: string): Promise<void> {
    const { error } = await supabase
      .from('notifications')
      .delete()
      .eq('id', notificationId);

    if (error) throw error;
  }
};
