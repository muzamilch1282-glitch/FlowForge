import { TaskPriority as Priority } from '@/types/task';
import { Badge } from '@/components/shared';

interface TaskPriorityBadgeProps {
  priority: Priority;
  className?: string;
}

export function TaskPriority({ priority, className }: TaskPriorityBadgeProps) {
  const colors = {
    low: 'bg-slate-100 text-slate-700 dark:bg-slate-500/10 dark:text-slate-400',
    medium: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-400',
    high: 'bg-rose-100 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400',
  };

  return (
    <Badge className={`${colors[priority]} ${className || ''}`}>
      {priority}
    </Badge>
  );
}
