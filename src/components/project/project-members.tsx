import * as React from 'react';
import { cn } from '@/lib/utils';
import { UserPlus } from 'lucide-react';

interface ProjectMembersProps {
  max?: number;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const DUMMY_MEMBERS = [
  { id: '1', name: 'Alice Smith', color: 'bg-rose-500' },
  { id: '2', name: 'Bob Johnson', color: 'bg-blue-500' },
  { id: '3', name: 'Charlie Davis', color: 'bg-emerald-500' },
  { id: '4', name: 'Diana Prince', color: 'bg-amber-500' },
];

export function ProjectMembers({ max = 3, className, size = 'sm' }: ProjectMembersProps) {
  const displayMembers = DUMMY_MEMBERS.slice(0, max);
  const remainingCount = Math.max(0, DUMMY_MEMBERS.length - max);

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
            {member.name.charAt(0)}
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
      
      <button className={cn(
        "ml-2 flex items-center justify-center rounded-full border border-dashed border-border bg-transparent text-muted-foreground hover:border-primary hover:text-primary transition-colors",
        sizeClasses[size]
      )}>
        <UserPlus className="h-3/5 w-3/5" />
      </button>
    </div>
  );
}
