import * as React from 'react';

export function TeamSkeleton() {
  return (
    <div className="space-y-4 animate-in fade-in duration-500">
      {[1, 2, 3].map((i) => (
        <div key={i} className="flex items-center justify-between rounded-xl border border-border bg-card p-4">
          <div className="flex items-center gap-4">
            <div className="h-10 w-10 rounded-full bg-secondary animate-pulse" />
            <div className="space-y-2">
              <div className="h-4 w-32 rounded-md bg-secondary animate-pulse" />
              <div className="h-3 w-24 rounded-md bg-secondary animate-pulse" />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="h-5 w-16 rounded-full bg-secondary animate-pulse hidden sm:block" />
            <div className="h-8 w-8 rounded-md bg-secondary animate-pulse" />
          </div>
        </div>
      ))}
    </div>
  );
}
