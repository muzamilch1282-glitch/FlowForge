'use client';

import * as React from 'react';
import { Moon, Sun, Monitor } from 'lucide-react';
import { useTheme } from 'next-themes';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="flex h-9 w-9 items-center justify-center rounded-lg" />
    );
  }

  const themes = [
    { key: 'light', icon: Sun, label: 'Light' },
    { key: 'dark', icon: Moon, label: 'Dark' },
    { key: 'system', icon: Monitor, label: 'System' },
  ] as const;

  return (
    <div className="flex items-center gap-1 rounded-lg border border-border bg-muted/50 p-1">
      {themes.map(({ key, icon: Icon, label }) => (
        <button
          key={key}
          onClick={() => setTheme(key)}
          className={cn(
            'relative flex h-7 w-7 items-center justify-center rounded-md transition-colors',
            'hover:text-foreground',
            theme === key ? 'text-foreground' : 'text-muted-foreground'
          )}
          title={label}
        >
          {theme === key && (
            <motion.div
              layoutId="theme-toggle-active"
              className="absolute inset-0 rounded-md bg-background shadow-sm"
              transition={{ type: 'spring', bounce: 0.2, duration: 0.3 }}
            />
          )}
          <Icon className="relative z-10 h-4 w-4" />
        </button>
      ))}
    </div>
  );
}
