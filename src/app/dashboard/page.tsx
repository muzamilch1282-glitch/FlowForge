import type { Metadata } from 'next';
import { DashboardHeader } from '@/components/dashboard/dashboard-header';
import { StatCard } from '@/components/dashboard/stat-card';
import { ProjectOverviewCard } from '@/components/dashboard/project-overview-card';
import { RecentActivity } from '@/components/dashboard/recent-activity';
import { QuickActions } from '@/components/dashboard/quick-actions';
import { EmptyState } from '@/components/dashboard/empty-state';
import { mockStats, mockProjects, mockActivities, mockQuickActions } from '@/data/dashboard';

export const metadata: Metadata = {
  title: 'Dashboard | FlowForge',
  description: 'FlowForge Dashboard Overview',
};

export default function DashboardPage() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <DashboardHeader 
        title="Dashboard" 
        welcomeMessage="Welcome back! Here's what's happening with your projects today." 
      />

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {mockStats.map((stat) => (
          <StatCard key={stat.id} stat={stat} />
        ))}
      </div>

      {/* Main Layout */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Projects Column */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold tracking-tight text-foreground">
              Active Projects
            </h2>
            <button className="text-sm font-medium text-primary hover:underline">
              View all projects
            </button>
          </div>
          
          {mockProjects.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2">
              {mockProjects.map((project) => (
                <ProjectOverviewCard key={project.id} project={project} />
              ))}
            </div>
          ) : (
            <EmptyState 
              title="No active projects"
              description="Get started by creating a new project or joining an existing one."
              actionLabel="Create Project"
              onAction={() => console.log('Create project')}
            />
          )}
        </div>

        {/* Sidebar Column */}
        <div className="space-y-6">
          <QuickActions actions={mockQuickActions} />
          
          {mockActivities.length > 0 ? (
            <RecentActivity activities={mockActivities} />
          ) : (
            <EmptyState 
              title="No recent activity"
              description="Your team's activities will appear here once things get moving."
            />
          )}
        </div>
      </div>
    </div>
  );
}
