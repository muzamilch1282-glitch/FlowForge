'use client';

import * as React from 'react';
import { useTasks } from '@/hooks/useTasks';
import { useProjects } from '@/hooks/useProjects';
import { PageHeader } from '@/components/shared';
import { TimelineBoard } from '@/components/timeline/timeline-board';
import { LoadingSpinner } from '@/components/shared/loading-spinner';
import { AlertCircle } from 'lucide-react';

export default function TimelinePage() {
  const { tasks, isLoading: tasksLoading, error: tasksError } = useTasks();
  const { projects, isLoading: projectsLoading, error: projectsError } = useProjects();

  const isLoading = tasksLoading || projectsLoading;
  const error = tasksError || projectsError;

  return (
    <div className="flex flex-col h-full">
      <div className="mb-6">
        <PageHeader
          title="Timeline"
          description="A chronological Gantt view of your projects and their tasks."
        />
      </div>

      {isLoading ? (
        <div className="flex flex-1 items-center justify-center min-h-[400px]">
          <LoadingSpinner className="h-8 w-8 text-primary" />
        </div>
      ) : error ? (
        <div className="flex flex-1 flex-col items-center justify-center min-h-[400px] text-center">
          <AlertCircle className="h-10 w-10 text-destructive mb-4" />
          <h3 className="text-lg font-semibold mb-2">Failed to load timeline data</h3>
          <p className="text-muted-foreground">{error.message}</p>
        </div>
      ) : (
        <TimelineBoard tasks={tasks} projects={projects} />
      )}
    </div>
  );
}
