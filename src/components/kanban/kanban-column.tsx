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
    <div className="flex h-full w-full min-w-[300px] max-w-[320px] shrink-0 flex-col rounded-xl bg-transparent">
      <div className="flex items-center justify-between px-3 py-2">
        <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
          {column.title}
          <span className="flex items-center justify-center rounded bg-secondary/60 px-1.5 py-0.5 text-[10px] font-bold text-foreground">
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
