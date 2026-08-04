import { useMemo } from 'react';
import { Users, CalendarCheck, Phone, TrendingUp, ClipboardList, BarChart3 } from 'lucide-react';
import { Link } from 'react-router-dom';
import Breadcrumbs from '../components/Breadcrumbs';
import CallsTrendChart from '../components/dashboard/CallsTrendChart';
import LeadPipelineChart from '../components/dashboard/LeadPipelineChart';
import { useAuth } from '../context/AuthContext';
import { useLeads } from '../context/LeadsContext';
import {
  buildCallsTrendData,
  buildPipelineTrendData,
  getConversionSummary,
} from '../utils/dashboardCharts';

export default function DashboardPage() {
  const { user, isTechnician, isStaff, isAdministrator } = useAuth();
  const { leads, visibleLeads } = useLeads();

  const chartLeads = isAdministrator ? leads : visibleLeads;
  const callsTrend = useMemo(() => buildCallsTrendData(chartLeads, 14), [chartLeads]);
  const pipelineTrend = useMemo(() => buildPipelineTrendData(chartLeads, 14), [chartLeads]);
  const conversionSummary = useMemo(() => getConversionSummary(chartLeads), [chartLeads]);

  const totalLeads = visibleLeads.length;
  const onsiteLeads = visibleLeads.filter((l) => l.isOnsite).length;
  const converted = visibleLeads.filter((l) => l.status === 'Converted').length;
  const pending = visibleLeads.filter((l) => l.status === 'Assigned').length;
  const todayLeads = visibleLeads.filter((l) => l.callDate === new Date().toISOString().split('T')[0]).length;

  const adminStats = [
    { label: 'Total Leads', value: totalLeads, icon: Users, color: 'bg-brand-500', light: 'bg-brand-50 text-brand-600' },
    { label: 'Onsite Appointments', value: onsiteLeads, icon: CalendarCheck, color: 'bg-emerald-500', light: 'bg-emerald-50 text-emerald-600' },
    { label: "Today's Leads", value: todayLeads, icon: Phone, color: 'bg-amber-500', light: 'bg-amber-50 text-amber-600' },
    { label: 'Converted', value: converted, icon: TrendingUp, color: 'bg-purple-500', light: 'bg-purple-50 text-purple-600' },
  ];

  const clientStats = [
    { label: 'My Tasks', value: totalLeads, icon: ClipboardList, color: 'bg-brand-500', light: 'bg-brand-50 text-brand-600' },
    { label: 'Pending', value: pending, icon: Phone, color: 'bg-amber-500', light: 'bg-amber-50 text-amber-600' },
    { label: 'Onsite', value: onsiteLeads, icon: CalendarCheck, color: 'bg-emerald-500', light: 'bg-emerald-50 text-emerald-600' },
    { label: 'Completed', value: converted, icon: TrendingUp, color: 'bg-purple-500', light: 'bg-purple-50 text-purple-600' },
  ];

  const stats = isTechnician ? clientStats : adminStats;

  return (
    <div>
      <Breadcrumbs items={[{ label: 'Dashboard' }]} />

      <div className="mt-6">
        <h1 className="text-2xl font-bold text-slate-800">
          Welcome, {user?.name}! 👋
        </h1>
        <p className="mt-1 text-slate-500">
          {isTechnician
            ? 'Here are the tasks assigned to you by the coordinator.'
            : isStaff
              ? "Here's an overview of leads across your ORCA workspace."
              : "Here's an overview of all leads and assignments."}
        </p>
      </div>

      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map(({ label, value, icon: Icon, color, light }) => (
          <div
            key={label}
            className="group rounded-xl border border-slate-200/80 bg-white p-5 shadow-card transition-all duration-300 hover:shadow-card-lg hover:-translate-y-0.5"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">{label}</p>
                <p className="mt-1 text-3xl font-bold text-slate-800">{value}</p>
              </div>
              <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${light} transition-transform group-hover:scale-110`}>
                <Icon size={22} />
              </div>
            </div>
            <div className={`mt-4 h-1 w-full rounded-full ${color} opacity-20`}>
              <div className={`h-full w-2/3 rounded-full ${color}`} />
            </div>
          </div>
        ))}
      </div>

      {isAdministrator && (
        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <div className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-card">
            <div className="mb-4 flex items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <BarChart3 size={18} className="text-brand-600" />
                  <h2 className="text-base font-semibold text-slate-800">Incoming Calls Trend</h2>
                </div>
                <p className="mt-1 text-xs text-slate-500">Last 14 days — converted vs not converted</p>
              </div>
              <div className="rounded-lg bg-slate-50 px-3 py-2 text-right">
                <p className="text-[10px] font-medium uppercase tracking-wide text-slate-500">Conversion Rate</p>
                <p className="text-lg font-bold text-brand-600">{conversionSummary.rate}%</p>
              </div>
            </div>
            <CallsTrendChart data={callsTrend} />
            <div className="mt-3 flex flex-wrap gap-4 text-xs text-slate-600">
              <span><strong className="text-slate-800">{conversionSummary.total}</strong> total calls</span>
              <span><strong className="text-green-600">{conversionSummary.converted}</strong> converted</span>
              <span><strong className="text-red-600">{conversionSummary.notConverted}</strong> not converted</span>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-card">
            <div className="mb-4">
              <div className="flex items-center gap-2">
                <BarChart3 size={18} className="text-purple-600" />
                <h2 className="text-base font-semibold text-slate-800">Lead Pipeline Trend</h2>
              </div>
              <p className="mt-1 text-xs text-slate-500">
                Recommended view — new leads, onsite jobs & technician assignments
              </p>
            </div>
            <LeadPipelineChart data={pipelineTrend} />
            <p className="mt-3 text-xs text-slate-500">
              Track daily intake against onsite demand and how many leads are being assigned to technicians.
            </p>
          </div>
        </div>
      )}

      <div className="mt-8 rounded-xl border border-slate-200/80 bg-white shadow-card">
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <h2 className="text-lg font-semibold text-slate-800">
            {isTechnician ? 'Recent Tasks' : 'Recent Leads'}
          </h2>
          {isTechnician && (
            <Link to="/my-tasks" className="text-sm font-medium text-brand-600 hover:underline">
              View all tasks
            </Link>
          )}
        </div>
        <div className="divide-y divide-slate-100">
          {visibleLeads.length === 0 ? (
            <div className="px-6 py-12 text-center text-slate-400">
              {isTechnician
                ? 'No tasks assigned yet. A coordinator will assign leads to you.'
                : 'No leads yet. Add your first lead to get started.'}
            </div>
          ) : (
            visibleLeads.slice(0, 5).map((lead) => (
              <div key={lead.id} className="flex items-center justify-between px-6 py-4 transition-colors hover:bg-slate-50/50">
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-50 text-sm font-bold text-brand-600">
                    {lead.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-medium text-slate-800">{lead.name}</p>
                    <p className="text-sm text-slate-500">
                      {lead.issueType} &middot; {lead.phone}
                      {!isTechnician && lead.assignedClientName && (
                        <span className="text-brand-600"> &middot; → {lead.assignedClientName}</span>
                      )}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`badge ${
                    lead.status === 'Converted' ? 'badge-green' :
                    lead.status === 'Assigned' ? 'badge-blue' :
                    lead.status === 'Missed' ? 'badge-red' : 'badge-orange'
                  }`}>
                    {lead.status}
                  </span>
                  <p className="mt-1 text-xs text-slate-400">{lead.date}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
