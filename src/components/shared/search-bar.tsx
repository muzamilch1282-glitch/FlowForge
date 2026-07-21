'use client';

import * as React from 'react';
import { Search, Command } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SearchBarProps extends React.HTMLAttributes<HTMLButtonElement> {}

export function SearchBar({ className, ...props }: SearchBarProps) {
  return (
    <button
      className={cn(
        'flex h-9 items-center gap-2 rounded-lg border border-border bg-muted/50 px-3 text-sm text-muted-foreground hover:bg-accent hover:text-foreground transition-colors w-full max-w-xs',
        className
      )}
      {...props}
    >
      <Search className="h-4 w-4 shrink-0" />
      <span className="hidden sm:inline">Search...</span>
      <kbd className="ml-auto hidden rounded border border-border bg-background px-1.5 py-0.5 text-[10px] font-mono font-medium text-muted-foreground sm:inline">
        <Command className="inline h-3 w-3" />K
      </kbd>
    </button>
  );
}
