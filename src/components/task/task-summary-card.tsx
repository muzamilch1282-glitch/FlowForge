import * as React from 'react';
import { LucideIcon } from 'lucide-react';

interface TaskSummaryCardProps {
  title: string;
  value: number;
  icon: LucideIcon;
  trend?: {
    value: number;
    label: string;
    positive?: boolean;
  };
  colorClass?: string;
}

export function TaskSummaryCard({ title, value, icon: Icon, trend, colorClass = 'text-primary bg-primary/10' }: TaskSummaryCardProps) {
  return (
    <div className="rounded-xl border border-border bg-card p-6 shadow-sm transition-all hover:shadow-md">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
        <div className={`flex h-10 w-10 items-center justify-center rounded-full ${colorClass}`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
      <div className="mt-4">
        <p className="text-3xl font-bold text-foreground">{value}</p>
        {trend && (
          <div className="mt-1 flex items-center text-xs">
            <span className={trend.positive ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}>
              {trend.positive ? '+' : '-'}{Math.abs(trend.value)}%
            </span>
            <span className="ml-2 text-muted-foreground">{trend.label}</span>
          </div>
        )}
      </div>
    </div>
  );
}
