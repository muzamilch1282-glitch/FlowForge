import * as React from 'react';
import { Modal } from '@/components/shared';
import { ProjectForm, ProjectFormValues } from './project-form';
import { Project } from '@/types/project';
import { Workspace } from '@/types/workspace';

interface ProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  project?: Project | null;
  workspaces: Workspace[];
  onSubmit: (data: ProjectFormValues) => void;
  isSubmitting: boolean;
}

export function ProjectModal({
  isOpen,
  onClose,
  project,
  workspaces,
  onSubmit,
  isSubmitting
}: ProjectModalProps) {
  return (
    <Modal
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
      title={project ? 'Edit Project' : 'Create Project'}
      description={
        project
          ? 'Update the details for this project.'
          : 'Add a new project to your workspace to start managing tasks.'
      }
    >
      <ProjectForm
        initialData={project || undefined}
        workspaces={workspaces}
        onSubmit={onSubmit}
        isSubmitting={isSubmitting}
      />
    </Modal>
  );
}
