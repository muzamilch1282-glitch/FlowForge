import * as React from 'react';
import { Task } from '@/types/task';
import { Project } from '@/types/project';
import { PriorityBadge } from './priority-badge';
import { TaskStatus } from './task-status';
import { OverdueBadge } from './overdue-badge';
import { format, parseISO, isPast, isToday } from 'date-fns';
import { Calendar, AlertCircle } from 'lucide-react';
import Link from 'next/link';

interface UpcomingTasksProps {
  tasks: Task[];
  projects: Project[];
}

export function UpcomingTasks({ tasks, projects }: UpcomingTasksProps) {
  // Sort tasks by nearest due date, exclude completed tasks and tasks without due date
  const upcomingTasks = React.useMemo(() => {
    return tasks
      .filter(t => t.due_date && t.status !== 'completed')
      .sort((a, b) => new Date(a.due_date!).getTime() - new Date(b.due_date!).getTime())
      .slice(0, 5);
  }, [tasks]);

  if (upcomingTasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card/50 p-8 text-center h-full min-h-[250px]">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary/50 mb-4">
          <Calendar className="h-6 w-6 text-muted-foreground" />
        </div>
        <p className="text-sm font-medium text-foreground">No upcoming tasks</p>
        <p className="mt-1 text-xs text-muted-foreground">You're all caught up!</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {upcomingTasks.map(task => {
        const project = projects.find(p => p.id === task.project_id);
        const dueDate = parseISO(task.due_date!);
        const isTaskOverdue = isPast(dueDate) && !isToday(dueDate);
        const isTaskDueToday = isToday(dueDate);

        return (
          <Link 
            key={task.id} 
            href={`/dashboard/tasks/${task.id}`}
            className="group flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-lg border border-border bg-card p-4 transition-all hover:border-primary/50 hover:shadow-sm"
          >
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                  {task.title}
                </h4>
                <OverdueBadge dueDate={task.due_date} status={task.status} className="h-5 text-[10px] px-1.5" />
              </div>
              
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                {project && (
                  <span className="font-medium text-foreground/80">{project.title}</span>
                )}
                {project && <span className="h-1 w-1 rounded-full bg-muted-foreground/30" />}
                
                <span className={`flex items-center gap-1 font-medium ${isTaskOverdue ? 'text-destructive' : isTaskDueToday ? 'text-amber-600 dark:text-amber-500' : ''}`}>
                  {isTaskOverdue ? <AlertCircle className="h-3 w-3" /> : <Calendar className="h-3 w-3" />}
                  {isTaskDueToday ? 'Today' : format(dueDate, 'MMM d, yyyy')}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 mt-2 sm:mt-0">
              <TaskStatus status={task.status} />
              <PriorityBadge priority={task.priority} />
            </div>
          </Link>
        );
      })}
    </div>
  );
}
