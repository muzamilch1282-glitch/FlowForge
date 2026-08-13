import { TaskStatus as Status } from '@/types/task';
import { Badge } from '@/components/shared';

interface TaskStatusBadgeProps {
  status: Status;
  className?: string;
}

export function TaskStatus({ status, className }: TaskStatusBadgeProps) {
  const colors: Record<Status, string> = {
    'backlog': 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
    'todo': 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
    'in-progress': 'bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400',
    'review': 'bg-purple-100 text-purple-700 dark:bg-purple-500/10 dark:text-purple-400',
    'completed': 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400',
  };

  const labels: Record<Status, string> = {
    'backlog': 'Backlog',
    'todo': 'Todo',
    'in-progress': 'In Progress',
    'review': 'Review',
    'completed': 'Completed'
  };

  return (
    <Badge className={`${colors[status]} ${className || ''}`}>
      {labels[status]}
    </Badge>
  );
}
