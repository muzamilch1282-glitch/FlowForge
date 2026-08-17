import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { timeService } from '@/services/time.service';
import { CreateTimeEntryDTO, UpdateTimeEntryDTO } from '@/types/time';

export function useTimeTracking(taskId: string) {
  const queryClient = useQueryClient();
  const [liveDuration, setLiveDuration] = useState<number>(0);

  // Fetch all time entries for this task
  const { data: entries = [], isLoading } = useQuery({
    queryKey: ['time_entries', taskId],
    queryFn: () => timeService.getEntriesByTask(taskId),
    enabled: !!taskId,
  });

  // Fetch the active timer globally for the user
  const { data: activeTimer } = useQuery({
    queryKey: ['active_timer'],
    queryFn: () => timeService.getActiveTimer(),
    refetchInterval: 60000, // Sync every minute just in case
  });

  // Calculate live tick if this task has the active timer
  const isActiveForThisTask = activeTimer?.task_id === taskId;

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (activeTimer && isActiveForThisTask) {
      const startedAt = new Date(activeTimer.started_at).getTime();
      
      const updateDuration = () => {
        const now = Date.now();
        const diffSeconds = Math.max(0, Math.floor((now - startedAt) / 1000));
        setLiveDuration(diffSeconds);
      };

      updateDuration(); // initial calculation
      interval = setInterval(updateDuration, 1000);
    } else {
      setLiveDuration(0);
    }

    return () => clearInterval(interval);
  }, [activeTimer, isActiveForThisTask]);

  const startMutation = useMutation({
    mutationFn: (workspaceId: string) => timeService.startTimer(taskId, workspaceId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['active_timer'] });
      queryClient.invalidateQueries({ queryKey: ['time_entries', taskId] });
      queryClient.invalidateQueries({ queryKey: ['project_time_entries'] });
    },
  });

  const stopMutation = useMutation({
    mutationFn: (id: string) => timeService.stopTimer(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['active_timer'] });
      queryClient.invalidateQueries({ queryKey: ['time_entries', taskId] });
      queryClient.invalidateQueries({ queryKey: ['project_time_entries'] });
    },
  });

  const addManualMutation = useMutation({
    mutationFn: (entry: CreateTimeEntryDTO) => timeService.addManualEntry(entry),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['time_entries', taskId] });
      queryClient.invalidateQueries({ queryKey: ['project_time_entries'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => timeService.deleteEntry(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['time_entries', taskId] });
      queryClient.invalidateQueries({ queryKey: ['project_time_entries'] });
    },
  });

  // Compute total duration
  const totalTrackedSeconds = entries.reduce((acc, entry) => {
    return acc + (entry.duration_seconds || 0);
  }, 0) + (isActiveForThisTask ? liveDuration : 0);

  return {
    entries,
    isLoading,
    activeTimer,
    isActiveForThisTask,
    liveDuration,
    totalTrackedSeconds,
    startTimer: startMutation.mutateAsync,
    stopTimer: stopMutation.mutateAsync,
    addManualEntry: addManualMutation.mutateAsync,
    deleteEntry: deleteMutation.mutateAsync,
    isStarting: startMutation.isPending,
    isStopping: stopMutation.isPending,
  };
}

export function formatDuration(totalSeconds: number): string {
  if (!totalSeconds || totalSeconds < 0) return '0h 0m';
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  if (minutes > 0) {
    return `${minutes}m ${seconds}s`;
  }
  return `${seconds}s`;
}
