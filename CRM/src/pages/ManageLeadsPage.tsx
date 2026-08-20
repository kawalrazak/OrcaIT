import { useState, useMemo } from 'react';
import {
  Search,
  RotateCcw,
  ChevronUp,
  ChevronDown,
  SquarePen,
  Trash2,
} from 'lucide-react';
import Breadcrumbs from '../components/Breadcrumbs';
import DateInput from '../components/DateInput';
import SendMessageModal, { type MessageTarget } from '../components/SendMessageModal';
import EditLeadModal from '../components/EditLeadModal';
import { LeadTableCells } from '../components/LeadTableCells';
import { useLeads } from '../context/LeadsContext';
import { useAccounts } from '../context/AccountsContext';
import { useAuth } from '../context/AuthContext';
import { hasPermission } from '../utils/permissions';
import { editFormToLeadUpdates } from '../utils/leadForm';
import { ISSUE_TYPES, DEVICE_TYPES, LEAD_STATUSES } from '../data/constants';
import type { EditLeadForm, Lead, LeadFilters } from '../types';
import {
  buildLeadMessage,
  buildQuoteMessage,
  defaultQuoteFees,
  isValidAustralianNumber,
  normalizeAustralianNumber,
  sendSms,
} from '../utils/sms';
const emptyFilters: LeadFilters = {
  name: '',
  phone: '',
  issueType: '',
  postCode: '',
  postCodeServiceable: '',
  callDateFrom: '',
  callDateTo: '',
  leadUser: '',
  leadStatus: '',
  deviceType: '',
  assignedClientId: '',
};

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
const PER_PAGE_OPTIONS = [5, 10, 15, 20, 25, 30];

