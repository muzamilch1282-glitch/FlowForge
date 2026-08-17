import * as React from 'react';
import { format, parseISO } from 'date-fns';
import { Calendar, CheckSquare, Clock, Users, Activity, Target } from 'lucide-react';
import { ProjectMembers } from '@/components/project/project-members';
import { ProjectProgress } from '@/components/project/project-progress';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

import { Project } from '@/types/project';
import { Task } from '@/types/task';

interface ProjectOverviewTabProps {
  project: Project;
  tasks: Task[];
  workspaceId: string;
}

export function ProjectOverviewTab({ project, tasks, workspaceId }: ProjectOverviewTabProps) {
  const completedTasks = tasks.filter(t => t.status === 'completed').length;
  const totalTasks = tasks.length;
  const progressPercent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const activeTasks = tasks.filter(t => t.status !== 'completed').slice(0, 3);

  return (
    <div className="space-y-6">
      
      {/* Top Row: Health & Dates */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Project Health & Progress */}
        <div className="lg:col-span-2 p-6 border border-border/60 rounded-xl bg-background shadow-[0_4px_30px_rgba(0,0,0,0.02)] flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <Target className="h-5 w-5 text-primary" />
              Project Health
            </h3>
            <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
              On Track
            </span>
          </div>

          <div className="grid sm:grid-cols-2 gap-6 flex-1">
            <div className="flex flex-col justify-center">
              <div className="text-sm font-medium text-muted-foreground mb-2">Overall Progress</div>
              <div className="flex items-end gap-3 mb-2">
                <span className="text-3xl font-bold">{progressPercent}%</span>
              </div>
              <div className="h-2 w-full bg-subtle rounded-full overflow-hidden mt-2">
                <div className="h-full bg-primary transition-all" style={{ width: `${progressPercent}%` }} />
              </div>
            </div>
            
            <div className="space-y-4 flex flex-col justify-center">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                  <CheckSquare className="h-4 w-4" /> Tasks Completed
                </div>
                <div className="font-bold">{completedTasks} / {totalTasks}</div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                  <Clock className="h-4 w-4" /> Open Tasks
                </div>
                <div className="font-bold">{totalTasks - completedTasks}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Important Dates */}
        <div className="lg:col-span-1 p-6 border border-border/60 rounded-xl bg-background shadow-[0_4px_30px_rgba(0,0,0,0.02)] flex flex-col">
          <h3 className="font-semibold text-foreground mb-6">Dates</h3>
          <div className="space-y-6 flex-1 flex flex-col justify-center">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary/50 text-muted-foreground border border-border/50 shrink-0">
                <Calendar className="h-4 w-4" />
              </div>
              <div>
                <p className="font-medium text-sm text-foreground">
                  {project.start_date ? format(parseISO(project.start_date), 'MMM d, yyyy') : 'Not set'}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">Start Date</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary border border-primary/20 shrink-0">
                <Calendar className="h-4 w-4" />
              </div>
              <div>
                <p className="font-medium text-sm text-foreground">
                  {project.end_date ? format(parseISO(project.end_date), 'MMM d, yyyy') : 'Not set'}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">Due Date</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Row: Activity & Team */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent Activity */}
        <div className="lg:col-span-2 p-6 border border-border/60 rounded-xl bg-background shadow-[0_4px_30px_rgba(0,0,0,0.02)] flex flex-col">
          <h3 className="font-semibold text-lg flex items-center gap-2 mb-6">
            <Activity className="h-5 w-5 text-muted-foreground" />
            Recent Activity
          </h3>
          <div className="space-y-6 flex-1">
            {activeTasks.length > 0 ? activeTasks.map((task, i) => (
              <div key={task.id} className="flex gap-4 relative">
                {i !== activeTasks.length - 1 && (
                  <div className="absolute left-[15px] top-8 bottom-[-24px] w-px bg-border/60" />
                )}
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 z-10 border border-primary/20">
                  <CheckSquare className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <div className="text-sm text-foreground">
                    <span className="font-medium">{task.title}</span> was updated
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">Recently</div>
                </div>
              </div>
            )) : (
              <div className="flex h-full items-center justify-center text-sm text-muted-foreground py-4">
                No recent activity.
              </div>
            )}
          </div>
        </div>

        {/* Team Members */}
        <div className="lg:col-span-1 p-6 border border-border/60 rounded-xl bg-background shadow-[0_4px_30px_rgba(0,0,0,0.02)] flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-semibold text-foreground flex items-center gap-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              Team
            </h3>
          </div>
          <div className="flex-1">
            <ProjectMembers size="md" max={5} workspaceId={workspaceId} />
          </div>
        </div>
      </div>

    </div>
  );
}
