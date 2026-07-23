import React from 'react';
import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';
import type { StatItem } from '@/data/dashboard';

interface StatCardProps {
  stat: StatItem;
}

export function StatCard({ stat }: StatCardProps) {
  const Icon = stat.icon;
  
  return (
    <div className="group relative overflow-hidden rounded-xl border border-border bg-card p-5 transition-all duration-300 hover:shadow-lg hover:shadow-violet-500/5 hover:-translate-y-0.5">
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">
            {stat.title}
          </p>
          <p className="text-3xl font-bold tracking-tight text-foreground">
            {stat.value}
          </p>
        </div>
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br ${stat.color} shadow-md`}
        >
          <Icon className="h-5 w-5 text-white" />
        </div>
      </div>
      <div className="mt-4 flex items-center gap-1.5">
        <div className="flex items-center gap-1">
          {stat.trend === 'up' ? (
            <ArrowUpRight className="h-3.5 w-3.5 text-emerald-500" />
          ) : stat.trend === 'down' ? (
            <ArrowDownRight className="h-3.5 w-3.5 text-rose-500" />
          ) : (
            <Minus className="h-3.5 w-3.5 text-muted-foreground" />
          )}
          <span 
            className={`text-xs font-medium ${
              stat.trend === 'up' 
                ? 'text-emerald-500' 
                : stat.trend === 'down' 
                  ? 'text-rose-500' 
                  : 'text-muted-foreground'
            }`}
          >
            {stat.change}
          </span>
        </div>
        <span className="text-xs text-muted-foreground">vs last week</span>
      </div>
      {/* Decorative gradient */}
      <div 
        className={`absolute -right-6 -top-6 h-24 w-24 rounded-full bg-gradient-to-br ${stat.color} opacity-5 transition-opacity group-hover:opacity-10`} 
      />
    </div>
  );
}
