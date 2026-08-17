import * as React from 'react';
import { cn } from '@/lib/utils';
import { useTeam } from '@/hooks/useTeam';

interface ProjectMembersProps {
  max?: number;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  workspaceId?: string;
}

const COLORS = [
  'bg-rose-500', 'bg-blue-500', 'bg-emerald-500', 'bg-amber-500',
  'bg-indigo-500', 'bg-purple-500', 'bg-pink-500', 'bg-cyan-500'
];

export function ProjectMembers({ max = 3, className, size = 'sm', workspaceId }: ProjectMembersProps) {
  const { members } = useTeam(workspaceId);

  if (!members || members.length === 0) {
    return null;
  }

  const displayMembers = members.slice(0, max).map((m, index) => {
    return {
      id: m.id,
      name: m.profile?.full_name || m.profile?.email || 'User',
      color: COLORS[index % COLORS.length]
    };
  });
  
  const remainingCount = Math.max(0, members.length - max);

  const sizeClasses = {
    sm: 'h-6 w-6 text-[10px]',
    md: 'h-8 w-8 text-xs',
    lg: 'h-10 w-10 text-sm',
  };

  return (
    <div className={cn("flex items-center", className)}>
      <div className="flex -space-x-2">
        {displayMembers.map((member, i) => (
          <div
            key={member.id}
            className={cn(
              "relative flex items-center justify-center rounded-full border-2 border-background font-medium text-white ring-2 ring-transparent transition-transform hover:z-10 hover:scale-110",
              member.color,
              sizeClasses[size]
            )}
            style={{ zIndex: 10 - i }}
            title={member.name}
          >
            {member.name.charAt(0).toUpperCase()}
          </div>
        ))}
        
        {remainingCount > 0 && (
          <div
            className={cn(
              "relative z-0 flex items-center justify-center rounded-full border-2 border-background bg-muted font-medium text-muted-foreground",
              sizeClasses[size]
            )}
          >
            +{remainingCount}
          </div>
        )}
      </div>
    </div>
  );
}
