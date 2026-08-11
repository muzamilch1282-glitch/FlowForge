export interface TimeEntry {
  id: string;
  task_id: string;
  user_id: string;
  workspace_id: string;
  started_at: string;
  ended_at: string | null;
  duration_seconds: number | null;
  description: string | null;
  created_at: string;
  updated_at: string;
}

export type CreateTimeEntryDTO = {
  task_id: string;
  workspace_id: string;
  description?: string;
  started_at?: string; // If manual
  ended_at?: string; // If manual
  duration_seconds?: number; // If manual
};

export type UpdateTimeEntryDTO = {
  id: string;
  ended_at?: string | null;
  duration_seconds?: number;
  description?: string;
};
