import * as React from 'react';
import { Workspace } from '@/types/workspace';
import { WorkspaceCard } from './workspace-card';
import { WorkspaceSkeleton } from './workspace-skeleton';
import { EmptyWorkspace } from './empty-workspace';

interface WorkspaceGridProps {
  workspaces: Workspace[];
  isLoading: boolean;
  onEdit: (workspace: Workspace) => void;
  onDelete: (workspace: Workspace) => void;
  onCreateNew: () => void;
}

export function WorkspaceGrid({
  workspaces,
  isLoading,
  onEdit,
  onDelete,
  onCreateNew,
}: WorkspaceGridProps) {
  if (isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, i) => (
          <WorkspaceSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (workspaces.length === 0) {
    return <EmptyWorkspace onAction={onCreateNew} />;
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {workspaces.map((workspace) => (
        <WorkspaceCard
          key={workspace.id}
          workspace={workspace}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
