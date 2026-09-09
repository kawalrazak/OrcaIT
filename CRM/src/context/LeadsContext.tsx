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
  deleteLead: (
    id: string,
    meta?: { leadName?: string; deletedBy?: string },
  ) => Promise<{ success: boolean; error?: string }>;
}

const LeadsContext = createContext<LeadsContextType | null>(null);

function activityActor(user: { id?: string; name?: string; username?: string } | null | undefined) {
  return {
    performedById: user?.id || '',
    performedByName: user?.name || user?.username || 'Unknown',
    performedByUsername: user?.username || '',
  };
}

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
      const alreadyMigrated = localStorage.getItem(LEADS_MIGRATION_KEY) === '1';

      let serverLeads = await fetchServerLeads();
      if (cancelled) return;

      // One-time migration only. After that, never re-upload local-only leads
      // (that was resurrecting deleted records from other browsers).
      if (!alreadyMigrated && localLeads.length > 0) {
        const merged = await syncLocalLeadsToServer(localLeads);
        if (merged) serverLeads = merged;
      }

      if (serverLeads) {
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
      const sortedServer = sortLeads(serverLeads);
      const localIds = current.map((lead) => lead.id).sort().join(',');
      const serverIds = sortedServer.map((lead) => lead.id).sort().join(',');

      if (localIds !== serverIds || current.length !== sortedServer.length) {
        applyServerLeads(sortedServer);
        return;
      }

      const localStamp = current
        .map((lead) => `${lead.id}:${lead.status}:${lead.outcome}:${lead.invoiceStatus}:${(lead.history || []).length}`)
        .sort()
        .join('|');
      const serverStamp = sortedServer
        .map((lead) => `${lead.id}:${lead.status}:${lead.outcome}:${lead.invoiceStatus}:${(lead.history || []).length}`)
        .sort()
        .join('|');

      if (localStamp !== serverStamp) {
        applyServerLeads(sortedServer);
      }
    }

    const interval = window.setInterval(() => {
      void pollServerLeads();
    }, 5000);

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
          body: JSON.stringify({
            ...newLead,
            ...activityActor(user),
          }),
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
          body: JSON.stringify({
            ...target,
            ...activityActor(user),
          }),
        })
          .catch(() => undefined)
          .finally(() => {
            syncingRef.current = false;
          });
      }

      return updated;
    });
  }, [user]);

  const deleteLead = useCallback(async (
    id: string,
    meta?: { leadName?: string; deletedBy?: string },
  ): Promise<{ success: boolean; error?: string }> => {
    const previous = leadsRef.current;
    const removed = previous.find((lead) => lead.id === id);
    const leadName = meta?.leadName || removed?.name || '';
    const actor = activityActor(user);
    const deletedBy = meta?.deletedBy || actor.performedByName;

    // Optimistically remove locally so UI updates immediately.
    setLeads((prev) => {
      const updated = prev.filter((l) => l.id !== id);
      cacheLeads(updated);
      return updated;
    });

    syncingRef.current = true;
    try {
      const response = await fetch(`/api/leads/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          leadName,
          accountName: leadName,
          deletedBy,
          ...actor,
          performedByName: deletedBy,
        }),
      });
      const data = await response.json().catch(() => ({}));

      if (!response.ok || data.ok === false) {
        applyServerLeads(previous);
        return {
          success: false,
          error: data.error || `Could not delete lead${leadName ? ` for ${leadName}` : ''}.`,
        };
      }

      const serverLeads = await fetchServerLeads();
      if (serverLeads) {
        applyServerLeads(serverLeads);
        if (serverLeads.some((lead) => lead.id === id)) {
          return {
            success: false,
            error: `Lead${leadName ? ` for ${leadName}` : ''} was not deleted from the database.`,
          };
        }
      }

      return { success: true };
    } catch {
      applyServerLeads(previous);
      return {
        success: false,
        error: `Unable to delete lead${leadName ? ` for ${leadName}` : ''}. Check the server connection.`,
      };
    } finally {
      syncingRef.current = false;
    }
  }, [applyServerLeads, user]);

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
