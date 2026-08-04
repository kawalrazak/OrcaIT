import type { Permissions, UserRole } from '../types';

/** Layer 1 — Support Associate: customer intake & lead entry */
export const LAYER1_SUPPORT_ASSOCIATE: Permissions = {
  viewDashboard: true,
  viewAddLead: true,
  viewManageLeads: true,
  viewOnsiteAppointments: false,
  viewMyTasks: false,
  editLeads: true,
  deleteLeads: false,
  assignTechnicians: false,
  manageAppointments: false,
  manageUsers: false,
  managePermissions: false,
};

/** Layer 2 — Service Coordinator: assign tickets & manage appointments */
export const LAYER2_SERVICE_COORDINATOR: Permissions = {
  viewDashboard: true,
  viewAddLead: true,
  viewManageLeads: true,
  viewOnsiteAppointments: true,
  viewMyTasks: false,
  editLeads: true,
  deleteLeads: false,
  assignTechnicians: true,
  manageAppointments: true,
  manageUsers: false,
  managePermissions: false,
};

/** Layer 3 — Administrator: full system control */
export const LAYER3_ADMINISTRATOR: Permissions = {
  viewDashboard: true,
  viewAddLead: true,
  viewManageLeads: true,
  viewOnsiteAppointments: true,
  viewMyTasks: true,
  editLeads: true,
  deleteLeads: true,
  assignTechnicians: true,
  manageAppointments: true,
  manageUsers: true,
  managePermissions: true,
};

/** Field technician — receives assigned tasks */
export const TECHNICIAN_DEFAULT_PERMISSIONS: Permissions = {
  viewDashboard: true,
  viewAddLead: false,
  viewManageLeads: false,
  viewOnsiteAppointments: false,
  viewMyTasks: true,
  editLeads: true,
  deleteLeads: false,
  assignTechnicians: false,
  manageAppointments: false,
  manageUsers: false,
  managePermissions: false,
};

export const ADMIN_PERMISSIONS = LAYER3_ADMINISTRATOR;
export const DEFAULT_PERMISSIONS = LAYER3_ADMINISTRATOR;

export const ROLE_LABELS: Record<UserRole, string> = {
  administrator: 'Administrator',
  service_coordinator: 'Service Coordinator',
  support_associate: 'Support Associate',
  technician: 'Technician',
};

export const PERMISSIONS_BY_ROLE: Record<UserRole, Permissions> = {
  administrator: LAYER3_ADMINISTRATOR,
  service_coordinator: LAYER2_SERVICE_COORDINATOR,
  support_associate: LAYER1_SUPPORT_ASSOCIATE,
  technician: TECHNICIAN_DEFAULT_PERMISSIONS,
};

export type NavPermissionKey = keyof Permissions;

export const NAV_PERMISSIONS: Record<string, NavPermissionKey> = {
  '/dashboard': 'viewDashboard',
  '/add-lead': 'viewAddLead',
  '/manage-leads': 'viewManageLeads',
  '/onsite-appointments': 'viewOnsiteAppointments',
  '/my-tasks': 'viewMyTasks',
  '/manage-clients': 'manageUsers',
};

export const PERMISSION_LABELS: { key: keyof Permissions; label: string; role: string }[] = [
  { key: 'viewDashboard', label: 'View Dashboard', role: 'All staff' },
  { key: 'viewAddLead', label: 'Create Leads', role: 'Support Associate+' },
  { key: 'viewManageLeads', label: 'View / Manage Leads', role: 'Support Associate+' },
  { key: 'editLeads', label: 'Edit Lead Data', role: 'Support Associate+' },
  { key: 'assignTechnicians', label: 'Assign Technicians', role: 'Service Coordinator+' },
  { key: 'manageAppointments', label: 'Manage Appointments', role: 'Service Coordinator+' },
  { key: 'viewOnsiteAppointments', label: 'Onsite Appointments', role: 'Service Coordinator+' },
  { key: 'viewMyTasks', label: 'My Tasks', role: 'Technician' },
  { key: 'deleteLeads', label: 'Delete Records', role: 'Administrator only' },
  { key: 'manageUsers', label: 'Manage User Accounts', role: 'Administrator only' },
  { key: 'managePermissions', label: 'Modify Permissions', role: 'Administrator only' },
];

export function isAdministrator(role: UserRole | undefined): boolean {
  return role === 'administrator';
}

export function isTechnicianRole(role: UserRole | undefined): boolean {
  return role === 'technician';
}

export function isStaffRole(role: UserRole | undefined): boolean {
  return role === 'administrator' || role === 'service_coordinator' || role === 'support_associate';
}

export function normalizePermissions(permissions: Partial<Permissions> | undefined): Permissions {
  return {
    viewDashboard: permissions?.viewDashboard ?? false,
    viewAddLead: permissions?.viewAddLead ?? false,
    viewManageLeads: permissions?.viewManageLeads ?? false,
    viewOnsiteAppointments: permissions?.viewOnsiteAppointments ?? false,
    viewMyTasks: permissions?.viewMyTasks ?? false,
    editLeads: permissions?.editLeads ?? false,
    deleteLeads: permissions?.deleteLeads ?? false,
    assignTechnicians: permissions?.assignTechnicians ?? false,
    manageAppointments: permissions?.manageAppointments ?? false,
    manageUsers: permissions?.manageUsers ?? false,
    managePermissions: permissions?.managePermissions ?? false,
  };
}

export function canAccessRoute(
  path: string,
  role: UserRole | undefined,
  permissions: Permissions | undefined,
): boolean {
  if (isAdministrator(role)) return true;
  const key = NAV_PERMISSIONS[path];
  if (!key) return true;
  return permissions?.[key] ?? false;
}

export function hasPermission(
  permissions: Permissions | undefined,
  key: keyof Permissions,
  role: UserRole | undefined,
): boolean {
  if (isAdministrator(role)) return true;
  return permissions?.[key] ?? false;
}

/** Migrate legacy role strings from localStorage */
export function migrateRole(role: string): UserRole {
  if (role === 'admin') return 'administrator';
  if (role === 'client') return 'technician';
  if (role === 'administrator' || role === 'service_coordinator' || role === 'support_associate' || role === 'technician') {
    return role;
  }
  return 'technician';
}
