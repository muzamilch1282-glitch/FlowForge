'use client';

import * as React from 'react';
import { Task } from '@/types/task';
import { Project } from '@/types/project';
import { format, isPast, isToday, parseISO } from 'date-fns';
import { Clock, Calendar as CalendarIcon, Flame, CheckCircle2, ChevronRight, AlertCircle } from 'lucide-react';
import Link from 'next/link';

interface PriorityInboxProps {
  tasks: Task[];
  projects: Project[];
}

export function PriorityInbox({ tasks, projects }: PriorityInboxProps) {
  
  const overdueTasks = tasks.filter(t => {
    if (t.status === 'completed' || !t.due_date) return false;
    const date = parseISO(t.due_date);
    return isPast(date) && !isToday(date);
  }).sort((a, b) => new Date(a.due_date!).getTime() - new Date(b.due_date!).getTime());

  const todayTasks = tasks.filter(t => {
    if (t.status === 'completed' || !t.due_date) return false;
    return isToday(parseISO(t.due_date));
  }).sort((a, b) => {
    const pOrder: Record<string, number> = { high: 3, medium: 2, low: 1 };
    return pOrder[b.priority] - pOrder[a.priority];
  });

  const highPriorityNoDate = tasks.filter(t => {
    return t.status !== 'completed' && t.priority === 'high' && !t.due_date;
  });

  const allItems = [
    ...overdueTasks.map(t => ({ ...t, _category: 'overdue' })),
    ...todayTasks.map(t => ({ ...t, _category: 'today' })),
    ...highPriorityNoDate.map(t => ({ ...t, _category: 'high' }))
  ].slice(0, 10); // Show top 10 actionable items

  if (allItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center border border-dashed rounded-xl border-border bg-card/50">
        <CheckCircle2 className="h-10 w-10 text-emerald-500 mb-3 opacity-80" />
        <h3 className="font-semibold text-foreground">Inbox Zero!</h3>
        <p className="text-sm text-muted-foreground mt-1">You have no urgent or overdue tasks.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {allItems.map(task => {
        const project = projects.find(p => p.id === task.project_id);
        
        let icon = <Clock className="h-4 w-4" />;
        let iconColor = "text-muted-foreground bg-secondary";
        
        if (task._category === 'overdue') {
          icon = <AlertCircle className="h-4 w-4" />;
          iconColor = "text-red-600 bg-red-100 dark:bg-red-500/20";
        } else if (task._category === 'today') {
          icon = <CalendarIcon className="h-4 w-4" />;
          iconColor = "text-amber-600 bg-amber-100 dark:bg-amber-500/20";
        } else if (task._category === 'high') {
          icon = <Flame className="h-4 w-4" />;
          iconColor = "text-rose-600 bg-rose-100 dark:bg-rose-500/20";
        }

        return (
          <Link 
            key={task.id} 
            href={`/dashboard/tasks/${task.id}`}
            className="flex items-center gap-4 p-3 rounded-xl border border-border/50 bg-card hover:bg-accent/50 hover:border-primary/30 transition-all duration-300 group"
          >
            <div className={`p-2 rounded-lg shrink-0 ${iconColor}`}>
              {icon}
            </div>
            
            <div className="flex-1 min-w-0">
              <h4 className="font-medium text-sm text-foreground truncate group-hover:text-primary transition-colors">
                {task.title}
              </h4>
              <div className="flex items-center gap-2 mt-0.5 text-xs text-muted-foreground truncate">
                {project && (
                  <span className="font-medium truncate max-w-[120px]">{project.title}</span>
                )}
                {project && <span>•</span>}
                {task.due_date ? (
                  <span className={task._category === 'overdue' ? 'text-red-500 font-medium' : ''}>
                    {task._category === 'today' ? 'Due Today' : `Due ${format(parseISO(task.due_date), 'MMM d')}`}
                  </span>
                ) : (
                  <span>High Priority</span>
                )}
              </div>
            </div>
            
            <div className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity translate-x-2 group-hover:translate-x-0 duration-300">
              <ChevronRight className="h-4 w-4 text-primary" />
            </div>
          </Link>
        );
      })}
    </div>
  );
}
