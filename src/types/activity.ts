import { UserProfile } from './auth';
import { EntityType } from './notification';

export type ActivityAction = 'created' | 'updated' | 'deleted' | 'uploaded' | 'assigned' | 'completed' | 'invited' | 'removed';

export interface ActivityLog {
  id: string;
  workspace_id: string;
  project_id?: string;
  task_id?: string;
  user_id: string;
  action: ActivityAction;
  entity_type: EntityType;
  entity_name: string;
  details?: any;
  created_at: string;
  profile?: UserProfile;
}

export interface CreateActivityDTO {
  workspace_id: string;
  project_id?: string;
  task_id?: string;
  action: ActivityAction;
  entity_type: EntityType;
  entity_name: string;
  details?: any;
}
