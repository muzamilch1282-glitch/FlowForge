import * as React from 'react';
import { Filter } from 'lucide-react';

interface WorkspaceFiltersProps {
  sortBy: string;
  onSortChange: (value: string) => void;
}

export function WorkspaceFilters({ sortBy, onSortChange }: WorkspaceFiltersProps) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Filter className="h-4 w-4" />
        <span>Sort by:</span>
      </div>
      <select
        value={sortBy}
        onChange={(e) => onSortChange(e.target.value)}
        className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      >
        <option value="recent">Recently Created</option>
        <option value="alphabetical">Alphabetical</option>
      </select>
    </div>
  );
}
