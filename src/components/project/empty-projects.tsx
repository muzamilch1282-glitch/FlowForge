import { FolderKanban } from 'lucide-react';
import { Button } from '@/components/shared';

interface EmptyProjectsProps {
  onAction: () => void;
  hasWorkspaces?: boolean;
}

export function EmptyProjects({ onAction, hasWorkspaces = true }: EmptyProjectsProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card py-16 text-center shadow-sm">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
        <FolderKanban className="h-7 w-7 text-primary" />
      </div>
      <h3 className="mt-4 text-lg font-semibold text-foreground">
        {hasWorkspaces ? 'No projects found' : 'Workspace Required'}
      </h3>
      <p className="mb-6 mt-2 max-w-sm text-sm text-muted-foreground">
        {hasWorkspaces 
          ? 'Get started by creating a new project to organize your tasks and collaborate with your team.'
          : 'You need to create a Workspace before you can create any projects.'}
      </p>
      {hasWorkspaces && (
        <Button onClick={onAction}>
          Create Project
        </Button>
      )}
    </div>
  );
}
