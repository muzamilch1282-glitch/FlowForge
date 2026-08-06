import React from 'react';

export function AttachmentSkeleton() {
  return (
    <div className="flex items-center gap-3 p-3 rounded-lg border border-border bg-card animate-pulse">
      <div className="h-10 w-10 shrink-0 rounded bg-muted" />
      <div className="flex-1 space-y-2">
        <div className="h-3 w-1/3 rounded bg-muted" />
        <div className="h-2 w-1/4 rounded bg-muted/50" />
      </div>
      <div className="h-8 w-8 rounded bg-muted shrink-0" />
    </div>
  );
}
