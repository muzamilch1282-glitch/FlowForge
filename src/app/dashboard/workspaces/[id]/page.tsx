'use client';

import * as React from 'react';
import { use } from 'react';
import Link from 'next/link';
import { ArrowLeft, Edit, Plus, FolderKanban, Activity } from 'lucide-react';
import { useWorkspaceById } from '@/hooks/useWorkspace';
import { Button } from '@/components/shared';
import { WorkspaceMembers } from '@/components/workspace/workspace-members';
import { EmptyState } from '@/components/dashboard/empty-state';
import { LoadingSpinner } from '@/components/shared/loading-spinner';

export default function WorkspaceDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  // Unwrap params since next.js 15 treats params as a promise in Server Components (and increasingly strictly in Client Components)
  const resolvedParams = use(params);
  const { data: workspace, isLoading, error } = useWorkspaceById(resolvedParams.id);

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <LoadingSpinner className="h-8 w-8 text-primary" />
      </div>
    );
  }

  if (error || !workspace) {
    return (
      <div className="flex h-64 flex-col items-center justify-center gap-4 text-center">
        <h2 className="text-xl font-semibold text-foreground">Workspace not found</h2>
        <p className="text-muted-foreground">The workspace you&apos;re looking for doesn&apos;t exist or you don&apos;t have access.</p>
        <Link href="/dashboard/workspaces">
          <Button variant="outline">Back to Workspaces</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col gap-4">
        <Link href="/dashboard/workspaces" className="flex w-fit items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" />
          Back to Workspaces
        </Link>
        
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-center gap-4">
            <div 
              className="flex h-16 w-16 items-center justify-center rounded-xl text-2xl font-bold text-white shadow-sm"
              style={{ backgroundColor: workspace.color || '#3B82F6' }}
            >
              {workspace.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">{workspace.name}</h1>
              <p className="text-muted-foreground">{workspace.description || 'No description provided'}</p>
            </div>
          </div>
          
          <Button variant="outline" className="gap-2 self-start sm:self-auto">
            <Edit className="h-4 w-4" />
            Manage Settings
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold tracking-tight text-foreground flex items-center gap-2">
              <FolderKanban className="h-5 w-5 text-primary" />
              Projects
            </h2>
            <Button size="sm" className="gap-2">
              <Plus className="h-4 w-4" />
              New Project
            </Button>
          </div>
          
          <EmptyState
            title="No projects yet"
            description="Create your first project in this workspace to get started."
            actionLabel="Create Project"
            onAction={() => console.log('Create project')}
          />

          <div className="pt-4">
            <h2 className="text-lg font-semibold tracking-tight text-foreground mb-4 flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" />
              Recent Activity
            </h2>
            <EmptyState
              title="No recent activity"
              description="Activities from this workspace will appear here."
            />
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
            <h3 className="font-semibold text-foreground mb-4">Workspace Details</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Created</span>
                <span className="font-medium text-foreground">{new Date(workspace.created_at).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Owner ID</span>
                <span className="font-medium text-foreground truncate max-w-[150px]" title={workspace.owner_id}>{workspace.owner_id}</span>
              </div>
            </div>
          </div>

          <WorkspaceMembers />
        </div>
      </div>
    </div>
  );
}
