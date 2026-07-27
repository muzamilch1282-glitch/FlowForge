import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Workspace } from '@/types/workspace';
import { Button } from '@/components/shared';

const workspaceSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(50, 'Name is too long'),
  description: z.string().max(200, 'Description is too long').optional(),
  color: z.string().optional(),
});

type WorkspaceFormValues = z.infer<typeof workspaceSchema>;

interface WorkspaceFormProps {
  initialData?: Workspace;
  onSubmit: (data: WorkspaceFormValues) => void;
  isSubmitting?: boolean;
}

const COLORS = [
  '#3B82F6', // Blue
  '#EF4444', // Red
  '#10B981', // Green
  '#F59E0B', // Yellow
  '#8B5CF6', // Purple
  '#EC4899', // Pink
];

export function WorkspaceForm({ initialData, onSubmit, isSubmitting }: WorkspaceFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<WorkspaceFormValues>({
    resolver: zodResolver(workspaceSchema),
    defaultValues: {
      name: initialData?.name || '',
      description: initialData?.description || '',
      color: initialData?.color || COLORS[0],
    },
  });

  const selectedColor = watch('color');

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-2">
        <label htmlFor="name" className="text-sm font-medium text-foreground">
          Workspace Name <span className="text-destructive">*</span>
        </label>
        <input
          {...register('name')}
          id="name"
          placeholder="e.g. Acme Corp"
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        />
        {errors.name && (
          <p className="text-sm text-destructive">{errors.name.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <label htmlFor="description" className="text-sm font-medium text-foreground">
          Description
        </label>
        <textarea
          {...register('description')}
          id="description"
          placeholder="Brief description of this workspace..."
          rows={3}
          className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
        />
        {errors.description && (
          <p className="text-sm text-destructive">{errors.description.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">
          Workspace Color
        </label>
        <div className="flex gap-2">
          {COLORS.map((color) => (
            <button
              key={color}
              type="button"
              onClick={() => setValue('color', color)}
              className={`h-8 w-8 rounded-full border-2 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${
                selectedColor === color ? 'border-foreground' : 'border-transparent'
              }`}
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
      </div>

      <div className="flex justify-end pt-4 border-t border-border">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : initialData ? 'Update Workspace' : 'Create Workspace'}
        </Button>
      </div>
    </form>
  );
}
