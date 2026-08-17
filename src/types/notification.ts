export type NotificationType = 'task_assigned' | 'comment_added' | 'due_date_reminder' | 'project_updated' | 'member_invited' | 'system';
export type EntityType = 'workspace' | 'project' | 'task' | 'comment' | 'file' | 'member';

export interface AppNotification {
  id: string;
  user_id: string;
  type: NotificationType;
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

export interface CreateNotificationDTO {
  user_id: string;
  type: NotificationType;
  title: string;
  message: string;
}
