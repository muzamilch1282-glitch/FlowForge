import React from 'react';
import { usePermissions } from '@/hooks/usePermissions';
import { Role } from '@/lib/roles';
import { checkRoleAccess } from '@/lib/auth';

interface RoleGuardProps {
  requiredRole: Role;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function RoleGuard({ requiredRole, children, fallback = null }: RoleGuardProps) {
  const { role, isLoading } = usePermissions();

  if (isLoading) {
    return null;
  }

  if (!checkRoleAccess(role, requiredRole)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
