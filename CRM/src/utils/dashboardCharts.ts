import type { Lead } from '../types';

export interface CallsTrendPoint {
  date: string;
  fullDate: string;
  incoming: number;
  converted: number;
  notConverted: number;
}

export interface PipelineTrendPoint {
  date: string;
  fullDate: string;
  incoming: number;
  onsite: number;
  assigned: number;
}

function getLastNDays(n: number): string[] {
  const days: string[] = [];
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    days.push(d.toISOString().split('T')[0]);
  }
  return days;
}

function formatShortDate(isoDate: string): string {
  const d = new Date(`${isoDate}T12:00:00`);
  return d.toLocaleDateString('en-AU', { weekday: 'short', day: 'numeric', month: 'short' });
}

export function buildCallsTrendData(leads: Lead[], days = 14): CallsTrendPoint[] {
  return getLastNDays(days).map((fullDate) => {
    const dayLeads = leads.filter((l) => l.callDate === fullDate);
    const converted = dayLeads.filter((l) => l.status === 'Converted').length;

    return {
      fullDate,
      date: formatShortDate(fullDate),
      incoming: dayLeads.length,
      converted,
      notConverted: dayLeads.length - converted,
    };
  });
}

export function buildPipelineTrendData(leads: Lead[], days = 14): PipelineTrendPoint[] {
  return getLastNDays(days).map((fullDate) => {
    const dayLeads = leads.filter((l) => l.callDate === fullDate);

    return {
      fullDate,
      date: formatShortDate(fullDate),
      incoming: dayLeads.length,
      onsite: dayLeads.filter((l) => l.isOnsite).length,
      assigned: dayLeads.filter((l) => l.status === 'Assigned' || l.assignedClientId).length,
    };
  });
}

export function getConversionSummary(leads: Lead[]) {
  const total = leads.length;
  const converted = leads.filter((l) => l.status === 'Converted').length;
  const notConverted = total - converted;
  const rate = total > 0 ? Math.round((converted / total) * 100) : 0;

  return { total, converted, notConverted, rate };
}
