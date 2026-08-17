import * as React from 'react';
import { Filter, SortAsc, ChevronDown, Check } from 'lucide-react';
import { Workspace } from '@/types/workspace';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

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

const STATUSES = [
  { value: 'all', label: 'All Statuses' },
  { value: 'active', label: 'Active' },
  { value: 'on-hold', label: 'On Hold' },
  { value: 'completed', label: 'Completed' },
];

const PRIORITIES = [
  { value: 'all', label: 'All Priorities' },
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
];

const SORTS = [
  { value: 'newest', label: 'Newest First' },
  { value: 'oldest', label: 'Oldest First' },
  { value: 'alphabetical', label: 'Alphabetical (A-Z)' },
  { value: 'due-date', label: 'Due Date' },
];

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
  const getWorkspaceLabel = () => {
    if (selectedWorkspace === 'all') return 'All Workspaces';
    return workspaces.find(w => w.id === selectedWorkspace)?.name || 'All Workspaces';
  };

  const getPriorityLabel = () => {
    return PRIORITIES.find(p => p.value === selectedPriority)?.label || 'All Priorities';
  };

  const getSortLabel = () => {
    return SORTS.find(s => s.value === sortBy)?.label || 'Newest First';
  };

  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="flex flex-wrap items-center gap-3">
        {/* Workspace Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex h-9 items-center gap-2 rounded-full border border-border/60 bg-background px-4 text-sm shadow-sm hover:bg-secondary/50 hover:border-border transition-all">
              <span className="text-muted-foreground hidden sm:inline">Workspace:</span>
              <span className="font-medium max-w-[150px] truncate">{getWorkspaceLabel()}</span>
              <ChevronDown className="h-3 w-3 opacity-50" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-[200px]">
            <DropdownMenuItem onClick={() => onWorkspaceChange('all')} className="justify-between">
              All Workspaces
              {selectedWorkspace === 'all' && <Check className="h-4 w-4" />}
            </DropdownMenuItem>
            {workspaces.map(w => (
              <DropdownMenuItem key={w.id} onClick={() => onWorkspaceChange(w.id)} className="justify-between">
                <span className="truncate">{w.name}</span>
                {selectedWorkspace === w.id && <Check className="h-4 w-4 shrink-0" />}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Priority Dropdown */}
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
              <DropdownMenuItem key={p.value} onClick={() => onPriorityChange(p.value)} className="justify-between">
                {p.label}
                {selectedPriority === p.value && <Check className="h-4 w-4" />}
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
            onClick={() => onStatusChange(s.value)}
            className="relative px-5 py-1.5 text-sm font-medium transition-colors rounded-md whitespace-nowrap"
          >
            {selectedStatus === s.value && (
              <motion.div
                layoutId="status-bg-project"
                className="absolute inset-0 bg-background shadow-sm rounded-md"
                initial={false}
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
            <span className={cn("relative z-10", selectedStatus === s.value ? "text-foreground" : "text-muted-foreground hover:text-foreground")}>
               {s.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
