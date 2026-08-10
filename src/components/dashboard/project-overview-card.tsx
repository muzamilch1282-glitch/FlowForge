import React from 'react';
import Link from 'next/link';
import { Calendar, MoreVertical, Flag } from 'lucide-react';
import { Project } from '@/types/project';

interface ProjectOverviewCardProps {
  project: Project;
}

export function ProjectOverviewCard({ project }: ProjectOverviewCardProps) {
  const getStatusColor = (status: Project['status']) => {
    switch (status) {
      case 'active':
        return 'bg-blue-500/10 text-blue-600 dark:text-blue-400';
      case 'on-hold':
        return 'bg-amber-500/10 text-amber-600 dark:text-amber-400';
      case 'completed':
        return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getPriorityColor = (priority: Project['priority']) => {
    switch (priority) {
      case 'high':
        return 'text-rose-500';
      case 'medium':
        return 'text-amber-500';
      case 'low':
        return 'text-emerald-500';
      default:
        return 'text-muted-foreground';
    }
  };

  // Mock progress since we don't have it in the DB schema yet
  const progress = 0;

  return (
    <div className="flex flex-col rounded-xl border border-border bg-card p-5 transition-all hover:shadow-md">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <Link href={`/dashboard/projects/${project.id}`} className="group flex items-center gap-2">
            <h3 className="font-semibold tracking-tight text-foreground group-hover:text-primary transition-colors">
              {project.title}
            </h3>
          </Link>
          <p className="text-sm text-muted-foreground line-clamp-1">
            {project.description || 'No description'}
          </p>
        </div>
        <button className="rounded-md p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground transition-colors">
          <MoreVertical className="h-4 w-4" />
        </button>
      </div>

      <div className="mt-4 flex items-center gap-2">
        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${getStatusColor(project.status)}`}>
          {project.status.replace('-', ' ')}
        </span>
        <div className="flex items-center gap-1 text-xs text-muted-foreground capitalize">
          <Flag className={`h-3 w-3 ${getPriorityColor(project.priority)}`} />
          <span>{project.priority}</span>
        </div>
      </div>

      <div className="mt-5 space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="font-medium text-foreground">Progress</span>
          <span className="text-muted-foreground">{progress}%</span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
          <div
            className="h-full bg-primary transition-all duration-500 ease-in-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="mt-5 flex items-center justify-between border-t border-border pt-4">
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Calendar className="h-3.5 w-3.5" />
          <span>{project.end_date ? `Due ${new Date(project.end_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}` : 'No due date'}</span>
        </div>
        
        <div className="flex -space-x-2">
          {/* Members mock */}
        </div>
      </div>
    </div>
  );
}
