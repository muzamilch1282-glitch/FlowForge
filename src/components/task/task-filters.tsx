import * as React from 'react';
import { Filter } from 'lucide-react';
import { Project } from '@/types/project';
import { Workspace } from '@/types/workspace';

export interface TaskFilterState {
  status: string;
  priority: string;
  project_id: string;
  workspace_id: string;
  assigned_to: string;
  timing: string;
}

interface TaskFiltersProps {
  filters: TaskFilterState;
  onFilterChange: (key: keyof TaskFilterState, value: string) => void;
  projects: Project[];
  workspaces?: Workspace[];
}

export function TaskFilters({
  filters,
  onFilterChange,
  projects,
  workspaces = []
}: TaskFiltersProps) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="flex h-9 items-center gap-2 rounded-md border border-input bg-background px-3 shadow-sm hover:bg-accent hover:text-accent-foreground transition-colors">
        <Filter className="h-3.5 w-3.5 text-muted-foreground" />
        <select
          value={filters.status}
          onChange={(e) => onFilterChange('status', e.target.value)}
          className="bg-transparent text-sm text-foreground focus:outline-none appearance-none pr-2 cursor-pointer"
        >
          <option value="all">All Status</option>
          <option value="todo">Todo</option>
          <option value="in-progress">In Progress</option>
          <option value="review">Review</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      <div className="flex h-9 items-center gap-2 rounded-md border border-input bg-background px-3 shadow-sm hover:bg-accent hover:text-accent-foreground transition-colors">
        <select
          value={filters.priority}
          onChange={(e) => onFilterChange('priority', e.target.value)}
          className="bg-transparent text-sm text-foreground focus:outline-none appearance-none pr-2 cursor-pointer"
        >
          <option value="all">All Priorities</option>
          <option value="low">Low Priority</option>
          <option value="medium">Medium Priority</option>
          <option value="high">High Priority</option>
        </select>
      </div>

      <div className="flex h-9 items-center gap-2 rounded-md border border-input bg-background px-3 shadow-sm hover:bg-accent hover:text-accent-foreground transition-colors">
        <select
          value={filters.timing}
          onChange={(e) => onFilterChange('timing', e.target.value)}
          className="bg-transparent text-sm text-foreground focus:outline-none appearance-none pr-2 cursor-pointer"
        >
          <option value="all">Any Time</option>
          <option value="overdue">Overdue</option>
          <option value="today">Due Today</option>
          <option value="week">Due This Week</option>
        </select>
      </div>

      {workspaces.length > 0 && (
        <div className="flex h-9 items-center gap-2 rounded-md border border-input bg-background px-3 shadow-sm hover:bg-accent hover:text-accent-foreground transition-colors">
          <select
            value={filters.workspace_id}
            onChange={(e) => onFilterChange('workspace_id', e.target.value)}
            className="bg-transparent text-sm text-foreground focus:outline-none appearance-none pr-2 cursor-pointer max-w-[150px] truncate"
          >
            <option value="all">All Workspaces</option>
            {workspaces.map(w => (
              <option key={w.id} value={w.id}>{w.name}</option>
            ))}
          </select>
        </div>
      )}

      <div className="flex h-9 items-center gap-2 rounded-md border border-input bg-background px-3 shadow-sm hover:bg-accent hover:text-accent-foreground transition-colors">
        <select
          value={filters.project_id}
          onChange={(e) => onFilterChange('project_id', e.target.value)}
          className="bg-transparent text-sm text-foreground focus:outline-none appearance-none pr-2 cursor-pointer max-w-[150px] truncate"
        >
          <option value="all">All Projects</option>
          {projects.map(p => (
            <option key={p.id} value={p.id}>{p.title}</option>
          ))}
        </select>
      </div>

      <div className="flex h-9 items-center gap-2 rounded-md border border-input bg-background px-3 shadow-sm hover:bg-accent hover:text-accent-foreground transition-colors hidden sm:flex">
        <select
          value={filters.assigned_to}
          onChange={(e) => onFilterChange('assigned_to', e.target.value)}
          className="bg-transparent text-sm text-foreground focus:outline-none appearance-none pr-2 cursor-pointer"
        >
          <option value="all">All Assignees</option>
          <option value="assigned">Assigned to me</option>
          <option value="unassigned">Unassigned</option>
        </select>
      </div>
    </div>
  );
}
