import { FormEvent, useState } from 'react';
import { FAR_TECH_OPTIONS, LEAD_STATUSES } from '../data/constants';
import type { Lead, LeadHistoryEntry } from '../types';

const PAYMENT_RECEIVED_OPTIONS = ['Card', 'Cash'] as const;

function statusBadgeClass(status: string) {
  switch (status) {
    case 'Not Fixed':
      return 'bg-orange-500 text-white';
    case 'Appointment Done':
      return 'bg-amber-400 text-slate-900';
    case 'Assigned':
      return 'bg-sky-600 text-white';
    case 'Converted':
      return 'bg-emerald-600 text-white';
    case 'Missed':
      return 'bg-red-600 text-white';
    default:
      return 'bg-slate-600 text-white';
  }
}

function formatHistoryDate() {
  return new Date().toLocaleString('en-AU', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

function formatLeadDateNow() {
  return new Date().toLocaleString('en-AU', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
}

const fieldClass =
  'w-full rounded border border-slate-300 bg-white px-2 py-1.5 text-xs text-slate-800 focus:border-brand-500 focus:outline-none';

interface LeadInlineHistoryProps {
  lead: Lead;
  canEdit: boolean;
  currentUserName: string;
  onSave: (updates: Partial<Lead>) => void;
}

export default function LeadInlineHistory({
  lead,
  canEdit,
  currentUserName,
  onSave,
}: LeadInlineHistoryProps) {
  const [issueStatus, setIssueStatus] = useState('');
  const [leadStatus, setLeadStatus] = useState('');
  const [farTech, setFarTech] = useState<'Yes' | 'No'>(lead.farFromTech ? 'Yes' : 'No');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [paymentAmount, setPaymentAmount] = useState(
    lead.paymentAmount && lead.paymentAmount > 0 ? String(lead.paymentAmount) : '',
  );
  const [comment, setComment] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const history = lead.history ?? [];

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!canEdit) return;

    const amountValue = Number(paymentAmount);
    const hasPayment = Boolean(paymentMethod);
    const hasValidAmount = Number.isFinite(amountValue) && amountValue > 0;

    if (hasPayment && !hasValidAmount) {
      setError('Enter the payment amount received.');
      return;
    }
    if (hasValidAmount && !hasPayment) {
      setError('Select Card or Cash for the payment received.');
      return;
    }
    if (!issueStatus && !leadStatus && !comment.trim() && !hasPayment) {
      setError('Select a status, payment, or enter a comment before submitting.');
      return;
    }

    setError('');
    setSaving(true);

    const paymentNote = hasPayment
      ? `Payment received by ${paymentMethod} — $${amountValue.toFixed(2)}`
      : '';
    const historyComment = [comment.trim(), paymentNote].filter(Boolean).join(' · ');

    const entry: LeadHistoryEntry = {
      id: crypto.randomUUID(),
      user: currentUserName || 'Staff',
      comment: historyComment,
      farTech,
      date: formatHistoryDate(),
      issueStatus: issueStatus || undefined,
      leadStatus: leadStatus || undefined,
    };

    const updates: Partial<Lead> = {
      history: [...history, entry],
      farFromTech: farTech === 'Yes',
    };

    if (issueStatus) {
      updates.status = issueStatus as Lead['status'];
    } else if (leadStatus) {
      updates.status = leadStatus as Lead['status'];
    }

    if (comment.trim()) {
      updates.comment = comment.trim();
    } else if (hasPayment && !(lead.comment || '').toLowerCase().includes('payment taken')) {
      updates.comment = 'Payment taken.';
    }

    // Write payment onto the lead record itself (shows in the row above).
    if (hasPayment) {
      updates.paymentMethod = paymentMethod;
      updates.paymentAmount = amountValue;
      updates.date = formatLeadDateNow();
      updates.submittedAt = new Date().toISOString();
    }

    onSave(updates);
    setIssueStatus('');
    setLeadStatus('');
    setComment('');
    if (hasPayment) {
      setPaymentMethod('');
      setPaymentAmount(String(amountValue));
    }
    setSaving(false);
  }

  return (
    <div className="space-y-4 rounded border border-slate-200 bg-white p-3 shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-200 text-slate-600">
              <th className="px-2 py-1.5 font-semibold">S.N.</th>
              <th className="px-2 py-1.5 font-semibold">User</th>
              <th className="px-2 py-1.5 font-semibold">Comment</th>
              <th className="px-2 py-1.5 font-semibold">Far Tech</th>
              <th className="px-2 py-1.5 font-semibold">Date</th>
              <th className="px-2 py-1.5 font-semibold">Status</th>
            </tr>
          </thead>
          <tbody>
            {history.length === 0 && (
              <tr>
                <td colSpan={6} className="px-2 py-4 text-center text-slate-400">
                  No history yet. Submit an update below.
                </td>
              </tr>
            )}
            {history.map((entry, idx) => (
              <tr key={entry.id} className="border-b border-slate-100 align-top">
                <td className="px-2 py-2 text-slate-700">{idx + 1}.</td>
                <td className="px-2 py-2 text-slate-800">{entry.user}</td>
                <td className="max-w-xs px-2 py-2 text-slate-800">{entry.comment || '—'}</td>
                <td className="px-2 py-2 text-slate-700">{entry.farTech}</td>
                <td className="whitespace-nowrap px-2 py-2 text-slate-700">{entry.date}</td>
                <td className="px-2 py-2">
                  <div className="flex flex-wrap gap-1">
                    {entry.issueStatus && (
                      <span
                        className={`rounded px-1.5 py-0.5 text-[10px] font-semibold ${statusBadgeClass(entry.issueStatus)}`}
                      >
                        {entry.issueStatus}
                      </span>
                    )}
                    {entry.leadStatus && entry.leadStatus !== entry.issueStatus && (
                      <span
                        className={`rounded px-1.5 py-0.5 text-[10px] font-semibold ${statusBadgeClass(entry.leadStatus)}`}
                      >
                        {entry.leadStatus}
                      </span>
                    )}
                    {!entry.issueStatus && !entry.leadStatus && (
                      <span className="text-slate-400">—</span>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {canEdit && (
        <form onSubmit={handleSubmit} className="space-y-3 border-t border-slate-100 pt-3">
          {error && (
            <p className="rounded bg-red-50 px-2 py-1.5 text-[11px] text-red-600 ring-1 ring-red-200">
              {error}
            </p>
          )}
          <div className="grid gap-3 sm:grid-cols-3">
            <div>
              <label className="mb-1 block text-[11px] font-medium text-slate-600">Issue Status</label>
              <select
                value={issueStatus}
                onChange={(e) => setIssueStatus(e.target.value)}
                className={fieldClass}
              >
                <option value="">-Select-</option>
                {LEAD_STATUSES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-[11px] font-medium text-slate-600">Lead Status</label>
              <select
                value={leadStatus}
                onChange={(e) => setLeadStatus(e.target.value)}
                className={fieldClass}
              >
                <option value="">-Select-</option>
                {LEAD_STATUSES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-[11px] font-medium text-slate-600">Is far from TECH</label>
              <select
                value={farTech}
                onChange={(e) => setFarTech(e.target.value as 'Yes' | 'No')}
                className={fieldClass}
              >
                {FAR_TECH_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-[11px] font-medium text-slate-600">
                Payment received by
              </label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className={fieldClass}
              >
                <option value="">- Not received -</option>
                {PAYMENT_RECEIVED_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-[11px] font-medium text-slate-600">
                Amount received $
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={paymentAmount}
                onChange={(e) => setPaymentAmount(e.target.value)}
                className={fieldClass}
                placeholder="e.g. 165.00"
              />
            </div>
          </div>
          {lead.paymentAmount != null && lead.paymentAmount > 0 && (
            <p className="text-[11px] text-emerald-700">
              Current on record: {lead.paymentMethod || 'Card'} — ${lead.paymentAmount.toFixed(2)}
            </p>
          )}

          <div>
            <label className="mb-1 block text-[11px] font-medium text-slate-600">Comment</label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={3}
              className={`${fieldClass} resize-y`}
              placeholder="Add an update comment..."
            />
          </div>
          <button type="submit" disabled={saving} className="btn-primary py-1.5">
            {saving ? 'Saving...' : 'Submit'}
          </button>
        </form>
      )}
    </div>
  );
}
