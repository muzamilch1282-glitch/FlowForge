import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Play, Square } from 'lucide-react';
import { timeService } from '@/services/time.service';
import { TimeEntry } from '@/types/time';
import { toast } from 'sonner';

interface TaskTimerProps {
  taskId: string;
  workspaceId: string;
}

export function TaskTimer({ taskId, workspaceId }: TaskTimerProps) {
  const [activeTimer, setActiveTimer] = React.useState<TimeEntry | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [elapsed, setElapsed] = React.useState(0);

  const fetchActiveTimer = React.useCallback(async () => {
    try {
      setIsLoading(true);
      const timer = await timeService.getActiveTimer();
      if (timer && timer.task_id === taskId) {
        setActiveTimer(timer);
      } else {
        setActiveTimer(null);
      }
    } catch (err: any) {
      console.error('Timer fetch error:', err?.message || JSON.stringify(err));
    } finally {
      setIsLoading(false);
    }
  }, [taskId]);

  React.useEffect(() => {
    fetchActiveTimer();
  }, [fetchActiveTimer]);

  React.useEffect(() => {
    let interval: NodeJS.Timeout;
    if (activeTimer) {
      const start = new Date(activeTimer.started_at).getTime();
      interval = setInterval(() => {
        setElapsed(Math.floor((Date.now() - start) / 1000));
      }, 1000);
    } else {
      setElapsed(0);
    }
    return () => clearInterval(interval);
  }, [activeTimer]);

  const handleStartTimer = async () => {
    try {
      setIsLoading(true);
      const newTimer = await timeService.startTimer(taskId, workspaceId);
      setActiveTimer(newTimer);
      toast.success('Timer started');
    } catch (err: any) {
      toast.error(err.message || 'Failed to start timer');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStopTimer = async () => {
    if (!activeTimer) return;
    try {
      setIsLoading(true);
      await timeService.stopTimer(activeTimer.id);
      setActiveTimer(null);
      toast.success('Timer stopped');
    } catch (err: any) {
      toast.error(err.message || 'Failed to stop timer');
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  if (isLoading && !activeTimer) {
    return <div className="text-xs text-muted-foreground">Loading timer...</div>;
  }

  return (
    <div className="flex items-center gap-2">
      <span className="font-mono text-sm tabular-nums text-foreground">
        {formatTime(elapsed)}
      </span>
      {activeTimer ? (
        <Button size="sm" variant="destructive" className="h-6 w-6 p-0 rounded-full" onClick={handleStopTimer} disabled={isLoading}>
          <Square className="h-3 w-3 fill-current" />
        </Button>
      ) : (
        <Button size="sm" variant="outline" className="h-6 w-6 p-0 rounded-full bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 hover:text-emerald-700 border-emerald-500/20" onClick={handleStartTimer} disabled={isLoading}>
          <Play className="h-3 w-3 fill-current" />
        </Button>
      )}
    </div>
  );
}
