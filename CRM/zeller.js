import { createHmac, randomUUID, timingSafeEqual } from 'crypto';

function asNumber(value, fallback = 0) {
  const n = typeof value === 'number' ? value : Number(value);
  return Number.isFinite(n) ? n : fallback;
}

function dollarsToCents(amountDollars) {
  return Math.round(asNumber(amountDollars) * 100);
}

function pickUrl(payload) {
  if (!payload || typeof payload !== 'object') return '';
  const candidates = [
    payload.payment_url,
    payload.paymentUrl,
    payload.checkout_url,
    payload.checkoutUrl,
    payload.url,
    payload.link,
    payload?.data?.payment_url,
    payload?.data?.paymentUrl,
    payload?.data?.checkout_url,
    payload?.data?.url,
    payload?.session?.payment_url,
    payload?.session?.url,
  ];
  for (const value of candidates) {
    if (typeof value === 'string' && value.trim()) return value.trim();
  }
  return '';
}

function pickSessionId(payload) {
  if (!payload || typeof payload !== 'object') return '';
  const candidates = [
    payload.id,
    payload.session_id,
    payload.sessionId,
    payload?.data?.id,
    payload?.session?.id,
  ];
  for (const value of candidates) {
    if (typeof value === 'string' && value.trim()) return value.trim();
  }
  return '';
}

export function getZellerConfig() {
  return {
    apiBaseUrl: (process.env.ZELLER_API_BASE_URL || 'https://api.myzeller.com').replace(/\/$/, ''),
    checkoutPath: process.env.ZELLER_CHECKOUT_PATH || '/v1/checkout/sessions',
    apiKey: process.env.ZELLER_API_KEY || '',
    apiSecret: process.env.ZELLER_API_SECRET || '',
    webhookSecret: process.env.ZELLER_WEBHOOK_SECRET || '',
    currency: (process.env.ZELLER_CURRENCY || 'AUD').toUpperCase(),
    mockMode: process.env.ZELLER_MOCK_MODE === 'true',
  };
}

/**
 * Create a Zeller Online Payments checkout session.
 * Request/response field names are configurable via env because Zeller docs are portal-gated.
 * Set ZELLER_MOCK_MODE=true to simulate a payment.myzeller.com link without live credentials.
 */
export async function createCheckoutSession({
  amountDollars,
  referenceId,
  description,
  customer,
  metadata = {},
}) {
  const config = getZellerConfig();
  const amountCents = dollarsToCents(amountDollars);

  if (amountCents < 1) {
    return { ok: false, error: 'Invoice amount must be greater than $0.' };
  }

  const reference = referenceId || `INV-${randomUUID().slice(0, 8).toUpperCase()}`;

  if (config.mockMode || !config.apiKey) {
    if (!config.mockMode && !config.apiKey) {
      return {
        ok: false,
        error:
          'Zeller is not configured. Set ZELLER_API_KEY (and ZELLER_API_BASE_URL) or ZELLER_MOCK_MODE=true.',
      };
    }

    const sessionId = `mock_${randomUUID()}`;
    const paymentUrl = `https://payment.myzeller.com/mock/${encodeURIComponent(reference)}`;
    return {
      ok: true,
      mock: true,
      sessionId,
      referenceId: reference,
      amountCents,
      currency: config.currency,
      paymentUrl,
      raw: { mock: true, id: sessionId, payment_url: paymentUrl, reference_id: reference },
    };
  }

  const body = {
    amount: amountCents,
    currency: config.currency,
    reference_id: reference,
    description: description || `Invoice ${reference}`,
    customer: {
      name: customer?.name || '',
      email: customer?.email || undefined,
      phone: customer?.phone || undefined,
    },
    metadata: {
      ...metadata,
      reference_id: reference,
    },
  };

  const url = `${config.apiBaseUrl}${config.checkoutPath.startsWith('/') ? '' : '/'}${config.checkoutPath}`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${config.apiKey}`,
        ...(config.apiSecret ? { 'X-Api-Secret': config.apiSecret } : {}),
      },
      body: JSON.stringify(body),
    });

    const raw = await response.json().catch(() => ({}));
    if (!response.ok) {
      const message =
        raw?.error?.message ||
        raw?.message ||
        raw?.error ||
        `Zeller checkout failed (${response.status}).`;
      return { ok: false, error: typeof message === 'string' ? message : 'Zeller checkout failed.' };
    }

    const paymentUrl = pickUrl(raw);
    if (!paymentUrl) {
      return {
        ok: false,
        error:
          'Zeller response did not include a payment URL. Check ZELLER_CHECKOUT_PATH / API response mapping against developer docs.',
        raw,
      };
    }

    return {
      ok: true,
      mock: false,
      sessionId: pickSessionId(raw) || reference,
      referenceId: reference,
      amountCents,
      currency: config.currency,
      paymentUrl,
      raw,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unable to reach Zeller API.';
    return { ok: false, error: message };
  }
}

export function verifyZellerWebhookSignature(rawBody, signatureHeader) {
  const { webhookSecret } = getZellerConfig();
  if (!webhookSecret) return true;
  if (!signatureHeader || !rawBody) return false;

  const expected = createHmac('sha256', webhookSecret).update(rawBody).digest('hex');
  const provided = String(signatureHeader).replace(/^sha256=/, '').trim();

  try {
    const a = Buffer.from(expected, 'utf8');
    const b = Buffer.from(provided, 'utf8');
    if (a.length !== b.length) return false;
    return timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

export function parseZellerWebhookEvent(body = {}) {
  const type =
    body.type ||
    body.event ||
    body.event_type ||
    body?.data?.type ||
    '';

  const data = body.data || body.payload || body.object || body;
  const referenceId =
    data.reference_id ||
    data.referenceId ||
    data.metadata?.reference_id ||
    body.reference_id ||
    '';
  const sessionId = data.id || data.session_id || data.sessionId || body.id || '';
  const status = String(data.status || body.status || '').toLowerCase();

  const succeeded =
    type === 'payment.succeeded' ||
    type === 'checkout.session.completed' ||
    type === 'payment_intent.succeeded' ||
    status === 'paid' ||
    status === 'succeeded' ||
    status === 'completed';

  return {
    type: String(type),
    succeeded,
    referenceId: String(referenceId || ''),
    sessionId: String(sessionId || ''),
    raw: body,
  };
}
