import * as React from 'react';
import { Modal } from '@/components/shared';
import { TaskForm } from './task-form';
import { Task } from '@/types/task';
import { Project } from '@/types/project';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: Task | null;
  projects: Project[];
  onSubmit: (data: any) => void;
  isSubmitting?: boolean;
}

export function TaskModal({ isOpen, onClose, task, projects, onSubmit, isSubmitting }: TaskModalProps) {
  return (
    <Modal
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
      title={task ? 'Edit Task' : 'Create Task'}
      description={task ? 'Update the details of your task.' : 'Add a new task to your project.'}
    >
      <TaskForm
        task={task}
        projects={projects}
        onSubmit={onSubmit}
        isSubmitting={isSubmitting}
      />
    </Modal>
  );
}
