'use client';

import * as React from 'react';
import { DashboardHeader } from '@/components/dashboard/dashboard-header';
import { ProjectOverviewCard } from '@/components/dashboard/project-overview-card';
import { QuickActions } from '@/components/dashboard/quick-actions';
import { EmptyState } from '@/components/dashboard/empty-state';
import { mockQuickActions } from '@/data/dashboard';
import { useTasks } from '@/hooks/useTasks';
import { useProjects } from '@/hooks/useProjects';
import { TaskSummaryCard } from '@/components/task/task-summary-card';
import { UpcomingTasks } from '@/components/task/upcoming-tasks';
import { TaskCalendar } from '@/components/task/task-calendar';
import { isPast, isToday, isThisWeek, parseISO } from 'date-fns';
import { LayoutList, CheckCircle2, CircleDashed, AlertCircle, Calendar, CalendarDays, Flame } from 'lucide-react';
import Link from 'next/link';

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
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <DashboardHeader 
        title="Dashboard" 
        welcomeMessage="Welcome back! Here's a summary of your tasks and projects." 
      />

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7">
        <TaskSummaryCard 
          title="Total Tasks" 
          value={stats.total} 
          icon={LayoutList} 
          colorClass="bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400"
        />
        <TaskSummaryCard 
          title="Completed" 
          value={stats.completed} 
          icon={CheckCircle2} 
          colorClass="bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400"
        />
        <TaskSummaryCard 
          title="In Progress" 
          value={stats.inProgress} 
          icon={CircleDashed} 
          colorClass="bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400"
        />
        <TaskSummaryCard 
          title="High Priority" 
          value={stats.highPriority} 
          icon={Flame} 
          colorClass="bg-rose-100 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400"
        />
        <TaskSummaryCard 
          title="Overdue" 
          value={stats.overdue} 
          icon={AlertCircle} 
          colorClass="bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400"
        />
        <TaskSummaryCard 
          title="Due Today" 
          value={stats.dueToday} 
          icon={Calendar} 
          colorClass="bg-indigo-100 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-400"
        />
        <TaskSummaryCard 
          title="Due This Week" 
          value={stats.dueThisWeek} 
          icon={CalendarDays} 
          colorClass="bg-violet-100 text-violet-700 dark:bg-violet-500/10 dark:text-violet-400"
        />
      </div>

      {/* Main Layout */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column (Calendar & Projects) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Calendar Section */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold tracking-tight text-foreground">
              Schedule
            </h2>
            <TaskCalendar tasks={tasks} projects={projects} />
          </div>

          {/* Projects Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold tracking-tight text-foreground">
                Active Projects
              </h2>
              <Link href="/dashboard/projects" className="text-sm font-medium text-primary hover:underline">
                View all projects
              </Link>
            </div>
            
            {isLoading ? (
              <div className="grid gap-4 sm:grid-cols-2">
                {[1, 2].map(i => (
                  <div key={i} className="h-32 rounded-xl border border-border bg-card animate-pulse" />
                ))}
              </div>
            ) : projects.length > 0 ? (
              <div className="grid gap-4 sm:grid-cols-2">
                {projects.slice(0, 4).map((project) => (
                  <ProjectOverviewCard key={project.id} project={project} />
                ))}
              </div>
            ) : (
              <EmptyState 
                title="No active projects"
                description="Get started by creating a new project or joining an existing one."
                actionLabel="Create Project"
                onAction={() => window.location.href = '/dashboard/projects'}
              />
            )}
          </div>
        </div>

        {/* Sidebar Column */}
        <div className="space-y-6">
          <QuickActions actions={mockQuickActions} />
          
          <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-foreground">Upcoming Tasks</h3>
              <Link href="/dashboard/tasks" className="text-xs font-medium text-primary hover:underline">
                View all
              </Link>
            </div>
            
            {isLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-16 rounded-lg bg-secondary/50 animate-pulse" />
                ))}
              </div>
            ) : (
              <UpcomingTasks tasks={tasks} projects={projects} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
