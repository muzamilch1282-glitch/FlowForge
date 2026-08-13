'use client';

import * as React from 'react';
import { Task } from '@/types/task';
import { Project } from '@/types/project';
import { format, parseISO, isPast, isToday } from 'date-fns';
import { AlertCircle, Calendar, CheckCircle2, Circle, Clock, FileText, FolderKanban, MoreHorizontal, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { PermissionGuard } from '@/components/auth/PermissionGuard';
import { PERMISSIONS } from '@/lib/permissions';

interface TaskTableProps {
  tasks: Task[];
  projects: Project[];
  isLoading: boolean;
  hasProjects: boolean;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
  onView: (task: Task) => void;
  onCreateNew: () => void;
}

export function TaskTable({
  tasks,
  projects,
  isLoading,
  hasProjects,
  onEdit,
  onDelete,
  onView,
  onCreateNew
}: TaskTableProps) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3, 4, 5].map(i => (
          <div key={i} className="h-12 w-full animate-pulse bg-muted/50 rounded-md" />
        ))}
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center border border-dashed border-border/60 rounded-xl bg-background/50">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary mb-4">
          <FileText className="h-6 w-6 text-muted-foreground" />
        </div>
        <h3 className="text-sm font-semibold text-foreground">No tasks found</h3>
        <p className="mt-1 text-sm text-muted-foreground max-w-sm mx-auto mb-6">
          {hasProjects 
            ? "You don't have any tasks matching your filters, or you haven't created any yet."
            : "You need to create a project before you can create tasks."}
        </p>
        <PermissionGuard permission={PERMISSIONS.TASK_CREATE}>
          <Button onClick={onCreateNew} disabled={!hasProjects}>
            Create Task
          </Button>
        </PermissionGuard>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-border/50 bg-card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-muted-foreground uppercase bg-secondary/30 border-b border-border/50">
            <tr>
              <th className="px-4 py-3 font-semibold w-12"></th>
              <th className="px-4 py-3 font-semibold">Title</th>
              <th className="px-4 py-3 font-semibold w-40 hidden md:table-cell">Project</th>
              <th className="px-4 py-3 font-semibold w-32 hidden sm:table-cell">Status</th>
              <th className="px-4 py-3 font-semibold w-28 hidden lg:table-cell">Priority</th>
              <th className="px-4 py-3 font-semibold w-32">Due Date</th>
              <th className="px-4 py-3 font-semibold w-24 text-center">Assignee</th>
              <th className="px-4 py-3 font-semibold w-12"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/50">
            {tasks.map(task => {
              const project = projects.find(p => p.id === task.project_id);
              const isOverdue = task.due_date && isPast(parseISO(task.due_date)) && !isToday(parseISO(task.due_date)) && task.status !== 'completed';
              
              return (
                <tr 
                  key={task.id} 
                  className="group hover:bg-secondary/40 transition-colors cursor-pointer"
                  onClick={() => onView(task)}
                >
                  <td className="px-4 py-3 text-center">
                    <div className="flex items-center justify-center">
                      {getStatusIcon(task.status)}
                    </div>
                  </td>
                  <td className="px-4 py-3 font-medium text-foreground min-w-[200px]">
                    <span className="truncate block max-w-sm">{task.title}</span>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground hidden md:table-cell">
                    {project ? (
                      <div className="flex items-center gap-1.5 truncate max-w-[140px] text-xs">
                        <FolderKanban className="h-3 w-3 shrink-0" />
                        <span className="truncate">{project.title}</span>
                      </div>
                    ) : (
                      <span className="text-xs italic opacity-50">None</span>
                    )}
                  </td>
                  <td className="px-4 py-3 hidden sm:table-cell">
                    <Badge variant="outline" className={cn(
                      "font-normal text-[11px] h-5 px-1.5 border-transparent bg-secondary/50",
                      task.status === 'completed' && "bg-emerald-500/10 text-emerald-600",
                      task.status === 'in-progress' && "bg-blue-500/10 text-blue-600",
                    )}>
                      {task.status.replace('-', ' ')}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 hidden lg:table-cell">
                    <span className={cn(
                      "text-[11px] font-medium capitalize flex items-center gap-1",
                      task.priority === 'high' ? "text-red-500" : 
                      task.priority === 'medium' ? "text-amber-500" : "text-muted-foreground"
                    )}>
                      {task.priority === 'high' && <AlertCircle className="h-3 w-3" />}
                      {task.priority || 'Normal'}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {task.due_date ? (
                      <div className={cn(
                        "flex items-center gap-1.5 text-xs font-medium",
                        isOverdue ? "text-red-500" : "text-muted-foreground"
                      )}>
                        <Calendar className="h-3 w-3" />
                        {format(parseISO(task.due_date), 'MMM d')}
                      </div>
                    ) : (
                      <span className="text-xs text-muted-foreground/50">-</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex justify-center">
                      {task.assigned_to ? (
                        <Avatar className="h-6 w-6 border border-background">
                          <AvatarFallback className="text-[9px] bg-primary/10 text-primary">
                            {task.assigned_to.substring(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                      ) : (
                        <div className="h-6 w-6 rounded-full border border-dashed border-border flex items-center justify-center bg-secondary/30 text-[10px] text-muted-foreground" title="Unassigned">
                          ?
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right" onClick={(e) => e.stopPropagation()}>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-7 w-7 p-0 opacity-0 group-hover:opacity-100 transition-opacity">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-40">
                        <DropdownMenuItem onClick={() => onView(task)}>View Details</DropdownMenuItem>
                        <PermissionGuard permission={PERMISSIONS.TASK_EDIT}>
                          <DropdownMenuItem onClick={() => onEdit(task)}>Edit Task</DropdownMenuItem>
                        </PermissionGuard>
                        <PermissionGuard permission={PERMISSIONS.TASK_DELETE}>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => onDelete(task)} className="text-red-600 focus:bg-red-50 focus:text-red-600 dark:focus:bg-red-950">
                            Delete Task
                          </DropdownMenuItem>
                        </PermissionGuard>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function getStatusIcon(status: string) {
  switch (status) {
    case 'todo': return <Circle className="h-3.5 w-3.5 text-muted-foreground/60 shrink-0" />;
    case 'in-progress': return <Play className="h-3.5 w-3.5 text-blue-500 shrink-0" />;
    case 'review': return <AlertCircle className="h-3.5 w-3.5 text-amber-500 shrink-0" />;
    case 'completed': return <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />;
    default: return <Circle className="h-3.5 w-3.5 text-muted-foreground/60 shrink-0" />;
  }
}
