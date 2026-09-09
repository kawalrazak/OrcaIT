import { useCallback, useEffect, useState } from 'react';
import { RefreshCw, ScrollText } from 'lucide-react';
import Breadcrumbs from '../components/Breadcrumbs';

type ActivityEntry = {
  at?: string;
  action?: string;
  success?: boolean;
  leadId?: string;
  leadName?: string;
  leadUser?: string;
  deletedBy?: string;
  status?: string;
  outcome?: string;
  source?: string;
  error?: string;
  [key: string]: unknown;
};

function formatAction(action: string | undefined) {
  if (!action) return '—';
  return action
    .split('.')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' · ');
}

function formatTime(at: string | undefined) {
  if (!at) return '—';
  const date = new Date(at);
  if (Number.isNaN(date.getTime())) return at;
  return date.toLocaleString();
}

function actorOf(entry: ActivityEntry) {
  return entry.deletedBy || entry.leadUser || entry.source || '—';
}

function detailsOf(entry: ActivityEntry) {
  const parts: string[] = [];
  if (entry.status) parts.push(`Status: ${entry.status}`);
  if (entry.outcome) parts.push(`Outcome: ${entry.outcome}`);
  if (entry.error) parts.push(`Error: ${entry.error}`);
  if (entry.leadId) parts.push(`ID: ${entry.leadId}`);
  return parts.length ? parts.join(' · ') : '—';
}

export default function ActivityLogPage() {
  const [entries, setEntries] = useState<ActivityEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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

  return (
    <div>
      <Breadcrumbs items={[{ label: 'Log' }]} />

      <div className="mt-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-orca-royal-dark">Activity Log</h1>
          <p className="mt-1 text-sm text-slate-500">
            Record of lead creates, updates, and deletes
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
          <p className="text-sm font-semibold text-slate-800">Recent activity</p>
          <span className="ml-auto text-xs text-slate-400">{entries.length} entries</span>
        </div>

        {error ? (
          <p className="px-5 py-8 text-center text-sm text-red-600">{error}</p>
        ) : loading && entries.length === 0 ? (
          <p className="px-5 py-8 text-center text-sm text-slate-500">Loading activity…</p>
        ) : entries.length === 0 ? (
          <p className="px-5 py-8 text-center text-sm text-slate-500">No activity recorded yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-4 py-3 font-semibold">Time</th>
                  <th className="px-4 py-3 font-semibold">Action</th>
                  <th className="px-4 py-3 font-semibold">Result</th>
                  <th className="px-4 py-3 font-semibold">Lead</th>
                  <th className="px-4 py-3 font-semibold">By</th>
                  <th className="px-4 py-3 font-semibold">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {entries.map((entry, index) => (
                  <tr key={`${entry.at || 'row'}-${index}`} className="hover:bg-slate-50/70">
                    <td className="whitespace-nowrap px-4 py-2.5 text-xs text-slate-600">
                      {formatTime(entry.at)}
                    </td>
                    <td className="px-4 py-2.5 font-medium text-slate-800">
                      {formatAction(entry.action)}
                    </td>
                    <td className="px-4 py-2.5">
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
                    <td className="max-w-[14rem] truncate px-4 py-2.5 text-slate-700">
                      {entry.leadName || '—'}
                    </td>
                    <td className="whitespace-nowrap px-4 py-2.5 text-slate-600">
                      {actorOf(entry)}
                    </td>
                    <td className="max-w-xs truncate px-4 py-2.5 text-xs text-slate-500" title={detailsOf(entry)}>
                      {detailsOf(entry)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
