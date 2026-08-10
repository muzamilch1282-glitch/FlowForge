'use client';

import * as React from 'react';
import { ActivityTimeline } from '@/components/activity/ActivityTimeline';
import { useWorkspaceActivity } from '@/hooks/useActivity';
import { useWorkspace } from '@/hooks/useWorkspace';
import { useAppStore } from '@/store/app-store';

export default function ActivityPage() {
  const { workspaces } = useWorkspace();
  const { activeWorkspaceId } = useAppStore();
  const currentWorkspace = workspaces.find(w => w.id === activeWorkspaceId);
  const { data: activities = [], isLoading } = useWorkspaceActivity(currentWorkspace?.id);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Workspace Activity</h1>
        <p className="text-sm text-muted-foreground mt-1">
          A complete history of actions performed in {currentWorkspace?.name || 'this workspace'}.
        </p>
      </div>

      <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
        <ActivityTimeline 
          activities={activities} 
          isLoading={isLoading} 
          title="Recent Activity"
        />
      </div>
    </div>
  );
}
