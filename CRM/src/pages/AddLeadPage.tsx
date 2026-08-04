import { useState, FormEvent, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { Settings, Save, X } from 'lucide-react';
import Breadcrumbs from '../components/Breadcrumbs';
import { useLeads } from '../context/LeadsContext';
import { useAccounts } from '../context/AccountsContext';
import { useAuth } from '../context/AuthContext';
import { hasPermission } from '../utils/permissions';
import DateInput from '../components/DateInput';
import { ISSUE_TYPES, DEVICE_TYPES, OUTCOMES } from '../data/constants';
import type { AddLeadForm } from '../types';

const emptyForm: AddLeadForm = {
  callDate: new Date().toISOString().split('T')[0],
  customerName: '',
  customerEmail: '',
  phoneNumber: '',
  customerAddress: '',
  postCode: '',
  outcome: '',
  issueType: '',
  deviceType: '',
  customerIssue: '',
  finalComments: '',
  assignedClientId: '',
};

const fieldClass =
  'w-full rounded border border-slate-200 bg-white px-2 py-1 text-[11px] text-slate-800 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500/30';

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
  const { addLead } = useLeads();
  const { technicianAccounts } = useAccounts();
  const { user } = useAuth();
  const canAssign = hasPermission(user?.permissions, 'assignTechnicians', user?.role);
  const navigate = useNavigate();

  function updateField(field: keyof AddLeadForm, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    setSaving(true);

    setTimeout(() => {
      const payload = canAssign ? form : { ...form, assignedClientId: '' };
      const result = addLead(payload);
      if (result.success) {
        navigate('/manage-leads');
      } else {
        setError(result.error ?? 'Failed to save lead.');
      }
      setSaving(false);
    }, 400);
  }

  return (
    <div className="flex h-[calc(100vh-5.5rem)] flex-col">
      <Breadcrumbs items={[{ label: 'Add Lead Details' }]} />

      <div className="mt-2 flex min-h-0 flex-1 flex-col overflow-hidden rounded-lg border border-slate-200/80 bg-white shadow-card">
        <div className="flex shrink-0 items-center gap-2 border-b border-slate-100 bg-slate-50/80 px-4 py-2">
          <Settings size={14} className="text-brand-600" />
          <h1 className="text-xs font-semibold text-slate-800">Add Lead Details</h1>
        </div>

        <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col px-4 py-3">
          {error && (
            <div className="mb-2 shrink-0 rounded bg-red-50 px-3 py-1.5 text-[11px] text-red-600 ring-1 ring-red-200">
              {error}
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
                placeholder="Additional comments..."
                className={`${fieldClass} min-h-0 flex-1 resize-none`}
                rows={4}
              />
            </Field>
          </div>

          <div className="mt-2 flex shrink-0 items-center gap-2 border-t border-slate-100 pt-2">
            <button type="submit" disabled={saving} className="btn-primary py-1.5">
              <Save size={14} />
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
            <button type="button" onClick={() => navigate('/dashboard')} className="btn-secondary py-1.5">
              <X size={14} />
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
