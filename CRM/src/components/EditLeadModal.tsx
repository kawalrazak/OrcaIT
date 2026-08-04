import { FormEvent, useEffect, useState, type ReactNode } from 'react';
import { FileEdit, Save, X } from 'lucide-react';
import DateInput from './DateInput';
import { ISSUE_TYPES, DEVICE_TYPES, OUTCOMES } from '../data/constants';
import { leadToEditForm } from '../utils/leadForm';
import type { Account, EditLeadForm, Lead } from '../types';

interface EditLeadModalProps {
  open: boolean;
  lead: Lead | null;
  technicians: Account[];
  canAssign: boolean;
  onClose: () => void;
  onSave: (form: EditLeadForm) => void;
}

function FormRow({
  label,
  children,
  fullWidth = false,
}: {
  label: string;
  children: ReactNode;
  fullWidth?: boolean;
}) {
  return (
    <div className={`grid items-center gap-3 border-b border-slate-100 py-2.5 ${fullWidth ? 'grid-cols-1' : 'grid-cols-[140px_1fr]'}`}>
      {!fullWidth && (
        <label className="text-right text-xs font-medium text-slate-700">{label}</label>
      )}
      <div className={fullWidth ? '' : 'min-w-0'}>
        {fullWidth && (
          <label className="mb-1 block text-xs font-medium text-slate-700">{label}</label>
        )}
        {children}
      </div>
    </div>
  );
}

