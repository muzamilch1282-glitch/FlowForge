import { Role, ROLES } from './roles';

export const PERMISSIONS = {
  // Workspace
  WORKSPACE_VIEW: 'workspace:view',
  WORKSPACE_CREATE: 'workspace:create',
  WORKSPACE_EDIT: 'workspace:edit',
  WORKSPACE_DELETE: 'workspace:delete',

  // Projects
  PROJECT_VIEW: 'project:view',
  PROJECT_CREATE: 'project:create',
  PROJECT_EDIT: 'project:edit',
  PROJECT_DELETE: 'project:delete',

  // Tasks
  TASK_VIEW: 'task:view',
  TASK_CREATE: 'task:create',
  TASK_EDIT: 'task:edit',
  TASK_DELETE: 'task:delete',
  TASK_COMMENT: 'task:comment',

  // Members
  MEMBER_INVITE: 'member:invite',
  MEMBER_REMOVE: 'member:remove',
  MEMBER_UPDATE_ROLE: 'member:updateRole',
} as const;

export type Permission = typeof PERMISSIONS[keyof typeof PERMISSIONS];

// Map roles to their specific permissions
export const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  [ROLES.ADMIN]: [
    // Admins have all permissions
    ...Object.values(PERMISSIONS)
  ],
  [ROLES.MEMBER]: [
    PERMISSIONS.WORKSPACE_VIEW,
    PERMISSIONS.PROJECT_VIEW,
    PERMISSIONS.TASK_VIEW,
    PERMISSIONS.TASK_EDIT, // Members can edit tasks they are assigned to or have access to
    PERMISSIONS.TASK_COMMENT,
  ],
};

export const hasPermission = (role: Role, permission: Permission): boolean => {
  return ROLE_PERMISSIONS[role].includes(permission);
};
