import * as React from 'react';
import { Filter, ChevronDown, Check } from 'lucide-react';
import { Project } from '@/types/project';
import { Workspace } from '@/types/workspace';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

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

const STATUSES = [
  { value: 'all', label: 'All Status' },
  { value: 'todo', label: 'Todo' },
  { value: 'in-progress', label: 'In Progress' },
  { value: 'review', label: 'Review' },
  { value: 'completed', label: 'Completed' },
];

const PRIORITIES = [
  { value: 'all', label: 'All Priorities' },
  { value: 'low', label: 'Low Priority' },
  { value: 'medium', label: 'Medium Priority' },
  { value: 'high', label: 'High Priority' },
];

const TIMINGS = [
  { value: 'all', label: 'Any Time' },
  { value: 'overdue', label: 'Overdue' },
  { value: 'today', label: 'Due Today' },
  { value: 'week', label: 'Due This Week' },
];

const ASSIGNEES = [
  { value: 'all', label: 'All Assignees' },
  { value: 'assigned', label: 'Assigned to me' },
  { value: 'unassigned', label: 'Unassigned' },
];

export function TaskFilters({
  filters,
  onFilterChange,
  projects,
  workspaces = []
}: TaskFiltersProps) {
  const getPriorityLabel = () => PRIORITIES.find(p => p.value === filters.priority)?.label || 'All Priorities';
  const getTimingLabel = () => TIMINGS.find(t => t.value === filters.timing)?.label || 'Any Time';
  const getAssigneeLabel = () => ASSIGNEES.find(a => a.value === filters.assigned_to)?.label || 'All Assignees';
  
  const getWorkspaceLabel = () => {
    if (filters.workspace_id === 'all') return 'All Workspaces';
    return workspaces.find(w => w.id === filters.workspace_id)?.name || 'All Workspaces';
  };
  
  const getProjectLabel = () => {
    if (filters.project_id === 'all') return 'All Projects';
    return projects.find(p => p.id === filters.project_id)?.title || 'All Projects';
  };

  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="flex flex-wrap items-center gap-3">

        {workspaces.length > 0 && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex h-9 items-center gap-2 rounded-full border border-border/60 bg-background px-4 text-sm shadow-sm hover:bg-secondary/50 hover:border-border transition-all">
                <span className="text-muted-foreground hidden sm:inline">Workspace:</span>
                <span className="font-medium max-w-[120px] truncate">{getWorkspaceLabel()}</span>
                <ChevronDown className="h-3 w-3 opacity-50" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-[200px]">
              <DropdownMenuItem onClick={() => onFilterChange('workspace_id', 'all')} className="justify-between">
                All Workspaces
                {filters.workspace_id === 'all' && <Check className="h-4 w-4" />}
              </DropdownMenuItem>
              {workspaces.map(w => (
                <DropdownMenuItem key={w.id} onClick={() => onFilterChange('workspace_id', w.id)} className="justify-between">
                  <span className="truncate">{w.name}</span>
                  {filters.workspace_id === w.id && <Check className="h-4 w-4 shrink-0" />}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        )}

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex h-9 items-center gap-2 rounded-full border border-border/60 bg-background px-4 text-sm shadow-sm hover:bg-secondary/50 hover:border-border transition-all">
              <span className="text-muted-foreground hidden sm:inline">Project:</span>
              <span className="font-medium max-w-[120px] truncate">{getProjectLabel()}</span>
              <ChevronDown className="h-3 w-3 opacity-50" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-[200px]">
            <DropdownMenuItem onClick={() => onFilterChange('project_id', 'all')} className="justify-between">
              All Projects
              {filters.project_id === 'all' && <Check className="h-4 w-4" />}
            </DropdownMenuItem>
            {projects.map(p => (
              <DropdownMenuItem key={p.id} onClick={() => onFilterChange('project_id', p.id)} className="justify-between">
                <span className="truncate">{p.title}</span>
                {filters.project_id === p.id && <Check className="h-4 w-4 shrink-0" />}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex h-9 items-center gap-2 rounded-full border border-border/60 bg-background px-4 text-sm shadow-sm hover:bg-secondary/50 hover:border-border transition-all">
              <span className="text-muted-foreground hidden sm:inline">Assignee:</span>
              <span className="font-medium">{getAssigneeLabel()}</span>
              <ChevronDown className="h-3 w-3 opacity-50" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            {ASSIGNEES.map(a => (
              <DropdownMenuItem key={a.value} onClick={() => onFilterChange('assigned_to', a.value)} className="justify-between">
                {a.label}
                {filters.assigned_to === a.value && <Check className="h-4 w-4" />}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex h-9 items-center gap-2 rounded-full border border-border/60 bg-background px-4 text-sm shadow-sm hover:bg-secondary/50 hover:border-border transition-all">
              <span className="text-muted-foreground hidden sm:inline">Priority:</span>
              <span className="font-medium">{getPriorityLabel()}</span>
              <ChevronDown className="h-3 w-3 opacity-50" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            {PRIORITIES.map(p => (
              <DropdownMenuItem key={p.value} onClick={() => onFilterChange('priority', p.value)} className="justify-between">
                {p.label}
                {filters.priority === p.value && <Check className="h-4 w-4" />}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>



      </div>

      {/* Animated Status Segmented Control */}
      <div className="flex bg-muted/50 p-1 rounded-lg overflow-x-auto no-scrollbar w-max max-w-full shrink-0">
        {STATUSES.map(s => (
          <button
            key={s.value}
            onClick={() => onFilterChange('status', s.value)}
            className="relative px-5 py-1.5 text-sm font-medium transition-colors rounded-md whitespace-nowrap"
          >
            {filters.status === s.value && (
              <motion.div
                layoutId="status-bg-task"
                className="absolute inset-0 bg-background shadow-sm rounded-md"
                initial={false}
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
            <span className={cn("relative z-10", filters.status === s.value ? "text-foreground" : "text-muted-foreground hover:text-foreground")}>
              {s.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
