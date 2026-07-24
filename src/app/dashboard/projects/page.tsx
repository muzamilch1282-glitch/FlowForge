import type { Metadata } from 'next';
import { PageHeader } from '@/components/shared/page-header';
import { Button } from '@/components/shared/button';
import { ProjectCard, type ProjectCardProps } from '@/components/dashboard/project-card';
import { FolderKanban, Plus, Search } from 'lucide-react';
import { EmptyState } from '@/components/shared/empty-state';
import { Input } from '@/components/ui/input';

export const metadata: Metadata = {
  title: 'Projects | FlowForge',
};

const dummyProjects: ProjectCardProps[] = [
  {
    name: 'SaaS Platform Redesign',
    description: 'Complete overhaul of the core SaaS platform UI/UX.',
    progress: 75,
    status: 'active',
    priority: 'high',
    members: [
      { name: 'Alice' },
      { name: 'Bob' },
      { name: 'Charlie' },
      { name: 'Dave' },
    ],
    dueDate: 'Oct 15, 2026',
  },
  {
    name: 'Mobile App Beta',
    description: 'Launch the iOS and Android beta applications.',
    progress: 30,
    status: 'on-hold',
    priority: 'medium',
    members: [{ name: 'Eve' }, { name: 'Frank' }],
    dueDate: 'Nov 1, 2026',
  },
  {
    name: 'Marketing Site',
    description: 'New marketing landing pages for Q4 campaign.',
    progress: 100,
    status: 'completed',
    priority: 'low',
    members: [{ name: 'Grace' }],
    dueDate: 'Sep 10, 2026',
  },
];

export default function ProjectsPage() {
  const hasProjects = dummyProjects.length > 0;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Projects"
        description="Manage and track your projects."
      >
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          New Project
        </Button>
      </PageHeader>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input type="search" placeholder="Search projects..." className="pl-8" />
        </div>
      </div>

      {!hasProjects ? (
        <EmptyState
          icon={FolderKanban}
          title="No projects yet"
          description="Create your first project to start managing your work."
        >
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Create Project
          </Button>
        </EmptyState>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {dummyProjects.map((project, i) => (
            <ProjectCard key={i} {...project} />
          ))}
        </div>
      )}
    </div>
  );
}
