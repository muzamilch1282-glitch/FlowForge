import * as React from 'react';
import { useState, useMemo } from 'react';
import { useWorkspace } from '@/hooks/useWorkspace';
import { Workspace, CreateWorkspaceDTO, UpdateWorkspaceDTO } from '@/types/workspace';
import { Button } from '@/components/shared';
import { Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  WorkspaceGrid,
  WorkspaceModal,
  WorkspaceSearch,
  WorkspaceFilters,
} from '@/components/workspace';

export function WorkspaceSettings({ hideTitle }: { hideTitle?: boolean }) {
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
    
    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase();
      result = result.filter(
        w => w.name.toLowerCase().includes(lowerQuery) || 
             w.description?.toLowerCase().includes(lowerQuery)
      );
    }

    if (sortBy === 'alphabetical') {
      result.sort((a, b) => a.name.localeCompare(b.name));
    } else {
      result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    }

    return result;
  }, [workspaces, searchQuery, sortBy]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {!hideTitle && <h3 className="text-lg font-medium text-foreground">Manage Workspaces</h3>}
        <Button onClick={handleCreateNew} className={cn("gap-2 self-start sm:self-auto", hideTitle && "ml-auto")}>
          <Plus className="h-4 w-4" />
          New Workspace
        </Button>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-border/60 pb-4">
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
