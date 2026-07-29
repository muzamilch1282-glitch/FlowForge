import * as React from 'react';
import { Task } from '@/types/task';
import { Project } from '@/types/project';
import { MoreVertical, Calendar, Clock, User2 } from 'lucide-react';
import { TaskStatus } from './task-status';
import { TaskPriority } from './task-priority';
import Link from 'next/link';
import { format, parseISO, isPast, isToday } from 'date-fns';

interface TaskCardProps {
  task: Task;
  project?: Project;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
}

export function TaskCard({ task, project, onEdit, onDelete }: TaskCardProps) {
  const [showDropdown, setShowDropdown] = React.useState(false);

  const toggleDropdown = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowDropdown(!showDropdown);
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowDropdown(false);
    onEdit(task);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowDropdown(false);
    onDelete(task);
  };
  
  const dueDate = task.due_date ? parseISO(task.due_date) : null;
  const overdue = dueDate && isPast(dueDate) && !isToday(dueDate) && task.status !== 'completed';
  const dueToday = dueDate && isToday(dueDate) && task.status !== 'completed';

  return (
    <div className="group relative flex flex-col justify-between rounded-xl border border-border bg-card p-5 shadow-sm transition-all hover:shadow-md hover:border-primary/20">
      <div>
        <div className="mb-3 flex items-start justify-between">
          <div className="flex flex-col gap-1.5">
            <Link 
              href={`/dashboard/tasks/${task.id}`}
              className="text-lg font-semibold tracking-tight text-foreground hover:text-primary transition-colors line-clamp-1"
            >
              {task.title}
            </Link>
            {project && (
              <span className="text-xs font-medium text-muted-foreground flex items-center">
                Project: <Link href={`/dashboard/projects/${project.id}`} className="ml-1 hover:text-primary transition-colors">{project.title}</Link>
              </span>
            )}
          </div>
          
          <div className="relative">
            <button 
              onClick={toggleDropdown}
              className="flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
            >
              <MoreVertical className="h-4 w-4" />
            </button>
            
            {showDropdown && (
              <div className="absolute right-0 top-full z-10 mt-1 w-36 rounded-md border border-border bg-popover py-1 shadow-lg">
                <button 
                  onClick={handleEdit}
                  className="flex w-full items-center px-3 py-1.5 text-sm text-foreground hover:bg-secondary transition-colors"
                >
                  Edit Task
                </button>
                <button 
                  onClick={handleDelete}
                  className="flex w-full items-center px-3 py-1.5 text-sm text-destructive hover:bg-destructive/10 transition-colors"
                >
                  Delete Task
                </button>
              </div>
            )}
          </div>
        </div>

        {task.description && (
          <p className="mb-4 text-sm text-muted-foreground line-clamp-2">
            {task.description}
          </p>
        )}
        
        <div className="flex flex-wrap gap-2 mb-4">
          <TaskStatus status={task.status} />
          <TaskPriority priority={task.priority} />
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
        <div className="flex items-center gap-1.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-secondary text-xs text-muted-foreground">
            {task.assigned_to ? <User2 className="h-3.5 w-3.5" /> : <User2 className="h-3.5 w-3.5 opacity-50" />}
          </div>
        </div>
        
        {dueDate && (
          <div className={`flex items-center gap-1.5 text-xs font-medium px-2 py-1 rounded-md
            ${overdue ? 'bg-destructive/10 text-destructive' : 
              dueToday ? 'bg-amber-500/10 text-amber-600 dark:text-amber-500' : 
              'text-muted-foreground'}`}
          >
            {overdue || dueToday ? <Clock className="h-3.5 w-3.5" /> : <Calendar className="h-3.5 w-3.5" />}
            {format(dueDate, 'MMM d, yyyy')}
            {overdue && ' (Overdue)'}
            {dueToday && ' (Due Today)'}
          </div>
        )}
      </div>
      
      {/* Click outside overlay to close dropdown */}
      {showDropdown && (
        <div 
          className="fixed inset-0 z-0" 
          onClick={() => setShowDropdown(false)}
        />
      )}
    </div>
  );
}
