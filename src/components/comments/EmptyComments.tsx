import React from 'react';
import { MessageSquare } from 'lucide-react';

export function EmptyComments() {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center rounded-xl border border-dashed border-border bg-card/50">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted mb-4">
        <MessageSquare className="h-6 w-6 text-muted-foreground" />
      </div>
      <h3 className="text-sm font-medium text-foreground">No comments yet</h3>
      <p className="mt-1 text-sm text-muted-foreground max-w-sm">
        Be the first to share your thoughts or updates on this task.
      </p>
    </div>
  );
}
