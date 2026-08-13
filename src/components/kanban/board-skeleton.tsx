import * as React from 'react';

export function BoardSkeleton() {
  return (
    <div className="flex h-full gap-6 overflow-x-hidden pt-4 animate-in fade-in duration-500">
      {[1, 2, 3, 4].map((col) => (
        <div key={col} className="flex h-full w-[350px] shrink-0 flex-col rounded-xl bg-secondary/30 p-4">
          <div className="mb-4 flex items-center justify-between">
            <div className="h-6 w-32 animate-pulse rounded bg-secondary"></div>
            <div className="h-6 w-8 animate-pulse rounded-full bg-secondary"></div>
          </div>
          
          <div className="flex flex-col gap-3">
            {[1, 2, 3].map((card) => (
              <div key={card} className="h-[120px] w-full animate-pulse rounded-lg border border-border bg-card p-4">
                <div className="h-5 w-3/4 rounded bg-secondary/50 mb-3"></div>
                <div className="h-4 w-full rounded bg-secondary/30 mb-2"></div>
                <div className="h-4 w-1/2 rounded bg-secondary/30 mb-4"></div>
                <div className="flex items-center justify-between mt-auto">
                  <div className="h-5 w-16 rounded-full bg-secondary/40"></div>
                  <div className="h-5 w-5 rounded-full bg-secondary/40"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
