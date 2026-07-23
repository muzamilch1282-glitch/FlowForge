import React from 'react';
import { MessageSquare, CheckSquare, FileText, FolderKanban } from 'lucide-react';
import type { ActivityItem } from '@/data/dashboard';

interface RecentActivityProps {
  activities: ActivityItem[];
}

export function RecentActivity({ activities }: RecentActivityProps) {
  const getActivityIcon = (type: ActivityItem['type']) => {
    switch (type) {
      case 'comment':
        return <MessageSquare className="h-4 w-4 text-blue-500" />;
      case 'task':
        return <CheckSquare className="h-4 w-4 text-emerald-500" />;
      case 'file':
        return <FileText className="h-4 w-4 text-amber-500" />;
      case 'project':
        return <FolderKanban className="h-4 w-4 text-violet-500" />;
      default:
        return <span className="h-4 w-4 rounded-full bg-muted" />;
    }
  };

  const getActivityBg = (type: ActivityItem['type']) => {
    switch (type) {
      case 'comment':
        return 'bg-blue-500/10 border-blue-500/20';
      case 'task':
        return 'bg-emerald-500/10 border-emerald-500/20';
      case 'file':
        return 'bg-amber-500/10 border-amber-500/20';
      case 'project':
        return 'bg-violet-500/10 border-violet-500/20';
      default:
        return 'bg-muted border-border';
    }
  };

  return (
    <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
      <div className="mb-6 flex items-center justify-between">
        <h3 className="font-semibold tracking-tight text-foreground">
          Recent Activity
        </h3>
        <button className="text-xs font-medium text-primary hover:underline">
          View all
        </button>
      </div>

      <div className="space-y-6">
        {activities.map((activity, index) => (
          <div key={activity.id} className="relative flex gap-4">
            {/* Timeline connector */}
            {index !== activities.length - 1 && (
              <div className="absolute left-[19px] top-[38px] bottom-[-24px] w-px bg-border" />
            )}

            <div className="relative z-10 flex items-start gap-4">
              <div 
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border ${getActivityBg(activity.type)}`}
              >
                {getActivityIcon(activity.type)}
              </div>
              
              <div className="flex flex-col space-y-1">
                <p className="text-sm text-foreground">
                  <span className="font-medium">{activity.user}</span>{' '}
                  <span className="text-muted-foreground">{activity.action}</span>{' '}
                  <span className="font-medium">{activity.target}</span>
                </p>
                <span className="text-xs text-muted-foreground">
                  {activity.timestamp}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
