'use client';

import * as React from 'react';
import { PageHeader, Button } from '@/components/shared';
import { Plus } from 'lucide-react';
import { useTasks } from '@/hooks/useTasks';
import { useProjects } from '@/hooks/useProjects';
import { useWorkspace } from '@/hooks/useWorkspace';
import { TaskGrid } from '@/components/task/task-grid';
import { TaskModal } from '@/components/task/task-modal';
import { TaskSearch } from '@/components/task/task-search';
import { TaskFilters, TaskFilterState } from '@/components/task/task-filters';
import { TaskSortDropdown, TaskSortOption } from '@/components/task/task-sort-dropdown';
import { Task, CreateTaskDTO, UpdateTaskDTO } from '@/types/task';
import { isPast, isToday, isThisWeek, parseISO } from 'date-fns';

export default function TasksPage() {
  const { 
    tasks, 
    isLoading: tasksLoading, 
    createTask, 
    updateTask, 
    deleteTask, 
    isCreating, 
    isUpdating 
  } = useTasks();
  
  const { projects, isLoading: projectsLoading } = useProjects();
  const { workspaces, isLoading: workspacesLoading } = useWorkspace();

  const [searchQuery, setSearchQuery] = React.useState('');
  
  // Advanced Filter State
  const [filters, setFilters] = React.useState<TaskFilterState>({
    status: 'all',
    priority: 'all',
    project_id: 'all',
    workspace_id: 'all',
    assigned_to: 'all',
    timing: 'all',
  });

  const [sortBy, setSortBy] = React.useState<TaskSortOption>('newest');

  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [editingTask, setEditingTask] = React.useState<Task | null>(null);

  const handleFilterChange = (key: keyof TaskFilterState, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  // Derived state for filtering and sorting
  const filteredTasks = React.useMemo(() => {
    let result = [...tasks];

    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(t => 
        t.title.toLowerCase().includes(q) || 
        (t.description && t.description.toLowerCase().includes(q))
      );
    }

    // Dropdown filters
    if (filters.status !== 'all') {
      result = result.filter(t => t.status === filters.status);
    }
    
    if (filters.priority !== 'all') {
      result = result.filter(t => t.priority === filters.priority);
    }
    
    if (filters.project_id !== 'all') {
      result = result.filter(t => t.project_id === filters.project_id);
    }

    if (filters.workspace_id !== 'all') {
      // Find projects in this workspace, then filter tasks in those projects
      const workspaceProjects = new Set(
        projects.filter(p => p.workspace_id === filters.workspace_id).map(p => p.id)
      );
      result = result.filter(t => workspaceProjects.has(t.project_id));
    }

    if (filters.assigned_to !== 'all') {
      if (filters.assigned_to === 'unassigned') {
        result = result.filter(t => !t.assigned_to);
      } else {
        result = result.filter(t => !!t.assigned_to);
      }
    }

    if (filters.timing !== 'all') {
      result = result.filter(t => {
        if (!t.due_date) return false;
        const date = parseISO(t.due_date);
        
        switch (filters.timing) {
          case 'overdue':
            return isPast(date) && !isToday(date) && t.status !== 'completed';
          case 'today':
            return isToday(date) && t.status !== 'completed';
          case 'week':
            return isThisWeek(date) && t.status !== 'completed';
          default:
            return true;
        }
      });
    }

    // Sorting
    result.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        case 'oldest':
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        case 'alphabetical':
          return a.title.localeCompare(b.title);
        case 'priority': {
          const pOrder = { high: 3, medium: 2, low: 1 };
          return pOrder[b.priority] - pOrder[a.priority];
        }
        case 'status': {
          const sOrder = { 'todo': 1, 'in-progress': 2, 'review': 3, 'completed': 4 };
          return sOrder[a.status] - sOrder[b.status];
        }
        case 'due_date':
          if (!a.due_date) return 1;
          if (!b.due_date) return -1;
          return new Date(a.due_date).getTime() - new Date(b.due_date).getTime();
        default:
          return 0;
      }
    });

    return result;
  }, [tasks, projects, searchQuery, filters, sortBy]);

  const handleCreateNew = () => {
    setEditingTask(null);
    setIsModalOpen(true);
  };

  const handleEdit = (task: Task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const handleDelete = (task: Task) => {
    if (window.confirm(`Are you sure you want to delete task "${task.title}"?`)) {
      deleteTask(task.id);
    }
  };

  const handleSubmit = (data: any) => {
    if (editingTask) {
      updateTask(
        { id: editingTask.id, data: data as UpdateTaskDTO },
        { onSuccess: () => setIsModalOpen(false) }
      );
    } else {
      createTask(data as CreateTaskDTO, {
        onSuccess: () => setIsModalOpen(false)
      });
    }
  };

  const hasProjects = projects.length > 0;
  const isLoading = tasksLoading || projectsLoading || workspacesLoading;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Tasks"
        description="Manage and track your individual tasks."
      >
        <Button onClick={handleCreateNew} disabled={!hasProjects} className="gap-2">
          <Plus className="h-4 w-4" />
          New Task
        </Button>
      </PageHeader>

      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <TaskSearch 
            value={searchQuery} 
            onChange={setSearchQuery} 
            className="w-full sm:max-w-xs" 
          />
          <div className="sm:ml-auto">
            <TaskSortDropdown value={sortBy} onChange={setSortBy} />
          </div>
        </div>
        
        <TaskFilters 
          filters={filters}
          onFilterChange={handleFilterChange}
          projects={projects}
          workspaces={workspaces}
        />
      </div>

      <TaskGrid
        tasks={filteredTasks}
        projects={projects}
        isLoading={isLoading}
        hasProjects={hasProjects}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onCreateNew={handleCreateNew}
      />

      <TaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        task={editingTask}
        projects={projects}
        onSubmit={handleSubmit}
        isSubmitting={isCreating || isUpdating}
      />
    </div>
  );
}
