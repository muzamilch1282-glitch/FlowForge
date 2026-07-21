import type { Metadata } from 'next';
import { PageHeader } from '@/components/shared/page-header';
import { EmptyState } from '@/components/shared/empty-state';
import { CheckSquare, Plus } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Tasks',
};

export default function TasksPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Tasks"
        description="View and organize your tasks across all projects."
      >
        <button className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors">
          <Plus className="h-4 w-4" />
          New Task
        </button>
      </PageHeader>

      <EmptyState
        icon={CheckSquare}
        title="No tasks yet"
        description="Create your first task to start organizing your work."
      >
        <button className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors">
          <Plus className="h-4 w-4" />
          Create Task
        </button>
      </EmptyState>
    </div>
  );
}
