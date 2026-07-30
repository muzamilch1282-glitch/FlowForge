import * as React from 'react';
import { Search } from 'lucide-react';

interface BoardSearchProps {
  value: string;
  onChange: (value: string) => void;
}

export function BoardSearch({ value, onChange }: BoardSearchProps) {
  return (
    <div className="relative min-w-[200px] w-full max-w-[300px]">
      <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search board..."
        className="h-9 w-full rounded-md border border-input bg-background pl-9 pr-4 text-sm shadow-sm transition-colors focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
      />
    </div>
  );
}
