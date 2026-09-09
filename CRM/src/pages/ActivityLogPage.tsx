import { useCallback, useEffect, useState, Fragment } from 'react';
import { ChevronDown, ChevronRight, RefreshCw, ScrollText } from 'lucide-react';
import Breadcrumbs from '../components/Breadcrumbs';

type ActivityEntry = {
  at?: string;
  date?: string;
  action?: string;
  actionLabel?: string;
  success?: boolean;
  summary?: string;
  leadId?: string;
  leadName?: string;
  accountName?: string;
  accountId?: string;
  leadUser?: string;
  deletedBy?: string;
  performedByName?: string;
  performedByUsername?: string;
  performedById?: string;
  status?: string;
  outcome?: string;
  source?: string;
  error?: string;
  [key: string]: unknown;
};

function formatDate(entry: ActivityEntry) {
  if (entry.date) return entry.date;
  if (!entry.at) return '—';
  const date = new Date(entry.at);
  if (Number.isNaN(date.getTime())) return '—';
  return date.toLocaleDateString('en-AU');
}

function formatTime(at: string | undefined) {
  if (!at) return '—';
  const date = new Date(at);
  if (Number.isNaN(date.getTime())) return at;
  return date.toLocaleTimeString('en-AU', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  });
}

function actionLabel(entry: ActivityEntry) {
  if (entry.actionLabel) return entry.actionLabel;
  if (!entry.action) return '—';
  return entry.action
    .split('.')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' · ');
}

function accountOf(entry: ActivityEntry) {
  return entry.accountName || entry.leadName || '—';
}

function performedByOf(entry: ActivityEntry) {
  const name =
    entry.performedByName || entry.deletedBy || entry.leadUser || entry.source || 'Unknown';
  if (entry.performedByUsername && entry.performedByUsername !== name) {
    return `${name} (@${entry.performedByUsername})`;
  }
  return name;
}

function summaryOf(entry: ActivityEntry) {
  if (entry.summary) return entry.summary;
  return `${performedByOf(entry)} ${actionLabel(entry).toLowerCase()} on account "${accountOf(entry)}"`;
}

export default function ActivityLogPage() {
  const [entries, setEntries] = useState<ActivityEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/activity?limit=300');
      const data = await res.json();
      if (!res.ok || !data?.ok) {
        throw new Error(data?.error || 'Failed to load activity log.');
      }
      setEntries(Array.isArray(data.entries) ? data.entries : []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load activity log.');
      setEntries([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  function toggleRow(key: string) {
    setExpanded((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  return (
    <div>
      <Breadcrumbs items={[{ label: 'Activity Logs' }]} />

      <div className="mt-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-orca-royal-dark">Activity Logs</h1>
          <p className="mt-1 text-sm text-slate-500">
            Detailed record of actions: what was done, on which account, by whom, and when
          </p>
        </div>
        <button
          type="button"
          onClick={() => void load()}
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:opacity-60"
        >
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          Refresh
        </button>
      </div>

      <div className="mt-6 overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-card">
        <div className="flex items-center gap-2.5 border-b border-slate-100 bg-slate-50/50 px-5 py-3">
          <ScrollText size={16} className="text-orca-royal" />
          <p className="text-sm font-semibold text-slate-800">Audit trail</p>
          <span className="ml-auto text-xs text-slate-400">{entries.length} entries</span>
        </div>

        {error ? (
          <p className="px-5 py-8 text-center text-sm text-red-600">{error}</p>
        ) : loading && entries.length === 0 ? (
          <p className="px-5 py-8 text-center text-sm text-slate-500">Loading activity…</p>
        ) : entries.length === 0 ? (
          <p className="px-5 py-8 text-center text-sm text-slate-500">
            No activity recorded yet. Create, update, or delete a lead to see entries here.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="w-8 px-3 py-3" />
                  <th className="px-3 py-3 font-semibold">Date</th>
                  <th className="px-3 py-3 font-semibold">Time</th>
                  <th className="px-3 py-3 font-semibold">Action</th>
                  <th className="px-3 py-3 font-semibold">Account</th>
                  <th className="px-3 py-3 font-semibold">Performed By</th>
                  <th className="px-3 py-3 font-semibold">Result</th>
                  <th className="px-3 py-3 font-semibold">Summary</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {entries.map((entry, index) => {
                  const key = `${entry.at || 'row'}-${index}`;
                  const open = !!expanded[key];
                  return (
                    <Fragment key={key}>
                      <tr className="hover:bg-slate-50/70">
                        <td className="px-3 py-2.5">
                          <button
                            type="button"
                            onClick={() => toggleRow(key)}
                            className="inline-flex h-6 w-6 items-center justify-center rounded text-slate-500 hover:bg-slate-100"
                            aria-label={open ? 'Hide details' : 'Show details'}
                          >
                            {open ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                          </button>
                        </td>
                        <td className="whitespace-nowrap px-3 py-2.5 text-xs text-slate-600">
                          {formatDate(entry)}
                        </td>
                        <td className="whitespace-nowrap px-3 py-2.5 text-xs text-slate-600">
                          {formatTime(entry.at)}
                        </td>
                        <td className="px-3 py-2.5 font-medium text-slate-800">
                          {actionLabel(entry)}
                        </td>
                        <td className="max-w-[12rem] truncate px-3 py-2.5 text-slate-700" title={accountOf(entry)}>
                          {accountOf(entry)}
                        </td>
                        <td className="max-w-[12rem] truncate px-3 py-2.5 text-slate-700" title={performedByOf(entry)}>
                          {performedByOf(entry)}
                        </td>
                        <td className="px-3 py-2.5">
                          <span
                            className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                              entry.success === false
                                ? 'bg-red-50 text-red-700'
                                : 'bg-emerald-50 text-emerald-700'
                            }`}
                          >
                            {entry.success === false ? 'Failed' : 'OK'}
                          </span>
                        </td>
                        <td className="max-w-md truncate px-3 py-2.5 text-xs text-slate-500" title={summaryOf(entry)}>
                          {summaryOf(entry)}
                        </td>
                      </tr>
                      {open ? (
                        <tr className="bg-slate-50/80">
                          <td colSpan={8} className="px-5 py-3 text-xs text-slate-600">
                            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                              <p><span className="font-semibold text-slate-700">Full date/time:</span> {entry.at || '—'}</p>
                              <p><span className="font-semibold text-slate-700">Account ID:</span> {entry.accountId || entry.leadId || '—'}</p>
                              <p><span className="font-semibold text-slate-700">User ID:</span> {entry.performedById || '—'}</p>
                              <p><span className="font-semibold text-slate-700">Username:</span> {entry.performedByUsername || '—'}</p>
                              <p><span className="font-semibold text-slate-700">Status:</span> {entry.status || '—'}</p>
                              <p><span className="font-semibold text-slate-700">Outcome:</span> {entry.outcome || '—'}</p>
                              <p className="sm:col-span-2 lg:col-span-3">
                                <span className="font-semibold text-slate-700">Details:</span> {summaryOf(entry)}
                                {entry.error ? ` · Error: ${entry.error}` : ''}
                              </p>
                            </div>
                          </td>
                        </tr>
                      ) : null}
                    </Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
