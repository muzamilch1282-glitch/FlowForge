'use client';

import * as React from 'react';
import { useWorkspaceActivity } from '@/hooks/useActivity';
import { useWorkspace } from '@/hooks/useWorkspace';
import { formatDistanceToNow } from 'date-fns';
import { Activity as ActivityIcon, CheckCircle2, MessageSquare, Link2, PlusCircle, UserPlus, FileText } from 'lucide-react';
import Link from 'next/link';
import { Project } from '@/types/project';

interface LiveActivityFeedProps {
  projects: Project[];
}

export function LiveActivityFeed({ projects }: LiveActivityFeedProps) {
  const { currentWorkspace } = useWorkspace();
  const { data: activities = [], isLoading } = useWorkspaceActivity(currentWorkspace?.id);

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="flex gap-3 animate-pulse">
            <div className="w-8 h-8 rounded-full bg-secondary/50 shrink-0" />
            <div className="flex-1 space-y-2 py-1">
              <div className="h-4 bg-secondary/50 rounded w-3/4" />
              <div className="h-3 bg-secondary/50 rounded w-1/4" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (activities.length === 0) {
    return (
      <div className="text-center py-6 text-muted-foreground text-sm">
        No recent activity found.
      </div>
    );
  }

  return (
    <div className="space-y-6 relative before:absolute before:inset-0 before:ml-4 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-border before:to-transparent">
      {activities.slice(0, 10).map((activity) => {
        
        let Icon = ActivityIcon;
        let iconBg = 'bg-blue-500/10 text-blue-500';
        let linkHref = '#';

        // Icon Logic
        if (activity.action.includes('created')) {
          Icon = PlusCircle;
          iconBg = 'bg-emerald-500/10 text-emerald-500';
        } else if (activity.action.includes('completed')) {
          Icon = CheckCircle2;
          iconBg = 'bg-green-500/10 text-green-500';
        } else if (activity.action.includes('comment')) {
          Icon = MessageSquare;
          iconBg = 'bg-amber-500/10 text-amber-500';
        } else if (activity.action.includes('depend')) {
          Icon = Link2;
          iconBg = 'bg-indigo-500/10 text-indigo-500';
        } else if (activity.action.includes('invit')) {
          Icon = UserPlus;
          iconBg = 'bg-purple-500/10 text-purple-500';
        } else if (activity.action.includes('attach') || activity.action.includes('file')) {
          Icon = FileText;
          iconBg = 'bg-cyan-500/10 text-cyan-500';
        }

        // Link Logic
        if (activity.task_id) {
          linkHref = `/dashboard/tasks/${activity.task_id}`;
        } else if (activity.project_id) {
          linkHref = `/dashboard/projects/${activity.project_id}`;
        }

        const project = projects.find(p => p.id === activity.project_id);

        return (
          <div key={activity.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
            
            {/* Timeline dot */}
            <div className={`flex items-center justify-center w-8 h-8 rounded-full border-4 border-background shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 shadow-sm transition-transform duration-300 group-hover:scale-110 ${iconBg}`}>
              <Icon className="w-3.5 h-3.5" />
            </div>
            
            {/* Content Box */}
            <div className="w-[calc(100%-3rem)] md:w-[calc(50%-2rem)] p-3 rounded-xl border border-border/50 bg-card hover:bg-accent/30 hover:border-border transition-colors shadow-sm">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-semibold text-foreground">
                  {activity.user?.full_name || activity.user?.email || 'Someone'}
                </span>
                <time className="text-[10px] text-muted-foreground font-medium">
                  {formatDistanceToNow(new Date(activity.created_at), { addSuffix: true })}
                </time>
              </div>
              
              <p className="text-sm text-muted-foreground leading-snug">
                {activity.action.replace('_', ' ')}{' '}
                <Link href={linkHref} className="font-medium text-foreground hover:text-primary transition-colors">
                  {activity.entity_name}
                </Link>
              </p>
              
              {project && (
                <p className="text-[10px] text-muted-foreground mt-1.5 uppercase tracking-wider font-semibold">
                  in {project.title}
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
