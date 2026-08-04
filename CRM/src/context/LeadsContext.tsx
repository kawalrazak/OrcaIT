import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useMemo,
  type ReactNode,
} from 'react';
import type { Lead, AddLeadForm } from '../types';
import { LEADS_STORAGE_KEY } from '../data/constants';
import { useAuth } from './AuthContext';
import { useAccounts } from './AccountsContext';

interface LeadsContextType {
  leads: Lead[];
  visibleLeads: Lead[];
  addLead: (form: AddLeadForm) => { success: boolean; error?: string };
  updateLead: (id: string, updates: Partial<Lead>) => void;
  deleteLead: (id: string) => void;
}

const LeadsContext = createContext<LeadsContextType | null>(null);

function loadLeads(): Lead[] {
  try {
    const saved = localStorage.getItem(LEADS_STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

function saveLeads(leads: Lead[]) {
  localStorage.setItem(LEADS_STORAGE_KEY, JSON.stringify(leads));
}

function mergeWebsiteLeads(existing: Lead[], websiteLeads: Lead[]): Lead[] {
  const byId = new Map(existing.map((lead) => [lead.id, lead]));
  let changed = false;

  for (const websiteLead of websiteLeads) {
    if (!byId.has(websiteLead.id)) {
      byId.set(websiteLead.id, websiteLead);
      changed = true;
    }
  }

  if (!changed) return existing;

  return Array.from(byId.values()).sort((a, b) => {
    const aTime = Date.parse((a as Lead & { submittedAt?: string }).submittedAt || a.callDate || '') || 0;
    const bTime = Date.parse((b as Lead & { submittedAt?: string }).submittedAt || b.callDate || '') || 0;
    return bTime - aTime;
  });
}

export function LeadsProvider({ children }: { children: ReactNode }) {
  const { user, isTechnician } = useAuth();
  const { getAccountById } = useAccounts();
  const [leads, setLeads] = useState<Lead[]>(loadLeads);

  useEffect(() => {
    saveLeads(leads);
  }, [leads]);

  useEffect(() => {
    let cancelled = false;

    async function syncWebsiteLeads() {
      try {
        const response = await fetch('/api/leads');
        if (!response.ok) return;
        const data = await response.json();
        const websiteLeads = Array.isArray(data.leads) ? (data.leads as Lead[]) : [];
        if (cancelled || websiteLeads.length === 0) return;

        setLeads((prev) => {
          const merged = mergeWebsiteLeads(prev, websiteLeads);
          if (merged === prev) return prev;
          saveLeads(merged);
          return merged;
        });
      } catch {
        // CRM API may be offline during local frontend-only runs
      }
    }

    syncWebsiteLeads();
    const interval = window.setInterval(syncWebsiteLeads, 10000);
    return () => {
      cancelled = true;
      window.clearInterval(interval);
    };
  }, []);

  const visibleLeads = useMemo(() => {
    if (!user) return [];
    if (!isTechnician) return leads;
    return leads.filter((l) => l.assignedClientId === user.id);
  }, [leads, user, isTechnician]);

  const addLead = useCallback(
    (form: AddLeadForm): { success: boolean; error?: string } => {
      const client = form.assignedClientId ? getAccountById(form.assignedClientId) : null;
      if (form.assignedClientId && !client) {
        return { success: false, error: 'Selected client not found.' };
      }

      const newLead: Lead = {
        id: crypto.randomUUID(),
        name: form.customerName.trim(),
        phone: form.phoneNumber.trim(),
        email: form.customerEmail.trim() || undefined,
        callDate: form.callDate || new Date().toISOString().split('T')[0],
        issueType: form.issueType,
        issueDescription: form.customerIssue.trim(),
        address: form.customerAddress.trim() || undefined,
        comment: form.finalComments.trim(),
        postCode: form.postCode.trim(),
        postCodeServiceable: true,
        deviceType: form.deviceType,
        date: new Date().toLocaleString('en-AU', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          hour12: true,
        }),
        status: form.assignedClientId ? 'Assigned' : 'Not Fixed',
        leadUser: user?.name ?? 'Admin',
        assignedClientId: client?.id ?? '',
        assignedClientName: client?.name ?? '',
        isOnsite: form.issueType.includes('Onsite'),
        outcome: form.outcome,
        sentStatus: 'PENDING',
        sentToCustomer: false,
        sentToTechnician: false,
      };

      setLeads((prev) => {
        const updated = [newLead, ...prev];
        saveLeads(updated);
        return updated;
      });

      return { success: true };
    },
    [user, getAccountById],
  );

  const updateLead = useCallback((id: string, updates: Partial<Lead>) => {
    setLeads((prev) => {
      const updated = prev.map((l) => (l.id === id ? { ...l, ...updates } : l));
      saveLeads(updated);

      const target = updated.find((l) => l.id === id) as (Lead & { webSource?: string }) | undefined;
      if (target?.webSource) {
        void fetch(`/api/leads/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(target),
        }).catch(() => undefined);
      }

      return updated;
    });
  }, []);

  const deleteLead = useCallback((id: string) => {
    setLeads((prev) => {
      const target = prev.find((l) => l.id === id) as (Lead & { webSource?: string }) | undefined;
      const updated = prev.filter((l) => l.id !== id);
      saveLeads(updated);

      if (target?.webSource) {
        void fetch(`/api/leads/${id}`, { method: 'DELETE' }).catch(() => undefined);
      }

      return updated;
    });
  }, []);

  return (
    <LeadsContext.Provider value={{ leads, visibleLeads, addLead, updateLead, deleteLead }}>
      {children}
    </LeadsContext.Provider>
  );
}

export function useLeads() {
  const ctx = useContext(LeadsContext);
  if (!ctx) throw new Error('useLeads must be used within LeadsProvider');
  return ctx;
}
