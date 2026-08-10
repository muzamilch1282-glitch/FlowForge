import * as React from 'react';
import Link from 'next/link';
import { MoreHorizontal, Edit, Trash2, Calendar, Building2 } from 'lucide-react';
import { Project } from '@/types/project';
import { Workspace } from '@/types/workspace';
import { Badge, Dropdown } from '@/components/shared';
import { ProjectProgress } from './project-progress';
import { ProjectMembers } from './project-members';
import { format, parseISO } from 'date-fns';
import { usePermissions } from '@/hooks/usePermissions';
import { PERMISSIONS } from '@/lib/permissions';

interface ProjectCardProps {
  project: Project;
  workspace?: Workspace;
  onEdit: (project: Project) => void;
  onDelete: (project: Project) => void;
}

export function ProjectCard({ project, workspace, onEdit, onDelete }: ProjectCardProps) {
  const { hasPermission } = usePermissions();
  
  // Generate a dummy progress based on the id (deterministic)
  const dummyProgress = React.useMemo(() => {
    const sum = project.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return sum % 100;
  }, [project.id]);

  const statusColors = {
    'active': 'bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400',
    'on-hold': 'bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400',
    'completed': 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400',
  };

  const priorityColors = {
    'low': 'bg-slate-100 text-slate-700 dark:bg-slate-500/10 dark:text-slate-400',
    'medium': 'bg-indigo-100 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-400',
    'high': 'bg-rose-100 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400',
  };

  return (
    <div className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-all hover:shadow-md hover:border-primary/50">
      <div className="p-5 flex-1 flex flex-col">
        <div className="flex items-start justify-between mb-2">
          <Link href={`/dashboard/projects/${project.id}`} className="hover:underline">
            <h3 className="font-semibold text-lg text-foreground line-clamp-1">{project.title}</h3>
          </Link>
        <Dropdown
            trigger={
              <button className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground">
                <MoreHorizontal className="h-4 w-4" />
              </button>
            }
            items={[
              ...(hasPermission(PERMISSIONS.PROJECT_EDIT) ? [{
                label: 'Edit Project',
                icon: <Edit className="h-4 w-4" />,
                onClick: () => onEdit(project),
              }] : []),
              ...(hasPermission(PERMISSIONS.PROJECT_DELETE) ? [{
                label: 'Delete',
                icon: <Trash2 className="h-4 w-4" />,
                onClick: () => onDelete(project),
                danger: true,
              }] : []),
            ]}
          />
        </div>
        
        {workspace && (
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-3">
            <Building2 className="h-3.5 w-3.5" />
            <span className="truncate">{workspace.name}</span>
          </div>
        )}
        
        <p className="text-sm text-muted-foreground line-clamp-2 mb-4 flex-1">
          {project.description || 'No description provided.'}
        </p>

        <div className="flex flex-wrap items-center gap-2 mb-5">
          <Badge className={statusColors[project.status]}>
            {project.status.replace('-', ' ')}
          </Badge>
          <Badge className={priorityColors[project.priority]}>
            {project.priority} priority
          </Badge>
        </div>

        <ProjectProgress value={dummyProgress} className="mt-auto" />
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-border bg-muted/20 px-5 py-3">
        <ProjectMembers max={3} size="sm" />
        
        {project.end_date && (
          <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground shrink-0">
            <Calendar className="h-3.5 w-3.5" />
            <span>Due {format(parseISO(project.end_date), 'MMM d, yyyy')}</span>
          </div>
        )}
      </div>
    </div>
  );
}
