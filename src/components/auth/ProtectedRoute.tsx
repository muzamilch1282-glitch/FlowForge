'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { usePermissions } from '@/hooks/usePermissions';
import { Permission } from '@/lib/permissions';

interface ProtectedRouteProps {
  permission: Permission;
  children: React.ReactNode;
}

export function ProtectedRoute({ permission, children }: ProtectedRouteProps) {
  const { hasPermission, isLoading } = usePermissions();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !hasPermission(permission)) {
      router.replace('/unauthorized');
    }
  }, [isLoading, hasPermission, permission, router]);

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-r-transparent"></div>
      </div>
    );
  }

  if (!hasPermission(permission)) {
    return null; // Will unmount shortly via useEffect redirect
  }

  return <>{children}</>;
}
