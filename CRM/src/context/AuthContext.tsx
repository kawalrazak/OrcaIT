import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react';
import type { User } from '../types';
import { useAccounts } from './AccountsContext';
import {
  isAdministrator,
  isTechnicianRole,
  isStaffRole,
  migrateRole,
  normalizePermissions,
} from '../utils/permissions';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isClient: boolean;
  isAdministrator: boolean;
  isServiceCoordinator: boolean;
  isSupportAssociate: boolean;
  isTechnician: boolean;
  isStaff: boolean;
  login: (username: string, password: string, remember: boolean) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

const USER_STORAGE_KEY = 'careit_user';

function formatLastLogin(): string {
  return new Date().toLocaleString('en-AU', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  });
}

function loadUser(): User | null {
  try {
    const saved = localStorage.getItem(USER_STORAGE_KEY) ?? sessionStorage.getItem(USER_STORAGE_KEY);
    if (!saved) return null;
    const raw = JSON.parse(saved) as User & { role?: string };
    const role = migrateRole(raw.role ?? 'technician');
    return {
      ...raw,
      role,
      permissions: normalizePermissions(raw.permissions),
    };
  } catch {
    return null;
  }
}

function persistUser(user: User | null, remember: boolean) {
  sessionStorage.removeItem(USER_STORAGE_KEY);
  localStorage.removeItem(USER_STORAGE_KEY);
  if (user) {
    const storage = remember ? localStorage : sessionStorage;
    storage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const { authenticate, getAccountById, accounts } = useAccounts();
  const [user, setUser] = useState<User | null>(loadUser);
  const [rememberMe] = useState(() => !!localStorage.getItem(USER_STORAGE_KEY));

  useEffect(() => {
    setUser((current) => {
      if (!current) return current;
      const account = getAccountById(current.id);
      if (!account) return current;

      const updated: User = {
        ...current,
        name: account.name,
        email: account.email,
        phone: account.phone,
        role: account.role,
        permissions: normalizePermissions(account.permissions),
      };

      const changed =
        current.name !== updated.name ||
        current.email !== updated.email ||
        current.phone !== updated.phone ||
        current.role !== updated.role ||
        JSON.stringify(current.permissions) !== JSON.stringify(updated.permissions);

      if (!changed) return current;

      persistUser(updated, rememberMe);
      return updated;
    });
  }, [accounts, getAccountById, rememberMe]);

  const login = useCallback(
    (username: string, password: string, remember: boolean) => {
      const account = authenticate(username, password);
      if (!account) return false;

      const loggedInUser: User = {
        id: account.id,
        username: account.username,
        name: account.name,
        email: account.email,
        phone: account.phone,
        role: account.role,
        permissions: normalizePermissions(account.permissions),
        lastLogin: formatLastLogin(),
      };

      setUser(loggedInUser);
      persistUser(loggedInUser, remember);
      return true;
    },
    [authenticate],
  );

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem(USER_STORAGE_KEY);
    sessionStorage.removeItem(USER_STORAGE_KEY);
  }, []);

  const role = user?.role;

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isAdmin: isAdministrator(role),
        isClient: isTechnicianRole(role),
        isAdministrator: isAdministrator(role),
        isServiceCoordinator: role === 'service_coordinator',
        isSupportAssociate: role === 'support_associate',
        isTechnician: isTechnicianRole(role),
        isStaff: isStaffRole(role),
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
