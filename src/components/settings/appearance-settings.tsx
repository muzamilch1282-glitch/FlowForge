'use client';

import * as React from 'react';
import { useTheme } from 'next-themes';
import { Monitor, Moon, Sun } from 'lucide-react';
import { cn } from '@/lib/utils';

export function AppearanceSettings() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="space-y-6">
      <div className="p-6 rounded-xl border border-border/60 bg-card shadow-sm space-y-6">
        <div className="border-b border-border/60 pb-3">
          <h3 className="text-sm font-semibold text-foreground">Theme Preferences</h3>
          <p className="text-xs text-muted-foreground mt-1">Customize the interface appearance.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <ThemeCard 
            title="Light" 
            icon={Sun} 
            isActive={theme === 'light'} 
            onClick={() => setTheme('light')}
            className="bg-white border-zinc-200"
          >
            <div className="w-full h-16 bg-zinc-100 rounded-md mt-2 flex flex-col gap-1 p-2">
              <div className="w-1/2 h-2 bg-zinc-300 rounded" />
              <div className="w-full h-2 bg-zinc-200 rounded" />
              <div className="w-3/4 h-2 bg-zinc-200 rounded" />
            </div>
          </ThemeCard>

          <ThemeCard 
            title="Dark" 
            icon={Moon} 
            isActive={theme === 'dark'} 
            onClick={() => setTheme('dark')}
            className="bg-zinc-950 border-zinc-800"
          >
            <div className="w-full h-16 bg-zinc-900 rounded-md mt-2 flex flex-col gap-1 p-2">
              <div className="w-1/2 h-2 bg-zinc-700 rounded" />
              <div className="w-full h-2 bg-zinc-800 rounded" />
              <div className="w-3/4 h-2 bg-zinc-800 rounded" />
            </div>
          </ThemeCard>

          <ThemeCard 
            title="System" 
            icon={Monitor} 
            isActive={theme === 'system'} 
            onClick={() => setTheme('system')}
            className="bg-gradient-to-br from-white to-zinc-950 border-zinc-400 dark:border-zinc-700"
          >
            <div className="w-full h-16 bg-zinc-500/20 rounded-md mt-2 flex flex-col gap-1 p-2 backdrop-blur-sm">
              <div className="w-1/2 h-2 bg-zinc-500/50 rounded" />
              <div className="w-full h-2 bg-zinc-500/30 rounded" />
              <div className="w-3/4 h-2 bg-zinc-500/30 rounded" />
            </div>
          </ThemeCard>
        </div>
      </div>
    </div>
  );
}

function ThemeCard({ title, icon: Icon, isActive, onClick, className, children }: any) {
  return (
    <div 
      onClick={onClick}
      className={cn(
        "relative flex flex-col p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 hover:scale-[1.02]",
        isActive ? "border-primary shadow-sm" : "border-transparent opacity-70 hover:opacity-100",
      )}
    >
      <div className={cn("absolute inset-0 rounded-xl border opacity-50", className)} />
      <div className="relative z-10 flex items-center justify-between mb-2">
        <div className={cn("text-sm font-semibold", isActive ? "text-primary" : "text-foreground")}>{title}</div>
        <Icon className={cn("h-4 w-4", isActive ? "text-primary" : "text-muted-foreground")} />
      </div>
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}
