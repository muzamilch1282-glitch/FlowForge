'use client';

import { useState } from 'react';
import { useAppStore } from '@/store';
import { useWorkspace } from '@/hooks/useWorkspace';
import { usePermissions } from '@/hooks/usePermissions';
import { workspaceService } from '@/services/workspace.service';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Loader2, Trash2 } from 'lucide-react';

export function WorkspaceSettings() {
  const activeWorkspaceId = useAppStore((state) => state.activeWorkspaceId);
  const { workspaces, isLoading: isLoadingWorkspaces } = useWorkspace();
  const { canEditWorkspace, canDeleteWorkspace } = usePermissions();
  const queryClient = useQueryClient();

  const workspace = workspaces?.find((w) => w.id === activeWorkspaceId);

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(workspace?.name || '');
  const [description, setDescription] = useState(workspace?.description || '');

  const updateMutation = useMutation({
    mutationFn: (data: { name: string; description: string }) => {
      if (!activeWorkspaceId) throw new Error('No workspace selected');
      return workspaceService.updateWorkspace(activeWorkspaceId, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workspaces'] });
      toast.success('Workspace updated successfully');
      setIsEditing(false);
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update workspace');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () => {
      if (!activeWorkspaceId) throw new Error('No workspace selected');
      return workspaceService.deleteWorkspace(activeWorkspaceId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workspaces'] });
      useAppStore.setState({ activeWorkspaceId: null });
      toast.success('Workspace deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to delete workspace');
    },
  });

  if (isLoadingWorkspaces) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!workspace) {
    return (
      <div className="p-8 text-center text-muted-foreground">
        Select a workspace to view settings.
      </div>
    );
  }

  const handleSave = () => {
    updateMutation.mutate({ name, description });
  };

  const handleCancel = () => {
    setName(workspace.name);
    setDescription(workspace.description || '');
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this workspace? This action cannot be undone.')) {
      deleteMutation.mutate();
    }
  };

  const canEdit = canEditWorkspace();
  const canDelete = canDeleteWorkspace();

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Workspace Settings</CardTitle>
          <CardDescription>
            Manage your workspace details and preferences.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {!canEdit && (
            <p className="text-sm text-muted-foreground mb-4">
              Only workspace admins can edit these settings.
            </p>
          )}

          <div className="space-y-2">
            <Label htmlFor="name">Workspace Name</Label>
            <Input
              id="name"
              value={isEditing ? name : workspace.name}
              onChange={(e) => setName(e.target.value)}
              disabled={!isEditing}
              className={!isEditing ? 'bg-muted' : ''}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={isEditing ? description : workspace.description || ''}
              onChange={(e) => setDescription(e.target.value)}
              disabled={!isEditing}
              className={!isEditing ? 'bg-muted' : ''}
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Color</Label>
              <div className="flex items-center space-x-2 p-2 border border-border rounded-md">
                <div 
                  className="w-4 h-4 rounded-full" 
                  style={{ backgroundColor: workspace.color || '#000' }}
                />
                <span className="text-sm text-muted-foreground">
                  {workspace.color || 'Default'}
                </span>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Icon</Label>
              <div className="p-2 border border-border rounded-md text-sm text-muted-foreground">
                {workspace.icon || 'None'}
              </div>
            </div>
          </div>

          <div className="pt-4 space-y-1 text-sm text-muted-foreground">
            <p>Owner ID: {workspace.owner_id}</p>
            <p>Created: {new Date(workspace.created_at).toLocaleDateString()}</p>
          </div>
        </CardContent>
        {canEdit && (
          <CardFooter className="flex justify-between">
            {isEditing ? (
              <div className="flex space-x-2">
                <Button onClick={handleSave} disabled={updateMutation.isPending}>
                  {updateMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Save Changes
                </Button>
                <Button variant="outline" onClick={handleCancel} disabled={updateMutation.isPending}>
                  Cancel
                </Button>
              </div>
            ) : (
              <Button onClick={() => setIsEditing(true)}>Edit Details</Button>
            )}
          </CardFooter>
        )}
      </Card>

      {canDelete && (
        <Card className="border-destructive">
          <CardHeader>
            <CardTitle className="text-destructive">Danger Zone</CardTitle>
            <CardDescription>
              Permanently delete this workspace and all of its data.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Once you delete a workspace, there is no going back. Please be certain.
            </p>
          </CardContent>
          <CardFooter>
            <Button 
              variant="destructive" 
              onClick={handleDelete}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Trash2 className="mr-2 h-4 w-4" />}
              Delete Workspace
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}
