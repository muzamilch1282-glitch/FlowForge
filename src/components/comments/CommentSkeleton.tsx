import React from 'react';

export function CommentSkeleton() {
  return (
    <div className="flex gap-4 p-4 animate-pulse">
      <div className="h-10 w-10 shrink-0 rounded-full bg-muted" />
      <div className="flex-1 space-y-3">
        <div className="flex items-center gap-2">
          <div className="h-4 w-24 rounded bg-muted" />
          <div className="h-3 w-16 rounded bg-muted/50" />
        </div>
        <div className="space-y-2">
          <div className="h-3 w-full rounded bg-muted" />
          <div className="h-3 w-5/6 rounded bg-muted" />
        </div>
      </div>
    </div>
  );
}
