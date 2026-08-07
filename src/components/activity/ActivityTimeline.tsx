import React from 'react';
import { ActivityLog } from '@/types/activity';
import { ActivityCard } from './ActivityCard';
import { ActivitySkeleton } from './ActivitySkeleton';
import { EmptyActivity } from './EmptyActivity';
import { History } from 'lucide-react';

interface ActivityTimelineProps {
  activities: ActivityLog[];
  isLoading: boolean;
  title?: string;
}

export function ActivityTimeline({ activities, isLoading, title = "Activity History" }: ActivityTimelineProps) {
  return (
    <div className="flex flex-col space-y-4">
      <div className="flex items-center gap-2 mb-2">
        <History className="h-5 w-5 text-muted-foreground" />
        <h3 className="font-semibold text-foreground">{title}</h3>
      </div>

      {isLoading ? (
        <div className="py-2">
          <ActivitySkeleton />
          <ActivitySkeleton />
          <ActivitySkeleton />
        </div>
      ) : activities.length === 0 ? (
        <EmptyActivity />
      ) : (
        <div className="py-2">
          {activities.map((activity, index) => (
            <ActivityCard 
              key={activity.id} 
              activity={activity} 
              isLast={index === activities.length - 1} 
            />
          ))}
        </div>
      )}
    </div>
  );
}
