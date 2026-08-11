import * as React from 'react';

import { Task } from '@/types/task';
import { Project } from '@/types/project';
import { Button } from '@/components/shared';
import { DueDatePicker } from './due-date-picker';

interface TaskFormProps {
  task?: Task | null;
  projects: Project[];
  onSubmit: (data: any) => void;
  isSubmitting?: boolean;
}

export function TaskForm({ task, projects, onSubmit, isSubmitting }: TaskFormProps) {
  const [formData, setFormData] = React.useState({
    title: task?.title || '',
    description: task?.description || '',
    project_id: task?.project_id || (projects.length > 0 ? projects[0].id : ''),
    status: task?.status || 'todo',
    priority: task?.priority || 'medium',
    start_date: task?.start_date || '',
    due_date: task?.due_date || '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground" htmlFor="title">
          Title <span className="text-destructive">*</span>
        </label>
        <input
          id="title"
          name="title"
          required
          value={formData.title}
          onChange={handleChange}
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          placeholder="e.g., Design new landing page"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground" htmlFor="project_id">
          Project <span className="text-destructive">*</span>
        </label>
        <select
          id="project_id"
          name="project_id"
          required
          value={formData.project_id}
          onChange={handleChange}
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
        >
          {projects.map(p => (
            <option key={p.id} value={p.id}>{p.title}</option>
          ))}
        </select>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground" htmlFor="description">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={3}
          className="w-full resize-none rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          placeholder="Detailed explanation of the task..."
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground" htmlFor="status">
            Status
          </label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="todo">Todo</option>
            <option value="in-progress">In Progress</option>
            <option value="review">Review</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground" htmlFor="priority">
            Priority
          </label>
          <select
            id="priority"
            name="priority"
            value={formData.priority}
            onChange={handleChange}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground" htmlFor="start_date">
            Start Date
          </label>
          <DueDatePicker
            id="start_date"
            name="start_date"
            value={formData.start_date}
            onChange={(val) => setFormData(prev => ({ ...prev, start_date: val }))}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground" htmlFor="due_date">
            Due Date
          </label>
          <DueDatePicker
            id="due_date"
            name="due_date"
            value={formData.due_date}
            onChange={(val) => setFormData(prev => ({ ...prev, due_date: val }))}
          />
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : task ? 'Update Task' : 'Create Task'}
        </Button>
      </div>
    </form>
  );
}
