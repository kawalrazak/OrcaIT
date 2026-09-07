import { CreditCard } from 'lucide-react';
import type { Lead } from '../types';

function outcomeBadgeClass(outcome: string) {
  switch (outcome) {
    case 'Resolved':
    case 'Onsite Fixed':
    case 'Customer Converted':
      return 'bg-emerald-600 text-white';
    case 'Appointment Booked':
      return 'bg-sky-600 text-white';
    case 'Not Converted':
    case 'Missed Call':
      return 'bg-orange-500 text-white';
    default:
      return 'bg-slate-600 text-white';
  }
}

interface LeadTableCellsProps {
  lead: Lead;
  index: number;
}

export function LeadTableCells({ lead, index }: LeadTableCellsProps) {
  const technicianLabel = lead.technician || lead.assignedClientName;
  const outcome = lead.outcome?.trim() || '';
  const showFollowUp = outcome === 'Follow Up';
  const showOutcomeBadge = outcome !== '' && !showFollowUp;

  return (
    <>
      <td className="px-2 py-2 align-top">
        <div className="flex flex-col items-start gap-0.5">
          <div className="flex items-center gap-1">
            <span className="text-[10px] text-slate-600">{index}.</span>
            <input type="checkbox" className="h-3 w-3 rounded border-slate-300" />
          </div>
          <CreditCard size={12} className="text-slate-400" />
        </div>
      </td>

      <td className="px-2 py-2 align-top">
        <p className="text-[10px] text-slate-800">{lead.name}</p>
        <p className="text-[10px] italic text-red-600">{lead.phone}</p>
        <a
          href={`tel:${lead.phone}`}
          className="mt-0.5 inline-block text-[9px] text-slate-500 underline hover:text-brand-600"
        >
          Call Now
        </a>
      </td>

      <td className="px-2 py-2 align-top">
        <p className="text-[10px] text-slate-800">{lead.callDate}</p>
      </td>

      <td className="max-w-[220px] px-2 py-2 align-top">
        <p className="text-[10px] italic text-blue-800">{lead.issueType}</p>
        {lead.issueDescription && (
          <p className="mt-0.5 text-[10px] leading-snug text-slate-800">
            {lead.issueDescription}
          </p>
        )}
        {lead.address && (
          <p className="mt-0.5 text-[10px] italic leading-snug text-sky-600">
            Add: {lead.address}
          </p>
        )}
        {lead.appointmentDate && (
          <p className="mt-0.5 text-[10px] text-slate-800">
            Appointment Date: {lead.appointmentDate}
          </p>
        )}
        {lead.technicianTimeDetail && (
          <p className="mt-0.5 text-[10px] text-slate-800">
            Time: {lead.technicianTimeDetail}
          </p>
        )}
        {lead.calloutFee != null && lead.calloutFee > 0 && (
          <p className="mt-0.5 text-[10px] text-sky-600">
            Callout Fee: ${lead.calloutFee.toFixed(2)}
          </p>
        )}
        {lead.paymentAmount != null && lead.paymentAmount > 0 && (
          <p className="mt-0.5 text-[10px] text-sky-600">
            {lead.paymentMethod || 'Card'} - Amount: {lead.paymentAmount.toFixed(2)}
          </p>
        )}
      </td>

      <td className="max-w-[220px] px-2 py-2 align-top">
        {lead.deviceType && (
          <p className="text-[10px] italic text-blue-800">{lead.deviceType}</p>
        )}
        {lead.comment && (
          <p className="mt-0.5 text-[10px] leading-relaxed text-slate-800">
            {lead.comment}
          </p>
        )}
      </td>

      <td className="px-2 py-2 align-top">
        <p className="text-[10px] text-slate-800">{lead.postCode || '—'}</p>
        {lead.postCode && (
          <p className="text-[9px] text-slate-600">
            {lead.postCodeServiceable ? 'Serviceable postcode' : 'Not serviceable'}
          </p>
        )}
        {technicianLabel && (
          <p className="mt-0.5 text-[9px] font-medium text-brand-600 hover:underline">
            {technicianLabel}
          </p>
        )}
      </td>

      <td className="px-2 py-2 align-top">
        <p className="text-[10px] text-slate-800">{lead.date}</p>
        <div className="mt-1 flex flex-col items-start gap-1">
          {showOutcomeBadge && (
            <span
              className={`rounded px-1.5 py-0.5 text-[9px] font-semibold ${outcomeBadgeClass(outcome)}`}
            >
              {outcome}
            </span>
          )}
          {showFollowUp && (
            <span className="rounded bg-red-600 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-white shadow-sm ring-2 ring-red-200">
              Follow Up
            </span>
          )}
        </div>
        {lead.assignedTo && (
          <p className="mt-0.5 text-[9px] italic text-slate-800">{lead.assignedTo}</p>
        )}
      </td>
    </>
  );
}
