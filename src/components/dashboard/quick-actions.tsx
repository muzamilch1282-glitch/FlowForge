import React from 'react';
import Link from 'next/link';
import type { QuickAction } from '@/data/dashboard';

interface QuickActionsProps {
  actions: QuickAction[];
}

export function QuickActions({ actions }: QuickActionsProps) {
  return (
    <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
      <div className="mb-4">
        <h3 className="font-semibold tracking-tight text-foreground">
          Quick Actions
        </h3>
        <p className="text-xs text-muted-foreground mt-1">
          Frequently used shortcuts
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-1">
        {actions.map((action) => {
          const Icon = action.icon;
          return (
            <Link
              key={action.id}
              href={action.href}
              className="group flex items-center gap-3 rounded-lg border border-border p-3 transition-all hover:border-primary/50 hover:bg-accent hover:shadow-sm"
            >
              <div 
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border ${action.color} transition-colors group-hover:bg-background`}
              >
                <Icon className="h-5 w-5" />
              </div>
              <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                {action.label}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
