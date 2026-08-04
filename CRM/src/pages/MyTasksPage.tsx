import { Phone, ClipboardList } from 'lucide-react';
import Breadcrumbs from '../components/Breadcrumbs';
import { useLeads } from '../context/LeadsContext';
import { useAuth } from '../context/AuthContext';
import { LEAD_STATUSES } from '../data/constants';
import { hasPermission } from '../utils/permissions';
import type { Lead } from '../types';
function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    Assigned: 'badge-blue',
    Converted: 'badge-green',
    Missed: 'badge-red',
    'Not Fixed': 'badge-orange',
    'Appointment Done': 'badge-green',
  };
  return <span className={map[status] || 'badge-gray'}>{status}</span>;
}

export default function MyTasksPage() {
  const { visibleLeads, updateLead } = useLeads();
  const { user } = useAuth();
  const canEdit = hasPermission(user?.permissions, 'editLeads', user?.role);
  function handleStatusChange(lead: Lead, status: Lead['status']) {
    updateLead(lead.id, { status });
  }

  return (
    <div>
      <Breadcrumbs items={[{ label: 'My Tasks' }]} />

      <div className="mt-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-800">
            My Tasks <span className="text-brand-600">— {visibleLeads.length}</span>
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Leads assigned to you by the admin
          </p>
        </div>
      </div>

      {visibleLeads.length === 0 ? (
        <div className="mt-8 rounded-xl border border-slate-200/80 bg-white px-6 py-16 text-center shadow-card">
          <ClipboardList size={48} className="mx-auto text-slate-300" />
          <h3 className="mt-4 text-lg font-semibold text-slate-700">No tasks assigned yet</h3>
          <p className="mt-2 text-sm text-slate-500">
            When the admin adds a lead and assigns it to you, it will appear here.
          </p>
        </div>
      ) : (
        <div className="mt-6 space-y-4">
          {visibleLeads.map((lead) => (
            <div
              key={lead.id}
              className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-card transition-all hover:shadow-card-lg"
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-3">
                    <h3 className="text-lg font-semibold text-slate-800">{lead.name}</h3>
                    <StatusBadge status={lead.status} />
                  </div>
                  <p className="mt-1 text-sm text-slate-500">
                    {lead.phone} &middot; {lead.callDate}
                  </p>
                  <a
                    href={`tel:${lead.phone}`}
                    className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-brand-600 hover:underline"
                  >
                    <Phone size={14} /> Call Now
                  </a>
                </div>

                <div className="text-right text-sm text-slate-500">
                  <p>Assigned by Admin</p>
                  <p className="text-xs">{lead.date}</p>
                </div>
              </div>

              <div className="mt-4 grid gap-3 border-t border-slate-100 pt-4 sm:grid-cols-2">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-400">Issue</p>
                  <span className="badge-blue mt-1">{lead.issueType}</span>
                  <p className="mt-2 text-sm text-slate-600">{lead.issueDescription}</p>
                </div>
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-400">Details</p>
                  <p className="mt-1 text-sm text-slate-600">
                    Device: {lead.deviceType || '—'} &middot; Post Code: {lead.postCode}
                  </p>
                  {lead.address && <p className="mt-1 text-sm text-brand-600">{lead.address}</p>}
                  {lead.comment && <p className="mt-1 text-sm text-slate-500">{lead.comment}</p>}
                </div>
              </div>

              {canEdit ? (
                <div className="mt-4 flex flex-wrap items-center gap-3 border-t border-slate-100 pt-4">
                  <span className="text-sm font-medium text-slate-600">Update Status:</span>
                  {LEAD_STATUSES.map((status) => (
                    <button
                      key={status}
                      onClick={() => handleStatusChange(lead, status as Lead['status'])}
                      className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                        lead.status === status
                          ? 'bg-brand-600 text-white'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              ) : (
                <p className="mt-4 border-t border-slate-100 pt-4 text-xs text-slate-400">
                  View only — you do not have permission to edit leads.
                </p>
              )}            </div>
          ))}
        </div>
      )}
    </div>
  );
}
