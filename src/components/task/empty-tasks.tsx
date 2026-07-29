import { CheckSquare } from 'lucide-react';
import { Button } from '@/components/shared';

interface EmptyTasksProps {
  onAction: () => void;
  hasProjects?: boolean;
}

export function EmptyTasks({ onAction, hasProjects = true }: EmptyTasksProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card py-16 text-center shadow-sm">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
        <CheckSquare className="h-7 w-7 text-primary" />
      </div>
      <h3 className="mt-4 text-lg font-semibold text-foreground">
        {hasProjects ? 'No tasks found' : 'Project Required'}
      </h3>
      <p className="mb-6 mt-2 max-w-sm text-sm text-muted-foreground">
        {hasProjects 
          ? 'Get started by creating a new task to organize your work.'
          : 'You need to create a Project before you can create any tasks.'}
      </p>
      {hasProjects && (
        <Button onClick={onAction}>
          Create Task
        </Button>
      )}
    </div>
  );
}
