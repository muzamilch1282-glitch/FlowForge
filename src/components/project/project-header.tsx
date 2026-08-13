import * as React from 'react';
import Link from 'next/link';
import { ArrowLeft, Edit, Plus, Building2, Settings2 } from 'lucide-react';
import { Project } from '@/types/project';
import { Workspace } from '@/types/workspace';
import { Button, Badge } from '@/components/shared';
import { ProjectMembers } from '@/components/project/project-members';
import { cn } from '@/lib/utils';

interface ProjectHeaderProps {
  project: Project;
  workspace?: Workspace;
  onEdit?: () => void;
  onAddTask?: () => void;
  onAutomations?: () => void;
}

const statusColors: Record<string, string> = {
  'active': 'bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400',
  'on-hold': 'bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400',
  'completed': 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400',
};

const priorityColors: Record<string, string> = {
  'low': 'bg-slate-100 text-slate-700 dark:bg-slate-500/10 dark:text-slate-400',
  'medium': 'bg-indigo-100 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-400',
  'high': 'bg-rose-100 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400',
};

export function ProjectHeader({ project, workspace, onEdit, onAddTask, onAutomations }: ProjectHeaderProps) {
  return (
    <div className="flex flex-col gap-4 pt-2">
      <Link href="/dashboard/projects" className="flex w-fit items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to Projects
      </Link>
      
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
        <div className="flex gap-4">
          <div className="h-14 w-14 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20 shrink-0 shadow-sm mt-1">
            <span className="text-xl font-bold text-primary">{project.title.substring(0, 2).toUpperCase()}</span>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground tracking-tight">{project.title}</h1>
            <p className="text-sm text-muted-foreground mt-1 max-w-2xl leading-relaxed">{project.description || 'No description provided'}</p>
            <div className="flex flex-wrap items-center gap-2 mt-3">
              <Badge variant="outline" className={cn("text-[10px] uppercase font-bold tracking-wider", statusColors[project.status])}>
                {project.status.replace('-', ' ')}
              </Badge>
              <Badge variant="outline" className={cn("text-[10px] uppercase font-bold tracking-wider", priorityColors[project.priority])}>
                {project.priority}
              </Badge>
              {workspace && (
                <div className="flex items-center gap-1.5 text-[11px] font-semibold text-muted-foreground bg-secondary/50 border border-border/50 px-2 py-0.5 rounded-full">
                  <Building2 className="h-3 w-3" />
                  <span>{workspace.name}</span>
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
          <div className="flex -space-x-2 mr-2">
            <ProjectMembers size="sm" max={3} />
          </div>
          {onEdit && (
            <Button variant="outline" size="sm" onClick={onEdit} className="h-8 font-medium text-xs rounded-md">
              <Edit className="h-3.5 w-3.5 mr-1.5" /> Edit
            </Button>
          )}
          {onAutomations && (
            <Button variant="outline" size="sm" onClick={onAutomations} className="h-8 font-medium text-xs rounded-md">
              <Settings2 className="h-3.5 w-3.5 mr-1.5" /> Automations
            </Button>
          )}
          {onAddTask && (
            <Button size="sm" onClick={onAddTask} className="h-8 font-medium text-xs rounded-md">
              <Plus className="h-3.5 w-3.5 mr-1.5" /> Add Task
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
