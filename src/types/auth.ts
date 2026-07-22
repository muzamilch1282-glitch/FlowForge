import { User, Session } from '@supabase/supabase-js';

export interface AuthUser {
  id: string;
  email?: string;
  user_metadata: Record<string, any>;
  app_metadata: Record<string, any>;
}

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  avatar_url?: string;
  role: string;
  created_at: string;
  updated_at: string;
}

export interface AuthState {
  user: User | null;
  session: Session | null;
  profile: UserProfile | null;
  isLoading: boolean;
  error: Error | null;
}
