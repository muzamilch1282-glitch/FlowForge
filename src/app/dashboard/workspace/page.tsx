import type { Metadata } from 'next';
import { PageHeader } from '@/components/shared/page-header';
import { EmptyState } from '@/components/shared/empty-state';
import { Building2, Settings } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Workspace',
};

export default function WorkspacePage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Workspace"
        description="Configure your workspace settings and preferences."
      >
        <button className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2.5 text-sm font-medium text-foreground hover:bg-accent transition-colors">
          <Settings className="h-4 w-4" />
          Configure
        </button>
      </PageHeader>

      <EmptyState
        icon={Building2}
        title="Workspace setup"
        description="Configure your workspace to get started with team collaboration."
      />
    </div>
  );
}
