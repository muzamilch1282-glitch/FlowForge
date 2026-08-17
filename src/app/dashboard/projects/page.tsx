'use client';

import * as React from 'react';
import { PageHeader, Button } from '@/components/shared';
import { Plus } from 'lucide-react';
import { useProjects } from '@/hooks/useProjects';
import { useWorkspace } from '@/hooks/useWorkspace';
import { useTasks } from '@/hooks/useTasks';
import { ProjectGrid } from '@/components/project/project-grid';
import { ProjectModal } from '@/components/project/project-modal';
import { ProjectSearch } from '@/components/project/project-search';
import { ProjectFilters } from '@/components/project/project-filters';
import { Project, CreateProjectDTO, UpdateProjectDTO } from '@/types/project';
import { PermissionGuard } from '@/components/auth/PermissionGuard';
import { PERMISSIONS } from '@/lib/permissions';

export default function ProjectsPage() {
  const { 
    projects, 
    isLoading: projectsLoading, 
    createProject, 
    updateProject, 
    deleteProject, 
    isCreating, 
    isUpdating 
  } = useProjects();
  
  const { workspaces, isLoading: workspacesLoading } = useWorkspace();
  const { tasks } = useTasks();

  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedWorkspace, setSelectedWorkspace] = React.useState('all');
  const [selectedStatus, setSelectedStatus] = React.useState('all');
  const [selectedPriority, setSelectedPriority] = React.useState('all');
  const [sortBy, setSortBy] = React.useState('newest');

  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [editingProject, setEditingProject] = React.useState<Project | null>(null);

  // Derived state for filtering and sorting
  const filteredProjects = React.useMemo(() => {
    let result = [...projects];

    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(p => 
        p.title.toLowerCase().includes(q) || 
        (p.description && p.description.toLowerCase().includes(q))
      );
    }

    // Dropdown filters
    if (selectedWorkspace !== 'all') {
      result = result.filter(p => p.workspace_id === selectedWorkspace);
    }
    if (selectedStatus !== 'all') {
      result = result.filter(p => {
        if (selectedStatus === 'completed') {
          // Explicitly completed, or has tasks and all are completed (100% progress)
          if (p.status === 'completed') return true;
          const pTasks = tasks.filter((t: any) => t.project_id === p.id);
          if (pTasks.length > 0 && pTasks.every((t: any) => t.status === 'completed')) return true;
          return false;
        }
        
        // For 'active' or 'on-hold', we might want to exclude projects that are 100% completed
        // so they don't show up in both tabs.
        if (selectedStatus === 'active' || selectedStatus === 'on-hold') {
          const pTasks = tasks.filter((t: any) => t.project_id === p.id);
          const isFullyCompleted = pTasks.length > 0 && pTasks.every((t: any) => t.status === 'completed');
          if (isFullyCompleted) return false;
        }
        
        return p.status === selectedStatus;
      });
    }
    if (selectedPriority !== 'all') {
      result = result.filter(p => p.priority === selectedPriority);
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
          if (!a.end_date) return 1;
          if (!b.end_date) return -1;
          return new Date(a.end_date).getTime() - new Date(b.end_date).getTime();
        default:
          return 0;
      }
    });

    return result;
  }, [projects, searchQuery, selectedWorkspace, selectedStatus, selectedPriority, sortBy]);

  const handleCreateNew = () => {
    setEditingProject(null);
    setIsModalOpen(true);
  };

  const handleEdit = (project: Project) => {
    setEditingProject(project);
    setIsModalOpen(true);
  };

  const handleDelete = (project: Project) => {
    if (window.confirm(`Are you sure you want to delete project "${project.title}"?`)) {
      deleteProject(project.id);
    }
  };

  const handleSubmit = (data: any) => {
    if (editingProject) {
      updateProject(
        { id: editingProject.id, data: data as UpdateProjectDTO },
        { onSuccess: () => setIsModalOpen(false) }
      );
    } else {
      createProject(data as CreateProjectDTO, {
        onSuccess: () => setIsModalOpen(false)
      });
    }
  };

  const hasWorkspaces = workspaces.length > 0;
  const isLoading = projectsLoading || workspacesLoading;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Projects"
        description="Manage and track your projects."
      >
        <PermissionGuard permission={PERMISSIONS.PROJECT_CREATE}>
          <Button onClick={handleCreateNew} disabled={!hasWorkspaces} className="gap-2">
            <Plus className="h-4 w-4" />
            New Project
          </Button>
        </PermissionGuard>
      </PageHeader>

      <div className="flex flex-col gap-4">
        <ProjectSearch 
          value={searchQuery} 
          onChange={setSearchQuery} 
          className="w-full sm:max-w-md" 
        />
        <ProjectFilters 
          workspaces={workspaces}
          selectedWorkspace={selectedWorkspace}
          onWorkspaceChange={setSelectedWorkspace}
          selectedStatus={selectedStatus}
          onStatusChange={setSelectedStatus}
          selectedPriority={selectedPriority}
          onPriorityChange={setSelectedPriority}
          sortBy={sortBy}
          onSortChange={setSortBy}
        />
      </div>

      <ProjectGrid
        projects={filteredProjects}
        workspaces={workspaces}
        isLoading={isLoading}
        hasWorkspaces={hasWorkspaces}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onCreateNew={handleCreateNew}
      />

      <ProjectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        project={editingProject}
        workspaces={workspaces}
        onSubmit={handleSubmit}
        isSubmitting={isCreating || isUpdating}
      />
    </div>
  );
}
