import React from 'react';

export function NotificationSkeleton() {
  return (
    <div className="flex items-start gap-3 p-3 rounded-lg bg-card animate-pulse border-b border-border last:border-0">
      <div className="h-8 w-8 shrink-0 rounded-full bg-muted" />
      <div className="flex-1 space-y-2 py-1">
        <div className="h-3 w-3/4 rounded bg-muted" />
        <div className="h-2 w-1/2 rounded bg-muted/50" />
      </div>
    </div>
  );
}
