import * as React from 'react';
import { Search } from 'lucide-react';

interface WorkspaceSearchProps {
  value: string;
  onChange: (value: string) => void;
}

export function WorkspaceSearch({ value, onChange }: WorkspaceSearchProps) {
  return (
    <div className="relative max-w-sm w-full">
      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
        <Search className="h-4 w-4 text-muted-foreground" />
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="flex h-10 w-full rounded-md border border-input bg-background pl-10 pr-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        placeholder="Search workspaces..."
      />
    </div>
  );
}
