import { TaskPriority as Priority } from '@/types/task';
import { Badge } from '@/components/shared';

interface PriorityBadgeProps {
  priority: Priority;
  className?: string;
}

export function PriorityBadge({ priority, className }: PriorityBadgeProps) {
  const priorityStyles = {
    low: 'bg-stone-100 text-stone-700 dark:bg-stone-500/10 dark:text-stone-400',
    medium: 'bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400',
    high: 'bg-rose-100 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400',
  };

  return (
    <Badge className={`${priorityStyles[priority]} ${className || ''}`}>
      {priority}
    </Badge>
  );
}
