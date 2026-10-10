import { ROLES, type Role } from '@/constants/roles';

export interface Permission {
  resource: string;
  actions: string[];
}

const rolePermissions: Record<Role, Permission[]> = {
  [ROLES.ADMIN]: [
    { resource: 'users', actions: ['read', 'create', 'update', 'delete'] },
    { resource: 'accounts', actions: ['read', 'create', 'update', 'delete'] },
    { resource: 'transactions', actions: ['read', 'create', 'update', 'reverse'] },
    { resource: 'services', actions: ['read', 'create', 'update', 'delete'] },
    { resource: 'settings', actions: ['read', 'update'] },
    { resource: 'reports', actions: ['read', 'export'] },
  ],
  [ROLES.CUSTOMER]: [
    { resource: 'accounts', actions: ['read'] },
    { resource: 'transactions', actions: ['read', 'create'] },
    { resource: 'services', actions: ['read'] },
    { resource: 'profile', actions: ['read', 'update'] },
  ],
};

export function hasPermission(role: Role, resource: string, action: string): boolean {
  const permissions = rolePermissions[role];
  if (!permissions) return false;
  const match = permissions.find((p) => p.resource === resource);
  return match ? match.actions.includes(action) : false;
}

export function getPermissions(role: Role): Permission[] {
  return rolePermissions[role] ?? [];
}
