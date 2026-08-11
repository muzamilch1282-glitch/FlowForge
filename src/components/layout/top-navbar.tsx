'use client';

import * as React from 'react';
import { Bell } from 'lucide-react';
import { ThemeToggle, SearchBar, UserProfileDropdown, Breadcrumbs } from '@/components/shared';
import { NotificationBell } from '@/components/notifications/NotificationBell';
import { RealtimeStatus } from '@/components/realtime/RealtimeStatus';
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
        <RealtimeStatus />
        <NotificationBell />


        {/* User Profile */}
        <div className="ml-2">
          <UserProfileDropdown />
        </div>
      </div>
    </header>
  );
}
