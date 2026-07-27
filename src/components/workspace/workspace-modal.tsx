import * as React from 'react';
import { Modal } from '@/components/shared';
import { WorkspaceForm } from './workspace-form';
import { Workspace, CreateWorkspaceDTO, UpdateWorkspaceDTO } from '@/types/workspace';

interface WorkspaceModalProps {
  isOpen: boolean;
  onClose: () => void;
  workspace?: Workspace | null;
  onSubmit: (data: CreateWorkspaceDTO | UpdateWorkspaceDTO) => void;
  isSubmitting?: boolean;
}

export function WorkspaceModal({
  isOpen,
  onClose,
  workspace,
  onSubmit,
  isSubmitting,
}: WorkspaceModalProps) {
  return (
    <Modal
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
      title={workspace ? 'Edit Workspace' : 'Create Workspace'}
      description={
        workspace 
          ? 'Update the details of your workspace.'
          : 'Create a new workspace to organize your projects and team.'
      }
    >
      <WorkspaceForm
        initialData={workspace || undefined}
        onSubmit={onSubmit}
        isSubmitting={isSubmitting}
      />
    </Modal>
  );
}
