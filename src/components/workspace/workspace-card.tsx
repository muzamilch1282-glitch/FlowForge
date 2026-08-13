import Link from 'next/link';
import { MoreHorizontal, Edit, Trash2, FolderKanban, Users } from 'lucide-react';
import { Workspace } from '@/types/workspace';
import { Dropdown } from '@/components/shared';

import { useAuth } from '@/hooks/useAuth';

interface WorkspaceCardProps {
  workspace: Workspace;
  onEdit: (workspace: Workspace) => void;
  onDelete: (workspace: Workspace) => void;
}

export function WorkspaceCard({ workspace, onEdit, onDelete }: WorkspaceCardProps) {
  const { user } = useAuth();
  const isOwner = user?.id === workspace.owner_id;

  const dropdownItems = [];
  
  if (isOwner) {
    dropdownItems.push(
      {
        label: 'Edit Workspace',
        icon: <Edit className="h-4 w-4" />,
        onClick: () => onEdit(workspace),
      },
      {
        label: 'Delete Workspace',
        icon: <Trash2 className="h-4 w-4" />,
        onClick: () => onDelete(workspace),
        className: 'text-destructive focus:bg-destructive/10 focus:text-destructive',
      }
    );
  }

  return (
    <div className="group relative rounded-xl border border-border bg-card p-6 shadow-sm transition-all hover:shadow-md">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <div 
            className="flex h-12 w-12 items-center justify-center rounded-lg text-white"
            style={{ backgroundColor: workspace.color || '#3B82F6' }}
          >
            {/* We could dynamically map icon string to lucide icon here. Using default for now. */}
            <span className="text-xl font-bold">{workspace.name.charAt(0).toUpperCase()}</span>
          </div>
          <div>
            {isOwner ? (
              <button onClick={() => onEdit(workspace)} className="font-semibold text-foreground hover:underline text-left">
                {workspace.name}
              </button>
            ) : (
              <span className="font-semibold text-foreground">
                {workspace.name}
              </span>
            )}
            <p className="mt-1 line-clamp-1 text-sm text-muted-foreground">
              {workspace.description || 'No description provided.'}
            </p>
          </div>
        </div>
        
        {dropdownItems.length > 0 && (
          <div onClick={(e) => e.preventDefault()}>
            <Dropdown
              trigger={
                <button className="rounded-md p-2 text-muted-foreground hover:bg-muted hover:text-foreground">
                  <MoreHorizontal className="h-4 w-4" />
                </button>
              }
              items={dropdownItems}
              align="end"
            />
          </div>
        )}
      </div>
      
      <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4 text-sm text-muted-foreground">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-1.5 whitespace-nowrap">
            <FolderKanban className="h-4 w-4 shrink-0" />
            <span>{workspace.project_count || 0} Project{workspace.project_count !== 1 ? 's' : ''}</span>
          </div>
          <div className="flex items-center gap-1.5 whitespace-nowrap">
            <Users className="h-4 w-4 shrink-0" />
            <span>{workspace.member_count || 1} Member{workspace.member_count !== 1 ? 's' : ''}</span>
          </div>
        </div>
        <div className="text-xs whitespace-nowrap opacity-80">
          {new Date(workspace.created_at).toLocaleDateString()}
        </div>
      </div>
    </div>
  );
}
