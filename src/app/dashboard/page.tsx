import type { Metadata } from 'next';
import { PageHeader } from '@/components/shared/page-header';
import {
  FolderKanban,
  CheckSquare,
  Users,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Dashboard',
};

const stats = [
  {
    title: 'Active Projects',
    value: '12',
    change: '+2',
    trend: 'up' as const,
    icon: FolderKanban,
    color: 'from-violet-500 to-indigo-600',
  },
  {
    title: 'Open Tasks',
    value: '48',
    change: '-5',
    trend: 'down' as const,
    icon: CheckSquare,
    color: 'from-emerald-500 to-teal-600',
  },
  {
    title: 'Team Members',
    value: '8',
    change: '+1',
    trend: 'up' as const,
    icon: Users,
    color: 'from-amber-500 to-orange-600',
  },
  {
    title: 'Completion Rate',
    value: '87%',
    change: '+4%',
    trend: 'up' as const,
    icon: TrendingUp,
    color: 'from-rose-500 to-pink-600',
  },
];

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Dashboard"
        description="Welcome back! Here's an overview of your workspace."
      />

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.title}
              className="group relative overflow-hidden rounded-xl border border-border bg-card p-5 transition-all duration-300 hover:shadow-lg hover:shadow-violet-500/5 hover:-translate-y-0.5"
            >
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </p>
                  <p className="text-3xl font-bold tracking-tight text-foreground">
                    {stat.value}
                  </p>
                </div>
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br ${stat.color} shadow-md`}
                >
                  <Icon className="h-5 w-5 text-white" />
                </div>
              </div>
              <div className="mt-3 flex items-center gap-1">
                {stat.trend === 'up' ? (
                  <ArrowUpRight className="h-3.5 w-3.5 text-emerald-500" />
                ) : (
                  <ArrowDownRight className="h-3.5 w-3.5 text-emerald-500" />
                )}
                <span className="text-xs font-medium text-emerald-500">
                  {stat.change}
                </span>
                <span className="text-xs text-muted-foreground">vs last week</span>
              </div>
              {/* Decorative gradient */}
              <div className={`absolute -right-6 -top-6 h-24 w-24 rounded-full bg-gradient-to-br ${stat.color} opacity-5 transition-opacity group-hover:opacity-10`} />
            </div>
          );
        })}
      </div>

      {/* Placeholder sections */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent Activity */}
        <div className="lg:col-span-2 rounded-xl border border-border bg-card p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">
            Recent Activity
          </h3>
          <div className="flex items-center justify-center py-12 text-muted-foreground">
            <p className="text-sm">Activity feed will appear here</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="rounded-xl border border-border bg-card p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">
            Quick Actions
          </h3>
          <div className="space-y-3">
            {[
              'Create New Project',
              'Add Task',
              'Invite Team Member',
              'View Reports',
            ].map((action) => (
              <button
                key={action}
                className="flex w-full items-center gap-3 rounded-lg border border-border px-4 py-3 text-sm font-medium text-foreground hover:bg-accent transition-colors"
              >
                {action}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
