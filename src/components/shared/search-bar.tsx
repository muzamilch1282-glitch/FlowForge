'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Search, Command } from 'lucide-react';
import { cn } from '@/lib/utils';

type SearchBarProps = React.FormHTMLAttributes<HTMLFormElement>;

export function SearchBar({ className, ...props }: SearchBarProps) {
  const router = useRouter();
  const [query, setQuery] = React.useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/dashboard/search?q=${encodeURIComponent(query.trim())}`);
    } else {
      router.push(`/dashboard/search`);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={cn(
        'relative flex h-9 items-center rounded-lg border border-border bg-muted/50 px-3 text-sm transition-colors w-full max-w-xs focus-within:ring-1 focus-within:ring-primary focus-within:bg-background',
        className
      )}
      {...props}
    >
      <Search className="h-4 w-4 shrink-0 text-muted-foreground mr-2" />
      <input
        type="text"
        placeholder="Search..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="flex-1 bg-transparent border-none outline-none text-foreground placeholder:text-muted-foreground h-full"
      />
      <kbd className="hidden rounded border border-border bg-background px-1.5 py-0.5 text-[10px] font-mono font-medium text-muted-foreground sm:inline pointer-events-none">
        <Command className="inline h-3 w-3" />K
      </kbd>
    </form>
  );
}
