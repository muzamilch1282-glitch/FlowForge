'use client';

import * as React from 'react';
import { Bell, Sparkles } from 'lucide-react';
import { ThemeToggle, SearchBar, UserProfileDropdown, Breadcrumbs } from '@/components/shared';
import { NotificationBell } from '@/components/notifications/NotificationBell';
import { RealtimeStatus } from '@/components/realtime/RealtimeStatus';
import { MobileSidebar } from './mobile-sidebar';
import { Button } from '@/components/shared';
import { useAppStore } from '@/store';

export function TopNavbar() {
  const { setAiAssistantOpen } = useAppStore();

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
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => setAiAssistantOpen(true)}
          className="text-primary hover:text-primary hover:bg-primary/10 transition-colors"
          title="Ask AI"
        >
          <Sparkles className="h-5 w-5" />
        </Button>
        <NotificationBell />


        {/* User Profile */}
        <div className="ml-2">
          <UserProfileDropdown />
        </div>
      </div>
    </header>
  );
}
