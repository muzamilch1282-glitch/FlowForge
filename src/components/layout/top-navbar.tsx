'use client';

import * as React from 'react';
import { Search, Bot } from 'lucide-react';
import { Breadcrumbs, Logo } from '@/components/shared';
import { MobileSidebar } from './mobile-sidebar';
import { useRouter } from 'next/navigation';
import { useAppStore } from '@/store';
import { Button } from '@/components/shared';

export function TopNavbar() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = React.useState('');
  const { setAiAssistantOpen } = useAppStore();

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      router.push(`/dashboard/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <>
      <header className="sticky top-0 z-30 flex h-12 items-center justify-between border-b border-border/40 bg-background/95 backdrop-blur-sm px-4">
        {/* Left: Mobile sidebar trigger and Logo & Breadcrumbs */}
        <div className="flex items-center gap-3 lg:gap-4 flex-1">
          <div className="flex items-center gap-3 lg:hidden">
            <MobileSidebar />
            <Logo collapsed={false} />
          </div>
          <div className="hidden lg:block text-sm font-medium text-foreground">
            <Breadcrumbs />
          </div>
        </div>

        {/* Center: Global Search */}
        <div className="flex-1 flex justify-center px-4 max-w-xl hidden sm:flex">
          <div className="relative w-full max-w-md group">
            <div className="absolute inset-y-0 left-0 flex items-center pl-2.5 pointer-events-none text-muted-foreground group-focus-within:text-primary transition-colors">
              <Search className="h-3.5 w-3.5" />
            </div>
            <input
              type="text"
              placeholder="Search anything..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleSearch}
              className="h-8 w-full rounded-md bg-secondary/40 border border-transparent pl-8 pr-3 text-[13px] text-foreground placeholder:text-muted-foreground/70 outline-none transition-all hover:bg-secondary/60 focus:bg-background focus:border-primary/50 focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center justify-end flex-1">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setAiAssistantOpen(true)}
            className="h-8 w-8 text-primary hover:bg-primary/10 hover:text-primary"
            aria-label="Open AI Assistant"
          >
            <Bot className="h-4 w-4" />
          </Button>
        </div>
      </header>
    </>
  );
}
