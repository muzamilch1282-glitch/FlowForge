import * as React from 'react';
import { ArrowDownUp } from 'lucide-react';
import { Button } from '@/components/shared';

export type TaskSortOption = 'newest' | 'oldest' | 'priority' | 'due_date' | 'status' | 'alphabetical';

interface TaskSortDropdownProps {
  value: TaskSortOption;
  onChange: (value: TaskSortOption) => void;
}

export function TaskSortDropdown({ value, onChange }: TaskSortDropdownProps) {
  // Using a simple select wrapped in a nice UI. Alternatively, could build a full custom dropdown.
  return (
    <div className="relative flex items-center">
      <div className="flex h-9 items-center gap-2 rounded-md border border-input bg-background px-3 shadow-sm hover:bg-accent hover:text-accent-foreground transition-colors">
        <ArrowDownUp className="h-3.5 w-3.5 text-muted-foreground" />
        <select
          value={value}
          onChange={(e) => onChange(e.target.value as TaskSortOption)}
          className="bg-transparent text-sm text-foreground focus:outline-none cursor-pointer appearance-none pr-4"
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="priority">Priority</option>
          <option value="due_date">Due Date</option>
          <option value="status">Status</option>
          <option value="alphabetical">Alphabetical</option>
        </select>
        {/* Custom arrow to replace native one */}
        <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
          <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>
    </div>
  );
}
