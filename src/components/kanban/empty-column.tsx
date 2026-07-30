import * as React from 'react';

export function EmptyColumn() {
  return (
    <div className="flex h-32 flex-col items-center justify-center rounded-lg border-2 border-dashed border-border/60 bg-card/50 px-4 text-center">
      <p className="text-sm font-medium text-muted-foreground">
        No tasks here
      </p>
      <p className="mt-1 text-xs text-muted-foreground/70">
        Drag a task here or create a new one
      </p>
    </div>
  );
}
