'use client';

import * as React from 'react';
import { useTaskDependencies } from '@/hooks/useTaskDependencies';
import { useTasks } from '@/hooks/useTasks';
import { Button } from '@/components/shared';
import { Link2, Unlink, Plus, AlertCircle, ArrowDown, ArrowUp } from 'lucide-react';
import Link from 'next/link';

interface TaskDependenciesProps {
  taskId: string;
  projectId: string;
}

export function TaskDependencies({ taskId, projectId }: TaskDependenciesProps) {
  const { 
    blockedBy, 
    blocks, 
    isLoadingBlockedBy, 
    isLoadingBlocks,
    addDependency,
    removeDependency,
    isAddingDependency
  } = useTaskDependencies(taskId);
  
  const { tasks } = useTasks();
  const [isAdding, setIsAdding] = React.useState(false);
  const [selectedTask, setSelectedTask] = React.useState('');

  // Filter available tasks: same project, not the current task, and not already a dependency
  const availableTasks = tasks.filter(t => 
    t.project_id === projectId && 
    t.id !== taskId &&
    !blockedBy.some(dep => dep.depends_on_task_id === t.id)
  );

  const handleAdd = () => {
    if (!selectedTask) return;
    addDependency({ dependsOnTaskId: selectedTask, projectId }, {
      onSuccess: () => {
        setIsAdding(false);
        setSelectedTask('');
      }
    });
  };

  if (isLoadingBlockedBy || isLoadingBlocks) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-6 w-32 bg-secondary rounded"></div>
        <div className="h-10 w-full bg-secondary rounded"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-foreground flex items-center gap-2">
          <Link2 className="h-4 w-4" /> Dependencies
        </h3>
      </div>

      {/* Blocked By (Upstream) */}
      <div className="space-y-3">
        <h4 className="text-sm font-medium text-muted-foreground flex items-center gap-1.5">
          <ArrowDown className="h-3.5 w-3.5 text-amber-500" /> Blocked By
        </h4>
        
        {blockedBy.length === 0 ? (
          <p className="text-xs text-muted-foreground italic pl-5">This task is not waiting on anything.</p>
        ) : (
          <div className="space-y-2 pl-2">
            {blockedBy.map(dep => (
              <div key={dep.id} className="flex items-center justify-between group rounded-md border border-border bg-background p-2 text-sm shadow-sm">
                <Link href={`/dashboard/tasks/${dep.depends_on_task_id}`} className="hover:underline hover:text-primary truncate font-medium">
                  {dep.depends_on_task?.title || 'Unknown Task'}
                </Link>
                <button 
                  onClick={() => removeDependency(dep.id)}
                  className="text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Remove Dependency"
                >
                  <Unlink className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Add Dependency UI */}
        {isAdding ? (
          <div className="flex items-center gap-2 mt-2">
            <select
              value={selectedTask}
              onChange={(e) => setSelectedTask(e.target.value)}
              className="flex-1 rounded-md border border-input bg-background px-2 py-1.5 text-xs shadow-sm focus:border-primary focus:outline-none"
            >
              <option value="">Select a task...</option>
              {availableTasks.map(t => (
                <option key={t.id} value={t.id}>{t.title}</option>
              ))}
            </select>
            <Button size="sm" onClick={handleAdd} disabled={!selectedTask || isAddingDependency}>
              Add
            </Button>
            <Button size="sm" variant="ghost" onClick={() => setIsAdding(false)}>
              Cancel
            </Button>
          </div>
        ) : (
          <Button variant="outline" size="sm" className="w-full mt-2 text-xs h-8 border-dashed" onClick={() => setIsAdding(true)}>
            <Plus className="h-3 w-3 mr-1.5" /> Add Blocking Task
          </Button>
        )}
      </div>

      <div className="w-full h-px bg-border my-4" />

      {/* Blocks (Downstream) */}
      <div className="space-y-3">
        <h4 className="text-sm font-medium text-muted-foreground flex items-center gap-1.5">
          <ArrowUp className="h-3.5 w-3.5 text-blue-500" /> Blocks
        </h4>
        
        {blocks.length === 0 ? (
          <p className="text-xs text-muted-foreground italic pl-5">This task does not block any others.</p>
        ) : (
          <div className="space-y-2 pl-2">
            {blocks.map(dep => (
              <div key={dep.id} className="flex items-center justify-between group rounded-md border border-border bg-background p-2 text-sm shadow-sm">
                <Link href={`/dashboard/tasks/${dep.task_id}`} className="hover:underline hover:text-primary truncate font-medium">
                  {dep.dependent_task?.title || 'Unknown Task'}
                </Link>
                {/* Note: the current task is the upstream dependency for this downstream task. 
                    Removing it unblocks the downstream task. */}
                <button 
                  onClick={() => removeDependency(dep.id)}
                  className="text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Remove Dependency"
                >
                  <Unlink className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
