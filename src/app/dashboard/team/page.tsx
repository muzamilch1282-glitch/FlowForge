import type { Metadata } from 'next';
import { PageHeader } from '@/components/shared/page-header';
import { Button } from '@/components/shared/button';
import { TeamMemberCard, type TeamMemberCardProps } from '@/components/dashboard/team-member-card';
import { Users, UserPlus, Search } from 'lucide-react';
import { EmptyState } from '@/components/shared/empty-state';
import { Input } from '@/components/ui/input';

export const metadata: Metadata = {
  title: 'Team | FlowForge',
};

const dummyTeamMembers: TeamMemberCardProps[] = [
  {
    name: 'Alice Johnson',
    role: 'Product Manager',
    email: 'alice@example.com',
    status: 'online',
  },
  {
    name: 'Bob Smith',
    role: 'Senior Developer',
    email: 'bob@example.com',
    status: 'away',
  },
  {
    name: 'Charlie Davis',
    role: 'UX Designer',
    email: 'charlie@example.com',
    status: 'offline',
  },
  {
    name: 'Diana Prince',
    role: 'Marketing Head',
    email: 'diana@example.com',
    status: 'online',
  },
];

export default function TeamPage() {
  const hasMembers = dummyTeamMembers.length > 0;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Team"
        description="Manage your team members and their roles."
      >
        <Button className="gap-2">
          <UserPlus className="h-4 w-4" />
          Invite Member
        </Button>
      </PageHeader>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input type="search" placeholder="Search members..." className="pl-8" />
        </div>
      </div>

      {!hasMembers ? (
        <EmptyState
          icon={Users}
          title="No team members"
          description="Invite your team members to collaborate on projects together."
        >
          <Button className="gap-2">
            <UserPlus className="h-4 w-4" />
            Invite Members
          </Button>
        </EmptyState>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {dummyTeamMembers.map((member, i) => (
            <TeamMemberCard key={i} {...member} />
          ))}
        </div>
      )}
    </div>
  );
}
