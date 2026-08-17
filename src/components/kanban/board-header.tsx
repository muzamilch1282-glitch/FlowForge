import * as React from 'react';
import { PageHeader, Button } from '@/components/shared';
import { RefreshCw } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import { BoardSearch } from './board-search';
import { BoardFilters } from './board-filters';
import { Project } from '@/types/project';

interface BoardHeaderProps {
  projects: Project[];
  searchQuery: string;
  onSearchChange: (val: string) => void;
  selectedProject: string;
  onProjectChange: (val: string) => void;
  selectedStatus?: string;
  onStatusChange?: (val: string) => void;
  selectedPriority: string;
  onPriorityChange: (val: string) => void;
  selectedAssignee: string;
  onAssigneeChange: (val: string) => void;
}

export function BoardHeader({
  projects,
  searchQuery,
  onSearchChange,
  selectedProject,
  onProjectChange,
  selectedStatus = 'all',
  onStatusChange = () => {},
  selectedPriority,
  onPriorityChange,
  selectedAssignee,
  onAssigneeChange
}: BoardHeaderProps) {
  const queryClient = useQueryClient();
  const [isRefreshing, setIsRefreshing] = React.useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await queryClient.invalidateQueries({ queryKey: ['tasks'] });
    setTimeout(() => setIsRefreshing(false), 500); // Visual feedback
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <PageHeader
          title="Kanban Board"
          description="Drag and drop tasks to update their status."
        />
        <Button variant="outline" size="icon" onClick={handleRefresh} disabled={isRefreshing}>
          <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin text-primary' : ''}`} />
        </Button>
      </div>

      <div className="flex flex-col gap-3 md:flex-row md:items-center">
        <BoardSearch value={searchQuery} onChange={onSearchChange} />
        <BoardFilters 
          projects={projects}
          selectedProject={selectedProject}
          onProjectChange={onProjectChange}
          selectedStatus={selectedStatus}
          onStatusChange={onStatusChange}
          selectedPriority={selectedPriority}
          onPriorityChange={onPriorityChange}
          selectedAssignee={selectedAssignee}
          onAssigneeChange={onAssigneeChange}
        />
      </div>
    </div>
  );
}
