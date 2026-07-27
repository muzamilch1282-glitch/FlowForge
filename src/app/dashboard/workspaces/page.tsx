'use client';

import * as React from 'react';
import { useState, useMemo } from 'react';
import { useWorkspace } from '@/hooks/useWorkspace';
import { Workspace, CreateWorkspaceDTO, UpdateWorkspaceDTO } from '@/types/workspace';
import { DashboardHeader } from '@/components/dashboard/dashboard-header';
import { Button } from '@/components/shared';
import { Plus } from 'lucide-react';
import {
  WorkspaceGrid,
  WorkspaceModal,
  WorkspaceSearch,
  WorkspaceFilters,
} from '@/components/workspace';

export default function WorkspacesPage() {
  const { workspaces, isLoading, createWorkspace, updateWorkspace, deleteWorkspace, isCreating, isUpdating } = useWorkspace();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('recent');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingWorkspace, setEditingWorkspace] = useState<Workspace | null>(null);

  const handleCreateNew = () => {
    setEditingWorkspace(null);
    setIsModalOpen(true);
  };

  const handleEdit = (workspace: Workspace) => {
    setEditingWorkspace(workspace);
    setIsModalOpen(true);
  };

  const handleDelete = (workspace: Workspace) => {
    if (confirm(`Are you sure you want to delete ${workspace.name}? This action cannot be undone.`)) {
      deleteWorkspace(workspace.id);
    }
  };

  const handleSubmit = (data: CreateWorkspaceDTO | UpdateWorkspaceDTO) => {
    if (editingWorkspace) {
      updateWorkspace({ id: editingWorkspace.id, data: data as UpdateWorkspaceDTO }, {
        onSuccess: () => setIsModalOpen(false)
      });
    } else {
      createWorkspace(data as CreateWorkspaceDTO, {
        onSuccess: () => setIsModalOpen(false)
      });
    }
  };

  const filteredWorkspaces = useMemo(() => {
    let result = [...workspaces];
    
    // Filter by search query
    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase();
      result = result.filter(
        w => w.name.toLowerCase().includes(lowerQuery) || 
             w.description?.toLowerCase().includes(lowerQuery)
      );
    }

    // Sort
    if (sortBy === 'alphabetical') {
      result.sort((a, b) => a.name.localeCompare(b.name));
    } else {
      // recent
      result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    }

    return result;
  }, [workspaces, searchQuery, sortBy]);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <DashboardHeader 
          title="Workspaces" 
          welcomeMessage="Manage your workspaces and team collaborations." 
        />
        <Button onClick={handleCreateNew} className="gap-2 self-start sm:self-auto">
          <Plus className="h-4 w-4" />
          New Workspace
        </Button>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <WorkspaceSearch value={searchQuery} onChange={setSearchQuery} />
        <WorkspaceFilters sortBy={sortBy} onSortChange={setSortBy} />
      </div>

      <WorkspaceGrid
        workspaces={filteredWorkspaces}
        isLoading={isLoading}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onCreateNew={handleCreateNew}
      />

      <WorkspaceModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        workspace={editingWorkspace}
        onSubmit={handleSubmit}
        isSubmitting={isCreating || isUpdating}
      />
    </div>
  );
}
