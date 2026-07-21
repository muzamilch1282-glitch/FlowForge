import type { Metadata } from 'next';
import { PageHeader } from '@/components/shared/page-header';
import { EmptyState } from '@/components/shared/empty-state';
import { Users, UserPlus } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Team',
};

export default function TeamPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Team"
        description="Manage your team members and their roles."
      >
        <button className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors">
          <UserPlus className="h-4 w-4" />
          Invite Member
        </button>
      </PageHeader>

      <EmptyState
        icon={Users}
        title="No team members"
        description="Invite your team members to collaborate on projects together."
      >
        <button className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors">
          <UserPlus className="h-4 w-4" />
          Invite Members
        </button>
      </EmptyState>
    </div>
  );
}
