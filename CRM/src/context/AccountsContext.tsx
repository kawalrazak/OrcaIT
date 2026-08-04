import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from 'react';
import type { Account, CreateClientForm, Permissions } from '../types';
import { ACCOUNTS_STORAGE_KEY } from '../data/constants';
import { DEFAULT_ADMIN } from '../data/defaultAccounts';
import {
  migrateRole,
  normalizePermissions,
  PERMISSIONS_BY_ROLE,
  isAdministrator,
} from '../utils/permissions';

interface AccountsContextType {
  accounts: Account[];
  technicianAccounts: Account[];
  addClient: (form: CreateClientForm) => { success: boolean; error?: string };
  updateClientPermissions: (id: string, permissions: Permissions) => { success: boolean; error?: string };
  deleteClient: (id: string) => void;
  getAccountById: (id: string) => Account | undefined;
  authenticate: (username: string, password: string) => Account | null;
}

const AccountsContext = createContext<AccountsContextType | null>(null);

function normalizeAccount(raw: Account & { role?: string }): Account {
  const role = migrateRole(raw.role ?? 'technician');
  return {
    ...raw,
    role,
    permissions: normalizePermissions({
      ...PERMISSIONS_BY_ROLE[role],
      ...(raw.permissions ?? {}),
    }),
  };
}

function loadAccounts(): Account[] {
  try {
    const saved = localStorage.getItem(ACCOUNTS_STORAGE_KEY);
    if (saved) return JSON.parse(saved).map((a: Account) => normalizeAccount(a));

    const initial = [normalizeAccount(DEFAULT_ADMIN)];
    localStorage.setItem(ACCOUNTS_STORAGE_KEY, JSON.stringify(initial));
    return initial;
  } catch {
    return [normalizeAccount(DEFAULT_ADMIN)];
  }
}

function saveAccounts(accounts: Account[]) {
  localStorage.setItem(ACCOUNTS_STORAGE_KEY, JSON.stringify(accounts));
}

export function AccountsProvider({ children }: { children: ReactNode }) {
  const [accounts, setAccounts] = useState<Account[]>(loadAccounts);

  useEffect(() => {
    saveAccounts(accounts);
  }, [accounts]);

  const technicianAccounts = accounts.filter((a) => a.role === 'technician');

  const getAccountById = useCallback(
    (id: string) => accounts.find((a) => a.id === id),
    [accounts],
  );

  const authenticate = useCallback(
    (username: string, password: string): Account | null => {
      const account = accounts.find(
        (a) =>
          a.username.toLowerCase() === username.trim().toLowerCase() &&
          a.password === password,
      );
      return account ?? null;
    },
    [accounts],
  );

  const addClient = useCallback(
    (form: CreateClientForm): { success: boolean; error?: string } => {
      const username = form.username.trim().toLowerCase();
      if (!username || !form.password || !form.name.trim()) {
        return { success: false, error: 'Username, password, and name are required.' };
      }
      if (accounts.some((a) => a.username.toLowerCase() === username)) {
        return { success: false, error: 'Username already exists.' };
      }

      const role = form.role ?? 'technician';
      const newAccount: Account = {
        id: crypto.randomUUID(),
        username,
        password: form.password,
        name: form.name.trim(),
        email: form.email.trim() || `${username}@careit.com`,
        phone: form.phone.trim() || '',
        role,
        permissions: normalizePermissions(form.permissions ?? PERMISSIONS_BY_ROLE[role]),
        createdAt: new Date().toISOString(),
      };

      setAccounts((prev) => {
        const updated = [...prev, newAccount];
        saveAccounts(updated);
        return updated;
      });

      return { success: true };
    },
    [accounts],
  );

  const updateClientPermissions = useCallback(
    (id: string, permissions: Permissions): { success: boolean; error?: string } => {
      const account = accounts.find((a) => a.id === id && !isAdministrator(a.role));
      if (!account) {
        return { success: false, error: 'User not found.' };
      }

      setAccounts((prev) => {
        const updated = prev.map((a) =>
          a.id === id ? { ...a, permissions: normalizePermissions(permissions) } : a,
        );
        saveAccounts(updated);
        return updated;
      });

      return { success: true };
    },
    [accounts],
  );

  const deleteClient = useCallback((id: string) => {
    setAccounts((prev) => {
      const updated = prev.filter((a) => a.id !== id || isAdministrator(a.role));
      saveAccounts(updated);
      return updated;
    });
  }, []);

  return (
    <AccountsContext.Provider
      value={{
        accounts,
        technicianAccounts,
        addClient,
        updateClientPermissions,
        deleteClient,
        getAccountById,
        authenticate,
      }}
    >
      {children}
    </AccountsContext.Provider>
  );
}

/** @deprecated use technicianAccounts */
export function useAccounts() {
  const ctx = useContext(AccountsContext);
  if (!ctx) throw new Error('useAccounts must be used within AccountsProvider');
  return {
    ...ctx,
    clientAccounts: ctx.technicianAccounts,
  };
}
