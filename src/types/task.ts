export type TaskStatus = 'backlog' | 'todo' | 'in-progress' | 'review' | 'completed';
export type TaskPriority = 'low' | 'medium' | 'high';

export interface Task {
  id: string;
  project_id: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  assigned_to: string | null;
  start_date: string | null;
  due_date: string | null;
  estimated_seconds: number | null;
  created_at: string;
  updated_at: string;
}

export interface CreateTaskDTO {
  project_id: string;
  title: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  assigned_to?: string;
  start_date?: string;
  due_date?: string;
  estimated_seconds?: number;
}

export interface UpdateTaskDTO {
  project_id?: string;
  title?: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  assigned_to?: string | null;
  start_date?: string | null;
  due_date?: string | null;
  estimated_seconds?: number | null;
}

export interface TaskDependency {
  id: string;
  task_id: string;
  depends_on_task_id: string;
  created_at: string;
  // Included when joining with tasks table
  depends_on_task?: Task;
  dependent_task?: Task;
}
