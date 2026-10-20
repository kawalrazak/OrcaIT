import { Fragment, FormEvent, useCallback, useEffect, useState } from 'react';
import { ChevronDown, ChevronRight, Eye, EyeOff, KeyRound, Mail, Save, Sparkles, Trash2, UserPlus, Users } from 'lucide-react';
import Breadcrumbs from '../components/Breadcrumbs';
import ConfirmModal from '../components/ConfirmModal';
import PasswordField from '../components/PasswordField';
import { useAccounts } from '../context/AccountsContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { keycloak } from '../lib/keycloak';
import {
  PERMISSIONS_BY_ROLE,
  PERMISSION_LABELS,
  ROLE_LABELS,
} from '../utils/permissions';
import type { UserRole } from '../types';

type DirectoryUser = {
  id: string;
  username: string;
  firstName?: string;
  lastName?: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  passwordOnFile?: boolean;
  createdAt?: string;
};

type EditForm = {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  phone: string;
};

type ActivityEntry = {
  at?: string;
  actionLabel?: string;
  summary?: string;
  performedByUsername?: string;
  performedByName?: string;
  performedById?: string;
  deletedBy?: string;
  leadUser?: string;
  success?: boolean;
};

type CreateForm = {
  firstName: string;
  lastName: string;
  username: string;
  password: string;
  email: string;
  phone: string;
  role: UserRole;
};

const emptyForm: CreateForm = {
  firstName: '',
  lastName: '',
  username: '',
  password: '',
  email: '',
  phone: '',
  role: 'technician',
};

const PASSWORD_RULES: { label: string; test: (value: string) => boolean }[] = [
  { label: 'At least 10 characters', test: (value) => value.length >= 10 },
  { label: 'A lowercase letter', test: (value) => /[a-z]/.test(value) },
  { label: 'An uppercase letter', test: (value) => /[A-Z]/.test(value) },
  { label: 'A number', test: (value) => /\d/.test(value) },
  { label: 'A symbol', test: (value) => /[^A-Za-z0-9]/.test(value) },
];

function australianPhoneMessage(value: string) {
  const compact = value.trim().replace(/[\s()-]/g, '');
  if (!compact) return 'Phone number is required.';
  let national = compact;
  if (national.startsWith('+61')) national = `0${national.slice(3)}`;
  else if (/^61\d{9}$/.test(national)) national = `0${national.slice(2)}`;
  if (/^04\d{8}$/.test(national) || /^0[2378]\d{8}$/.test(national)) return '';
  return 'Use an Australian number, such as 0412 345 678 or 02 9876 5432.';
}

function generatePassword() {
  const lower = 'abcdefghijkmnopqrstuvwxyz';
  const upper = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
  const digits = '23456789';
  const symbols = '!@#$%&*?';
  const all = lower + upper + digits + symbols;
  const bytes = new Uint32Array(16);
  crypto.getRandomValues(bytes);
  const chars = [
    lower[bytes[0] % lower.length],
    upper[bytes[1] % upper.length],
    digits[bytes[2] % digits.length],
    symbols[bytes[3] % symbols.length],
  ];
  for (let index = 4; index < 16; index += 1) {
    chars.push(all[bytes[index] % all.length]);
  }
  for (let index = chars.length - 1; index > 0; index -= 1) {
    const swap = bytes[index] % (index + 1);
    const current = chars[index];
    chars[index] = chars[swap];
    chars[swap] = current;
  }
  return chars.join('');
}

async function api(path: string, options: RequestInit = {}) {
  if (keycloak.authenticated) {
    try {
      await keycloak.updateToken(30);
    } catch {
      /* Use the current access token. */
    }
  }
  const headers = new Headers(options.headers);
  if (!headers.has('Content-Type') && options.body) headers.set('Content-Type', 'application/json');
  if (keycloak.token) headers.set('Authorization', `Bearer ${keycloak.token}`);
  const response = await fetch(path, { ...options, headers });
  const data = await response.json().catch(() => ({}));
  if (!response.ok || data.ok === false) {
    const error = new Error(data.error || 'Request failed.') as Error & { password?: string };
    if (typeof data.password === 'string') error.password = data.password;
    throw error;
  }
  return data;
}

