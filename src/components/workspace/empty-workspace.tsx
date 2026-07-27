import { Building2 } from 'lucide-react';
import { Button } from '@/components/shared';

interface EmptyWorkspaceProps {
  onAction: () => void;
}

export function EmptyWorkspace({ onAction }: EmptyWorkspaceProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card py-12 text-center shadow-sm">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
        <Building2 className="h-7 w-7 text-primary" />
      </div>
      <h3 className="mt-4 text-lg font-semibold text-foreground">No workspaces found</h3>
      <p className="mb-6 mt-2 max-w-sm text-sm text-muted-foreground">
        Get started by creating a new workspace to organize your projects and team members.
      </p>
      <Button onClick={onAction}>
        Create Workspace
      </Button>
    </div>
  );
}
