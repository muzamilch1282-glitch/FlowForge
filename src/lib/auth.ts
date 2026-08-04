import { Role, ROLES } from './roles';

/**
 * Validates if a user has a required role or higher
 * In this simple RBAC, admin is highest.
 */
export const checkRoleAccess = (userRole: Role, requiredRole: Role): boolean => {
  if (userRole === ROLES.ADMIN) return true; // Admin has access to everything
  if (requiredRole === ROLES.MEMBER && userRole === ROLES.MEMBER) return true;
  return false;
};
