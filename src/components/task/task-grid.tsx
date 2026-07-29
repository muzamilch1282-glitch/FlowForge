import * as React from 'react';
import { Task } from '@/types/task';
import { Project } from '@/types/project';
import { TaskCard } from './task-card';
import { EmptyTasks } from './empty-tasks';
import { TaskSkeleton } from './task-skeleton';

interface TaskGridProps {
  tasks: Task[];
  projects: Project[];
  isLoading: boolean;
  hasProjects: boolean;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
  onCreateNew: () => void;
}

export function TaskGrid({
  tasks,
  projects,
  isLoading,
  hasProjects,
  onEdit,
  onDelete,
  onCreateNew
}: TaskGridProps) {
  if (isLoading) {
    return <TaskSkeleton />;
  }

  if (tasks.length === 0) {
    return <EmptyTasks onAction={onCreateNew} hasProjects={hasProjects} />;
  }

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
      {tasks.map((task) => {
        const project = projects.find(p => p.id === task.project_id);
        return (
          <TaskCard 
            key={task.id} 
            task={task}
            project={project}
            onEdit={onEdit} 
            onDelete={onDelete} 
          />
        );
      })}
    </div>
  );
}
