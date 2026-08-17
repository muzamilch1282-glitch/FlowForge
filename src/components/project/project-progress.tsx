import * as React from 'react';
import { cn } from '@/lib/utils';

interface ProjectProgressProps {
  value: number; // 0 to 100
  className?: string;
}

export function ProjectProgress({ value, className }: ProjectProgressProps) {
  const safeValue = Math.min(Math.max(value, 0), 100);
  
  let colorClass = 'bg-orange-500';
  if (safeValue >= 100) colorClass = 'bg-emerald-500';
  else if (safeValue > 70) colorClass = 'bg-amber-500';
  else if (safeValue > 30) colorClass = 'bg-orange-400';
  else colorClass = 'bg-rose-500';

  return (
    <div className={cn("w-full space-y-1.5", className)}>
      <div className="flex items-center justify-between text-xs font-medium">
        <span className="text-muted-foreground">Progress</span>
        <span className="text-foreground">{Math.round(safeValue)}%</span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-secondary/20">
        <div
          className={cn("h-full transition-all duration-500 ease-in-out", colorClass)}
          style={{ width: `${safeValue}%` }}
        />
      </div>
    </div>
  );
}
