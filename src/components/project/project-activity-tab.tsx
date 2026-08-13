'use client';

import * as React from 'react';
import { ActivityTimeline } from '@/components/activity/ActivityTimeline';
import { useProjectActivity } from '@/hooks/useActivity';

interface ProjectActivityTabProps {
  projectId: string;
}

export function ProjectActivityTab({ projectId }: ProjectActivityTabProps) {
  const { data: activities = [], isLoading } = useProjectActivity(projectId);

  return (
    <div className="rounded-xl border border-border/60 bg-card p-6 shadow-sm animate-in fade-in duration-300">
      <ActivityTimeline 
        activities={activities} 
        isLoading={isLoading} 
        title="Project Activity"
      />
    </div>
  );
}
