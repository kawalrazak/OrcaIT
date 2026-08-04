import { useState, FormEvent } from 'react';
import { UserPlus, Trash2, Users, Edit3 } from 'lucide-react';
import Breadcrumbs from '../components/Breadcrumbs';
import { useAccounts } from '../context/AccountsContext';
import { useAuth } from '../context/AuthContext';
import {
  PERMISSIONS_BY_ROLE,
  PERMISSION_LABELS,
  ROLE_LABELS,
  TECHNICIAN_DEFAULT_PERMISSIONS,
} from '../utils/permissions';
import type { CreateClientForm, Permissions, UserRole } from '../types';

const emptyForm: CreateClientForm = {
  username: '',
  password: '',
  name: '',
  email: '',
  phone: '',
  role: 'technician',
  permissions: { ...TECHNICIAN_DEFAULT_PERMISSIONS },
};

export default function ManageClientsPage() {
  const { accounts, addClient, deleteClient, updateClientPermissions } = useAccounts();
  const { user } = useAuth();
  const canEditPermissions = user?.permissions.managePermissions ?? false;
  const [form, setForm] = useState<CreateClientForm>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingPermissions, setEditingPermissions] = useState<Permissions>({ ...TECHNICIAN_DEFAULT_PERMISSIONS });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const staffAccounts = accounts.filter((a) => a.role !== 'administrator');

  function handleRoleChange(role: UserRole) {
    setForm({
      ...form,
      role,
      permissions: { ...PERMISSIONS_BY_ROLE[role] },
    });
  }

  function startEditing(account: { id: string; permissions: Permissions }) {
    setEditingId(account.id);
    setEditingPermissions({ ...account.permissions });
  }

  function saveEditing() {
    if (!editingId) return;
    const result = updateClientPermissions(editingId, editingPermissions);
    if (result.success) {
      setSuccess('Permissions updated successfully.');
      setEditingId(null);
    } else {
      setError(result.error ?? 'Failed to update permissions.');
    }
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    setSuccess('');
    const result = addClient(form);
    if (result.success) {
      setSuccess(`Account "${form.name}" created as ${ROLE_LABELS[form.role]}.`);
      setForm(emptyForm);
    } else {
      setError(result.error ?? 'Failed to create account.');
    }
  }

  return (
    <div>
      <Breadcrumbs items={[{ label: 'Manage Users' }]} />

      <div className="mt-6">
        <h1 className="text-xl font-bold text-slate-800">User & Permission Management</h1>
        <p className="mt-1 text-sm text-slate-500">
          Support Associate → Service Coordinator → Administrator + Technicians
        </p>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        {[
          { title: 'Support Associate', desc: 'Create leads, view status. No user mgmt or delete.' },
          { title: 'Service Coordinator', desc: 'Assign technicians, manage appointments. No user creation.' },
          { title: 'Administrator', desc: 'Full access — users, permissions, delete, reports.' },
        ].map((item) => (
          <div key={item.title} className="rounded-xl border border-slate-200 bg-white p-4 shadow-card">
            <p className="font-semibold text-slate-800">{item.title}</p>
            <p className="mt-1 text-xs text-slate-500">{item.desc}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-slate-200/80 bg-white shadow-card">
          <div className="flex items-center gap-2.5 border-b border-slate-100 bg-slate-50/50 px-6 py-4">
            <UserPlus size={18} className="text-brand-600" />
            <h2 className="text-lg font-semibold text-slate-800">Create User Account</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 p-6">
            {error && <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div>}
            {success && <div className="rounded-lg bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{success}</div>}

            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">Role *</label>
              <select
                value={form.role}
                onChange={(e) => handleRoleChange(e.target.value as UserRole)}
                className="select-field"
              >
                <option value="technician">Technician</option>
                <option value="support_associate">Support Associate</option>
                <option value="service_coordinator">Service Coordinator</option>
              </select>
              <p className="mt-1 text-xs text-slate-500">Permissions are set automatically by role</p>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">Full Name *</label>
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input-field" required />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">Username *</label>
              <input value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} className="input-field" required />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">Password *</label>
              <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="input-field" required />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">Email</label>
              <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="input-field" />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">Phone</label>
              <input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="input-field" />
            </div>

            <button type="submit" className="btn-primary w-full">
              <UserPlus size={16} /> Create Account
            </button>
          </form>
        </div>

        <div className="rounded-xl border border-slate-200/80 bg-white shadow-card">
          <div className="flex items-center gap-2.5 border-b border-slate-100 bg-slate-50/50 px-6 py-4">
            <Users size={18} className="text-brand-600" />
            <h2 className="text-lg font-semibold text-slate-800">User Accounts ({staffAccounts.length})</h2>
          </div>

          <div className="divide-y divide-slate-100">
            {staffAccounts.length === 0 ? (
              <div className="px-6 py-12 text-center text-sm text-slate-400">No user accounts yet.</div>
            ) : (
              staffAccounts.map((account) => (
                <div key={account.id} className="px-6 py-4">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="font-medium text-slate-800">{account.name}</p>
                      <p className="text-sm text-slate-500">@{account.username} · {account.email}</p>
                      <span className="mt-1 inline-block rounded-full bg-brand-50 px-2 py-0.5 text-[10px] font-bold uppercase text-brand-700">
                        {ROLE_LABELS[account.role]}
                      </span>
                      <div className="mt-2 flex flex-wrap gap-1">
                        {PERMISSION_LABELS.filter((p) => account.permissions[p.key]).map((p) => (
                          <span key={p.key} className="rounded bg-slate-100 px-1.5 py-0.5 text-[9px] font-medium text-slate-600">
                            {p.label}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {canEditPermissions && (
                        <button type="button" onClick={() => startEditing(account)} className="rounded-lg border border-slate-200 p-2 hover:bg-slate-50">
                          <Edit3 size={16} />
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => { if (confirm(`Delete "${account.name}"?`)) deleteClient(account.id); }}
                        className="rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-500"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>

                  {editingId === account.id && canEditPermissions && (
                    <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
                      <p className="mb-3 text-sm font-semibold text-slate-800">Edit Permissions</p>
                      <div className="grid gap-2 sm:grid-cols-2">
                        {PERMISSION_LABELS.map((item) => (
                          <label key={item.key} className="flex items-center gap-2 text-xs text-slate-700">
                            <input
                              type="checkbox"
                              checked={editingPermissions[item.key]}
                              onChange={(e) => setEditingPermissions({ ...editingPermissions, [item.key]: e.target.checked })}
                              className="h-3.5 w-3.5 rounded border-slate-300 text-brand-600"
                            />
                            <span>{item.label} <span className="text-slate-400">({item.role})</span></span>
                          </label>
                        ))}
                      </div>
                      <div className="mt-4 flex gap-2">
                        <button type="button" onClick={saveEditing} className="btn-primary text-sm">Save</button>
                        <button type="button" onClick={() => setEditingId(null)} className="btn-secondary text-sm">Cancel</button>
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
