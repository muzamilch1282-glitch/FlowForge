'use client';

import React, { createContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { getSupabaseClient } from '@/lib/supabase';
import { authService } from '@/services/auth.service';
import type { UserProfile } from '@/types/auth';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: UserProfile | null;
  isLoading: boolean;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  profile: null,
  isLoading: true,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const supabase = getSupabaseClient();
    
    const fetchProfileAndSetState = async (currentSession: Session | null) => {
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      
      if (currentSession?.user) {
        const userProfile = await authService.getProfile(currentSession.user.id);
        setProfile(userProfile);
      } else {
        setProfile(null);
      }
      setIsLoading(false);
    };

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      fetchProfileAndSetState(session);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      fetchProfileAndSetState(session);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, session, profile, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}
