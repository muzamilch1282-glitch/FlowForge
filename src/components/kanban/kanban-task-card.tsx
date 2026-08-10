import * as React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Task } from '@/types/task';
import { Project } from '@/types/project';
import { Calendar, User2 } from 'lucide-react';
import { format, parseISO, isPast, isToday } from 'date-fns';
import { PriorityBadge } from '../task/priority-badge';
import { motion } from 'framer-motion';
import { usePermissions } from '@/hooks/usePermissions';
import { useAuth } from '@/hooks/useAuth';

interface KanbanTaskCardProps {
  task: Task;
  project?: Project;
}

export function KanbanTaskCard({ task, project }: KanbanTaskCardProps) {
  const { isAdmin } = usePermissions();
  const { user } = useAuth();
  
  // Can only drag if Admin or if explicitly assigned to this task
  const canEdit = isAdmin() || task.assigned_to === user?.id;

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ 
    id: task.id,
    disabled: !canEdit,
    data: {
      type: 'Task',
      task,
    }
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const dueDate = task.due_date ? parseISO(task.due_date) : null;
  const overdue = dueDate && isPast(dueDate) && !isToday(dueDate) && task.status !== 'completed';
  const dueToday = dueDate && isToday(dueDate) && task.status !== 'completed';

  if (isDragging) {
    return (
      <div 
        ref={setNodeRef}
        style={style}
        className="h-[120px] rounded-lg border-2 border-primary bg-primary/10 opacity-50"
      />
    );
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -2 }}
    >
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        className={`group flex flex-col rounded-lg border border-border bg-card p-4 shadow-sm transition-colors ${canEdit ? 'cursor-grab active:cursor-grabbing hover:shadow-md hover:border-primary/30' : 'cursor-not-allowed opacity-80'}`}
      >
        <div className="flex items-start justify-between mb-2 gap-2">
          <h4 className="text-sm font-semibold text-foreground line-clamp-2">
            {task.title}
          </h4>
        </div>
        
        {project && (
          <p className="text-xs text-muted-foreground mb-3 line-clamp-1">
            {project.title}
          </p>
        )}
        
        <div className="mt-auto pt-2 flex items-center justify-between">
          <PriorityBadge priority={task.priority} className="text-[10px] px-1.5 py-0.5 h-5" />
          
          <div className="flex items-center gap-2">
            {dueDate && (
              <span className={`text-[10px] font-medium flex items-center
                ${overdue ? 'text-destructive' : 
                  dueToday ? 'text-amber-600 dark:text-amber-500' : 
                  'text-muted-foreground'}`}
              >
                <Calendar className="mr-1 h-3 w-3" />
                {format(dueDate, 'MMM d')}
              </span>
            )}
            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-secondary text-xs text-muted-foreground">
              {task.assigned_to ? <User2 className="h-3 w-3" /> : <User2 className="h-3 w-3 opacity-50" />}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
