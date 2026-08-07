import React from 'react';
import { Activity } from 'lucide-react';

export function EmptyActivity() {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center rounded-xl border border-dashed border-border bg-card/30">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted mb-3">
        <Activity className="h-5 w-5 text-muted-foreground" />
      </div>
      <h3 className="text-sm font-medium text-foreground">No activity yet</h3>
      <p className="mt-1 text-xs text-muted-foreground max-w-sm">
        When changes happen in this workspace, they will appear here.
      </p>
    </div>
  );
}
