import { User, Session } from '@supabase/supabase-js';
import { getSupabaseClient } from '../lib/supabase';

export const authService = {
  /**
   * Get the current active user
   * @returns User object or null
   */
  getCurrentUser: async (): Promise<User | null> => {
    const supabase = getSupabaseClient();
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error) {
      console.error('Error fetching user:', error.message);
      return null;
    }
    
    return user;
  },

  /**
   * Get the current active session
   * @returns Session object or null
   */
  getSession: async (): Promise<Session | null> => {
    const supabase = getSupabaseClient();
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error('Error fetching session:', error.message);
      return null;
    }
    
    return session;
  },

  /**
   * Register a new user with email and password, and create a profile
   */
  registerWithEmail: async (email: string, password: string, fullName: string) => {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });

    if (error) {
      throw error;
    }

    // Profile creation is now handled securely by a Postgres Trigger in the database
    // to bypass RLS issues when a user signs up but isn't fully authenticated yet.

    return data;
  },

  /**
   * Login with email and password, and update last login
   */
  loginWithEmail: async (email: string, password: string) => {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      throw error;
    }

    if (data.user) {
      // Update last login timestamp
      await supabase.from('profiles').update({ updated_at: new Date().toISOString() }).eq('id', data.user.id);
    }

    return data;
  },

  /**
   * Get the current user's profile
   */
  getProfile: async (userId: string) => {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).single();
    
    if (error) {
      console.error('Error fetching profile:', error.message);
      return null;
    }
    
    return data;
  },

  /**
   * Update the current user's profile
   */
  updateProfile: async (userId: string, data: { full_name?: string; avatar_url?: string }) => {
    const supabase = getSupabaseClient();
    const { data: updatedData, error } = await supabase
      .from('profiles')
      .update(data)
      .eq('id', userId)
      .select()
      .single();
    
    if (error) {
      throw error;
    }
    
    return updatedData;
  },

  /**
   * Update user password
   */
  updatePassword: async (newPassword: string) => {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase.auth.updateUser({
      password: newPassword
    });

    if (error) {
      throw error;
    }

    return data;
  },

  /**
   * Send a password reset email
   */
  resetPasswordForEmail: async (email: string) => {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/update-password`,
    });

    if (error) {
      throw error;
    }

    return data;
  },

  /**
   * Logout current user
   */
  logout: async () => {
    const supabase = getSupabaseClient();
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      throw error;
    }
  },

  /**
   * Update Notification Preferences in user_metadata
   */
  updateNotificationPreferences: async (preferences: any) => {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase.auth.updateUser({
      data: { notification_preferences: preferences }
    });

    if (error) throw error;
    return data;
  }
};
