'use client';

import * as React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useTaskById } from '@/hooks/useTasks';
import { useProjectById } from '@/hooks/useProjects';
import { Button } from '@/components/shared';
import { TaskStatus } from '@/components/task/task-status';
import { PriorityBadge } from '@/components/task/priority-badge';
import { TaskComments } from '@/components/task/task-comments';
import { ArrowLeft, Calendar, Clock, User2, AlignLeft, Activity } from 'lucide-react';
import { format, parseISO, isPast, isToday } from 'date-fns';
import Link from 'next/link';

export default function TaskDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const taskId = params.id as string;
  
  const { data: task, isLoading: taskLoading, error } = useTaskById(taskId);
  const { data: project, isLoading: projectLoading } = useProjectById(task?.project_id || '');

  if (taskLoading || projectLoading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  if (error || !task) {
    return (
      <div className="flex flex-col items-center justify-center h-[400px] text-center">
        <h2 className="text-2xl font-bold text-foreground">Task not found</h2>
        <p className="mt-2 text-muted-foreground">The task you're looking for doesn't exist or you don't have access.</p>
        <Button className="mt-6" onClick={() => router.push('/dashboard/tasks')}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Tasks
        </Button>
      </div>
    );
  }

  const dueDate = task.due_date ? parseISO(task.due_date) : null;
  const overdue = dueDate && isPast(dueDate) && !isToday(dueDate) && task.status !== 'completed';
  const dueToday = dueDate && isToday(dueDate) && task.status !== 'completed';

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header section */}
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">{task.title}</h1>
          </div>
          {project && (
            <p className="text-sm text-muted-foreground">
              in project <Link href={`/dashboard/projects/${project.id}`} className="font-medium hover:text-primary hover:underline">{project.title}</Link>
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main content column */}
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <AlignLeft className="h-5 w-5 text-muted-foreground" />
              <h3 className="font-semibold text-foreground">Description</h3>
            </div>
            {task.description ? (
              <p className="text-muted-foreground whitespace-pre-wrap">{task.description}</p>
            ) : (
              <p className="text-muted-foreground italic">No description provided.</p>
            )}
          </div>

          <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
            <TaskComments />
          </div>
        </div>

        {/* Sidebar column */}
        <div className="space-y-6">
          <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
            <h3 className="font-semibold text-foreground mb-4">Details</h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Status</span>
                <TaskStatus status={task.status} />
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Priority</span>
                <PriorityBadge priority={task.priority} />
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Assignee</span>
                <div className="flex items-center gap-2">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-secondary text-xs text-muted-foreground">
                    <User2 className="h-3 w-3" />
                  </div>
                  <span className="text-sm font-medium">
                    {task.assigned_to ? 'Assigned' : 'Unassigned'}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Due Date</span>
                {dueDate ? (
                  <div className={`flex items-center gap-1.5 text-sm font-medium
                    ${overdue ? 'text-destructive' : 
                      dueToday ? 'text-amber-600 dark:text-amber-500' : 
                      'text-foreground'}`}
                  >
                    {overdue || dueToday ? <Clock className="h-3.5 w-3.5" /> : <Calendar className="h-3.5 w-3.5" />}
                    {format(dueDate, 'MMM d, yyyy')}
                  </div>
                ) : (
                  <span className="text-sm text-muted-foreground">None</span>
                )}
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <Activity className="h-5 w-5 text-muted-foreground" />
              <h3 className="font-semibold text-foreground">Activity</h3>
            </div>
            
            <div className="relative pl-4 border-l border-border space-y-6">
              <div className="relative">
                <div className="absolute -left-[21px] flex h-2 w-2 items-center justify-center rounded-full bg-primary mt-1.5" />
                <p className="text-sm text-foreground">Task created</p>
                <p className="text-xs text-muted-foreground">{format(parseISO(task.created_at), 'MMM d, yyyy h:mm a')}</p>
              </div>
              {task.updated_at !== task.created_at && (
                <div className="relative">
                  <div className="absolute -left-[21px] flex h-2 w-2 items-center justify-center rounded-full bg-muted-foreground mt-1.5" />
                  <p className="text-sm text-foreground">Task updated</p>
                  <p className="text-xs text-muted-foreground">{format(parseISO(task.updated_at), 'MMM d, yyyy h:mm a')}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
