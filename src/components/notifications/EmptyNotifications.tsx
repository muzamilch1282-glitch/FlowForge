import React from 'react';
import { Bell } from 'lucide-react';

export function EmptyNotifications() {
  return (
    <div className="flex flex-col items-center justify-center py-8 px-4 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted mb-3">
        <Bell className="h-5 w-5 text-muted-foreground" />
      </div>
      <h3 className="text-sm font-medium text-foreground">No new notifications</h3>
      <p className="mt-1 text-xs text-muted-foreground">
        We'll let you know when something important happens.
      </p>
    </div>
  );
}
