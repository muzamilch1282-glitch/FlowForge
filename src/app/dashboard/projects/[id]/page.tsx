'use client';

import * as React from 'react';
import { use } from 'react';
import Link from 'next/link';
import { ArrowLeft, Edit, LayoutList, Calendar, Building2 } from 'lucide-react';
import { useProjectById } from '@/hooks/useProjects';
import { useWorkspaceById } from '@/hooks/useWorkspace';
import { Button, Badge } from '@/components/shared';
import { ProjectMembers } from '@/components/project/project-members';
import { ProjectProgress } from '@/components/project/project-progress';
import { EmptyState } from '@/components/dashboard/empty-state';
import { LoadingSpinner } from '@/components/shared/loading-spinner';
import { format, parseISO } from 'date-fns';

export default function ProjectDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const { data: project, isLoading: isProjectLoading, error } = useProjectById(resolvedParams.id);
  
  // Use workspace conditionally if project exists
  const { data: workspace, isLoading: isWorkspaceLoading } = useWorkspaceById(project?.workspace_id || '');

  const statusColors = {
    'active': 'bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400',
    'on-hold': 'bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400',
    'completed': 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400',
  };

  const priorityColors = {
    'low': 'bg-slate-100 text-slate-700 dark:bg-slate-500/10 dark:text-slate-400',
    'medium': 'bg-indigo-100 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-400',
    'high': 'bg-rose-100 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400',
  };

  // Generate dummy progress
  const dummyProgress = React.useMemo(() => {
    if (!project) return 0;
    const sum = project.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return sum % 100;
  }, [project]);

  if (isProjectLoading || (project && isWorkspaceLoading)) {
    return (
      <div className="flex h-64 items-center justify-center">
        <LoadingSpinner className="h-8 w-8 text-primary" />
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="flex h-64 flex-col items-center justify-center gap-4 text-center">
        <h2 className="text-xl font-semibold text-foreground">Project not found</h2>
        <p className="text-muted-foreground">The project you&apos;re looking for doesn&apos;t exist or you don&apos;t have access.</p>
        <Link href="/dashboard/projects">
          <Button variant="outline">Back to Projects</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col gap-4">
        <Link href="/dashboard/projects" className="flex w-fit items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" />
          Back to Projects
        </Link>
        
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-2 max-w-2xl">
            <h1 className="text-3xl font-bold text-foreground">{project.title}</h1>
            <p className="text-muted-foreground text-lg">{project.description || 'No description provided'}</p>
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Badge className={statusColors[project.status]}>
                {project.status.replace('-', ' ')}
              </Badge>
              <Badge className={priorityColors[project.priority]}>
                {project.priority} priority
              </Badge>
              {workspace && (
                <div className="flex items-center gap-1.5 text-sm text-muted-foreground bg-secondary/30 px-2 py-0.5 rounded-full">
                  <Building2 className="h-3.5 w-3.5" />
                  <span>{workspace.name}</span>
                </div>
              )}
            </div>
          </div>
          
          <Button variant="outline" className="gap-2 self-start sm:self-auto shrink-0">
            <Edit className="h-4 w-4" />
            Edit Project
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold tracking-tight text-foreground flex items-center gap-2">
              <LayoutList className="h-5 w-5 text-primary" />
              Tasks
            </h2>
            <Button size="sm" className="gap-2">
              <Plus className="h-4 w-4" />
              Add Task
            </Button>
          </div>
          
          <EmptyState
            title="No tasks yet"
            description="Create your first task to start tracking work in this project."
            actionLabel="Create Task"
            onAction={() => console.log('Create task')}
          />
        </div>

        <div className="space-y-6">
          <div className="rounded-xl border border-border bg-card p-6 shadow-sm space-y-6">
            <div>
              <h3 className="font-semibold text-foreground mb-4">Project Progress</h3>
              <ProjectProgress value={dummyProgress} />
            </div>

            <div className="pt-2">
              <h3 className="font-semibold text-foreground mb-4">Dates</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-md bg-secondary/50 text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">
                      {project.start_date ? format(parseISO(project.start_date), 'MMM d, yyyy') : 'Not set'}
                    </p>
                    <p className="text-xs text-muted-foreground">Start Date</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-md bg-secondary/50 text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">
                      {project.end_date ? format(parseISO(project.end_date), 'MMM d, yyyy') : 'Not set'}
                    </p>
                    <p className="text-xs text-muted-foreground">Due Date</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <h3 className="font-semibold text-foreground mb-4">Team Members</h3>
              <ProjectMembers size="md" max={5} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
