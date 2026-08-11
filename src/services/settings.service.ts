import { getSupabaseClient } from '@/lib/supabase';

export interface NotificationPreferences {
  id?: string;
  user_id: string;
  task_assigned: boolean;
  task_comments: boolean;
  task_due_date: boolean;
  task_completed: boolean;
  project_updates: boolean;
  workspace_activity: boolean;
  automation_notifications: boolean;
  ai_notifications: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface UpdateProfileDTO {
  full_name?: string;
  avatar_url?: string | null;
}

const DEFAULT_NOTIFICATION_PREFS: Omit<NotificationPreferences, 'id' | 'user_id' | 'created_at' | 'updated_at'> = {
  task_assigned: true,
  task_comments: true,
  task_due_date: true,
  task_completed: true,
  project_updates: true,
  workspace_activity: true,
  automation_notifications: true,
  ai_notifications: true,
};

export const settingsService = {
  // ─── Profile ───────────────────────────────────────────────
  async getProfile(userId: string) {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) throw new Error(error.message);
    return data;
  },

  async updateProfile(userId: string, updates: UpdateProfileDTO) {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from('profiles')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', userId)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  },

  // ─── Password ──────────────────────────────────────────────
  async changePassword(newPassword: string) {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) throw new Error(error.message);
    return data;
  },

  // ─── Notification Preferences ──────────────────────────────
  async getNotificationPreferences(userId: string): Promise<NotificationPreferences> {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from('notification_preferences')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error && error.code === 'PGRST116') {
      // No preferences found, return defaults
      return { user_id: userId, ...DEFAULT_NOTIFICATION_PREFS };
    }
    if (error) throw new Error(error.message);
    return data as NotificationPreferences;
  },

  async updateNotificationPreferences(
    userId: string,
    prefs: Partial<Omit<NotificationPreferences, 'id' | 'user_id' | 'created_at' | 'updated_at'>>
  ): Promise<NotificationPreferences> {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from('notification_preferences')
      .upsert(
        {
          user_id: userId,
          ...prefs,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'user_id' }
      )
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data as NotificationPreferences;
  },

  // ─── Sign Out ──────────────────────────────────────────────
  async signOut() {
    const supabase = getSupabaseClient();
    const { error } = await supabase.auth.signOut();
    if (error) throw new Error(error.message);
  },

  async signOutEverywhere() {
    const supabase = getSupabaseClient();
    const { error } = await supabase.auth.signOut({ scope: 'global' });
    if (error) throw new Error(error.message);
  },
};
