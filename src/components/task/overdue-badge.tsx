import * as React from 'react';
import { Badge } from '@/components/shared';
import { Clock } from 'lucide-react';
import { isPast, isToday, parseISO } from 'date-fns';
import { TaskStatus } from '@/types/task';

interface OverdueBadgeProps {
  dueDate: string | null;
  status: TaskStatus;
  className?: string;
}

export function OverdueBadge({ dueDate, status, className = '' }: OverdueBadgeProps) {
  if (!dueDate || status === 'completed') return null;

  const parsedDate = parseISO(dueDate);
  const overdue = isPast(parsedDate) && !isToday(parsedDate);

  if (!overdue) return null;

  return (
    <Badge variant="destructive" className={`flex items-center gap-1 ${className}`}>
      <Clock className="h-3 w-3" />
      Overdue
    </Badge>
  );
}
