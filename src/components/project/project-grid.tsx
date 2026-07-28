import * as React from 'react';
import { Project } from '@/types/project';
import { Workspace } from '@/types/workspace';
import { ProjectCard } from './project-card';
import { ProjectSkeleton } from './project-skeleton';
import { EmptyProjects } from './empty-projects';

interface ProjectGridProps {
  projects: Project[];
  workspaces: Workspace[];
  isLoading: boolean;
  hasWorkspaces: boolean;
  onEdit: (project: Project) => void;
  onDelete: (project: Project) => void;
  onCreateNew: () => void;
}

export function ProjectGrid({
  projects,
  workspaces,
  isLoading,
  hasWorkspaces,
  onEdit,
  onDelete,
  onCreateNew
}: ProjectGridProps) {
  if (isLoading) {
    return <ProjectSkeleton />;
  }

  if (!projects.length) {
    return <EmptyProjects onAction={onCreateNew} hasWorkspaces={hasWorkspaces} />;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {projects.map((project) => (
        <ProjectCard
          key={project.id}
          project={project}
          workspace={workspaces.find((w) => w.id === project.workspace_id)}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
