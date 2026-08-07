import { Task, CreateTaskDTO, UpdateTaskDTO } from '../types/task';
import { getSupabaseClient } from '../lib/supabase';
import { activityService } from './activity.service';
import { notificationService } from './notification.service';

export const taskService = {
  async getTasks(): Promise<Task[]> {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .order('updated_at', { ascending: false });

    if (error) throw new Error(error.message);
    return data || [];
  },

  async getTasksByProject(projectId: string): Promise<Task[]> {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('project_id', projectId)
      .order('updated_at', { ascending: false });

    if (error) throw new Error(error.message);
    return data || [];
  },

  async getTaskById(id: string): Promise<Task> {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw new Error(error.message);
    return data;
  },

  async createTask(task: CreateTaskDTO): Promise<Task> {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from('tasks')
      .insert(task)
      .select()
      .single();

    if (error) throw new Error(error.message);
    
    // Log activity asynchronously
    (async () => {
      try {
        const { data: project } = await supabase.from('projects').select('workspace_id').eq('id', task.project_id).single();
        if (project) {
          await activityService.createActivity({
            workspace_id: project.workspace_id,
            project_id: task.project_id,
            task_id: data.id,
            action: 'created',
            entity_type: 'task',
            entity_name: data.title
          });

          if (task.assigned_to) {
            await notificationService.createNotification({
              user_id: task.assigned_to,
              type: 'task_assigned',
              title: 'Task Assigned',
              message: `You were assigned to task: ${data.title}`,
              entity_type: 'task',
              entity_id: data.id
            });
          }
        }
      } catch (e) {
        console.error('Failed to log activity for task creation', e);
      }
    })();

    return data;
  },

  async updateTask(id: string, updates: UpdateTaskDTO): Promise<Task> {
    const supabase = getSupabaseClient();
    
    // Clean undefined values
    const cleanUpdates = Object.fromEntries(
      Object.entries(updates).filter(([_, v]) => v !== undefined)
    );

    const { data: previousTask } = await supabase.from('tasks').select('*').eq('id', id).single();

    const { data, error } = await supabase
      .from('tasks')
      .update(cleanUpdates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw new Error(error.message);

    // Log activity
    (async () => {
      try {
        const { data: project } = await supabase.from('projects').select('workspace_id').eq('id', data.project_id).single();
        if (project) {
          if (updates.status === 'completed' && previousTask?.status !== 'completed') {
            await activityService.createActivity({
              workspace_id: project.workspace_id,
              project_id: data.project_id,
              task_id: data.id,
              action: 'completed',
              entity_type: 'task',
              entity_name: data.title
            });
          } else {
            await activityService.createActivity({
              workspace_id: project.workspace_id,
              project_id: data.project_id,
              task_id: data.id,
              action: 'updated',
              entity_type: 'task',
              entity_name: data.title
            });
          }

          // If assignee changed
          if (updates.assigned_to && updates.assigned_to !== previousTask?.assigned_to) {
            await notificationService.createNotification({
              user_id: updates.assigned_to,
              type: 'task_assigned',
              title: 'Task Assigned',
              message: `You were assigned to task: ${data.title}`,
              entity_type: 'task',
              entity_id: data.id
            });
          }
        }
      } catch (e) {
        console.error('Failed to log activity for task update', e);
      }
    })();

    return data;
  },

  async deleteTask(id: string): Promise<void> {
    const supabase = getSupabaseClient();
    
    // Fetch info before delete to log it
    const { data: task } = await supabase.from('tasks').select('*').eq('id', id).single();
    let workspaceId: string | null = null;
    
    if (task) {
      const { data: project } = await supabase.from('projects').select('workspace_id').eq('id', task.project_id).single();
      if (project) workspaceId = project.workspace_id;
    }

    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', id);

    if (error) throw new Error(error.message);

    if (workspaceId && task) {
      activityService.createActivity({
        workspace_id: workspaceId,
        project_id: task.project_id,
        action: 'deleted',
        entity_type: 'task',
        entity_name: task.title
      }).catch(console.error);
    }
  }
};
