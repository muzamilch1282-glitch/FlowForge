'use client';

import * as React from 'react';
import { useTasks } from '@/hooks/useTasks';
import { useProjects } from '@/hooks/useProjects';
import { isPast, isToday, isThisWeek, parseISO } from 'date-fns';
import Link from 'next/link';

// Custom Components
import { DashboardHeader } from '@/components/dashboard/dashboard-header';
import { ProjectOverviewCard } from '@/components/dashboard/project-overview-card';
import { QuickActions } from '@/components/dashboard/quick-actions';
import { EmptyState } from '@/components/dashboard/empty-state';
import { mockQuickActions } from '@/data/dashboard';

// New Bento Components
import { BentoHero } from '@/components/dashboard/bento-hero';
import { PriorityInbox } from '@/components/dashboard/priority-inbox';
import { LiveActivityFeed } from '@/components/dashboard/live-activity-feed';

export default function DashboardPage() {
  const { tasks, isLoading: tasksLoading } = useTasks();
  const { projects, isLoading: projectsLoading } = useProjects();

  const isLoading = tasksLoading || projectsLoading;

  const stats = React.useMemo(() => {
    let completed = 0;
    let inProgress = 0;
    let overdue = 0;
    let dueToday = 0;
    let dueThisWeek = 0;
    let highPriority = 0;

    tasks.forEach(t => {
      if (t.status === 'completed') completed++;
      if (t.status === 'in-progress') inProgress++;
      if (t.priority === 'high') highPriority++;

      if (t.due_date && t.status !== 'completed') {
        const date = parseISO(t.due_date);
        if (isPast(date) && !isToday(date)) overdue++;
        if (isToday(date)) dueToday++;
        if (isThisWeek(date)) dueThisWeek++;
      }
    });

    return {
      total: tasks.length,
      completed,
      inProgress,
      overdue,
      dueToday,
      dueThisWeek,
      highPriority
    };
  }, [tasks]);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      
      {/* 1. The Bento Hero Section */}
      <BentoHero stats={stats} />

      {/* 2. Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3 xl:grid-cols-4">
        
        {/* Left Column (Span 2/3) - Priority Inbox & Projects */}
        <div className="lg:col-span-2 xl:col-span-3 space-y-6">
          
          {/* Priority Inbox */}
          <div className="rounded-2xl border border-border/50 bg-card/30 backdrop-blur-md p-6 shadow-[0_4px_30px_rgba(0,0,0,0.02)] transition-all">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl font-bold tracking-tight text-foreground">Priority Inbox</h2>
                <p className="text-sm text-muted-foreground">Action items demanding your attention</p>
              </div>
              <Link href="/dashboard/tasks" className="text-sm font-medium text-primary hover:underline">
                View all tasks
              </Link>
            </div>
            
            {isLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-16 rounded-xl bg-secondary/50 animate-pulse" />
                ))}
              </div>
            ) : (
              <PriorityInbox tasks={tasks} projects={projects} />
            )}
          </div>

          {/* Active Projects */}
          <div className="rounded-2xl border border-border/50 bg-card/30 backdrop-blur-md p-6 shadow-[0_4px_30px_rgba(0,0,0,0.02)] transition-all">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl font-bold tracking-tight text-foreground">Active Projects</h2>
                <p className="text-sm text-muted-foreground">Ongoing workspaces</p>
              </div>
              <Link href="/dashboard/projects" className="text-sm font-medium text-primary hover:underline">
                View all projects
              </Link>
            </div>
            
            {isLoading ? (
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-32 rounded-xl border border-border bg-card animate-pulse" />
                ))}
              </div>
            ) : projects.length > 0 ? (
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {projects.slice(0, 6).map((project) => (
                  <ProjectOverviewCard key={project.id} project={project} />
                ))}
              </div>
            ) : (
              <EmptyState 
                title="No active projects"
                description="Get started by creating a new project."
                actionLabel="Create Project"
                onAction={() => window.location.href = '/dashboard/projects'}
              />
            )}
          </div>
        </div>

        {/* Right Column (Span 1) - Activity & Actions */}
        <div className="space-y-6">
          <QuickActions actions={mockQuickActions} />
          
          <div className="rounded-2xl border border-border/50 bg-card/30 backdrop-blur-md p-6 shadow-[0_4px_30px_rgba(0,0,0,0.02)] sticky top-6">
            <div className="mb-6">
              <h3 className="font-bold tracking-tight text-foreground">Live Activity Feed</h3>
              <p className="text-xs text-muted-foreground mt-0.5">Real-time collaboration</p>
            </div>
            
            <LiveActivityFeed projects={projects} />
          </div>
        </div>
        
      </div>
    </div>
  );
}
