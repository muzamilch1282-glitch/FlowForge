import * as React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { taskService } from '@/services/task.service';
import { Task, TaskStatus } from '@/types/task';
import { BoardState, defaultColumns } from '@/types/kanban';
import { toast } from 'sonner';

export function useKanban() {
  const queryClient = useQueryClient();

  // Fetch all tasks
  const { data: tasks = [], isLoading, error } = useQuery({
    queryKey: ['tasks'],
    queryFn: () => taskService.getTasks(),
  });

  // Group tasks by status
  const boardState = React.useMemo(() => {
    const state: BoardState = {
      'todo': [],
      'in-progress': [],
      'review': [],
      'completed': [],
    };

    // Sort tasks by created_at descending (newest first) to maintain stable order
    const sortedTasks = [...tasks].sort((a, b) => {
      const dateA = new Date(a.created_at).getTime();
      const dateB = new Date(b.created_at).getTime();
      return dateB - dateA;
    });

    sortedTasks.forEach((task) => {
      if (state[task.status]) {
        state[task.status].push(task);
      } else {
        // Fallback for invalid status
        state['todo'].push(task);
      }
    });

    return state;
  }, [tasks]);

  // Mutation to update task status
  const moveTaskMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: TaskStatus }) => 
      taskService.updateTask(id, { status }),
    onMutate: async ({ id, status }) => {
      // Cancel any outgoing refetches to avoid overwriting optimistic update
      await queryClient.cancelQueries({ queryKey: ['tasks'] });

      // Snapshot the previous value
      const previousTasks = queryClient.getQueryData<Task[]>(['tasks']);

      // Optimistically update the cache
      if (previousTasks) {
        queryClient.setQueryData<Task[]>(['tasks'], (old) => 
          old?.map(task => task.id === id ? { ...task, status } : task)
        );
      }

      return { previousTasks };
    },
    onSuccess: () => {
      toast.success('Task moved successfully');
    },
    onError: (err, newTodo, context) => {
      // Revert if error
      if (context?.previousTasks) {
        queryClient.setQueryData(['tasks'], context.previousTasks);
      }
      toast.error('Failed to move task');
    },
    onSettled: () => {
      // Invalidate query to make sure data is fresh
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });

  return {
    boardState,
    tasks,
    isLoading,
    error,
    moveTask: moveTaskMutation.mutate,
    columns: defaultColumns,
  };
}
