'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { LoadingSpinner } from '@/components/shared/loading-spinner';

export function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { isLoading, user } = useAuth();

  if (isLoading) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-background">
        <LoadingSpinner className="h-8 w-8 text-primary" />
      </div>
    );
  }

  // If we're not loading and there's no user, we return null to prevent hydration flicker.
  // The middleware will actually handle the redirect before this ever mounts, 
  // but if it somehow leaks through, we don't render protected content.
  if (!user) {
    return null;
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.2, ease: 'easeInOut' }}
        className="flex-1"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
