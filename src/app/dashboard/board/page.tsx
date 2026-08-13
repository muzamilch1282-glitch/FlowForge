'use client';

import * as React from 'react';
import { useKanban } from '@/hooks/useKanban';
import { useProjects } from '@/hooks/useProjects';
import { KanbanBoard } from '@/components/kanban/kanban-board';
import { BoardHeader } from '@/components/kanban/board-header';
import { BoardSkeleton } from '@/components/kanban/board-skeleton';
import { BoardState } from '@/types/kanban';

export default function KanbanBoardPage() {
  const { boardState, tasks, columns, moveTask, isLoading: tasksLoading } = useKanban();
  const { projects, isLoading: projectsLoading } = useProjects();

  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedProject, setSelectedProject] = React.useState('all');
  const [selectedPriority, setSelectedPriority] = React.useState('all');
  const [selectedAssignee, setSelectedAssignee] = React.useState('all');

  const isLoading = tasksLoading || projectsLoading;

  // Filter the board state based on criteria
  const filteredBoardState = React.useMemo(() => {
    if (!boardState) return boardState;

    const filtered: BoardState = {
      'backlog': [],
      'todo': [],
      'in-progress': [],
      'review': [],
      'completed': []
    };

    const hasFilters = searchQuery.trim() !== '' || 
                       selectedProject !== 'all' || 
                       selectedPriority !== 'all' || 
                       selectedAssignee !== 'all';

    if (!hasFilters) return boardState;

    Object.keys(boardState).forEach((key) => {
      const statusKey = key as keyof BoardState;
      let colTasks = [...boardState[statusKey]];

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        colTasks = colTasks.filter(t => 
          t.title.toLowerCase().includes(q) || 
          (t.description && t.description.toLowerCase().includes(q))
        );
      }

      if (selectedProject !== 'all') {
        colTasks = colTasks.filter(t => t.project_id === selectedProject);
      }

      if (selectedPriority !== 'all') {
        colTasks = colTasks.filter(t => t.priority === selectedPriority);
      }

      if (selectedAssignee !== 'all') {
        if (selectedAssignee === 'unassigned') {
          colTasks = colTasks.filter(t => !t.assigned_to);
        } else {
          // 'assigned' means assigned to anyone (or me, if we had user context). 
          // Keeping it simple for now: assigned to *anyone* if 'assigned' is picked.
          colTasks = colTasks.filter(t => !!t.assigned_to);
        }
      }

      filtered[statusKey] = colTasks;
    });

    return filtered;
  }, [boardState, searchQuery, selectedProject, selectedPriority, selectedAssignee]);


  return (
    <div className="flex h-[calc(100vh-8rem)] flex-col gap-6">
      <div className="shrink-0">
        <BoardHeader
          projects={projects}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedProject={selectedProject}
          onProjectChange={setSelectedProject}
          selectedPriority={selectedPriority}
          onPriorityChange={setSelectedPriority}
          selectedAssignee={selectedAssignee}
          onAssigneeChange={setSelectedAssignee}
        />
      </div>
      
      <div className="flex-1 overflow-hidden">
        {isLoading ? (
          <BoardSkeleton />
        ) : (
          <KanbanBoard
            initialBoardState={filteredBoardState}
            columns={columns}
            projects={projects}
            onTaskMove={(id, status) => moveTask({ id, status })}
          />
        )}
      </div>
    </div>
  );
}
