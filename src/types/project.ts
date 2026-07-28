export type ProjectStatus = 'active' | 'on-hold' | 'completed';
export type ProjectPriority = 'low' | 'medium' | 'high';

export interface Project {
  id: string;
  workspace_id: string;
  owner_id: string;
  title: string;
  description: string | null;
  status: ProjectStatus;
  priority: ProjectPriority;
  start_date: string | null;
  end_date: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateProjectDTO {
  workspace_id: string;
  title: string;
  description?: string;
  status?: ProjectStatus;
  priority?: ProjectPriority;
  start_date?: string;
  end_date?: string;
}

export interface UpdateProjectDTO {
  workspace_id?: string;
  title?: string;
  description?: string;
  status?: ProjectStatus;
  priority?: ProjectPriority;
  start_date?: string | null;
  end_date?: string | null;
}
