import { useState, useMemo } from 'react';
import {
  Search,
  RotateCcw,
  Pencil,
  ChevronUp,
  ChevronDown,
  DollarSign,
} from 'lucide-react';
import Breadcrumbs from '../components/Breadcrumbs';
import DateInput from '../components/DateInput';
import { LeadTableCells } from '../components/LeadTableCells';
import { useLeads } from '../context/LeadsContext';
import { LEAD_STATUSES, PAYMENT_METHODS } from '../data/constants';
import type { Lead, OnsiteFilters } from '../types';
import { useAccounts } from '../context/AccountsContext';

const emptyFilters: OnsiteFilters = {
  name: '',
  phone: '',
  paymentTakenThrough: '',
  issueStatus: '',
  appointmentDateFrom: '',
  appointmentDateTo: '',
  callDateFrom: '',
  callDateTo: '',
  leadUser: '',
  leadStatus: '',
  technician: '',
  assignedClientId: '',
};

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
const PER_PAGE_OPTIONS = [5, 10, 15, 20, 25, 30];

export default function OnsiteAppointmentsPage() {
  const { visibleLeads } = useLeads();
  const { clientAccounts } = useAccounts();
  const onsiteLeads = useMemo(() => visibleLeads.filter((l) => l.isOnsite), [visibleLeads]);

  const technicians = useMemo(
    () => [...new Set(visibleLeads.map((l) => l.technician).filter(Boolean) as string[])],
    [visibleLeads],
  );

  const [filters, setFilters] = useState<OnsiteFilters>(emptyFilters);
  const [appliedFilters, setAppliedFilters] = useState<OnsiteFilters>(emptyFilters);
  const [perPage, setPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [alphaFilter, setAlphaFilter] = useState('');
  const [sortField, setSortField] = useState<'name' | 'date'>('date');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');

  const filtered = useMemo(() => {
    let result = [...onsiteLeads];

    if (appliedFilters.name) {
      result = result.filter((l) => l.name.toLowerCase().includes(appliedFilters.name.toLowerCase()));
    }
    if (appliedFilters.phone) {
      result = result.filter((l) => l.phone.includes(appliedFilters.phone));
    }
    if (appliedFilters.paymentTakenThrough) {
      result = result.filter((l) => l.paymentMethod === appliedFilters.paymentTakenThrough);
    }
    if (appliedFilters.issueStatus) {
      result = result.filter((l) => l.status === appliedFilters.issueStatus);
    }
    if (appliedFilters.appointmentDateFrom) {
      result = result.filter((l) => l.appointmentDate && l.appointmentDate >= appliedFilters.appointmentDateFrom);
    }
    if (appliedFilters.appointmentDateTo) {
      result = result.filter((l) => l.appointmentDate && l.appointmentDate <= appliedFilters.appointmentDateTo);
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
    if (appliedFilters.technician) {
      result = result.filter((l) => l.technician === appliedFilters.technician);
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
  }, [onsiteLeads, appliedFilters, alphaFilter, sortField, sortDir]);

  const totalAmount = filtered.reduce((sum, l) => sum + (l.paymentAmount || 0), 0);
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

  function setQuickDate(field: 'appointmentDateFrom' | 'appointmentDateTo' | 'callDateFrom' | 'callDateTo', type: 'prev' | 'today' | 'next') {
    const today = new Date();
    let date: Date;
    if (type === 'prev') date = new Date(today.setDate(today.getDate() - 1));
    else if (type === 'next') date = new Date(today.setDate(today.getDate() + 1));
    else date = new Date();
    const str = date.toISOString().split('T')[0];
    setFilters({ ...filters, [field]: str });
  }

  return (
    <div>
      <Breadcrumbs items={[{ label: 'Onsite Appointment Leads' }]} />

      <div className="mt-6 flex flex-wrap items-center gap-4">
        <h1 className="text-xl font-bold text-slate-800">
          Onsite Appointment Leads
          <span className="text-brand-600"> — {filtered.length}</span>
        </h1>
        <div className="flex items-center gap-2 rounded-lg bg-emerald-50 px-4 py-2 ring-1 ring-emerald-200">
          <DollarSign size={18} className="text-emerald-600" />
          <span className="text-sm font-medium text-emerald-700">
            Total Amount: <span className="font-bold">${totalAmount.toFixed(2)}</span>
          </span>
        </div>
      </div>

      {/* Search Panel */}
      <div className="mt-5 rounded-xl border border-slate-200/80 bg-white shadow-card">
        <div className="border-b border-slate-100 px-6 py-3.5">
          <h2 className="text-sm font-semibold text-slate-700">Search Record in Table</h2>
        </div>
        <div className="grid gap-4 p-6 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-500">Name</label>
            <input value={filters.name} onChange={(e) => setFilters({ ...filters, name: e.target.value })} className="input-field" />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-500">Payment Taken Through</label>
            <select value={filters.paymentTakenThrough} onChange={(e) => setFilters({ ...filters, paymentTakenThrough: e.target.value })} className="select-field">
              <option value="">- Select -</option>
              {PAYMENT_METHODS.map((m) => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-500">Phone</label>
            <input value={filters.phone} onChange={(e) => setFilters({ ...filters, phone: e.target.value })} className="input-field" />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-500">Issue Status</label>
            <select value={filters.issueStatus} onChange={(e) => setFilters({ ...filters, issueStatus: e.target.value })} className="select-field">
              <option value="">- Select -</option>
              {LEAD_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-500">Appointment Date</label>
            <div className="flex gap-2">
              <DateInput value={filters.appointmentDateFrom} onChange={(e) => setFilters({ ...filters, appointmentDateFrom: e.target.value })} className="input-field" />
              <DateInput value={filters.appointmentDateTo} onChange={(e) => setFilters({ ...filters, appointmentDateTo: e.target.value })} className="input-field" />
            </div>
            <div className="mt-1.5 flex gap-2 text-xs">
              {(['prev', 'today', 'next'] as const).map((t) => (
                <button key={t} onClick={() => setQuickDate('appointmentDateFrom', t)} className="text-brand-600 hover:underline">
                  {t === 'prev' ? 'Pre Date' : t === 'today' ? 'Today' : 'Next Date'}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-500">Call Date</label>
            <div className="flex gap-2">
              <DateInput value={filters.callDateFrom} onChange={(e) => setFilters({ ...filters, callDateFrom: e.target.value })} className="input-field" />
              <DateInput value={filters.callDateTo} onChange={(e) => setFilters({ ...filters, callDateTo: e.target.value })} className="input-field" />
            </div>
            <div className="mt-1.5 flex gap-2 text-xs">
              {(['prev', 'today', 'next'] as const).map((t) => (
                <button key={t} onClick={() => setQuickDate('callDateFrom', t)} className="text-brand-600 hover:underline">
                  {t === 'prev' ? 'Pre Date' : t === 'today' ? 'Today' : 'Next Date'}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-500">Assigned Client</label>
            <select value={filters.assignedClientId} onChange={(e) => setFilters({ ...filters, assignedClientId: e.target.value })} className="select-field">
              <option value="">- All Clients -</option>
              {clientAccounts.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-500">Lead Status</label>
              <select value={filters.leadStatus} onChange={(e) => setFilters({ ...filters, leadStatus: e.target.value })} className="select-field">
                <option value="">- Select -</option>
                {LEAD_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-500">Technician</label>
              <select value={filters.technician} onChange={(e) => setFilters({ ...filters, technician: e.target.value })} className="select-field">
                <option value="">- Select -</option>
                {technicians.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          </div>
        </div>
        <div className="flex gap-3 border-t border-slate-100 px-6 py-4">
          <button onClick={handleReset} className="btn-secondary">
            <RotateCcw size={15} /> Reset Search
          </button>
          <button onClick={handleSearch} className="btn-primary">
            <Search size={15} /> Search Records
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
                alphaFilter === letter ? 'bg-brand-600 text-white' : 'text-slate-500 hover:bg-slate-100'
              }`}
            >
              {letter}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-1 text-sm text-slate-500">
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
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/80">
                <th className="px-4 py-3 text-left font-semibold text-slate-600">S.N.</th>
                <th className="cursor-pointer px-4 py-3 text-left font-semibold text-slate-600" onClick={() => toggleSort('name')}>
                  <span className="flex items-center gap-1">
                    Name {sortField === 'name' && (sortDir === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />)}
                  </span>
                </th>
                <th className="px-4 py-3 text-left font-semibold text-slate-600">Call Date</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-600">Issue</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-600">Comment</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-600">Post Code</th>
                <th className="cursor-pointer px-4 py-3 text-left font-semibold text-slate-600" onClick={() => toggleSort('date')}>
                  <span className="flex items-center gap-1">
                    Date {sortField === 'date' && (sortDir === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />)}
                  </span>
                </th>
                <th className="px-4 py-3 text-left font-semibold text-slate-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginated.map((lead, idx) => (
                <OnsiteRow key={lead.id} lead={lead} index={(currentPage - 1) * perPage + idx + 1} />
              ))}
              {paginated.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-4 py-12 text-center text-slate-400">
                    No onsite appointment leads found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-slate-100 px-6 py-3">
            <p className="text-sm text-slate-500">
              Showing {(currentPage - 1) * perPage + 1}–{Math.min(currentPage * perPage, filtered.length)} of {filtered.length}
            </p>
            <div className="flex gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`flex h-8 w-8 items-center justify-center rounded-lg text-sm font-medium transition-colors ${
                    currentPage === page ? 'bg-brand-600 text-white' : 'text-slate-600 hover:bg-slate-100'
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

function OnsiteRow({ lead, index }: { lead: Lead; index: number }) {
  return (
    <tr className="transition-colors hover:bg-slate-50/50">
      <LeadTableCells lead={lead} index={index} />
      <td className="px-3 py-3 align-top">
        <div className="space-y-1">
          {['Not Converted', 'Missed Call', 'Customer Converted'].map((action) => (
            <button key={action} className="block text-xs text-slate-500 underline hover:text-brand-600">{action}</button>
          ))}
        </div>
        <button className="mt-2 flex h-7 w-7 items-center justify-center rounded-lg bg-brand-600 text-white hover:bg-brand-700">
          <Pencil size={13} />
        </button>
        {lead.assignedTo && <p className="mt-1.5 text-xs font-bold italic text-green-700">{lead.assignedTo}</p>}
        {lead.sentStatus && (
          <span className={`mt-1 inline-block text-xs font-bold ${lead.sentStatus === 'SENT' ? 'text-emerald-600' : 'text-amber-600'}`}>
            {lead.sentStatus}
          </span>
        )}
      </td>
    </tr>
  );
}