export default function ManageLeadsPage() {
  const { leads } = useLeads();
  const { clientAccounts } = useAccounts();
  const [filters, setFilters] = useState<LeadFilters>(emptyFilters);
  const [appliedFilters, setAppliedFilters] = useState<LeadFilters>(emptyFilters);
  const [perPage, setPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [alphaFilter, setAlphaFilter] = useState('');
  const [sortField, setSortField] = useState<'name' | 'date'>('date');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');

  const filtered = useMemo(() => {
    let result = [...leads];

    if (appliedFilters.name) {
      result = result.filter((l) => l.name.toLowerCase().includes(appliedFilters.name.toLowerCase()));
    }
    if (appliedFilters.phone) {
      result = result.filter((l) => l.phone.includes(appliedFilters.phone));
    }
    if (appliedFilters.issueType) {
      result = result.filter((l) => l.issueType === appliedFilters.issueType);
    }
    if (appliedFilters.postCode) {
      result = result.filter((l) => l.postCode.includes(appliedFilters.postCode));
    }
    if (appliedFilters.postCodeServiceable) {
      const svc = appliedFilters.postCodeServiceable === 'yes';
      result = result.filter((l) => l.postCodeServiceable === svc);
    }
    if (appliedFilters.callDateFrom) {
      result = result.filter((l) => l.callDate >= appliedFilters.callDateFrom);
    }
    if (appliedFilters.callDateTo) {
      result = result.filter((l) => l.callDate <= appliedFilters.callDateTo);
    }
    if (appliedFilters.leadUser) {
      result = result.filter((l) => l.leadUser === appliedFilters.leadUser);
    }
    if (appliedFilters.leadStatus) {
      result = result.filter((l) => l.status === appliedFilters.leadStatus);
    }
    if (appliedFilters.deviceType) {
      result = result.filter((l) => l.deviceType === appliedFilters.deviceType);
    }
    if (appliedFilters.assignedClientId) {
      result = result.filter((l) => l.assignedClientId === appliedFilters.assignedClientId);
    }
    if (alphaFilter) {
      result = result.filter((l) => l.name.toUpperCase().startsWith(alphaFilter));
    }

    result.sort((a, b) => {
      const aVal = sortField === 'name' ? a.name : a.date;
      const bVal = sortField === 'name' ? b.name : b.date;
      return sortDir === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
    });

    return result;
  }, [leads, appliedFilters, alphaFilter, sortField, sortDir]);

  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((currentPage - 1) * perPage, currentPage * perPage);

  function handleSearch() {
    setAppliedFilters({ ...filters });
    setCurrentPage(1);
  }

  function handleReset() {
    setFilters(emptyFilters);
    setAppliedFilters(emptyFilters);
    setAlphaFilter('');
    setCurrentPage(1);
  }

  function toggleSort(field: 'name' | 'date') {
    if (sortField === field) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDir('asc');
    }
  }

  return (
    <div>
      <Breadcrumbs items={[{ label: 'Manage Leads' }]} />

      <div className="mt-6 flex items-center justify-between">
        <h1 className="text-lg font-bold text-slate-800">
          Leads Information <span className="text-brand-600">— {filtered.length}</span>
        </h1>
      </div>

      {/* Search Panel */}
      <div className="mt-5 rounded-xl border border-slate-200/80 bg-white shadow-card">
        <div className="border-b border-slate-100 px-6 py-3.5">
          <h2 className="text-xs font-semibold text-slate-700">Search Record In Table</h2>
        </div>
        <div className="grid gap-4 p-6 md:grid-cols-3">
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-500">Name</label>
            <input
              value={filters.name}
              onChange={(e) => setFilters({ ...filters, name: e.target.value })}
              className="input-field"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-500">Call Date</label>
            <div className="flex gap-2">
              <DateInput
                value={filters.callDateFrom}
                onChange={(e) => setFilters({ ...filters, callDateFrom: e.target.value })}
                className="input-field"
              />
              <DateInput
                value={filters.callDateTo}
                onChange={(e) => setFilters({ ...filters, callDateTo: e.target.value })}
                className="input-field"
              />
            </div>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-500">Phone</label>
            <input
              value={filters.phone}
              onChange={(e) => setFilters({ ...filters, phone: e.target.value })}
              className="input-field"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-500">Assigned Client</label>
            <select
              value={filters.assignedClientId}
              onChange={(e) => setFilters({ ...filters, assignedClientId: e.target.value })}
              className="select-field"
            >
              <option value="">- All Clients -</option>
              {clientAccounts.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-500">Issue Type</label>
            <select
              value={filters.issueType}
              onChange={(e) => setFilters({ ...filters, issueType: e.target.value })}
              className="select-field"
            >
              <option value="">- Select Issue Type -</option>
              {ISSUE_TYPES.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-500">Lead Status</label>
            <select
              value={filters.leadStatus}
              onChange={(e) => setFilters({ ...filters, leadStatus: e.target.value })}
              className="select-field"
            >
              <option value="">- Select -</option>
              {LEAD_STATUSES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-500">Post Code</label>
            <input
              value={filters.postCode}
              onChange={(e) => setFilters({ ...filters, postCode: e.target.value })}
              className="input-field"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-500">Post Code Serviceable</label>
            <select
              value={filters.postCodeServiceable}
              onChange={(e) => setFilters({ ...filters, postCodeServiceable: e.target.value })}
              className="select-field"
            >
              <option value="">- Post Code Status -</option>
              <option value="yes">Serviceable</option>
              <option value="no">Not Serviceable</option>
            </select>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-500">Device Type</label>
            <select
              value={filters.deviceType}
              onChange={(e) => setFilters({ ...filters, deviceType: e.target.value })}
              className="select-field"
            >
              <option value="">- Select Device Type -</option>
              {DEVICE_TYPES.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="flex gap-3 border-t border-slate-100 px-6 py-4">
          <button onClick={handleReset} className="btn-secondary">
            <RotateCcw size={15} />
            Reset Search
          </button>
          <button onClick={handleSearch} className="btn-primary">
            <Search size={15} />
            Search Records
          </button>
        </div>
      </div>

      {/* Table Controls */}
      <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-0.5">
          {ALPHABET.map((letter) => (
            <button
              key={letter}
              onClick={() => setAlphaFilter(alphaFilter === letter ? '' : letter)}
              className={`flex h-7 w-7 items-center justify-center rounded text-xs font-medium transition-colors ${
                alphaFilter === letter
                  ? 'bg-brand-600 text-white'
                  : 'text-slate-500 hover:bg-slate-100'
              }`}
            >
              {letter}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-1 text-xs text-slate-500">
          Per Page:
          {PER_PAGE_OPTIONS.map((n) => (
            <button
              key={n}
              onClick={() => { setPerPage(n); setCurrentPage(1); }}
              className={`rounded px-2 py-0.5 font-medium transition-colors ${
                perPage === n ? 'bg-brand-600 text-white' : 'hover:bg-slate-100'
              }`}
            >
              {n}
            </button>
          ))}
        </div>
      </div>

      {/* Data Table */}
      <div className="mt-4 overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-card">
        <div className="overflow-x-auto">
          <table className="w-full text-[11px]">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/80">
                <th className="px-3 py-2 text-left text-[11px] font-semibold text-slate-600">S.N.</th>
                <th className="cursor-pointer px-3 py-2 text-left text-[11px] font-semibold text-slate-600" onClick={() => toggleSort('name')}>
                  <span className="flex items-center gap-1">
                    Name
                    {sortField === 'name' && (sortDir === 'asc' ? <ChevronUp size={12} /> : <ChevronDown size={12} />)}
                  </span>
                </th>
                <th className="px-3 py-2 text-left text-[11px] font-semibold text-slate-600">Call Date</th>
                <th className="px-3 py-2 text-left text-[11px] font-semibold text-slate-600">Issue</th>
                <th className="px-3 py-2 text-left text-[11px] font-semibold text-slate-600">Comment</th>
                <th className="px-3 py-2 text-left text-[11px] font-semibold text-slate-600">Post Code</th>
                <th className="cursor-pointer px-3 py-2 text-left text-[11px] font-semibold text-slate-600" onClick={() => toggleSort('date')}>
                  <span className="flex items-center gap-1">
                    Date
                    {sortField === 'date' && (sortDir === 'asc' ? <ChevronUp size={12} /> : <ChevronDown size={12} />)}
                  </span>
                </th>
                <th className="bg-slate-100 px-2 py-2 text-left text-[11px] font-semibold text-slate-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginated.map((lead, idx) => (
                <LeadRow key={lead.id} lead={lead} index={(currentPage - 1) * perPage + idx + 1} />
              ))}
              {paginated.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-4 py-12 text-center text-slate-400">
                    No leads found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-slate-100 px-6 py-3">
            <p className="text-xs text-slate-500">
              Showing {(currentPage - 1) * perPage + 1}–{Math.min(currentPage * perPage, filtered.length)} of {filtered.length}
            </p>
            <div className="flex gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`flex h-7 w-7 items-center justify-center rounded-lg text-xs font-medium transition-colors ${
                    currentPage === page
                      ? 'bg-brand-600 text-white'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function LeadRow({ lead, index }: { lead: Lead; index: number }) {
  const { getAccountById, technicianAccounts } = useAccounts();
  const { updateLead, deleteLead } = useLeads();
  const { user } = useAuth();
  const canEdit = hasPermission(user?.permissions, 'editLeads', user?.role);
  const canDelete = hasPermission(user?.permissions, 'deleteLeads', user?.role);
  const canAssign = hasPermission(user?.permissions, 'assignTechnicians', user?.role);
  const [modalOpen, setModalOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [modalTarget, setModalTarget] = useState<MessageTarget>('customer');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const technician = lead.assignedClientId ? getAccountById(lead.assignedClientId) : undefined;

  const recipient =
    modalTarget === 'customer'
      ? { name: lead.name, phone: lead.phone }
      : {
          name: technician?.name || lead.assignedClientName || 'Technician',
          phone: technician?.phone?.trim() || '',
        };

  const customerSent = lead.sentToCustomer === true;
  const technicianSent = lead.sentToTechnician === true;

  function handleSaveEdit(form: EditLeadForm) {
    const assigned = form.assignedClientId && canAssign
      ? getAccountById(form.assignedClientId)
      : null;
    const updates = editFormToLeadUpdates(
      canAssign ? form : { ...form, assignedClientId: lead.assignedClientId },
      assigned,
    );
    updateLead(lead.id, updates);
  }

  function openModal(target: MessageTarget) {
    if (target === 'customer' && customerSent) return;
    if (target === 'technician' && technicianSent) return;

    const phone =
      target === 'customer'
        ? lead.phone
        : technician?.phone?.trim() || '';

    if (!phone || !isValidAustralianNumber(phone)) {
      setModalTarget(target);
      setMessage(
        target === 'customer'
          ? buildQuoteMessage(lead, {
              visitTime: lead.technicianTimeDetail || lead.appointmentDate || '',
              ...defaultQuoteFees(lead),
            })
          : buildLeadMessage(lead),
      );
      setResult({
        type: 'error',
        text:
          target === 'customer'
            ? 'Customer does not have a valid Australian mobile number.'
            : 'Technician does not have a valid phone number. Add it in Manage Technicians.',
      });
      setModalOpen(true);
      return;
    }

    setModalTarget(target);
    setMessage(
      target === 'customer'
        ? buildQuoteMessage(lead, {
            visitTime: lead.technicianTimeDetail || lead.appointmentDate || '',
            ...defaultQuoteFees(lead),
          })
        : buildLeadMessage(lead),
    );
    setResult(null);
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
    setSending(false);
    setResult(null);
  }

  async function handleSend() {
    const normalized = normalizeAustralianNumber(recipient.phone);
    if (!normalized || !isValidAustralianNumber(normalized)) {
      setResult({ type: 'error', text: 'Invalid recipient phone number.' });
      return;
    }
    if (!message.trim()) {
      setResult({ type: 'error', text: 'Message cannot be empty.' });
      return;
    }

    setSending(true);
    setResult(null);

    try {
      const response = await sendSms(normalized, message.trim());
      if (response.ok) {
        updateLead(lead.id, {
          sentStatus: 'SENT',
          ...(modalTarget === 'customer'
            ? { sentToCustomer: true }
            : { sentToTechnician: true }),
        });
        setResult({
          type: 'success',
          text: modalTarget === 'customer'
            ? 'Quote sent to customer successfully.'
            : 'Message sent to technician successfully.',
        });
        setTimeout(closeModal, 1500);
      } else {
        updateLead(lead.id, { sentStatus: 'PENDING' });
        setResult({ type: 'error', text: response.error ?? 'Failed to send message.' });
      }
    } catch {
      updateLead(lead.id, { sentStatus: 'PENDING' });
      setResult({ type: 'error', text: 'Unable to send message — check the server connection.' });
    } finally {
      setSending(false);
    }
  }

  return (
    <>
      <tr className="transition-colors hover:bg-slate-50/50">
        <LeadTableCells lead={lead} index={index} />
        <td className="bg-slate-100 px-0 py-2 align-top">
          <div className="grid grid-cols-[1fr_auto] divide-x divide-slate-200">
            <div className="space-y-0.5 px-1.5">
              <button
                type="button"
                onClick={() => openModal('customer')}
                disabled={customerSent}
                className={`w-full rounded px-1.5 py-0.5 text-[9px] font-medium transition-colors ${
                  customerSent
                    ? 'cursor-not-allowed bg-slate-300 text-slate-500'
                    : 'bg-slate-600 text-white hover:bg-slate-700'
                }`}
              >
                {customerSent ? 'Quote Sent' : 'Send Quote'}
              </button>
              <button
                type="button"
                onClick={() => openModal('technician')}
                disabled={technicianSent}
                className={`w-full rounded px-1.5 py-0.5 text-[9px] font-medium transition-colors ${
                  technicianSent
                    ? 'cursor-not-allowed bg-slate-300 text-slate-500'
                    : 'bg-slate-600 text-white hover:bg-slate-700'
                }`}
              >
                {technicianSent ? 'Sent' : 'Technician'}
              </button>
            </div>
            <div className="flex items-start justify-center gap-1 px-1.5 pt-0.5">
              {canEdit && (
                <button
                  type="button"
                  onClick={() => setEditOpen(true)}
                  title="Edit lead details"
                  className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-sm bg-sky-400 text-white shadow-sm transition-colors hover:bg-sky-500"
                >
                  <SquarePen size={10} />
                </button>
              )}
              {canDelete && (
                <button
                  type="button"
                  onClick={() => {
                    if (confirm(`Delete lead for "${lead.name}"? This cannot be undone.`)) {
                      deleteLead(lead.id);
                    }
                  }}
                  title="Delete lead"
                  className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-sm bg-red-500 text-white shadow-sm transition-colors hover:bg-red-600"
                >
                  <Trash2 size={10} />
                </button>
              )}
            </div>
          </div>
        </td>
      </tr>

      <EditLeadModal
        open={editOpen}
        lead={lead}
        technicians={technicianAccounts}
        canAssign={canAssign}
        onClose={() => setEditOpen(false)}
        onSave={handleSaveEdit}
      />

      <SendMessageModal
        open={modalOpen}
        target={modalTarget}
        lead={lead}
        recipientName={recipient.name}
        recipientPhone={recipient.phone}
        message={message}
        sending={sending}
        result={result}
        onClose={closeModal}
        onMessageChange={setMessage}
        onSend={handleSend}
      />
    </>
  );
}