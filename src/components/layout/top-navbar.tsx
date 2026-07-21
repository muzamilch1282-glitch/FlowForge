'use client';

import * as React from 'react';
import { Bell } from 'lucide-react';
import { ThemeToggle, SearchBar, UserProfileDropdown, Breadcrumbs } from '@/components/shared';
import { MobileSidebar } from './mobile-sidebar';

export function TopNavbar() {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-border bg-background/80 backdrop-blur-xl px-4 sm:px-6">
      {/* Mobile sidebar trigger */}
      <MobileSidebar />

      {/* Page title / Breadcrumbs */}
      <Breadcrumbs />

      {/* Spacer */}
      <div className="flex-1" />

      {/* Search bar */}
      <SearchBar />

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

        {/* User Profile */}
        <div className="ml-2">
          <UserProfileDropdown />
        </div>
      </div>
    </header>
  );
}
