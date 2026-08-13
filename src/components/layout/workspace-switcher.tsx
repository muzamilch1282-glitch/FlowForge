'use client';

import * as React from 'react';
import Link from 'next/link';
import { Check, ChevronsUpDown, Briefcase, Plus } from 'lucide-react';
import { useWorkspace } from '@/hooks/useWorkspace';
import { useAppStore } from '@/store';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { WorkspaceModal } from '@/components/workspace';
import { CreateWorkspaceDTO } from '@/types/workspace';

export function WorkspaceSwitcher({ collapsed }: { collapsed?: boolean }) {
  const { workspaces, isLoading, createWorkspace, isCreating } = useWorkspace();
  const { activeWorkspaceId, setActiveWorkspaceId } = useAppStore();
  const [isWorkspaceModalOpen, setIsWorkspaceModalOpen] = React.useState(false);

  // Auto-select first workspace if none is selected
  React.useEffect(() => {
    if (workspaces.length > 0 && !activeWorkspaceId) {
      setActiveWorkspaceId(workspaces[0].id);
    }
  }, [workspaces, activeWorkspaceId, setActiveWorkspaceId]);

  const activeWorkspace = workspaces.find((w) => w.id === activeWorkspaceId);

  const handleCreateWorkspace = (data: CreateWorkspaceDTO | any) => {
    createWorkspace(data as CreateWorkspaceDTO, {
      onSuccess: () => setIsWorkspaceModalOpen(false)
    });
  };

  if (isLoading) {
    return (
      <div className="flex h-10 w-full items-center px-2 py-2">
        <div className="h-4 w-4 animate-pulse rounded bg-muted-foreground/20" />
        {!collapsed && <div className="ml-2 h-4 w-24 animate-pulse rounded bg-muted-foreground/20" />}
      </div>
    );
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            className={cn(
              "flex w-full items-center justify-between rounded-md px-2 py-1.5 text-[13px] font-semibold text-foreground hover:bg-secondary/60 transition-colors group outline-none focus-visible:ring-2 focus-visible:ring-primary/50",
              collapsed && "justify-center px-0 py-2"
            )}
          >
            <div className="flex items-center gap-2 overflow-hidden">
              <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded bg-primary text-[10px] text-white font-bold uppercase">
                {activeWorkspace?.name?.charAt(0) || "F"}
              </div>
              {!collapsed && (
                <span className="truncate">
                  {activeWorkspace?.name || "FlowForge"}
                </span>
              )}
            </div>
            {!collapsed && (
              <ChevronsUpDown className="h-3.5 w-3.5 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
            )}
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align={collapsed ? "center" : "start"} className="w-[240px] p-2" sideOffset={8}>
          <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">Workspaces</div>
          {workspaces.map((workspace) => (
            <DropdownMenuItem
              key={workspace.id}
              onClick={() => setActiveWorkspaceId(workspace.id)}
              className="flex items-center gap-2 cursor-pointer py-2 rounded-md"
            >
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded bg-primary/10 text-[10px] text-primary font-bold uppercase">
                {workspace.name.charAt(0)}
              </div>
              <div className="flex-1 flex flex-col items-start overflow-hidden">
                <span className="truncate text-[13px] font-medium leading-tight">{workspace.name}</span>
                <span className="text-[11px] text-muted-foreground leading-tight">1 Member</span>
              </div>
              {workspace.id === activeWorkspaceId && (
                <Check className="h-4 w-4 text-primary shrink-0" />
              )}
            </DropdownMenuItem>
          ))}
          {workspaces.length === 0 && (
            <div className="px-2 py-1 text-sm text-muted-foreground text-center">
              No workspaces
            </div>
          )}
          <DropdownMenuSeparator className="my-1.5" />
          <DropdownMenuItem 
            className="cursor-pointer gap-2 py-1.5 text-[13px]"
            onSelect={(e) => {
              e.preventDefault();
              setIsWorkspaceModalOpen(true);
            }}
          >
            <Plus className="h-4 w-4 text-muted-foreground" />
            Create Workspace
          </DropdownMenuItem>
          <DropdownMenuItem asChild className="cursor-pointer gap-2 py-1.5 text-[13px]">
            <Link href="/dashboard/workspaces">
              <Briefcase className="h-4 w-4 text-muted-foreground" />
              Workspace Settings
            </Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <WorkspaceModal
        isOpen={isWorkspaceModalOpen}
        onClose={() => setIsWorkspaceModalOpen(false)}
        onSubmit={handleCreateWorkspace}
        isSubmitting={isCreating}
      />
    </>
  );
}
