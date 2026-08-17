import * as React from 'react';
import { Filter } from 'lucide-react';
import { Project } from '@/types/project';

interface BoardFiltersProps {
  projects: Project[];
  selectedProject: string;
  onProjectChange: (val: string) => void;
  selectedStatus: string;
  onStatusChange: (val: string) => void;
  selectedPriority: string;
  onPriorityChange: (val: string) => void;
  selectedAssignee: string;
  onAssigneeChange: (val: string) => void;
}

export function BoardFilters({
  projects,
  selectedProject,
  onProjectChange,
  selectedStatus,
  onStatusChange,
  selectedPriority,
  onPriorityChange,
  selectedAssignee,
  onAssigneeChange
}: BoardFiltersProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="flex h-9 items-center gap-2 rounded-md border border-input bg-background px-3 shadow-sm">
        <Filter className="h-3.5 w-3.5 text-muted-foreground" />
        <select
          value={selectedProject}
          onChange={(e) => onProjectChange(e.target.value)}
          className="bg-transparent text-sm text-foreground focus:outline-none min-w-[100px]"
        >
          <option value="all">All Projects</option>
          {projects.map((p) => (
            <option key={p.id} value={p.id}>{p.title}</option>
          ))}
        </select>
      </div>

      <div className="flex h-9 items-center gap-2 rounded-md border border-input bg-background px-3 shadow-sm">
        <select
          value={selectedStatus}
          onChange={(e) => onStatusChange(e.target.value)}
          className="bg-transparent text-sm text-foreground focus:outline-none min-w-[100px]"
        >
          <option value="all">All Statuses</option>
          <option value="backlog">Backlog</option>
          <option value="todo">To Do</option>
          <option value="in-progress">In Progress</option>
          <option value="review">Review</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      <div className="flex h-9 items-center gap-2 rounded-md border border-input bg-background px-3 shadow-sm">
        <select
          value={selectedPriority}
          onChange={(e) => onPriorityChange(e.target.value)}
          className="bg-transparent text-sm text-foreground focus:outline-none min-w-[100px]"
        >
          <option value="all">All Priorities</option>
          <option value="low">Low Priority</option>
          <option value="medium">Medium Priority</option>
          <option value="high">High Priority</option>
        </select>
      </div>

      <div className="flex h-9 items-center gap-2 rounded-md border border-input bg-background px-3 shadow-sm hidden sm:flex">
        <select
          value={selectedAssignee}
          onChange={(e) => onAssigneeChange(e.target.value)}
          className="bg-transparent text-sm text-foreground focus:outline-none min-w-[100px]"
        >
          <option value="all">All Assignees</option>
          <option value="assigned">Assigned to me</option>
          <option value="unassigned">Unassigned</option>
        </select>
      </div>
    </div>
  );
}
