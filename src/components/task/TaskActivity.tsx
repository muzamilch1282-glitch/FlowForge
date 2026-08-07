import React from 'react';
import { ActivityTimeline } from '@/components/activity/ActivityTimeline';
import { useTaskActivity } from '@/hooks/useActivity';

interface TaskActivityProps {
  taskId: string;
}

export function TaskActivity({ taskId }: TaskActivityProps) {
  const { data: activities = [], isLoading } = useTaskActivity(taskId);

  return (
    <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
      <ActivityTimeline 
        activities={activities} 
        isLoading={isLoading} 
        title="Activity"
      />
    </div>
  );
}
