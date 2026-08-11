import * as React from 'react';
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragOverEvent,
  DragEndEvent,
} from '@dnd-kit/core';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { BoardState, Column, defaultColumns } from '@/types/kanban';
import { Task, TaskStatus } from '@/types/task';
import { Project } from '@/types/project';
import { KanbanColumn } from './kanban-column';
import { KanbanTaskCard } from './kanban-task-card';

interface KanbanBoardProps {
  initialBoardState: BoardState;
  columns: Column[];
  projects: Project[];
  onTaskMove: (id: string, status: TaskStatus) => void;
}

export function KanbanBoard({ initialBoardState, columns, projects, onTaskMove }: KanbanBoardProps) {
  // Local state for optimistic drag and drop updates before server responds
  const [boardState, setBoardState] = React.useState<BoardState>(initialBoardState);
  const [activeTask, setActiveTask] = React.useState<Task | null>(null);

  // Sync with prop when server data changes, but NOT while dragging
  React.useEffect(() => {
    if (!activeTask) {
      setBoardState(initialBoardState);
    }
  }, [initialBoardState, activeTask]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const onDragStart = (event: DragStartEvent) => {
    if (event.active.data.current?.type === 'Task') {
      setActiveTask(event.active.data.current.task);
    }
  };

  const onDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;
    if (activeId === overId) return;

    const isActiveTask = active.data.current?.type === 'Task';
    const isOverTask = over.data.current?.type === 'Task';
    const isOverColumn = over.data.current?.type === 'Column';

    if (!isActiveTask) return;

    // Moving task over another task
    if (isOverTask) {
      const activeTaskData = active.data.current?.task as Task;
      const overTaskData = over.data.current?.task as Task;
      
      const activeStatus = activeTaskData.status;
      const overStatus = overTaskData.status;

      if (activeStatus !== overStatus) {
        setBoardState((prev) => {
          const activeItems = [...prev[activeStatus]];
          const overItems = [...prev[overStatus]];
          
          const activeIndex = activeItems.findIndex(t => t.id === activeId);
          const overIndex = overItems.findIndex(t => t.id === overId);
          
          if (activeIndex === -1) return prev; // Protect against rapid re-renders

          // Modify active task status locally for smooth visual
          const taskToMove = { ...activeItems[activeIndex], status: overStatus };
          activeItems.splice(activeIndex, 1);
          
          const isBelowOverItem =
            over &&
            active.rect.current.translated &&
            active.rect.current.translated.top > over.rect.top + over.rect.height;

          const modifier = isBelowOverItem ? 1 : 0;
          
          overItems.splice(overIndex >= 0 ? overIndex + modifier : overItems.length + 1, 0, taskToMove);

          return {
            ...prev,
            [activeStatus]: activeItems,
            [overStatus]: overItems,
          };
        });
      }
    }

    // Moving task over an empty column
    if (isOverColumn) {
      const activeTaskData = active.data.current?.task as Task;
      const overColumnId = over.id as TaskStatus;
      const activeStatus = activeTaskData.status;
      
      if (activeStatus !== overColumnId) {
        setBoardState((prev) => {
          const activeItems = [...prev[activeStatus]];
          const overItems = [...prev[overColumnId]];
          
          const activeIndex = activeItems.findIndex(t => t.id === activeId);
          
          if (activeIndex === -1) return prev; // Protect against rapid re-renders
          
          const taskToMove = { ...activeItems[activeIndex], status: overColumnId };
          activeItems.splice(activeIndex, 1);
          overItems.push(taskToMove);
          
          return {
            ...prev,
            [activeStatus]: activeItems,
            [overColumnId]: overItems,
          };
        });
      }
    }
  };

  const onDragEnd = (event: DragEndEvent) => {
    setActiveTask(null);
    const { active, over } = event;
    if (!over) return;
    
    // Calculate new status based on where it was dropped (either on a task or column)
    let newStatus: TaskStatus | null = null;
    
    if (over.data.current?.type === 'Task') {
      newStatus = (over.data.current?.task as Task).status;
    } else if (over.data.current?.type === 'Column') {
      newStatus = over.id as TaskStatus;
    }

    const activeTaskData = active.data.current?.task as Task;
    
    if (newStatus && activeTaskData && activeTaskData.status !== newStatus) {
      onTaskMove(activeTaskData.id, newStatus);
    }
  };

  return (
    <div className="flex h-full w-full gap-6 overflow-x-auto pb-4 pt-2">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={onDragStart}
        onDragOver={onDragOver}
        onDragEnd={onDragEnd}
      >
        {columns.map((column) => (
          <KanbanColumn 
            key={column.id} 
            column={column} 
            tasks={boardState[column.id] || []} 
            projects={projects}
          />
        ))}

        <DragOverlay>
          {activeTask ? (
            <KanbanTaskCard 
              task={activeTask} 
              project={projects.find(p => p.id === activeTask.project_id)} 
            />
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}
