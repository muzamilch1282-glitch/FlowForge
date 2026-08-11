import * as React from 'react';
import { useTimeTracking, formatDuration } from '@/hooks/useTimeTracking';
import { Button } from '@/components/shared';
import { Play, Square, Clock, Plus, Trash2, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';
import { Task } from '@/types/task';
import { useWorkspace } from '@/hooks/useWorkspace';
import { useAppStore } from '@/store';
import { taskService } from '@/services/task.service';
import { useMutation, useQueryClient } from '@tanstack/react-query';

interface TaskTimeTrackerProps {
  task: Task;
}

export function TaskTimeTracker({ task }: TaskTimeTrackerProps) {
  const { workspaces } = useWorkspace();
  const { activeWorkspaceId } = useAppStore();
  const currentWorkspace = workspaces.find(w => w.id === activeWorkspaceId);
  const queryClient = useQueryClient();
  const { 
    entries, 
    activeTimer, 
    isActiveForThisTask, 
    liveDuration, 
    totalTrackedSeconds, 
    startTimer, 
    stopTimer, 
    deleteEntry,
    isStarting,
    isStopping
  } = useTimeTracking(task.id);

  const [isEditingEstimate, setIsEditingEstimate] = React.useState(false);
  const [estimateInput, setEstimateInput] = React.useState(
    task.estimated_seconds ? Math.round(task.estimated_seconds / 3600).toString() : ''
  );

  const updateTaskMutation = useMutation({
    mutationFn: (estimatedSeconds: number | null) => taskService.updateTask(task.id, { estimated_seconds: estimatedSeconds }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      setIsEditingEstimate(false);
    }
  });

  const handleSaveEstimate = () => {
    const hours = parseFloat(estimateInput);
    if (isNaN(hours) || hours <= 0) {
      updateTaskMutation.mutate(null);
    } else {
      updateTaskMutation.mutate(Math.round(hours * 3600));
    }
  };

  const handleToggleTimer = async () => {
    if (!currentWorkspace) return;
    
    try {
      if (isActiveForThisTask && activeTimer) {
        await stopTimer(activeTimer.id);
      } else {
        await startTimer(currentWorkspace.id);
      }
    } catch (e: any) {
      alert(e.message || 'Failed to toggle timer');
    }
  };

  const estimatedSeconds = task.estimated_seconds || 0;
  const remainingSeconds = Math.max(0, estimatedSeconds - totalTrackedSeconds);
  const progressPercent = estimatedSeconds > 0 
    ? Math.min(100, Math.round((totalTrackedSeconds / estimatedSeconds) * 100)) 
    : 0;

  // Format live digital clock
  const formatDigital = (totalSecs: number) => {
    const h = Math.floor(totalSecs / 3600).toString().padStart(2, '0');
    const m = Math.floor((totalSecs % 3600) / 60).toString().padStart(2, '0');
    const s = (totalSecs % 60).toString().padStart(2, '0');
    return `${h}:${m}:${s}`;
  };

  return (
    <div className="space-y-6">
      
      {/* Active Timer Display */}
      <div className="flex flex-col items-center justify-center p-6 bg-card border border-border rounded-xl shadow-sm relative overflow-hidden">
        {isActiveForThisTask && (
          <div className="absolute inset-0 bg-primary/5 animate-pulse" />
        )}
        
        <h3 className="text-sm font-medium text-muted-foreground mb-2 relative z-10">
          {isActiveForThisTask ? 'Current Session' : 'Total Tracked Time'}
        </h3>
        
        <div className="text-4xl font-mono font-bold tracking-tight mb-6 relative z-10 text-foreground">
          {isActiveForThisTask ? formatDigital(liveDuration) : formatDuration(totalTrackedSeconds)}
        </div>

        <Button 
          onClick={handleToggleTimer}
          disabled={isStarting || isStopping || (!isActiveForThisTask && activeTimer !== null)}
          className={`relative z-10 gap-2 w-full sm:w-auto min-w-[160px] ${
            isActiveForThisTask 
              ? 'bg-rose-500 hover:bg-rose-600 text-white shadow-[0_0_15px_rgba(244,63,94,0.4)]' 
              : 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-[0_0_15px_rgba(16,185,129,0.3)]'
          }`}
        >
          {isActiveForThisTask ? (
            <><Square className="h-4 w-4 fill-current" /> Stop Timer</>
          ) : (
            <><Play className="h-4 w-4 fill-current" /> Start Timer</>
          )}
        </Button>

        {!isActiveForThisTask && activeTimer !== null && (
          <p className="text-xs text-amber-500 mt-3 flex items-center gap-1 relative z-10">
            <AlertCircle className="h-3 w-3" />
            You have an active timer running on another task.
          </p>
        )}
      </div>

      {/* Metrics Bar */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium">Progress</span>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span>Est: {formatDuration(estimatedSeconds)}</span>
            <span>Rem: {formatDuration(remainingSeconds)}</span>
          </div>
        </div>
        
        <div className="h-2.5 w-full bg-secondary rounded-full overflow-hidden">
          <div 
            className={`h-full transition-all duration-500 ${progressPercent > 100 ? 'bg-rose-500' : 'bg-primary'}`}
            style={{ width: `${Math.min(100, progressPercent)}%` }}
          />
        </div>

        {isEditingEstimate ? (
          <div className="flex items-center gap-2 mt-2">
            <input 
              type="number" 
              placeholder="Hours (e.g. 8)"
              className="h-8 w-24 px-2 text-sm border border-input rounded bg-background"
              value={estimateInput}
              onChange={e => setEstimateInput(e.target.value)}
              step="0.5"
            />
            <Button size="sm" onClick={handleSaveEstimate} disabled={updateTaskMutation.isPending}>Save</Button>
            <Button size="sm" variant="ghost" onClick={() => setIsEditingEstimate(false)}>Cancel</Button>
          </div>
        ) : (
          <button 
            onClick={() => setIsEditingEstimate(true)}
            className="text-xs text-primary hover:underline mt-1"
          >
            {task.estimated_seconds ? 'Edit estimate' : '+ Add estimate'}
          </button>
        )}
      </div>

      {/* History */}
      <div className="pt-4 border-t border-border">
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-medium text-sm flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            Time Entries
          </h4>
          <Button variant="ghost" size="sm" className="h-7 text-xs gap-1">
            <Plus className="h-3 w-3" /> Manual Entry
          </Button>
        </div>

        <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
          {entries.length === 0 ? (
            <p className="text-xs text-muted-foreground text-center py-4 italic">No time tracked yet.</p>
          ) : (
            entries.map(entry => (
              <div key={entry.id} className="flex items-center justify-between p-2.5 rounded-lg border border-border bg-card/50 text-sm hover:bg-accent/50 transition-colors group">
                <div className="flex flex-col">
                  <span className="font-medium">
                    {entry.ended_at ? formatDuration(entry.duration_seconds || 0) : 'Currently active...'}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {format(new Date(entry.started_at), 'MMM d, h:mm a')}
                  </span>
                </div>
                {entry.ended_at && (
                  <button 
                    onClick={() => deleteEntry(entry.id)}
                    className="p-1.5 text-muted-foreground hover:text-red-500 rounded-md opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