export default function EditLeadModal({
  open,
  lead,
  technicians,
  canAssign,
  onClose,
  onSave,
}: EditLeadModalProps) {
  const [form, setForm] = useState<EditLeadForm | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (lead && open) {
      setForm(leadToEditForm(lead));
    }
  }, [lead, open]);

  if (!open || !lead || !form) return null;

  function updateField(field: keyof EditLeadForm, value: string) {
    setForm((prev) => (prev ? { ...prev, [field]: value } : prev));
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!form) return;
    setSaving(true);
    setTimeout(() => {
      onSave(form);
      setSaving(false);
      onClose();
    }, 300);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
        aria-label="Close"
      />
      <div className="relative z-10 flex max-h-[92vh] w-full max-w-3xl flex-col overflow-hidden rounded-lg border border-slate-300 bg-white shadow-2xl">
        <div className="flex items-center gap-2 border-b border-slate-200 bg-slate-100 px-4 py-3">
          <FileEdit size={16} className="text-slate-600" />
          <h2 className="text-sm font-semibold text-slate-800">Add Lead Details</h2>
        </div>

        <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col">
          <div className="overflow-y-auto px-4 py-2">
            <FormRow label="Call Date">
              <DateInput
                value={form.callDate}
                onChange={(e) => updateField('callDate', e.target.value)}
                className="w-full rounded border border-slate-300 px-2 py-1.5 text-xs text-slate-800 focus:border-brand-500 focus:outline-none"
              />
            </FormRow>

            <FormRow label="Customer Name">
              <input
                type="text"
                value={form.customerName}
                onChange={(e) => updateField('customerName', e.target.value)}
                className="w-full rounded border border-slate-300 px-2 py-1.5 text-xs text-slate-800 focus:border-brand-500 focus:outline-none"
              />
            </FormRow>

            <FormRow label="Customer Email">
              <input
                type="email"
                value={form.customerEmail}
                onChange={(e) => updateField('customerEmail', e.target.value)}
                className="w-full rounded border border-slate-300 px-2 py-1.5 text-xs text-slate-800 focus:border-brand-500 focus:outline-none"
              />
            </FormRow>

            <FormRow label="Phone Number">
              <input
                type="tel"
                value={form.phoneNumber}
                onChange={(e) => updateField('phoneNumber', e.target.value)}
                className="w-full rounded border border-slate-300 px-2 py-1.5 text-xs text-slate-800 focus:border-brand-500 focus:outline-none"
              />
            </FormRow>

            <FormRow label="Customer Address">
              <input
                type="text"
                value={form.customerAddress}
                onChange={(e) => updateField('customerAddress', e.target.value)}
                className="w-full rounded border border-slate-300 px-2 py-1.5 text-xs text-slate-800 focus:border-brand-500 focus:outline-none"
              />
            </FormRow>

            <FormRow label="Post Code?">
              <input
                type="text"
                value={form.postCode}
                onChange={(e) => updateField('postCode', e.target.value)}
                className="w-full rounded border border-slate-300 px-2 py-1.5 text-xs text-slate-800 focus:border-brand-500 focus:outline-none"
              />
            </FormRow>

            <FormRow label="Outcome">
              <select
                value={form.outcome}
                onChange={(e) => updateField('outcome', e.target.value)}
                className="w-full rounded border border-slate-300 px-2 py-1.5 text-xs text-slate-800 focus:border-brand-500 focus:outline-none"
              >
                <option value="">- Select Outcome -</option>
                {OUTCOMES.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </FormRow>

            {canAssign && (
              <FormRow label="Technician Name">
                <select
                  value={form.assignedClientId}
                  onChange={(e) => updateField('assignedClientId', e.target.value)}
                  className="w-full rounded border border-slate-300 px-2 py-1.5 text-xs text-slate-800 focus:border-brand-500 focus:outline-none"
                >
                  <option value="">- Select Technician -</option>
                  {technicians.map((t) => (
                    <option key={t.id} value={t.id}>{t.name}</option>
                  ))}
                </select>
              </FormRow>
            )}

            <FormRow label="Appointment Date Time">
              <input
                type="text"
                value={form.appointmentDateTime}
                onChange={(e) => updateField('appointmentDateTime', e.target.value)}
                placeholder="2026-07-09 09:00:00"
                className="w-full rounded border border-slate-300 px-2 py-1.5 text-xs text-slate-800 focus:border-brand-500 focus:outline-none"
              />
            </FormRow>

            <FormRow label="Technician Time Detail">
              <input
                type="text"
                value={form.technicianTimeDetail}
                onChange={(e) => updateField('technicianTimeDetail', e.target.value)}
                placeholder="11-1 Thursday"
                className="w-full rounded border border-slate-300 px-2 py-1.5 text-xs text-slate-800 focus:border-brand-500 focus:outline-none"
              />
            </FormRow>

            <FormRow label="Callout / Inspection Fee $">
              <input
                type="number"
                min="0"
                step="0.01"
                value={form.calloutFee}
                onChange={(e) => updateField('calloutFee', e.target.value)}
                className="w-full rounded border border-slate-300 px-2 py-1.5 text-xs text-slate-800 focus:border-brand-500 focus:outline-none"
              />
            </FormRow>

            <FormRow label="Troubleshooting Fee $">
              <input
                type="number"
                min="0"
                step="0.01"
                value={form.troubleshootingFee}
                onChange={(e) => updateField('troubleshootingFee', e.target.value)}
                className="w-full rounded border border-slate-300 px-2 py-1.5 text-xs text-slate-800 focus:border-brand-500 focus:outline-none"
              />
            </FormRow>

            <FormRow label="Issue Type">
              <select
                value={form.issueType}
                onChange={(e) => updateField('issueType', e.target.value)}
                className="w-full rounded border border-slate-300 px-2 py-1.5 text-xs text-slate-800 focus:border-brand-500 focus:outline-none"
              >
                <option value="">- Select Issue Type -</option>
                {ISSUE_TYPES.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </FormRow>

            <FormRow label="Device Type">
              <select
                value={form.deviceType}
                onChange={(e) => updateField('deviceType', e.target.value)}
                className="w-full rounded border border-slate-300 px-2 py-1.5 text-xs text-slate-800 focus:border-brand-500 focus:outline-none"
              >
                <option value="">- Select Device Type -</option>
                {DEVICE_TYPES.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </FormRow>

            <FormRow label="Customer Issue" fullWidth>
              <textarea
                value={form.customerIssue}
                onChange={(e) => updateField('customerIssue', e.target.value)}
                rows={3}
                className="w-full resize-none rounded border border-slate-300 px-2 py-1.5 text-xs text-slate-800 focus:border-brand-500 focus:outline-none"
              />
            </FormRow>

            <FormRow label="Final Comments" fullWidth>
              <textarea
                value={form.finalComments}
                onChange={(e) => updateField('finalComments', e.target.value)}
                rows={4}
                className="w-full resize-none rounded border border-slate-300 px-2 py-1.5 text-xs text-slate-800 focus:border-brand-500 focus:outline-none"
              />
            </FormRow>
          </div>

          <div className="flex items-center gap-2 border-t border-slate-200 bg-slate-100 px-4 py-3">
            <button
              type="submit"
              disabled={saving}
              className="rounded bg-brand-600 px-4 py-1.5 text-xs font-semibold text-white hover:bg-brand-700 disabled:opacity-60"
            >
              <Save size={14} className="mr-1 inline" />
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="rounded bg-slate-500 px-4 py-1.5 text-xs font-semibold text-white hover:bg-slate-600"
            >
              <X size={14} className="mr-1 inline" />
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
