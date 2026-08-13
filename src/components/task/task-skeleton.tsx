import * as React from 'react';

export function TaskSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 animate-in fade-in duration-500">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="flex flex-col rounded-lg border border-border bg-card p-4 shadow-sm animate-pulse">
          <div className="flex items-start justify-between mb-3">
            <div className="h-5 w-2/3 rounded-md bg-secondary/50"></div>
            <div className="h-6 w-6 rounded-md bg-secondary/30"></div>
          </div>
          
          <div className="space-y-2 mb-4">
            <div className="h-3 w-full rounded bg-secondary/30"></div>
            <div className="h-3 w-4/5 rounded bg-secondary/30"></div>
          </div>

          <div className="flex items-center gap-2 mb-4">
            <div className="h-5 w-16 rounded-full bg-secondary/40"></div>
            <div className="h-5 w-16 rounded-full bg-secondary/40"></div>
          </div>

          <div className="mt-auto pt-4 border-t border-border flex items-center justify-between">
            <div className="h-6 w-6 rounded-full bg-secondary/40"></div>
            <div className="h-3 w-20 rounded bg-secondary/30"></div>
          </div>
        </div>
      ))}
    </div>
  );
}
