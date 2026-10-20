import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react';
import type { User } from '../types';
import {
  isAdministrator,
  isTechnicianRole,
  isStaffRole,
} from '../utils/permissions';
import { useAccounts } from './AccountsContext';
import { useToast } from './ToastContext';
import {
  initKeycloak,
  keycloak,
  keycloakConfigured,
  loginWithKeycloak,
  logoutKeycloak,
  userFromKeycloak,
} from '../lib/keycloak';

interface AuthContextType {
  user: User | null;
  authReady: boolean;
  authError: string;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isClient: boolean;
  isAdministrator: boolean;
  isServiceCoordinator: boolean;
  isSupportAssociate: boolean;
  isTechnician: boolean;
  isStaff: boolean;
  login: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { refreshUsers } = useAccounts();
  const { notify } = useToast();
  const [user, setUser] = useState<User | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const [authError, setAuthError] = useState('');

  useEffect(() => {
    if (user) void refreshUsers();
  }, [user, refreshUsers]);

  useEffect(() => {
    if (!authReady || !user) return;
    const authTime = keycloak.tokenParsed?.auth_time;
    if (!authTime || Date.now() / 1000 - Number(authTime) > 45) return;
    const key = `orcait-login-toast-${authTime}`;
    if (sessionStorage.getItem(key)) return;
    sessionStorage.setItem(key, '1');
    notify({
      type: 'success',
      title: 'Signed in',
      message: `Welcome back, ${user.name || user.username}.`,
    });
  }, [authReady, notify, user]);

  useEffect(() => {
    let cancelled = false;
    if (!keycloakConfigured()) {
      setAuthError('Keycloak is not configured.');
      setAuthReady(true);
      return;
    }

    initKeycloak()
      .then(() => {
        if (cancelled) return;
        setUser(userFromKeycloak());
        setAuthReady(true);
      })
      .catch(() => {
        if (cancelled) return;
        setAuthError('Keycloak sign-in is unavailable.');
        setAuthReady(true);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const login = useCallback(() => {
    setAuthError('');
    void loginWithKeycloak();
  }, []);

  const logout = useCallback(() => {
    sessionStorage.setItem('orcait-signed-out', user?.name || 'You');
    setUser(null);
    void logoutKeycloak();
  }, [user]);

  const role = user?.role;

  return (
    <AuthContext.Provider
      value={{
        user,
        authReady,
        authError,
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
