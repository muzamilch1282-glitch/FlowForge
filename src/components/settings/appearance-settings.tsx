'use client';

import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Sun, Moon, Monitor, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

export function AppearanceSettings() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Appearance</CardTitle>
          <CardDescription>
            Customize how FlowForge looks on your device.
          </CardDescription>
        </CardHeader>
        <CardContent className="h-48 flex items-center justify-center">
          <div className="animate-pulse flex gap-4">
            <div className="w-32 h-32 bg-muted rounded-xl"></div>
            <div className="w-32 h-32 bg-muted rounded-xl"></div>
            <div className="w-32 h-32 bg-muted rounded-xl"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Appearance</CardTitle>
        <CardDescription>
          Customize how FlowForge looks on your device.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Light Theme Option */}
          <button
            onClick={() => setTheme('light')}
            className={cn(
              "relative flex flex-col items-center justify-center p-4 border rounded-xl transition-all duration-200 hover:bg-muted/50 cursor-pointer",
              theme === 'light' ? "border-primary ring-1 ring-primary/20 bg-muted/50" : "border-border"
            )}
          >
            {theme === 'light' && (
              <div className="absolute top-3 right-3 text-primary">
                <Check className="h-4 w-4" />
              </div>
            )}
            <div className="mb-4 p-2 bg-slate-100 rounded-lg shadow-sm border border-slate-200 w-full max-w-[120px] h-20 flex flex-col gap-2">
              <div className="h-3 w-1/2 bg-white rounded shadow-sm"></div>
              <div className="h-2 w-3/4 bg-slate-200 rounded"></div>
              <div className="h-2 w-full bg-slate-200 rounded"></div>
            </div>
            <div className="flex items-center gap-2">
              <Sun className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium text-sm">Light</span>
            </div>
          </button>

          {/* Dark Theme Option */}
          <button
            onClick={() => setTheme('dark')}
            className={cn(
              "relative flex flex-col items-center justify-center p-4 border rounded-xl transition-all duration-200 hover:bg-muted/50 cursor-pointer",
              theme === 'dark' ? "border-primary ring-1 ring-primary/20 bg-muted/50" : "border-border"
            )}
          >
            {theme === 'dark' && (
              <div className="absolute top-3 right-3 text-primary">
                <Check className="h-4 w-4" />
              </div>
            )}
            <div className="mb-4 p-2 bg-slate-900 rounded-lg shadow-sm border border-slate-800 w-full max-w-[120px] h-20 flex flex-col gap-2">
              <div className="h-3 w-1/2 bg-slate-800 rounded shadow-sm"></div>
              <div className="h-2 w-3/4 bg-slate-700 rounded"></div>
              <div className="h-2 w-full bg-slate-700 rounded"></div>
            </div>
            <div className="flex items-center gap-2">
              <Moon className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium text-sm">Dark</span>
            </div>
          </button>

          {/* System Theme Option */}
          <button
            onClick={() => setTheme('system')}
            className={cn(
              "relative flex flex-col items-center justify-center p-4 border rounded-xl transition-all duration-200 hover:bg-muted/50 cursor-pointer overflow-hidden",
              theme === 'system' ? "border-primary ring-1 ring-primary/20 bg-muted/50" : "border-border"
            )}
          >
            {theme === 'system' && (
              <div className="absolute top-3 right-3 text-primary z-10">
                <Check className="h-4 w-4" />
              </div>
            )}
            <div className="mb-4 p-2 rounded-lg shadow-sm border border-border w-full max-w-[120px] h-20 flex overflow-hidden relative">
              <div className="absolute inset-y-0 left-0 w-1/2 bg-slate-100 p-2 flex flex-col gap-2">
                <div className="h-3 w-full bg-white rounded shadow-sm"></div>
                <div className="h-2 w-full bg-slate-200 rounded"></div>
                <div className="h-2 w-full bg-slate-200 rounded"></div>
              </div>
              <div className="absolute inset-y-0 right-0 w-1/2 bg-slate-900 p-2 flex flex-col gap-2 border-l border-border/50">
                <div className="h-3 w-full bg-slate-800 rounded shadow-sm"></div>
                <div className="h-2 w-full bg-slate-700 rounded"></div>
                <div className="h-2 w-full bg-slate-700 rounded"></div>
              </div>
            </div>
            <div className="flex items-center gap-2 mt-auto">
              <Monitor className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium text-sm z-10">System</span>
            </div>
          </button>
        </div>

        <p className="text-sm text-muted-foreground pt-2">
          Your theme preference is saved automatically and persists across sessions.
        </p>
      </CardContent>
    </Card>
  );
}
