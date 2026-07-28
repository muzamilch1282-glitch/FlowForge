import * as React from 'react';

export function ProjectSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="flex flex-col overflow-hidden rounded-xl border border-border bg-card shadow-sm animate-pulse">
          <div className="p-5 flex-1">
            <div className="flex items-start justify-between mb-4">
              <div className="h-6 w-3/4 rounded-md bg-secondary/50"></div>
              <div className="h-8 w-8 rounded-md bg-secondary/30"></div>
            </div>
            
            <div className="space-y-2 mb-6">
              <div className="h-4 w-full rounded bg-secondary/30"></div>
              <div className="h-4 w-4/5 rounded bg-secondary/30"></div>
            </div>

            <div className="flex items-center gap-2 mb-4">
              <div className="h-5 w-16 rounded-full bg-secondary/40"></div>
              <div className="h-5 w-16 rounded-full bg-secondary/40"></div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <div className="h-3 w-16 rounded bg-secondary/30"></div>
                <div className="h-3 w-8 rounded bg-secondary/30"></div>
              </div>
              <div className="h-2 w-full rounded-full bg-secondary/20"></div>
            </div>
          </div>
          <div className="flex items-center justify-between border-t border-border bg-muted/20 px-5 py-3">
            <div className="flex -space-x-2">
              <div className="h-6 w-6 rounded-full bg-secondary/40 border-2 border-background"></div>
              <div className="h-6 w-6 rounded-full bg-secondary/40 border-2 border-background"></div>
              <div className="h-6 w-6 rounded-full bg-secondary/40 border-2 border-background"></div>
            </div>
            <div className="h-4 w-24 rounded bg-secondary/30"></div>
          </div>
        </div>
      ))}
    </div>
  );
}
