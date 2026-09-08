import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  type ReactNode,
} from 'react';
import type { Lead, AddLeadForm } from '../types';
import { LEADS_STORAGE_KEY } from '../data/constants';
import { useAuth } from './AuthContext';
import { useAccounts } from './AccountsContext';
import { fetchZellerInvoices } from '../utils/zeller';

const LEADS_MIGRATION_KEY = 'careit_leads_synced_to_server_v1';

interface LeadsContextType {
  leads: Lead[];
  visibleLeads: Lead[];
  loading: boolean;
  addLead: (form: AddLeadForm) => Promise<{ success: boolean; error?: string }>;
  updateLead: (id: string, updates: Partial<Lead>) => void;
  deleteLead: (id: string) => void;
}

const LeadsContext = createContext<LeadsContextType | null>(null);

function loadLocalLeads(): Lead[] {
  try {
    const saved = localStorage.getItem(LEADS_STORAGE_KEY);
    return saved ? (JSON.parse(saved) as Lead[]) : [];
  } catch {
    return [];
  }
}

function cacheLeads(leads: Lead[]) {
  localStorage.setItem(LEADS_STORAGE_KEY, JSON.stringify(leads));
}

function sortLeads(leads: Lead[]): Lead[] {
  return [...leads].sort((a, b) => {
    const aTime =
      Date.parse((a as Lead & { submittedAt?: string }).submittedAt || a.callDate || '') || 0;
    const bTime =
      Date.parse((b as Lead & { submittedAt?: string }).submittedAt || b.callDate || '') || 0;
    return bTime - aTime;
  });
}

async function fetchServerLeads(): Promise<Lead[] | null> {
  try {
    const response = await fetch('/api/leads');
    if (!response.ok) return null;
    const data = await response.json();
    return Array.isArray(data.leads) ? (data.leads as Lead[]) : [];
  } catch {
    return null;
  }
}

async function syncLocalLeadsToServer(localLeads: Lead[]): Promise<Lead[] | null> {
  if (localLeads.length === 0) {
    return fetchServerLeads();
  }

  try {
    const response = await fetch('/api/leads/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ leads: localLeads }),
    });
    if (!response.ok) return null;
    const data = await response.json();
    return Array.isArray(data.leads) ? (data.leads as Lead[]) : [];
  } catch {
    return null;
  }
}