function matchesUser(entry: ActivityEntry, user: DirectoryUser) {
  const username = user.username.toLowerCase();
  const fields = [entry.performedByUsername, entry.performedByName, entry.performedById, entry.deletedBy, entry.leadUser]
    .filter(Boolean)
    .map((value) => String(value).toLowerCase());
  return fields.some((value) => value === username || value === user.name.toLowerCase() || value === user.id);
}

function splitName(account: DirectoryUser): EditForm {
  const fallback = account.name.trim().split(/\s+/);
  return {
    firstName: account.firstName || fallback[0] || '',
    lastName: account.lastName || fallback.slice(1).join(' '),
    username: account.username,
    email: account.email || '',
    phone: account.phone || '',
  };
}

export default function ManageClientsPage() {
  const { refreshUsers } = useAccounts();
  const { user } = useAuth();
  const { notify } = useToast();
  const [form, setForm] = useState<CreateForm>(emptyForm);
  const [showPassword, setShowPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<keyof CreateForm, string>>>({});
  const [users, setUsers] = useState<DirectoryUser[]>([]);
  const [activity, setActivity] = useState<ActivityEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [pendingDelete, setPendingDelete] = useState<DirectoryUser | null>(null);
  const [openId, setOpenId] = useState<string | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [resetPassword, setResetPassword] = useState('');
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [resetError, setResetError] = useState('');
  const [editForm, setEditForm] = useState<EditForm>({ firstName: '', lastName: '', username: '', email: '', phone: '' });
  const [editErrors, setEditErrors] = useState<Partial<Record<keyof EditForm, string>>>({});
  const [knownPasswords, setKnownPasswords] = useState<Record<string, string>>({});
  const [revealedIds, setRevealedIds] = useState<Record<string, boolean>>({});
  const [busyId, setBusyId] = useState('');

  function rememberPassword(id: string, password: string) {
    setKnownPasswords((current) => ({ ...current, [id]: password }));
    setRevealedIds((current) => ({ ...current, [id]: true }));
    setResetPassword(password);
    setShowResetPassword(true);
    setUsers((current) => current.map((item) => (item.id === id ? { ...item, passwordOnFile: true } : item)));
  }

  async function togglePassword(account: DirectoryUser) {
    if (revealedIds[account.id]) {
      setRevealedIds((current) => ({ ...current, [account.id]: false }));
      return;
    }
    if (knownPasswords[account.id]) {
      setRevealedIds((current) => ({ ...current, [account.id]: true }));
      setResetPassword(knownPasswords[account.id]);
      setShowResetPassword(true);
      return;
    }
    try {
      const data = await api(`/api/users/${account.id}/password`);
      rememberPassword(account.id, data.password);
    } catch (err) {
      notify({
        type: 'info',
        title: 'Password not on file',
        message: err instanceof Error ? err.message : 'Save a new password, then the eye can show it.',
      });
    }
  }

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [directory, log] = await Promise.all([
        api('/api/users'),
        api('/api/activity?limit=300'),
      ]);
      setUsers(directory.users || []);
      setActivity(log.entries || []);
      await refreshUsers();
    } catch (err) {
      notify({
        type: 'error',
        title: 'Could not load users',
        message: err instanceof Error ? err.message : 'Could not load users.',
      });
    } finally {
      setLoading(false);
    }
  }, [notify, refreshUsers]);

  useEffect(() => {
    void load();
  }, [load]);

  function handleRoleChange(role: UserRole) {
    setForm({ ...form, role });
  }

  function validateForm() {
    const next: Partial<Record<keyof CreateForm, string>> = {};
    if (!form.firstName.trim()) next.firstName = 'First name is required.';
    if (!form.lastName.trim()) next.lastName = 'Last name is required.';
    if (!form.username.trim()) next.username = 'Username is required.';
    else if (!/^[a-z0-9._-]+$/i.test(form.username.trim())) {
      next.username = 'Use letters, numbers, dots, hyphens, or underscores.';
    }
    const phoneMessage = australianPhoneMessage(form.phone);
    if (phoneMessage) next.phone = phoneMessage;
    if (form.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      next.email = 'Enter a valid email address.';
    }
    if (PASSWORD_RULES.some((rule) => !rule.test(form.password))) {
      next.password = 'Password does not meet the rules below.';
    }
    setFieldErrors(next);
    return Object.keys(next).length === 0;
  }

  function validateEdit() {
    const next: Partial<Record<keyof EditForm, string>> = {};
    if (!editForm.firstName.trim()) next.firstName = 'First name is required.';
    if (!editForm.lastName.trim()) next.lastName = 'Last name is required.';
    if (!editForm.username.trim()) next.username = 'Username is required.';
    else if (!/^[a-z0-9._-]+$/i.test(editForm.username.trim())) {
      next.username = 'Use letters, numbers, dots, hyphens, or underscores.';
    }
    if (editForm.phone.trim() && australianPhoneMessage(editForm.phone) !== '' && australianPhoneMessage(editForm.phone) !== 'Phone number is required.') {
      next.phone = australianPhoneMessage(editForm.phone);
    }
    if (editForm.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(editForm.email.trim())) {
      next.email = 'Enter a valid email address.';
    }
    setEditErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!validateForm()) {
      setShowCreate(true);
      return;
    }
    const fullName = `${form.firstName.trim()} ${form.lastName.trim()}`;
    const password = form.password;
    try {
      const created = await api('/api/users', {
        method: 'POST',
        body: JSON.stringify({
          username: form.username,
          password,
          firstName: form.firstName,
          lastName: form.lastName,
          email: form.email,
          phone: form.phone,
          role: form.role,
        }),
      });
      if (created.user?.id) rememberPassword(created.user.id, password);
      notify({
        type: 'success',
        title: 'User created',
        message: `${fullName} can now sign in as ${ROLE_LABELS[form.role]}.`,
      });
      setForm(emptyForm);
      setShowPassword(false);
      setFieldErrors({});
      setShowCreate(false);
      await load();
    } catch (err) {
      notify({
        type: 'error',
        title: 'Could not create user',
        message: err instanceof Error ? err.message : 'Could not create the user.',
      });
    }
  }

  async function saveDetails(account: DirectoryUser) {
    if (!validateEdit()) return;
    setBusyId(account.id);
    try {
      const saved = await api(`/api/users/${account.id}`, {
        method: 'PUT',
        body: JSON.stringify(editForm),
      });
      if (saved.user) setEditForm(splitName(saved.user));
      notify({
        type: 'success',
        title: 'Details updated',
        message: `${editForm.firstName.trim()} ${editForm.lastName.trim()} was updated.`,
      });
      await load();
    } catch (err) {
      notify({
        type: 'error',
        title: 'Could not update details',
        message: err instanceof Error ? err.message : 'Could not update the user.',
      });
    } finally {
      setBusyId('');
    }
  }

  async function changeRole(account: DirectoryUser, role: UserRole) {
    setBusyId(account.id);
    try {
      await api(`/api/users/${account.id}/role`, {
        method: 'PUT',
        body: JSON.stringify({ role, name: account.name }),
      });
      notify({
        type: 'success',
        title: 'Role updated',
        message: `${account.name} is now ${ROLE_LABELS[role]}.`,
      });
      await load();
    } catch (err) {
      notify({
        type: 'error',
        title: 'Could not change role',
        message: err instanceof Error ? err.message : 'Could not change the role.',
      });
    } finally {
      setBusyId('');
    }
  }

  async function submitReset(account: DirectoryUser) {
    if (PASSWORD_RULES.some((rule) => !rule.test(resetPassword))) {
      setResetError('Password does not meet the rules below.');
      return;
    }
    setResetError('');
    setBusyId(account.id);
    const password = resetPassword;
    try {
      await api(`/api/users/${account.id}/password`, {
        method: 'PUT',
        body: JSON.stringify({ password, name: account.name }),
      });
      rememberPassword(account.id, password);
      notify({
        type: 'success',
        title: 'Password updated',
        message: `Password updated for ${account.name}.`,
      });
      await load();
    } catch (err) {
      notify({
        type: 'error',
        title: 'Could not reset password',
        message: err instanceof Error ? err.message : 'Could not reset the password.',
      });
    } finally {
      setBusyId('');
    }
  }

  async function emailReset(account: DirectoryUser) {
    if (!account.email) {
      notify({
        type: 'error',
        title: 'No email address',
        message: `Add an email for ${account.name} before sending a password reset.`,
      });
      return;
    }
    setBusyId(account.id);
    try {
      const data = await api(`/api/users/${account.id}/password-email`, { method: 'POST' });
      if (data.password) rememberPassword(account.id, data.password);
      notify({
        type: 'success',
        title: 'Reset email sent',
        message: `A new password was emailed to ${account.email}.`,
      });
      await load();
    } catch (err) {
      const password = (err as { password?: string }).password;
      if (password) rememberPassword(account.id, password);
      notify({
        type: 'error',
        title: 'Reset email failed',
        message: err instanceof Error ? err.message : 'Could not email a password reset.',
      });
    } finally {
      setBusyId('');
    }
  }

  async function removeUser(account: DirectoryUser) {
    setBusyId(account.id);
    try {
      await api(`/api/users/${account.id}?name=${encodeURIComponent(account.name)}`, { method: 'DELETE' });
      notify({
        type: 'success',
        title: 'User deleted',
        message: `${account.name} was deleted.`,
      });
      setPendingDelete(null);
      if (openId === account.id) setOpenId(null);
      await load();
    } catch (err) {
      notify({
        type: 'error',
        title: 'Could not delete user',
        message: err instanceof Error ? err.message : 'Could not delete the user.',
      });
    } finally {
      setBusyId('');
    }
  }

  return (
    <div>
      <Breadcrumbs items={[{ label: 'Manage Users' }]} />

      <div className="mt-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-orca-royal-dark">Users</h1>
          <p className="mt-1 text-sm text-slate-500">
            Sign-in accounts, permissions, passwords, and activity.
          </p>
        </div>
      </div>

      <div className="mt-5 overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-card">
        <button
          type="button"
          onClick={() => setShowCreate((open) => !open)}
          className="flex w-full items-center gap-2.5 px-5 py-3 text-left hover:bg-slate-50"
          aria-expanded={showCreate}
        >
          {showCreate ? <ChevronDown size={16} className="text-slate-500" /> : <ChevronRight size={16} className="text-slate-500" />}
          <UserPlus size={16} className="text-orca-royal" />
          <span className="text-sm font-semibold text-slate-800">Create user</span>
        </button>
        {showCreate && (
          <form onSubmit={handleSubmit} noValidate className="grid gap-4 border-t border-slate-100 p-5 sm:grid-cols-2 lg:grid-cols-3">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700" htmlFor="create-role">Role *</label>
              <select
                id="create-role"
                value={form.role}
                onChange={(event) => handleRoleChange(event.target.value as UserRole)}
                className="select-field"
              >
                <option value="technician">Technician</option>
                <option value="support_associate">Support Associate</option>
                <option value="service_coordinator">Service Coordinator</option>
                <option value="administrator">Administrator</option>
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700" htmlFor="create-first-name">First name *</label>
              <input
                id="create-first-name"
                value={form.firstName}
                onChange={(event) => setForm({ ...form, firstName: event.target.value })}
                className="input-field"
                required
              />
              {fieldErrors.firstName && <p className="mt-1 text-xs text-red-600">{fieldErrors.firstName}</p>}
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700" htmlFor="create-last-name">Last name *</label>
              <input
                id="create-last-name"
                value={form.lastName}
                onChange={(event) => setForm({ ...form, lastName: event.target.value })}
                className="input-field"
                required
              />
              {fieldErrors.lastName && <p className="mt-1 text-xs text-red-600">{fieldErrors.lastName}</p>}
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700" htmlFor="create-username">Username *</label>
              <input
                id="create-username"
                value={form.username}
                onChange={(event) => setForm({ ...form, username: event.target.value })}
                className="input-field"
                autoComplete="off"
                required
              />
              {fieldErrors.username && <p className="mt-1 text-xs text-red-600">{fieldErrors.username}</p>}
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700" htmlFor="create-phone">Phone *</label>
              <input
                id="create-phone"
                type="tel"
                value={form.phone}
                onChange={(event) => setForm({ ...form, phone: event.target.value })}
                placeholder="0412 345 678"
                className="input-field"
                required
              />
              {fieldErrors.phone && <p className="mt-1 text-xs text-red-600">{fieldErrors.phone}</p>}
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700" htmlFor="create-email">Email</label>
              <input
                id="create-email"
                type="email"
                value={form.email}
                onChange={(event) => setForm({ ...form, email: event.target.value })}
                className="input-field"
              />
              {fieldErrors.email && <p className="mt-1 text-xs text-red-600">{fieldErrors.email}</p>}
            </div>
            <div className="sm:col-span-2 lg:col-span-3">
              <label className="mb-1.5 block text-sm font-medium text-slate-700" htmlFor="create-password">Password *</label>
              <div className="flex flex-wrap gap-2">
                <PasswordField
                  id="create-password"
                  value={form.password}
                  onChange={(password) => setForm({ ...form, password })}
                  visible={showPassword}
                  onVisibleChange={setShowPassword}
                />
                <button
                  type="button"
                  onClick={() => {
                    setForm({ ...form, password: generatePassword() });
                    setShowPassword(true);
                    setFieldErrors((current) => ({ ...current, password: undefined }));
                  }}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  <Sparkles size={14} /> Generate password
                </button>
              </div>
              {fieldErrors.password && <p className="mt-1 text-xs text-red-600">{fieldErrors.password}</p>}
              <ul className="mt-2 flex flex-wrap gap-x-3 gap-y-1">
                {PASSWORD_RULES.map((rule) => {
                  const met = rule.test(form.password);
                  return (
                    <li key={rule.label} className={`text-xs ${form.password && met ? 'text-emerald-700' : 'text-slate-500'}`}>
                      {form.password && met ? '✓' : '•'} {rule.label}
                    </li>
                  );
                })}
              </ul>
            </div>
            <div className="sm:col-span-2 lg:col-span-3">
              <button type="submit" className="btn-primary">
                <UserPlus size={16} /> Create account
              </button>
            </div>
          </form>
        )}
      </div>

      <div className="mt-4 overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-card">
        <div className="flex items-center gap-2.5 border-b border-slate-100 bg-slate-50/50 px-5 py-3">
          <Users size={16} className="text-orca-royal" />
          <p className="text-sm font-semibold text-slate-800">Directory</p>
          <span className="text-xs text-slate-400">{loading ? '…' : users.length}</span>
        </div>

        {loading ? (
          <p className="px-5 py-10 text-center text-sm text-slate-500">Loading users…</p>
        ) : users.length === 0 ? (
          <p className="px-5 py-10 text-center text-sm text-slate-500">No users yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="w-10 px-3 py-3" />
                  <th className="px-3 py-3 font-semibold">Name</th>
                  <th className="px-3 py-3 font-semibold">Username</th>
                  <th className="px-3 py-3 font-semibold">Email</th>
                  <th className="px-3 py-3 font-semibold">Phone</th>
                  <th className="px-3 py-3 font-semibold">Password</th>
                  <th className="px-3 py-3 font-semibold">Role</th>
                  <th className="px-3 py-3 font-semibold"> </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {users.map((account) => {
                  const mine = account.id === user?.id;
                  const open = openId === account.id;
                  const permissions = PERMISSIONS_BY_ROLE[account.role] || PERMISSIONS_BY_ROLE.support_associate;
                  const entries = activity.filter((entry) => matchesUser(entry, account)).slice(0, 6);
                  return (
                    <Fragment key={account.id}>
                      <tr className={open ? 'bg-slate-50/80' : 'hover:bg-slate-50/70'}>
                        <td className="px-3 py-2.5">
                          <button
                            type="button"
                            aria-expanded={open}
                            aria-label={open ? `Hide details for ${account.name}` : `Show details for ${account.name}`}
                            onClick={() => {
                              const next = open ? null : account.id;
                              setOpenId(next);
                              setResetError('');
                              setEditErrors({});
                              if (next) {
                                setEditForm(splitName(account));
                                setResetPassword(knownPasswords[account.id] || '');
                                setShowResetPassword(Boolean(knownPasswords[account.id]));
                              }
                            }}
                            className="inline-flex h-7 w-7 items-center justify-center rounded text-slate-500 hover:bg-slate-100"
                          >
                            {open ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                          </button>
                        </td>
                        <td className="whitespace-nowrap px-3 py-2.5 font-medium text-slate-800">
                          {account.name}
                          {mine && <span className="ml-2 text-xs font-normal text-slate-400">You</span>}
                        </td>
                        <td className="whitespace-nowrap px-3 py-2.5 text-slate-600">@{account.username}</td>
                        <td className="px-3 py-2.5 text-slate-600">{account.email || '—'}</td>
                        <td className="whitespace-nowrap px-3 py-2.5 text-slate-600">{account.phone || '—'}</td>
                        <td className="whitespace-nowrap px-3 py-2.5">
                          <button
                            type="button"
                            onClick={() => void togglePassword(account)}
                            className="inline-flex items-center gap-1.5 rounded-md px-1.5 py-1 font-mono text-xs font-semibold text-slate-900 hover:bg-brand-50"
                            aria-label={revealedIds[account.id] ? `Hide password for ${account.name}` : `Show password for ${account.name}`}
                          >
                            <span>{revealedIds[account.id] && knownPasswords[account.id] ? knownPasswords[account.id] : '••••••••'}</span>
                            {revealedIds[account.id] ? <EyeOff size={15} className="text-brand-700" /> : <Eye size={15} className="text-brand-600" />}
                          </button>
                        </td>
                        <td className="whitespace-nowrap px-3 py-2.5">
                          <span className="rounded-full bg-brand-50 px-2 py-0.5 text-[11px] font-semibold text-brand-700">
                            {ROLE_LABELS[account.role]}
                          </span>
                        </td>
                        <td className="px-3 py-2.5 text-right">
                          <button
                            type="button"
                            disabled={mine || busyId === account.id}
                            onClick={() => setPendingDelete(account)}
                            className="rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-500 disabled:opacity-30"
                            aria-label={`Delete ${account.name}`}
                          >
                            <Trash2 size={15} />
                          </button>
                        </td>
                      </tr>
                      {open && (
                        <tr className="bg-slate-50/80">
                          <td colSpan={8} className="px-5 pb-5 pt-1">
                            <div className="rounded-xl border border-slate-200 bg-white p-5">
                              <form
                                onSubmit={(event) => {
                                  event.preventDefault();
                                  void saveDetails(account);
                                }}
                              >
                                <p className="text-sm font-bold text-slate-900">Details</p>
                                <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                                  <div>
                                    <label className="mb-1 block text-xs font-medium text-slate-700" htmlFor={`edit-first-${account.id}`}>First name *</label>
                                    <input id={`edit-first-${account.id}`} value={editForm.firstName} onChange={(event) => setEditForm({ ...editForm, firstName: event.target.value })} className="input-field" />
                                    {editErrors.firstName && <p className="mt-1 text-xs text-red-600">{editErrors.firstName}</p>}
                                  </div>
                                  <div>
                                    <label className="mb-1 block text-xs font-medium text-slate-700" htmlFor={`edit-last-${account.id}`}>Last name *</label>
                                    <input id={`edit-last-${account.id}`} value={editForm.lastName} onChange={(event) => setEditForm({ ...editForm, lastName: event.target.value })} className="input-field" />
                                    {editErrors.lastName && <p className="mt-1 text-xs text-red-600">{editErrors.lastName}</p>}
                                  </div>
                                  <div>
                                    <label className="mb-1 block text-xs font-medium text-slate-700" htmlFor={`edit-role-${account.id}`}>Role</label>
                                    <select
                                      id={`edit-role-${account.id}`}
                                      aria-label={`Role for ${account.name}`}
                                      value={account.role}
                                      disabled={mine || busyId === account.id}
                                      onChange={(event) => void changeRole(account, event.target.value as UserRole)}
                                      className="select-field disabled:bg-slate-50"
                                    >
                                      {(Object.keys(ROLE_LABELS) as UserRole[]).map((role) => (
                                        <option key={role} value={role}>{ROLE_LABELS[role]}</option>
                                      ))}
                                    </select>
                                  </div>
                                  <div>
                                    <label className="mb-1 block text-xs font-medium text-slate-700" htmlFor={`edit-user-${account.id}`}>Username *</label>
                                    <input id={`edit-user-${account.id}`} value={editForm.username} onChange={(event) => setEditForm({ ...editForm, username: event.target.value })} className="input-field" autoComplete="off" />
                                    {editErrors.username && <p className="mt-1 text-xs text-red-600">{editErrors.username}</p>}
                                  </div>
                                  <div>
                                    <label className="mb-1 block text-xs font-medium text-slate-700" htmlFor={`edit-phone-${account.id}`}>Phone</label>
                                    <input id={`edit-phone-${account.id}`} type="tel" value={editForm.phone} onChange={(event) => setEditForm({ ...editForm, phone: event.target.value })} placeholder="0412 345 678" className="input-field" />
                                    {editErrors.phone && <p className="mt-1 text-xs text-red-600">{editErrors.phone}</p>}
                                  </div>
                                  <div>
                                    <p className="mb-1 text-xs font-medium text-slate-700">Permissions</p>
                                    <div className="flex min-h-9 flex-wrap items-center gap-1">
                                      {PERMISSION_LABELS.filter((item) => permissions[item.key]).map((item) => (
                                        <span key={item.key} className="rounded-md bg-brand-50 px-1.5 py-0.5 text-[11px] font-semibold text-brand-700">
                                          {item.label}
                                        </span>
                                      ))}
                                    </div>
                                  </div>
                                  <div className="sm:col-span-2">
                                    <label className="mb-1 block text-xs font-medium text-slate-700" htmlFor={`edit-email-${account.id}`}>Email</label>
                                    <input id={`edit-email-${account.id}`} type="email" value={editForm.email} onChange={(event) => setEditForm({ ...editForm, email: event.target.value })} className="input-field" />
                                    {editErrors.email && <p className="mt-1 text-xs text-red-600">{editErrors.email}</p>}
                                  </div>
                                </div>
                                <button type="submit" disabled={busyId === account.id} className="btn-primary mt-4 text-sm">
                                  <Save size={14} /> Save details
                                </button>
                              </form>

                              <div className="mt-8 grid gap-8 border-t border-slate-200 pt-6 lg:grid-cols-2">
                              <form
                                className="space-y-3"
                                onSubmit={(event) => {
                                  event.preventDefault();
                                  void submitReset(account);
                                }}
                              >
                                <p className="flex items-center gap-2 text-sm font-bold text-slate-900">
                                  <KeyRound size={16} className="text-brand-600" /> Reset password
                                </p>
                                <div className="flex flex-wrap gap-2">
                                  <PasswordField
                                    id={`reset-password-${account.id}`}
                                    value={resetPassword}
                                    onChange={setResetPassword}
                                    visible={showResetPassword}
                                    onVisibleChange={setShowResetPassword}
                                    placeholder="New password"
                                  />
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setResetPassword(generatePassword());
                                      setShowResetPassword(true);
                                      setResetError('');
                                    }}
                                    className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                                  >
                                    <Sparkles size={14} /> Generate
                                  </button>
                                </div>
                                {resetError && <p className="text-xs text-red-600">{resetError}</p>}
                                <ul className="flex flex-wrap gap-x-3 gap-y-1">
                                  {PASSWORD_RULES.map((rule) => {
                                    const met = rule.test(resetPassword);
                                    return (
                                      <li key={rule.label} className={`text-xs font-medium ${resetPassword && met ? 'text-emerald-700' : 'text-slate-700'}`}>
                                        {resetPassword && met ? '✓' : '•'} {rule.label}
                                      </li>
                                    );
                                  })}
                                </ul>
                                <div className="flex flex-wrap gap-2">
                                  <button type="submit" disabled={busyId === account.id} className="btn-primary text-sm">
                                    Save password
                                  </button>
                                  <button
                                    type="button"
                                    disabled={busyId === account.id}
                                    onClick={() => void emailReset(account)}
                                    className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
                                  >
                                    <Mail size={14} /> Email reset
                                  </button>
                                </div>
                                <p className="text-xs font-medium text-slate-600">
                                  Click the eye in the directory to show a saved password.
                                </p>
                              </form>

                              <div>
                                <p className="text-sm font-bold text-slate-900">Recent activity</p>
                                {entries.length === 0 ? (
                                  <p className="mt-2 text-xs text-slate-500">No activity recorded yet.</p>
                                ) : (
                                  <ul className="mt-2 space-y-2">
                                    {entries.map((entry, index) => (
                                      <li key={`${entry.at}-${index}`} className="text-xs text-slate-600">
                                        <span className="font-semibold text-slate-800">{entry.actionLabel || 'Activity'}</span>
                                        {entry.at && (
                                          <span className="text-slate-400">
                                            {' '}
                                            · {new Date(entry.at).toLocaleString('en-AU', { hour12: true })}
                                          </span>
                                        )}
                                        {entry.summary && <p className="text-slate-500">{entry.summary}</p>}
                                      </li>
                                    ))}
                                  </ul>
                                )}
                              </div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <ConfirmModal
        open={Boolean(pendingDelete)}
        title="Are you sure?"
        tone="danger"
        confirmLabel="Delete user"
        cancelLabel="Cancel"
        confirming={Boolean(pendingDelete && busyId === pendingDelete.id)}
        message={
          pendingDelete
            ? `Delete ${pendingDelete.name} (@${pendingDelete.username})? They will no longer be able to sign in. This cannot be undone.`
            : ''
        }
        onClose={() => {
          if (!busyId) setPendingDelete(null);
        }}
        onConfirm={() => {
          if (pendingDelete) return removeUser(pendingDelete);
        }}
      />
    </div>
  );
}
