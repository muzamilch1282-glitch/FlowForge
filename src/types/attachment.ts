import { UserProfile } from './auth';

export interface TaskAttachment {
  id: string;
  task_id: string;
  file_name: string;
  file_url: string;
  file_size: number;
  file_type: string;
  uploaded_by: string;
  created_at: string;
  profile?: UserProfile;
}

export interface UploadResponse {
  attachment: TaskAttachment;
  publicUrl: string;
}
