'use client';

import * as React from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { getSupabaseClient } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';
import { RealtimeChannel } from '@supabase/supabase-js';

type ConnectionStatus = 'connecting' | 'connected' | 'disconnected';

interface RealtimeContextType {
  status: ConnectionStatus;
}

export const RealtimeContext = React.createContext<RealtimeContextType>({ status: 'disconnected' });

export function useRealtimeStatus() {
  return React.useContext(RealtimeContext);
}

export function RealtimeProvider({ children }: { children: React.ReactNode }) {
  const [status, setStatus] = React.useState<ConnectionStatus>('disconnected');
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const channelRef = React.useRef<RealtimeChannel | null>(null);

  React.useEffect(() => {
    // Only connect if we have an authenticated user
    if (!user) {
      setStatus('disconnected');
      return;
    }

    const supabase = getSupabaseClient();
    setStatus('connecting');

    // Create a single channel for all workspace-related updates
    const channel = supabase.channel('workspace-sync');
    channelRef.current = channel;

    // Listen to tasks
    channel.on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'tasks' },
      (payload) => {
        // Invalidate tasks query so the UI fetches the latest changes
        queryClient.invalidateQueries({ queryKey: ['tasks'] });
        // Also invalidate individual task if we are viewing it
        if (payload.new && 'id' in payload.new) {
          queryClient.invalidateQueries({ queryKey: ['task', payload.new.id] });
        }
      }
    );

    // Listen to task_comments
    channel.on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'task_comments' },
      (payload) => {
        // We invalidate all comments queries because we don't necessarily know which task is open
        queryClient.invalidateQueries({ queryKey: ['comments'] });
      }
    );

    // Listen to notifications
    channel.on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'notifications' },
      () => {
        queryClient.invalidateQueries({ queryKey: ['notifications'] });
      }
    );

    // Listen to activity_logs
    channel.on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'activity_logs' },
      () => {
        queryClient.invalidateQueries({ queryKey: ['activity'] });
      }
    );

    // Subscribe to the channel
    channel.subscribe((status) => {
      if (status === 'SUBSCRIBED') {
        setStatus('connected');
      } else if (status === 'CLOSED' || status === 'CHANNEL_ERROR') {
        setStatus('disconnected');
      }
    });

    // Cleanup on unmount
    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
      }
    };
  }, [user, queryClient]);

  return (
    <RealtimeContext.Provider value={{ status }}>
      {children}
    </RealtimeContext.Provider>
  );
}
