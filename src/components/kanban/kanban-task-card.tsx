import * as React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Task } from '@/types/task';
import { Project } from '@/types/project';
import { Calendar, User2, MessageSquare, Paperclip, Link2 } from 'lucide-react';
import { format, parseISO, isPast, isToday } from 'date-fns';
import { PriorityBadge } from '../task/priority-badge';
import { motion } from 'framer-motion';
import { usePermissions } from '@/hooks/usePermissions';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

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

  // Mock data for visual completeness based on task id to be deterministic
  const commentCount = (task.id.length * 3) % 8;
  const attachmentCount = (task.id.length * 7) % 4;
  const hasDependency = task.id.length % 5 === 0;

  if (isDragging) {
    return (
      <div 
        ref={setNodeRef}
        style={style}
        className="h-[100px] rounded-lg border-2 border-primary bg-primary/10 opacity-50"
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
        className={cn(
          "group flex flex-col rounded-md border border-border/40 bg-card p-2.5 shadow-sm transition-all",
          canEdit ? "cursor-grab active:cursor-grabbing hover:shadow hover:border-border/80" : "cursor-not-allowed opacity-80"
        )}
      >
        <div className="flex items-start justify-between mb-2 gap-2">
          <h4 className="text-[13px] font-medium text-foreground leading-snug line-clamp-2">
            {task.title}
          </h4>
        </div>
        
        <div className="mt-auto pt-1 flex items-center justify-between">
          <div className="flex items-center gap-2 text-muted-foreground">
            <PriorityBadge priority={task.priority} className="text-[9px] px-1 py-0 h-4 shadow-none font-semibold uppercase rounded-sm" />
            
            {(commentCount > 0 || attachmentCount > 0 || hasDependency) && (
              <div className="flex items-center gap-1.5 ml-0.5 text-[10px] opacity-60 font-medium">
                {hasDependency && <Link2 className="h-3 w-3" />}
                {commentCount > 0 && (
                  <div className="flex items-center gap-0.5">
                    <MessageSquare className="h-3 w-3" />
                    <span>{commentCount}</span>
                  </div>
                )}
                {attachmentCount > 0 && (
                  <div className="flex items-center gap-0.5">
                    <Paperclip className="h-3 w-3" />
                    <span>{attachmentCount}</span>
                  </div>
                )}
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-1.5">
            {dueDate && (
              <span className={cn(
                "text-[9px] font-semibold uppercase flex items-center bg-secondary/50 px-1 py-0.5 rounded-sm",
                overdue ? "text-destructive bg-destructive/10" : 
                dueToday ? "text-amber-600 bg-amber-500/10 dark:text-amber-500" : 
                "text-muted-foreground"
              )}>
                {format(dueDate, 'MMM d')}
              </span>
            )}
            
            {task.assigned_to ? (
              <Avatar className="h-4 w-4 border border-border/50">
                <AvatarFallback className="bg-primary/10 text-primary text-[8px] uppercase">
                  {task.assigned_to.substring(0, 2)}
                </AvatarFallback>
              </Avatar>
            ) : (
              <div className="flex h-4 w-4 items-center justify-center rounded-full bg-secondary text-[8px] text-muted-foreground border border-border/50">
                <User2 className="h-2.5 w-2.5 opacity-50" />
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
