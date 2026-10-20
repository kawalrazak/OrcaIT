export function isPayablePaymentLink(value: string) {
  const trimmed = value.trim();
  if (!trimmed) return false;
  try {
    const url = new URL(trimmed);
    if (url.protocol !== 'https:') return false;
    if (url.pathname.includes('/mock/') || url.pathname.startsWith('/mock')) return false;
    return true;
  } catch {
    return false;
  }
}

export interface ZellerCheckoutInvoice {
  id: string;
  leadId: string;
  referenceId: string;
  sessionId: string;
  amountCents: number;
  amountDollars: number;
  currency: string;
  paymentUrl: string;
  status: string;
}

export async function createZellerCheckoutSession(input: {
  leadId: string;
  amount: number;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  description?: string;
  referenceId?: string;
}): Promise<{ ok: boolean; invoice?: ZellerCheckoutInvoice; mock?: boolean; error?: string }> {
  const res = await fetch('/api/zeller/checkout-session', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok || !body.ok) {
    return { ok: false, error: body.error || 'Unable to create Zeller checkout session.' };
  }
  return { ok: true, invoice: body.invoice as ZellerCheckoutInvoice, mock: Boolean(body.mock) };
}

export async function fetchZellerInvoices(leadIds: string[]) {
  if (!leadIds.length) return [] as Array<{
    leadId: string;
    referenceId: string;
    paymentUrl: string;
    status: string;
    paidAt?: string | null;
  }>;

  const res = await fetch(`/api/zeller/invoices?leadIds=${encodeURIComponent(leadIds.join(','))}`);
  const body = await res.json().catch(() => ({}));
  if (!res.ok || !body.ok) return [];
  return (body.invoices || []) as Array<{
    leadId: string;
    referenceId: string;
    paymentUrl: string;
    status: string;
    paidAt?: string | null;
  }>;
}
