'use client';

import * as React from 'react';
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

export function WorkspaceSwitcher({ collapsed }: { collapsed?: boolean }) {
  const { workspaces, isLoading } = useWorkspace();
  const { activeWorkspaceId, setActiveWorkspaceId } = useAppStore();

  // Auto-select first workspace if none is selected
  React.useEffect(() => {
    if (workspaces.length > 0 && !activeWorkspaceId) {
      setActiveWorkspaceId(workspaces[0].id);
    }
  }, [workspaces, activeWorkspaceId, setActiveWorkspaceId]);

  const activeWorkspace = workspaces.find((w) => w.id === activeWorkspaceId);

  if (isLoading) {
    return (
      <div className="flex h-10 w-full items-center justify-between rounded-lg border border-border bg-card px-3 py-2 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 animate-pulse rounded bg-muted-foreground/20" />
          {!collapsed && <div className="h-4 w-24 animate-pulse rounded bg-muted-foreground/20" />}
        </div>
      </div>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className={cn(
            "flex w-full items-center justify-between rounded-lg border border-border bg-card px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors",
            collapsed && "justify-center px-0 py-2 border-none bg-transparent hover:bg-accent shadow-none"
          )}
        >
          <div className="flex items-center gap-2 overflow-hidden">
            <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded bg-primary/10 text-primary">
              <Briefcase className="h-3 w-3" />
            </div>
            {!collapsed && (
              <span className="truncate">
                {activeWorkspace?.name || "Select Workspace"}
              </span>
            )}
          </div>
          {!collapsed && <ChevronsUpDown className="h-4 w-4 shrink-0 text-muted-foreground" />}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align={collapsed ? "center" : "start"} className="w-[200px]" sideOffset={8}>
        <DropdownMenuLabel className="text-xs text-muted-foreground">Workspaces</DropdownMenuLabel>
        {workspaces.map((workspace) => (
          <DropdownMenuItem
            key={workspace.id}
            onClick={() => setActiveWorkspaceId(workspace.id)}
            className="flex items-center justify-between cursor-pointer"
          >
            <span className="truncate">{workspace.name}</span>
            {workspace.id === activeWorkspaceId && (
              <Check className="h-4 w-4 text-primary" />
            )}
          </DropdownMenuItem>
        ))}
        {workspaces.length === 0 && (
          <div className="px-2 py-1 text-sm text-muted-foreground text-center">
            No workspaces
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
