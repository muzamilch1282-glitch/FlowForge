import * as React from 'react';
import { Filter, SortAsc } from 'lucide-react';
import { Workspace } from '@/types/workspace';

interface ProjectFiltersProps {
  workspaces: Workspace[];
  selectedWorkspace: string;
  onWorkspaceChange: (val: string) => void;
  selectedStatus: string;
  onStatusChange: (val: string) => void;
  selectedPriority: string;
  onPriorityChange: (val: string) => void;
  sortBy: string;
  onSortChange: (val: string) => void;
}

export function ProjectFilters({
  workspaces,
  selectedWorkspace,
  onWorkspaceChange,
  selectedStatus,
  onStatusChange,
  selectedPriority,
  onPriorityChange,
  sortBy,
  onSortChange
}: ProjectFiltersProps) {
  return (
    <div className="flex flex-col sm:flex-row flex-wrap gap-3">
      <div className="flex items-center gap-2">
        <Filter className="h-4 w-4 text-muted-foreground" />
        <select
          value={selectedWorkspace}
          onChange={(e) => onWorkspaceChange(e.target.value)}
          className="h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
        >
          <option value="all">All Workspaces</option>
          {workspaces.map(ws => (
            <option key={ws.id} value={ws.id}>{ws.name}</option>
          ))}
        </select>
        
        <select
          value={selectedStatus}
          onChange={(e) => onStatusChange(e.target.value)}
          className="h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
        >
          <option value="all">All Statuses</option>
          <option value="active">Active</option>
          <option value="on-hold">On Hold</option>
          <option value="completed">Completed</option>
        </select>

        <select
          value={selectedPriority}
          onChange={(e) => onPriorityChange(e.target.value)}
          className="h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
        >
          <option value="all">All Priorities</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </div>

      <div className="flex items-center gap-2 sm:ml-auto">
        <SortAsc className="h-4 w-4 text-muted-foreground" />
        <select
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value)}
          className="h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="alphabetical">Alphabetical (A-Z)</option>
          <option value="due-date">Due Date</option>
        </select>
      </div>
    </div>
  );
}
