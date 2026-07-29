import { Task, CreateTaskDTO, UpdateTaskDTO } from '../types/task';
import { getSupabaseClient } from '../lib/supabase';

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
    return data;
  },

  async updateTask(id: string, updates: UpdateTaskDTO): Promise<Task> {
    const supabase = getSupabaseClient();
    
    // Clean undefined values
    const cleanUpdates = Object.fromEntries(
      Object.entries(updates).filter(([_, v]) => v !== undefined)
    );

    const { data, error } = await supabase
      .from('tasks')
      .update(cleanUpdates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  },

  async deleteTask(id: string): Promise<void> {
    const supabase = getSupabaseClient();
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', id);

    if (error) throw new Error(error.message);
  }
};
