export interface Workspace {
  id: string;
  name: string;
  description: string | null;
  owner_id: string;
  color: string;
  icon: string;
  created_at: string;
  updated_at: string;
}

export interface CreateWorkspaceDTO {
  name: string;
  description?: string;
  color?: string;
  icon?: string;
}

export interface UpdateWorkspaceDTO {
  name?: string;
  description?: string;
  color?: string;
  icon?: string;
}
