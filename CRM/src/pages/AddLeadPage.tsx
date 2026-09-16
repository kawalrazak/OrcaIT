import { useMemo, useState, FormEvent, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { Settings, Save, X, Search, UserRoundSearch } from 'lucide-react';
import Breadcrumbs from '../components/Breadcrumbs';
import { useLeads } from '../context/LeadsContext';
import { useAccounts } from '../context/AccountsContext';
import { useAuth } from '../context/AuthContext';
import { hasPermission } from '../utils/permissions';
import DateInput from '../components/DateInput';
import { ISSUE_TYPES, DEVICE_TYPES, OUTCOMES, APPOINTMENT_TYPES } from '../data/constants';
import type { AddLeadForm, Lead } from '../types';

const emptyForm: AddLeadForm = {
  callDate: new Date().toISOString().split('T')[0],
  customerName: '',
  customerEmail: '',
  phoneNumber: '',
  customerAddress: '',
  postCode: '',
  outcome: 'Not Converted',
  issueType: '',
  deviceType: '',
  appointmentType: '',
  customerIssue: '',
  finalComments: '',
  assignedClientId: '',
};

const fieldClass =
  'w-full rounded border border-slate-200 bg-white px-2 py-1 text-[11px] text-slate-800 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500/30';

type ExistingCustomer = {
  key: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  postCode: string;
  lastSeen: string;
};

function normalizePhone(value: string) {
  return value.replace(/[^\d]/g, '');
}

function buildExistingCustomers(leads: Lead[]): ExistingCustomer[] {
  const byKey = new Map<string, ExistingCustomer & { sortAt: number }>();

  for (const lead of leads) {
    const phone = lead.phone?.trim() || '';
    const name = lead.name?.trim() || '';
    if (!phone && !name) continue;

    const phoneKey = normalizePhone(phone);
    const key = phoneKey || `name:${name.toLowerCase()}`;
    const sortAt =
      Date.parse(lead.submittedAt || '') ||
      Date.parse(lead.callDate || '') ||
      Date.parse(lead.date || '') ||
      0;

    const existing = byKey.get(key);
    if (existing && existing.sortAt >= sortAt) {
      // Prefer filling any missing contact fields from older records only if blank.
      byKey.set(key, {
        ...existing,
        email: existing.email || lead.email?.trim() || '',
        address: existing.address || lead.address?.trim() || '',
        postCode: existing.postCode || lead.postCode?.trim() || '',
      });
      continue;
    }

    byKey.set(key, {
      key,
      name: name || existing?.name || '',
      email: lead.email?.trim() || existing?.email || '',
      phone: phone || existing?.phone || '',
      address: lead.address?.trim() || existing?.address || '',
      postCode: lead.postCode?.trim() || existing?.postCode || '',
      lastSeen: lead.callDate || lead.date || '',
      sortAt,
    });
  }

  return [...byKey.values()]
    .map(({ sortAt: _sortAt, ...customer }) => customer)
    .sort((a, b) => a.name.localeCompare(b.name));
}

function Field({
  label,
  children,
  className = '',
}: {
  label: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <label className="mb-0.5 block text-[10px] font-medium text-slate-600">{label}</label>
      {children}
    </div>
  );
}

export default function AddLeadPage() {
  const [form, setForm] = useState<AddLeadForm>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [showCustomerSearch, setShowCustomerSearch] = useState(false);
  const [customerQuery, setCustomerQuery] = useState('');
  const [selectedCustomerKey, setSelectedCustomerKey] = useState<string | null>(null);
  const { addLead, leads } = useLeads();
  const { technicianAccounts } = useAccounts();
  const { user } = useAuth();
  const canAssign = hasPermission(user?.permissions, 'assignTechnicians', user?.role);
  const navigate = useNavigate();

  const existingCustomers = useMemo(() => buildExistingCustomers(leads), [leads]);

  const matchedCustomers = useMemo(() => {
    const q = customerQuery.trim().toLowerCase();
    const qPhone = normalizePhone(customerQuery);
    if (!q) return existingCustomers.slice(0, 8);

    return existingCustomers
      .filter((customer) => {
        const haystack = [
          customer.name,
          customer.email,
          customer.phone,
          customer.postCode,
          customer.address,
        ]
          .join(' ')
          .toLowerCase();
        if (haystack.includes(q)) return true;
        if (qPhone && normalizePhone(customer.phone).includes(qPhone)) return true;
        return false;
      })
      .slice(0, 12);
  }, [customerQuery, existingCustomers]);

  function updateField(field: keyof AddLeadForm, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (
      field === 'customerName' ||
      field === 'customerEmail' ||
      field === 'phoneNumber' ||
      field === 'customerAddress' ||
      field === 'postCode'
    ) {
      setSelectedCustomerKey(null);
    }
  }

  function applyExistingCustomer(customer: ExistingCustomer) {
    setForm((prev) => ({
      ...prev,
      customerName: customer.name,
      customerEmail: customer.email,
      phoneNumber: customer.phone,
      customerAddress: customer.address,
      postCode: customer.postCode,
    }));
    setSelectedCustomerKey(customer.key);
    setShowCustomerSearch(false);
    setCustomerQuery('');
    setError('');
  }

  const canSave = Boolean(form.appointmentType);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!form.appointmentType) {
      setError('Please select Online or Onsite before saving.');
      return;
    }
    setError('');
    setSaving(true);

    try {
      const payload = canAssign ? form : { ...form, assignedClientId: '' };
      const result = await addLead(payload);
      if (result.success) {
        navigate('/manage-leads');
      } else {
        setError(result.error ?? 'Failed to save lead.');
      }
    } catch {
      setError('Failed to save lead.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="flex h-[calc(100vh-5.5rem)] flex-col">
      <Breadcrumbs items={[{ label: 'Add Lead Details' }]} />

      <div className="mt-2 flex min-h-0 flex-1 flex-col overflow-hidden rounded-lg border border-slate-200/80 bg-white shadow-card">
        <div className="flex shrink-0 items-center justify-between gap-2 border-b border-slate-100 bg-slate-50/80 px-4 py-2">
          <div className="flex items-center gap-2">
            <Settings size={14} className="text-brand-600" />
            <h1 className="text-xs font-semibold text-slate-800">Add Lead Details</h1>
          </div>
          <button
            type="button"
            onClick={() => setShowCustomerSearch((open) => !open)}
            className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-[11px] font-medium transition ${
              showCustomerSearch
                ? 'bg-brand-600 text-white'
                : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
            }`}
          >
            <UserRoundSearch size={13} />
            {showCustomerSearch ? 'Hide search' : 'Existing customer'}
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col px-4 py-3">
          {error && (
            <div className="mb-2 shrink-0 rounded bg-red-50 px-3 py-1.5 text-[11px] text-red-600 ring-1 ring-red-200">
              {error}
            </div>
          )}

          {showCustomerSearch && (
            <div className="mb-3 shrink-0 rounded-lg border border-brand-100 bg-brand-50/40 p-3">
              <div className="flex items-center gap-2">
                <Search size={14} className="text-brand-600" />
                <p className="text-[11px] font-semibold text-slate-800">
                  Search existing / old customers
                </p>
                <span className="text-[10px] text-slate-500">
                  {existingCustomers.length} on file
                </span>
              </div>
              <input
                type="search"
                value={customerQuery}
                onChange={(e) => setCustomerQuery(e.target.value)}
                placeholder="Search by name, phone, email, or postcode..."
                className={`${fieldClass} mt-2`}
                autoFocus
              />
              <div className="mt-2 max-h-40 overflow-y-auto rounded border border-slate-200 bg-white">
                {matchedCustomers.length === 0 ? (
                  <p className="px-3 py-4 text-center text-[11px] text-slate-400">
                    No matching customers found.
                  </p>
                ) : (
                  <ul className="divide-y divide-slate-100">
                    {matchedCustomers.map((customer) => (
                      <li key={customer.key}>
                        <button
                          type="button"
                          onClick={() => applyExistingCustomer(customer)}
                          className="flex w-full flex-col items-start gap-0.5 px-3 py-2 text-left transition hover:bg-brand-50"
                        >
                          <span className="text-[11px] font-semibold text-slate-800">
                            {customer.name || 'Unnamed customer'}
                          </span>
                          <span className="text-[10px] text-slate-500">
                            {[customer.phone, customer.email, customer.postCode]
                              .filter(Boolean)
                              .join(' · ') || 'No contact details'}
                          </span>
                          {customer.address && (
                            <span className="text-[10px] text-slate-400">{customer.address}</span>
                          )}
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          )}

          {selectedCustomerKey && (
            <div className="mb-2 flex shrink-0 items-center justify-between gap-2 rounded bg-emerald-50 px-3 py-1.5 text-[11px] text-emerald-700 ring-1 ring-emerald-200">
              <span>Customer details filled from an existing record. You can still edit any field.</span>
              <button
                type="button"
                onClick={() => setSelectedCustomerKey(null)}
                className="font-medium underline hover:no-underline"
              >
                Dismiss
              </button>
            </div>
          )}

          <div className="grid shrink-0 grid-cols-2 gap-x-3 gap-y-2 lg:grid-cols-4">
            <Field label="Call Date">
              <DateInput
                value={form.callDate}
                onChange={(e) => updateField('callDate', e.target.value)}
                className={fieldClass}
              />
            </Field>

            <Field label="Customer Name">
              <input
                type="text"
                value={form.customerName}
                onChange={(e) => updateField('customerName', e.target.value)}
                placeholder="Customer name"
                className={fieldClass}
              />
            </Field>

            <Field label="Customer Email">
              <input
                type="email"
                value={form.customerEmail}
                onChange={(e) => updateField('customerEmail', e.target.value)}
                placeholder="email@example.com"
                className={fieldClass}
              />
            </Field>

            <Field label="Phone Number">
              <input
                type="tel"
                value={form.phoneNumber}
                onChange={(e) => updateField('phoneNumber', e.target.value)}
                placeholder="04XX XXX XXX"
                className={fieldClass}
              />
            </Field>

            <Field label="Post Code" className="lg:col-span-1">
              <input
                type="text"
                value={form.postCode}
                onChange={(e) => updateField('postCode', e.target.value)}
                placeholder="e.g. 4103"
                className={fieldClass}
              />
            </Field>

            <Field label="Outcome">
              <select
                value={form.outcome}
                onChange={(e) => updateField('outcome', e.target.value)}
                className={fieldClass}
              >
                <option value="">- Select Outcome -</option>
                {OUTCOMES.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </Field>

            <Field label="Issue Type">
              <select
                value={form.issueType}
                onChange={(e) => updateField('issueType', e.target.value)}
                className={fieldClass}
              >
                <option value="">- Select Issue Type -</option>
                {ISSUE_TYPES.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </Field>

            <Field label="Device Type">
              <select
                value={form.deviceType}
                onChange={(e) => updateField('deviceType', e.target.value)}
                className={fieldClass}
              >
                <option value="">- Select Device Type -</option>
                {DEVICE_TYPES.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </Field>

            <Field label="Appointment Type *">
              <select
                value={form.appointmentType}
                onChange={(e) => updateField('appointmentType', e.target.value)}
                className={fieldClass}
                required
              >
                <option value="">- Select Online or Onsite -</option>
                {APPOINTMENT_TYPES.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </Field>

            {canAssign && (
              <Field label="Assign Technician" className="col-span-2 lg:col-span-4">
                <select
                  value={form.assignedClientId}
                  onChange={(e) => updateField('assignedClientId', e.target.value)}
                  className={fieldClass}
                >
                  <option value="">— Unassigned —</option>
                  {technicianAccounts.map((t) => (
                    <option key={t.id} value={t.id}>{t.name}</option>
                  ))}
                </select>
              </Field>
            )}

            <Field label="Customer Address" className="col-span-2 lg:col-span-4">
              <input
                type="text"
                value={form.customerAddress}
                onChange={(e) => updateField('customerAddress', e.target.value)}
                placeholder="Enter address"
                className={fieldClass}
              />
            </Field>
          </div>

          <div className="mt-2 grid min-h-0 flex-1 grid-cols-1 gap-2 lg:grid-cols-2">
            <Field label="Customer Issue" className="flex min-h-0 flex-col">
              <textarea
                value={form.customerIssue}
                onChange={(e) => updateField('customerIssue', e.target.value)}
                placeholder="Describe the customer issue..."
                className={`${fieldClass} min-h-0 flex-1 resize-none`}
                rows={4}
              />
            </Field>

            <Field label="Final Comments" className="flex min-h-0 flex-col">
              <textarea
                value={form.finalComments}
                onChange={(e) => updateField('finalComments', e.target.value)}
                placeholder="Final comments..."
                className={`${fieldClass} min-h-0 flex-1 resize-none`}
                rows={4}
              />
            </Field>
          </div>

          <div className="mt-3 flex shrink-0 justify-end gap-2 border-t border-slate-100 pt-3">
            <button
              type="button"
              onClick={() => navigate('/manage-leads')}
              className="btn-secondary py-1.5 text-xs"
            >
              <X size={14} />
              Cancel
            </button>
            <button type="submit" disabled={saving || !canSave} className="btn-primary py-1.5 text-xs">
              <Save size={14} />
              {saving ? 'Saving...' : 'Save Lead'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
