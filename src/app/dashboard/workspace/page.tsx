import type { Metadata } from 'next';
import { PageHeader } from '@/components/shared/page-header';
import { Button } from '@/components/shared/button';
import { WorkspaceCard, type WorkspaceCardProps } from '@/components/dashboard/workspace-card';
import { Building2, Plus, Search } from 'lucide-react';
import { EmptyState } from '@/components/shared/empty-state';
import { Input } from '@/components/ui/input';

export const metadata: Metadata = {
  title: 'Workspaces | FlowForge',
};

const dummyWorkspaces: WorkspaceCardProps[] = [
  {
    name: 'Acme Corp',
    owner: { name: 'Alice', avatarUrl: undefined },
    projectCount: 4,
    memberCount: 12,
    status: 'active',
  },
  {
    name: 'Personal Sandbox',
    owner: { name: 'Bob', avatarUrl: undefined },
    projectCount: 1,
    memberCount: 1,
    status: 'active',
  },
  {
    name: 'Stark Industries',
    owner: { name: 'Tony Stark', avatarUrl: undefined },
    projectCount: 15,
    memberCount: 45,
    status: 'archived',
  },
];

export default function WorkspacePage() {
  const hasWorkspaces = dummyWorkspaces.length > 0;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Workspaces"
        description="Manage your workspaces and view their status."
      >
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          New Workspace
        </Button>
      </PageHeader>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input type="search" placeholder="Search workspaces..." className="pl-8" />
        </div>
      </div>

      {!hasWorkspaces ? (
        <EmptyState
          icon={Building2}
          title="No workspaces yet"
          description="Create your first workspace to start collaborating."
        >
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Create Workspace
          </Button>
        </EmptyState>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {dummyWorkspaces.map((workspace, i) => (
            <WorkspaceCard key={i} {...workspace} />
          ))}
        </div>
      )}
    </div>
  );
}
