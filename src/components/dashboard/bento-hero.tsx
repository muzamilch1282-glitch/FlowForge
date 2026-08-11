'use client';

import * as React from 'react';
import { format } from 'date-fns';
import { CircleDashed, AlertCircle, Calendar, Flame } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BentoHeroProps {
  stats: {
    total: number;
    completed: number;
    inProgress: number;
    overdue: number;
    dueToday: number;
    highPriority: number;
  };
}

export function BentoHero({ stats }: BentoHeroProps) {
  const completionPercentage = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (completionPercentage / 100) * circumference;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Main Welcome Hero (Spans 2 columns on MD) */}
      <div className="md:col-span-2 rounded-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border border-primary/20 p-6 flex flex-col justify-between relative overflow-hidden backdrop-blur-xl group hover:shadow-lg transition-all duration-300">
        
        {/* Decorative background glow */}
        <div className="absolute -right-20 -top-20 w-64 h-64 bg-primary/20 blur-3xl rounded-full opacity-50 group-hover:opacity-70 transition-opacity duration-500 pointer-events-none" />
        
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6 h-full">
          <div>
            <p className="text-sm font-medium text-primary mb-1">{format(new Date(), 'EEEE, MMMM do, yyyy')}</p>
            <h1 className="text-3xl font-bold tracking-tight text-foreground mb-2">
              Welcome back, Agent!
            </h1>
            <p className="text-muted-foreground max-w-md">
              You have <strong className="text-foreground">{stats.dueToday} tasks due today</strong> and <strong className="text-foreground">{stats.highPriority} high-priority tasks</strong> that need your attention. Let's make today productive.
            </p>
          </div>

          {/* Progress Ring */}
          <div className="flex flex-col items-center justify-center shrink-0">
            <div className="relative flex items-center justify-center w-28 h-28">
              <svg className="transform -rotate-90 w-full h-full">
                <circle cx="56" cy="56" r={radius} stroke="currentColor" strokeWidth="8" fill="transparent" className="text-muted/30" />
                <circle 
                  cx="56" cy="56" r={radius} 
                  stroke="currentColor" strokeWidth="8" fill="transparent" 
                  strokeDasharray={circumference} 
                  strokeDashoffset={strokeDashoffset}
                  className="text-primary transition-all duration-1000 ease-out" 
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-2xl font-bold text-foreground">{completionPercentage}%</span>
                <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Done</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Metrics Column (Spans 1 column on MD) */}
      <div className="grid grid-rows-3 gap-4">
        
        <MetricCard 
          title="In Progress"
          value={stats.inProgress}
          icon={CircleDashed}
          colorClass="bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20 shadow-[0_0_15px_rgba(245,158,11,0.05)]"
        />
        
        <MetricCard 
          title="High Priority"
          value={stats.highPriority}
          icon={Flame}
          colorClass="bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20 shadow-[0_0_15px_rgba(225,29,72,0.05)]"
        />

        <MetricCard 
          title="Overdue"
          value={stats.overdue}
          icon={AlertCircle}
          colorClass="bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20 shadow-[0_0_15px_rgba(239,68,68,0.05)]"
        />

      </div>
    </div>
  );
}

function MetricCard({ title, value, icon: Icon, colorClass }: { title: string, value: number, icon: any, colorClass: string }) {
  return (
    <div className={cn(
      "rounded-2xl border backdrop-blur-md p-4 flex items-center justify-between hover:scale-[1.02] transition-transform duration-300",
      colorClass
    )}>
      <div className="flex items-center gap-3">
        <div className={cn("p-2 rounded-xl bg-background/50", colorClass.split(' ')[1])}>
          <Icon className="h-5 w-5" />
        </div>
        <p className="font-semibold text-sm">{title}</p>
      </div>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
}
