import { UserProfile } from './auth';

export interface TaskComment {
  id: string;
  task_id: string;
  user_id: string;
  comment: string;
  created_at: string;
  updated_at: string;
  profile?: UserProfile;
}

export interface CreateCommentDTO {
  task_id: string;
  comment: string;
}

export interface UpdateCommentDTO {
  id: string;
  comment: string;
}
