import * as React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Task } from '@/types/task';
import { Column } from '@/types/kanban';
import { Project } from '@/types/project';
import { KanbanTaskCard } from './kanban-task-card';
import { EmptyColumn } from './empty-column';

interface KanbanColumnProps {
  column: Column;
  tasks: Task[];
  projects: Project[];
}

export function KanbanColumn({ column, tasks, projects }: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: column.id,
    data: {
      type: 'Column',
      column,
    },
  });

  const taskIds = React.useMemo(() => tasks.map(t => t.id), [tasks]);

  return (
    <div className="flex h-full w-full min-w-[320px] max-w-[350px] shrink-0 flex-col rounded-xl bg-secondary/30">
      <div className="flex items-center justify-between p-4 pb-2">
        <h3 className="font-semibold text-foreground flex items-center gap-2">
          {column.title}
          <span className="flex h-5 items-center justify-center rounded-full bg-secondary px-2 text-xs font-medium text-muted-foreground">
            {tasks.length}
          </span>
        </h3>
      </div>
      
      <div 
        ref={setNodeRef}
        className={`flex flex-1 flex-col gap-3 p-4 overflow-y-auto min-h-[150px] transition-colors
          ${isOver ? 'bg-secondary/50 rounded-b-xl' : ''}`}
      >
        <SortableContext items={taskIds} strategy={verticalListSortingStrategy}>
          {tasks.length > 0 ? (
            tasks.map(task => (
              <KanbanTaskCard 
                key={task.id} 
                task={task} 
                project={projects.find(p => p.id === task.project_id)} 
              />
            ))
          ) : (
            <EmptyColumn />
          )}
        </SortableContext>
      </div>
    </div>
  );
}
