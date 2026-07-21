'use client';

import * as React from 'react';
import { usePathname } from 'next/navigation';
import { Bell, Search, Command } from 'lucide-react';
import { ThemeToggle } from '@/components/shared/theme-toggle';
import { MobileSidebar } from './mobile-sidebar';
import { cn } from '@/lib/utils';

function getBreadcrumb(pathname: string): { title: string; description: string } {
  const segments = pathname.split('/').filter(Boolean);
  const last = segments[segments.length - 1] || 'dashboard';
  const formatted = last
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');

  const descriptions: Record<string, string> = {
    dashboard: 'Overview of your workspace activity and metrics.',
    projects: 'Manage and track your projects.',
    tasks: 'View and organize your tasks.',
    workspace: 'Configure your workspace settings.',
    analytics: 'Insights and performance metrics.',
    team: 'Manage your team members.',
    settings: 'Application and account settings.',
    profile: 'Your profile and preferences.',
  };

  return {
    title: formatted,
    description: descriptions[last] || `Manage your ${formatted.toLowerCase()}.`,
  };
}

export function TopNavbar() {
  const pathname = usePathname();
  const { title, description } = getBreadcrumb(pathname);

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-border bg-background/80 backdrop-blur-xl px-4 sm:px-6">
      {/* Mobile sidebar trigger */}
      <MobileSidebar />

      {/* Page title */}
      <div className="hidden sm:block">
        <h2 className="text-sm font-semibold text-foreground">{title}</h2>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Search bar */}
      <button className="flex h-9 items-center gap-2 rounded-lg border border-border bg-muted/50 px-3 text-sm text-muted-foreground hover:bg-accent hover:text-foreground transition-colors w-full max-w-xs">
        <Search className="h-4 w-4 shrink-0" />
        <span className="hidden sm:inline">Search...</span>
        <kbd className="ml-auto hidden rounded border border-border bg-background px-1.5 py-0.5 text-[10px] font-mono font-medium text-muted-foreground sm:inline">
          <Command className="inline h-3 w-3" />K
        </kbd>
      </button>

      {/* Actions */}
      <div className="flex items-center gap-2">
        {/* Notifications */}
        <button className="relative flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground hover:bg-accent hover:text-foreground transition-colors">
          <Bell className="h-4 w-4" />
          <span className="absolute right-1.5 top-1.5 flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-violet-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-violet-500" />
          </span>
        </button>

        {/* Theme toggle */}
        <ThemeToggle />
      </div>
    </header>
  );
}