export function LeadsProvider({ children }: { children: ReactNode }) {
  const { user, isTechnician } = useAuth();
  const { getAccountById } = useAccounts();
  const [leads, setLeads] = useState<Lead[]>(() => sortLeads(loadLocalLeads()));
  const [loading, setLoading] = useState(true);
  const leadsRef = useRef(leads);
  leadsRef.current = leads;
  const syncingRef = useRef(false);

  const applyServerLeads = useCallback((serverLeads: Lead[]) => {
    const sorted = sortLeads(serverLeads);
    setLeads(sorted);
    cacheLeads(sorted);
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function bootstrapFromServer() {
      setLoading(true);
      const localLeads = loadLocalLeads();

      let serverLeads = await fetchServerLeads();
      if (cancelled) return;

      if (serverLeads) {
        const serverIds = new Set(serverLeads.map((lead) => lead.id));
        const missingLocal = localLeads.filter((lead) => lead.id && !serverIds.has(lead.id));

        if (missingLocal.length > 0) {
          const merged = await syncLocalLeadsToServer(missingLocal);
          if (merged) serverLeads = merged;
        }

        localStorage.setItem(LEADS_MIGRATION_KEY, '1');
        applyServerLeads(serverLeads);
      }

      setLoading(false);
    }

    void bootstrapFromServer();
    return () => {
      cancelled = true;
    };
  }, [applyServerLeads]);

  useEffect(() => {
    let cancelled = false;

    async function pollServerLeads() {
      if (syncingRef.current) return;
      const serverLeads = await fetchServerLeads();
      if (cancelled || !serverLeads) return;

      const current = leadsRef.current;
      const sameLength = current.length === serverLeads.length;
      const sameIds =
        sameLength &&
        current.every((lead) => serverLeads.some((server) => server.id === lead.id)) &&
        JSON.stringify(current) === JSON.stringify(sortLeads(serverLeads));

      if (!sameIds) {
        applyServerLeads(serverLeads);
      }
    }

    const interval = window.setInterval(() => {
      void pollServerLeads();
    }, 8000);

    return () => {
      cancelled = true;
      window.clearInterval(interval);
    };
  }, [applyServerLeads]);

  useEffect(() => {
    let cancelled = false;

    async function syncZellerInvoiceStatus() {
      try {
        const pendingIds = leadsRef.current
          .filter(
            (lead) =>
              Boolean(lead.zellerReferenceId) ||
              lead.invoiceStatus === 'sent' ||
              lead.invoiceStatus === 'pending' ||
              lead.sentInvoice === true,
          )
          .map((lead) => lead.id);
        if (pendingIds.length === 0) return;

        const invoices = await fetchZellerInvoices(pendingIds);
        if (cancelled || invoices.length === 0) return;

        const paidByLead = new Map(
          invoices
            .filter((invoice) => invoice.status === 'paid')
            .map((invoice) => [invoice.leadId, invoice]),
        );
        if (paidByLead.size === 0) return;

        for (const [leadId, paid] of paidByLead) {
          const lead = leadsRef.current.find((item) => item.id === leadId);
          if (!lead || lead.invoiceStatus === 'paid') continue;

          const updates: Partial<Lead> = {
            sentInvoice: true,
            invoiceStatus: 'paid',
            invoicePaidAt: paid.paidAt || new Date().toISOString(),
            zellerReferenceId: paid.referenceId || lead.zellerReferenceId,
            zellerPaymentUrl: paid.paymentUrl || lead.zellerPaymentUrl,
          };

          setLeads((prev) => {
            const updated = prev.map((item) =>
              item.id === leadId ? { ...item, ...updates } : item,
            );
            cacheLeads(updated);
            return updated;
          });

          void fetch(`/api/leads/${leadId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updates),
          }).catch(() => undefined);
        }
      } catch {
        // ignore offline / missing API during local frontend-only runs
      }
    }

    syncZellerInvoiceStatus();
    const interval = window.setInterval(syncZellerInvoiceStatus, 10000);
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
    async (form: AddLeadForm): Promise<{ success: boolean; error?: string }> => {
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
        isOnsite: form.appointmentType === 'Onsite',
        outcome: form.outcome,
        sentStatus: 'PENDING',
        sentToCustomer: false,
        sentToTechnician: false,
        sentInvoice: false,
        submittedAt: new Date().toISOString(),
      };

      try {
        syncingRef.current = true;
        const response = await fetch('/api/leads/crm', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newLead),
        });
        const data = await response.json().catch(() => ({}));
        if (!response.ok || !data.ok) {
          return { success: false, error: data.error || 'Failed to save lead to server.' };
        }

        const saved = (data.lead as Lead) || newLead;
        setLeads((prev) => {
          const updated = sortLeads([saved, ...prev.filter((lead) => lead.id !== saved.id)]);
          cacheLeads(updated);
          return updated;
        });
        return { success: true };
      } catch {
        return { success: false, error: 'Unable to reach server. Lead was not saved.' };
      } finally {
        syncingRef.current = false;
      }
    },
    [user, getAccountById],
  );

  const updateLead = useCallback((id: string, updates: Partial<Lead>) => {
    setLeads((prev) => {
      const updated = prev.map((l) => (l.id === id ? { ...l, ...updates } : l));
      cacheLeads(updated);

      const target = updated.find((l) => l.id === id);
      if (target) {
        syncingRef.current = true;
        void fetch(`/api/leads/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(target),
        })
          .then(async (response) => {
            if (response.status === 404) {
              await fetch('/api/leads/crm', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(target),
              });
            }
          })
          .catch(() => undefined)
          .finally(() => {
            syncingRef.current = false;
          });
      }

      return updated;
    });
  }, []);

  const deleteLead = useCallback((id: string) => {
    setLeads((prev) => {
      const updated = prev.filter((l) => l.id !== id);
      cacheLeads(updated);
      return updated;
    });

    syncingRef.current = true;
    void fetch(`/api/leads/${id}`, { method: 'DELETE' })
      .catch(() => undefined)
      .finally(() => {
        syncingRef.current = false;
      });
  }, []);

  return (
    <LeadsContext.Provider value={{ leads, visibleLeads, loading, addLead, updateLead, deleteLead }}>
      {children}
    </LeadsContext.Provider>
  );
}

export function useLeads() {
  const ctx = useContext(LeadsContext);
  if (!ctx) throw new Error('useLeads must be used within LeadsProvider');
  return ctx;
}
