'use client';

import * as React from 'react';
import { PageHeader } from '@/components/shared/page-header';
import { WorkspaceSettings } from '@/components/settings/workspace-settings';

export default function WorkspacesPage() {
  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-12 animate-in fade-in duration-500">
      <PageHeader
        title="Workspaces"
        description="Manage your workspaces, update settings, and configure access."
      />
      <WorkspaceSettings hideTitle />
    </div>
  );
}
