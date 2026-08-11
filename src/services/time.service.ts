import { supabase } from '@/lib/supabase';
import { TimeEntry, CreateTimeEntryDTO, UpdateTimeEntryDTO } from '@/types/time';

export const timeService = {
  // Get all time entries for a specific task
  async getEntriesByTask(taskId: string): Promise<TimeEntry[]> {
    const { data, error } = await supabase
      .from('time_entries')
      .select('*')
      .eq('task_id', taskId)
      .order('started_at', { ascending: false });

    if (error) throw error;
    return data as TimeEntry[];
  },

  // Get the current user's active timer across the whole workspace (if any)
  async getActiveTimer(): Promise<TimeEntry | null> {
    const { data: session } = await supabase.auth.getSession();
    if (!session?.session?.user) return null;

    const { data, error } = await supabase
      .from('time_entries')
      .select('*')
      .eq('user_id', session.session.user.id)
      .is('ended_at', null)
      .maybeSingle();

    if (error && error.code !== 'PGRST116') throw error; // PGRST116 is "multiple rows", which shouldn't happen due to unique index, but if no row it might error depending on how we call. maybeSingle handles no row well.
    return data as TimeEntry | null;
  },

  // Start a new timer for a task
  async startTimer(taskId: string, workspaceId: string): Promise<TimeEntry> {
    const { data: session } = await supabase.auth.getSession();
    if (!session?.session?.user) throw new Error('User not authenticated');

    // Make sure we don't already have an active timer
    const active = await this.getActiveTimer();
    if (active) {
      throw new Error('You already have an active timer. Please stop it first.');
    }

    const { data, error } = await supabase
      .from('time_entries')
      .insert({
        task_id: taskId,
        workspace_id: workspaceId,
        user_id: session.session.user.id,
        started_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) throw error;
    return data as TimeEntry;
  },

  // Stop the current active timer
  async stopTimer(id: string): Promise<TimeEntry> {
    const { data: current } = await supabase
      .from('time_entries')
      .select('started_at')
      .eq('id', id)
      .single();

    if (!current) throw new Error('Timer not found');

    const startedAt = new Date(current.started_at);
    const endedAt = new Date();
    const durationSeconds = Math.max(0, Math.floor((endedAt.getTime() - startedAt.getTime()) / 1000));

    const { data, error } = await supabase
      .from('time_entries')
      .update({
        ended_at: endedAt.toISOString(),
        duration_seconds: durationSeconds
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data as TimeEntry;
  },

  // Manually add a time entry
  async addManualEntry(entry: CreateTimeEntryDTO): Promise<TimeEntry> {
    const { data: session } = await supabase.auth.getSession();
    if (!session?.session?.user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('time_entries')
      .insert({
        ...entry,
        user_id: session.session.user.id,
      })
      .select()
      .single();

    if (error) throw error;
    return data as TimeEntry;
  },

  // Update a manual entry (e.g. adjust duration)
  async updateEntry(updates: UpdateTimeEntryDTO): Promise<TimeEntry> {
    const { id, ...rest } = updates;
    const { data, error } = await supabase
      .from('time_entries')
      .update(rest)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data as TimeEntry;
  },

  // Delete an entry
  async deleteEntry(id: string): Promise<void> {
    const { error } = await supabase
      .from('time_entries')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
};
