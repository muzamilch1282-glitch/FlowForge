'use client';

import * as React from 'react';
import { ThemeProvider } from './theme-provider';
import { QueryProvider } from './query-provider';
import { AuthProvider } from './auth-provider';
import { Toaster } from 'sonner';
import { TooltipProvider } from '@/components/ui/tooltip';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <AuthProvider>
          <TooltipProvider>
            {children}
          </TooltipProvider>
        </AuthProvider>
        <Toaster
          position="bottom-right"
          toastOptions={{
            classNames: {
              toast: 'bg-background text-foreground border-border shadow-lg',
            },
          }}
        />
      </ThemeProvider>
    </QueryProvider>
  );
}
