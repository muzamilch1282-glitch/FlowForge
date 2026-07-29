import * as React from 'react';
import { Filter } from 'lucide-react';

interface TaskFiltersProps {
  selectedStatus: string;
  onStatusChange: (val: string) => void;
  selectedPriority: string;
  onPriorityChange: (val: string) => void;
  sortBy: string;
  onSortChange: (val: string) => void;
}

export function TaskFilters({
  selectedStatus,
  onStatusChange,
  selectedPriority,
  onPriorityChange,
  sortBy,
  onSortChange
}: TaskFiltersProps) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="flex items-center gap-2 rounded-md border border-input bg-background px-3 py-2 shadow-sm">
        <Filter className="h-4 w-4 text-muted-foreground" />
        <select
          value={selectedStatus}
          onChange={(e) => onStatusChange(e.target.value)}
          className="bg-transparent text-sm text-foreground focus:outline-none"
        >
          <option value="all">All Status</option>
          <option value="todo">Todo</option>
          <option value="in-progress">In Progress</option>
          <option value="review">Review</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      <div className="flex items-center gap-2 rounded-md border border-input bg-background px-3 py-2 shadow-sm">
        <select
          value={selectedPriority}
          onChange={(e) => onPriorityChange(e.target.value)}
          className="bg-transparent text-sm text-foreground focus:outline-none"
        >
          <option value="all">All Priorities</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </div>

      <div className="flex items-center gap-2 rounded-md border border-input bg-background px-3 py-2 shadow-sm">
        <select
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value)}
          className="bg-transparent text-sm text-foreground focus:outline-none"
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="due-date">Due Date</option>
          <option value="alphabetical">A-Z</option>
        </select>
      </div>
    </div>
  );
}
