'use client';

import * as React from 'react';
import { PageHeader, Button } from '@/components/shared';
import { Plus } from 'lucide-react';
import { useTasks } from '@/hooks/useTasks';
import { useProjects } from '@/hooks/useProjects';
import { TaskGrid } from '@/components/task/task-grid';
import { TaskModal } from '@/components/task/task-modal';
import { TaskSearch } from '@/components/task/task-search';
import { TaskFilters } from '@/components/task/task-filters';
import { Task, CreateTaskDTO, UpdateTaskDTO } from '@/types/task';

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

  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedStatus, setSelectedStatus] = React.useState('all');
  const [selectedPriority, setSelectedPriority] = React.useState('all');
  const [sortBy, setSortBy] = React.useState('newest');

  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [editingTask, setEditingTask] = React.useState<Task | null>(null);

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
    if (selectedStatus !== 'all') {
      result = result.filter(t => t.status === selectedStatus);
    }
    if (selectedPriority !== 'all') {
      result = result.filter(t => t.priority === selectedPriority);
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
        case 'due-date':
          if (!a.due_date) return 1;
          if (!b.due_date) return -1;
          return new Date(a.due_date).getTime() - new Date(b.due_date).getTime();
        default:
          return 0;
      }
    });

    return result;
  }, [tasks, searchQuery, selectedStatus, selectedPriority, sortBy]);

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
  const isLoading = tasksLoading || projectsLoading;

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
        <TaskSearch 
          value={searchQuery} 
          onChange={setSearchQuery} 
          className="w-full sm:max-w-md" 
        />
        <TaskFilters 
          selectedStatus={selectedStatus}
          onStatusChange={setSelectedStatus}
          selectedPriority={selectedPriority}
          onPriorityChange={setSelectedPriority}
          sortBy={sortBy}
          onSortChange={setSortBy}
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
