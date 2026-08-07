import React from 'react';

export function ActivitySkeleton() {
  return (
    <div className="flex gap-4 p-4 animate-pulse">
      <div className="flex flex-col items-center">
        <div className="h-8 w-8 rounded-full bg-muted shrink-0 z-10" />
        <div className="w-px h-full bg-border mt-2" />
      </div>
      
      <div className="flex-1 space-y-2 pt-1 pb-6">
        <div className="flex items-center gap-2">
          <div className="h-4 w-24 rounded bg-muted" />
          <div className="h-3 w-16 rounded bg-muted/50" />
        </div>
        <div className="h-3 w-3/4 rounded bg-muted/50" />
      </div>
    </div>
  );
}
