import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { randomUUID } from 'crypto';
import twilio from 'twilio';
import { createLeadsStore } from './leads-db.js';
import { createZellerInvoicesStore } from './zeller-invoices-db.js';
import {
  createCheckoutSession,
  parseZellerWebhookEvent,
  verifyZellerWebhookSignature,
} from './zeller.js';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distPath = path.join(__dirname, 'dist');
const dataDir = path.join(__dirname, 'data');
const leadsStore = createLeadsStore({ dataDir });
const zellerInvoicesStore = createZellerInvoicesStore({ dataDir });
const isProduction =
  process.env.NODE_ENV === 'production' ||
  (process.env.NODE_ENV !== 'development' && existsSync(path.join(distPath, 'index.html')));

const app = express();
app.use(
  express.json({
    limit: '1mb',
    verify: (req, _res, buf) => {
      if (req.originalUrl?.startsWith('/api/zeller/webhook')) {
        req.rawBody = buf;
      }
    },
  }),
);

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.sendStatus(204);
  next();
});

let leadsWriteChain = Promise.resolve();

function withLeadsLock(fn) {
  const run = leadsWriteChain.then(fn, fn);
  leadsWriteChain = run.then(
    () => undefined,
    () => undefined,
  );
  return run;
}

function formatAuDateTime(date = new Date()) {
  return date.toLocaleString('en-AU', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
}

function asString(value, fallback = '') {
  return typeof value === 'string' ? value.trim() : fallback;
}

function buildLeadFromWebsite(body = {}) {
  const source = asString(body.source || body.webSource, 'website');
  const now = new Date();
  const callDate = now.toISOString().split('T')[0];

  // Book Now shape
  if (body.firstName || body.serviceTitle || source === 'book-now') {
    const firstName = asString(body.firstName);
    const lastName = asString(body.lastName);
    const name = asString(body.name) || `${firstName} ${lastName}`.trim();
    const unit = asString(body.unit);
    const address = asString(body.address);
    const fullAddress = unit ? `${unit}, ${address}` : address;
    const serviceTitle = asString(body.serviceTitle, 'Website booking');
    const helpNeeded = asString(body.helpNeeded || body.issue || body.issueDescription);
    const dateLabel = asString(body.dateLabel);
    const time = asString(body.time);
    const staffName = asString(body.staffName);
    const company = asString(body.company);
    const discountCode = asString(body.discountCode);

    return {
      id: randomUUID(),
      webSource: 'book-now',
      submittedAt: now.toISOString(),
      name,
      phone: asString(body.phone),
      email: asString(body.email) || undefined,
      callDate,
      issueType: serviceTitle.toLowerCase().includes('on-site') ? 'Onsite - Misc' : serviceTitle,
      issueDescription: helpNeeded || serviceTitle,
      address: fullAddress || undefined,
      appointmentDate: [dateLabel, time].filter(Boolean).join(' ') || undefined,
      comment: [
        'Source: Website Book Now',
        serviceTitle && `Service: ${serviceTitle}`,
        dateLabel && `Date: ${dateLabel}`,
        time && `Time: ${time}`,
        staffName && `Staff: ${staffName}`,
        company && `Company: ${company}`,
        discountCode && `Discount: ${discountCode}`,
        typeof body.servicePrice === 'number' && `Price: $${body.servicePrice}`,
      ]
        .filter(Boolean)
        .join(' | '),
      postCode: asString(body.postcode || body.postCode),
      postCodeServiceable: true,
      deviceType: 'Unknown',
      date: formatAuDateTime(now),
      status: 'Not Fixed',
      leadUser: 'Website',
      assignedClientId: '',
      assignedClientName: '',
      technician: staffName || undefined,
      isOnsite: serviceTitle.toLowerCase().includes('on-site') || serviceTitle.toLowerCase().includes('onsite'),
      outcome: 'Appointment Booked',
      sentStatus: 'PENDING',
      sentToCustomer: false,
      sentToTechnician: false,
      raw: body,
    };
  }

  // Chat / callback form shape
  const name = asString(body.name);
  const supportFor = asString(body.supportFor, 'Website enquiry');
  const existingCustomer = asString(body.existingCustomer);
  const preferredContactTime = asString(body.preferredContactTime);
  const suburb = asString(body.suburb || body.address);
  const issue = asString(body.issue || body.issueDescription || body.customerIssue);
  const visitType = asString(body.visitType);
  const isRemote =
    visitType.toLowerCase().startsWith('remote') ||
    visitType.toLowerCase().includes('online');
  const isOnsite =
    visitType.toLowerCase().includes('on-site') ||
    visitType.toLowerCase().includes('onsite') ||
    visitType.toLowerCase().includes('on site');

  return {
    id: randomUUID(),
    webSource:
      source === 'booking-form'
        ? 'booking-form'
        : source === 'facebook'
          ? 'facebook'
          : 'chat',
    submittedAt: now.toISOString(),
    name,
    phone: asString(body.phone),
    email: asString(body.email) || undefined,
    callDate,
    issueType: supportFor || 'Computer/Laptop',
    issueDescription: issue || 'Website enquiry',
    address: suburb || (isRemote ? 'Remote support' : undefined),
    comment: [
      `Source: ${
        source === 'facebook'
          ? 'Facebook Messenger'
          : source === 'booking-form'
            ? 'Website callback form'
            : 'Website chat'
      }`,
      supportFor && `Support for: ${supportFor}`,
      visitType && `Visit type: ${visitType}`,
      existingCustomer && `Existing customer: ${existingCustomer}`,
      preferredContactTime && `Preferred contact: ${preferredContactTime}`,
    ]
      .filter(Boolean)
      .join(' | '),
    postCode: asString(body.postCode || body.postcode),
    postCodeServiceable: true,
    deviceType: 'Unknown',
    date: formatAuDateTime(now),
    status: 'Not Fixed',
    leadUser: 'Website',
    assignedClientId: '',
    assignedClientName: '',
    isOnsite: isOnsite && !isRemote,
    outcome: '',
    sentStatus: 'PENDING',
    sentToCustomer: false,
    sentToTechnician: false,
    preferredContactTime: preferredContactTime || undefined,
    suburb: suburb || undefined,
    raw: body,
  };
}

app.get('/api/health', (_req, res) => {
  res.json({
    ok: true,
    mode: isProduction ? 'production' : 'development',
    storage: 'sqlite',
    csv: path.basename(leadsStore.paths.csvPath),
  });
});

app.get('/api/leads', async (_req, res) => {
  try {
    const leads = leadsStore.getAllLeads();
    res.json({ ok: true, leads });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unable to load leads.';
    res.status(500).json({ ok: false, error: message });
  }
});

app.post('/api/leads', async (req, res) => {
  try {
    const body = req.body || {};

    if (asString(body.website)) {
      return res.json({ ok: true, ignored: true });
    }

    const name = asString(body.name) || `${asString(body.firstName)} ${asString(body.lastName)}`.trim();
    const phone = asString(body.phone);

    if (!name || !phone) {
      return res.status(400).json({ ok: false, error: 'Name and phone are required.' });
    }

    const lead = buildLeadFromWebsite(body);
    await withLeadsLock(async () => {
      await leadsStore.insertLead(lead);
    });

    return res.status(201).json({ ok: true, lead });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unable to save lead.';
    return res.status(500).json({ ok: false, error: message });
  }
});

/** Full CRM lead document — used for Add Lead + migrating browser localStorage leads into SQLite. */
app.post('/api/leads/crm', async (req, res) => {
  try {
    const body = req.body || {};
    const id = asString(body.id);
    const name = asString(body.name);
    const phone = asString(body.phone);

    if (!id || !name || !phone) {
      return res.status(400).json({ ok: false, error: 'id, name, and phone are required.' });
    }

    const lead = {
      ...body,
      id,
      name,
      phone,
      submittedAt: asString(body.submittedAt) || new Date().toISOString(),
    };

    const saved = await withLeadsLock(async () => leadsStore.upsertLead(lead));
    if (saved?.skipped) {
      return res.status(410).json({ ok: false, error: 'Lead was deleted and cannot be restored.', deleted: true });
    }
    return res.status(201).json({ ok: true, lead: saved });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unable to save CRM lead.';
    return res.status(500).json({ ok: false, error: message });
  }
});

app.post('/api/leads/sync', async (req, res) => {
  try {
    const incoming = Array.isArray(req.body?.leads) ? req.body.leads : [];
    await withLeadsLock(async () => {
      for (const item of incoming) {
        const id = asString(item?.id);
        const name = asString(item?.name);
        const phone = asString(item?.phone);
        if (!id || !name || !phone) continue;
        await leadsStore.upsertLead({
          ...item,
          id,
          name,
          phone,
          submittedAt: asString(item.submittedAt) || new Date().toISOString(),
        });
      }
    });

    const leads = leadsStore.getAllLeads();
    return res.json({ ok: true, leads, synced: incoming.length });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unable to sync leads.';
    return res.status(500).json({ ok: false, error: message });
  }
});

app.put('/api/leads/:id', async (req, res) => {
  try {
    const updates = req.body || {};
    const lead = await withLeadsLock(async () => {
      const { id: _id, ...safeUpdates } = updates;
      return leadsStore.updateLead(req.params.id, safeUpdates);
    });

    if (!lead) {
      return res.status(404).json({ ok: false, error: 'Lead not found.' });
    }

    return res.json({ ok: true, lead });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unable to update lead.';
    return res.status(500).json({ ok: false, error: message });
  }
});

app.delete('/api/leads/:id', async (req, res) => {
  try {
    await withLeadsLock(async () => leadsStore.deleteLead(req.params.id));
    return res.json({ ok: true, deleted: true, id: req.params.id });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unable to delete lead.';
    return res.status(500).json({ ok: false, error: message });
  }
});

app.post('/api/send-sms', async (req, res) => {
  const { to, message } = req.body || {};

  if (!to || !message) {
    return res.status(400).json({ success: false, error: 'Recipient and message are required.' });
  }

  const accountSid = process.env.TWILIO_ACCOUNT_SID || '';
  const authToken = process.env.TWILIO_AUTH_TOKEN || '';
  const fromNumber = process.env.TWILIO_PHONE_NUMBER || process.env.TWILIO_FROM_NUMBER || '';

  if (!accountSid || !authToken || !fromNumber) {
    if (process.env.TWILIO_MOCK_MODE === 'true') {
      return res.json({ success: true, mock: true, message: 'SMS simulated successfully in mock mode.' });
    }

    return res.status(500).json({
      success: false,
      error: 'SMS is not configured. Set TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, and TWILIO_PHONE_NUMBER in .env',
    });
  }

  try {
    const client = twilio(accountSid, authToken);
    const result = await client.messages.create({
      body: message,
      from: fromNumber,
      to,
    });

    return res.json({ success: true, sid: result.sid, mock: false });
  } catch (error) {
    const errMessage = error instanceof Error ? error.message : 'Unable to send SMS.';
    return res.status(500).json({ success: false, error: errMessage });
  }
});

function invoiceAmountDollars(body = {}) {
  const direct = Number(body.amount);
  if (Number.isFinite(direct) && direct > 0) return direct;
  return 0;
}

app.post('/api/zeller/checkout-session', async (req, res) => {
  try {
    const body = req.body || {};
    const leadId = asString(body.leadId);
    const amountDollars = invoiceAmountDollars(body);
    const customerName = asString(body.customerName);
    const customerPhone = asString(body.customerPhone);
    const customerEmail = asString(body.customerEmail);
    const description = asString(body.description);

    if (!leadId) {
      return res.status(400).json({ ok: false, error: 'leadId is required.' });
    }
    if (amountDollars <= 0) {
      return res.status(400).json({ ok: false, error: 'A valid invoice amount is required.' });
    }

    const referenceId =
      asString(body.referenceId) ||
      `INV-${leadId.slice(0, 8).toUpperCase()}-${Date.now().toString(36).toUpperCase()}`;

    const session = await createCheckoutSession({
      amountDollars,
      referenceId,
      description: description || `Orca IT invoice for ${customerName || 'customer'}`,
      customer: {
        name: customerName,
        phone: customerPhone,
        email: customerEmail,
      },
      metadata: { lead_id: leadId },
    });

    if (!session.ok) {
      return res.status(502).json({ ok: false, error: session.error, raw: session.raw });
    }

    const invoiceRecord = {
      id: randomUUID(),
      leadId,
      referenceId: session.referenceId,
      sessionId: session.sessionId,
      amountCents: session.amountCents,
      currency: session.currency,
      paymentUrl: session.paymentUrl,
      status: 'pending',
      customerName,
      customerPhone,
      customerEmail,
      createdAt: new Date().toISOString(),
      payload: session.raw,
    };

    zellerInvoicesStore.insertInvoice(invoiceRecord);

    return res.json({
      ok: true,
      mock: Boolean(session.mock),
      invoice: {
        id: invoiceRecord.id,
        leadId,
        referenceId: session.referenceId,
        sessionId: session.sessionId,
        amountCents: session.amountCents,
        amountDollars: session.amountCents / 100,
        currency: session.currency,
        paymentUrl: session.paymentUrl,
        status: 'pending',
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unable to create Zeller checkout session.';
    return res.status(500).json({ ok: false, error: message });
  }
});

app.get('/api/zeller/invoices', (req, res) => {
  try {
    const leadIds = String(req.query.leadIds || '')
      .split(',')
      .map((id) => id.trim())
      .filter(Boolean);
    const invoices = zellerInvoicesStore.listByLeadIds(leadIds);
    return res.json({ ok: true, invoices });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unable to load invoices.';
    return res.status(500).json({ ok: false, error: message });
  }
});

app.post('/api/zeller/webhook', async (req, res) => {
  try {
    const signature =
      req.headers['x-zeller-signature'] ||
      req.headers['x-webhook-signature'] ||
      req.headers['stripe-signature'];

    const rawBody = req.rawBody || Buffer.from(JSON.stringify(req.body || {}));
    if (!verifyZellerWebhookSignature(rawBody, signature)) {
      return res.status(401).json({ ok: false, error: 'Invalid webhook signature.' });
    }

    const event = parseZellerWebhookEvent(req.body || {});
    if (!event.succeeded) {
      return res.json({ ok: true, ignored: true, type: event.type });
    }

    const paid = zellerInvoicesStore.markPaid({
      referenceId: event.referenceId,
      sessionId: event.sessionId,
      payload: event.raw,
    });

    if (!paid) {
      return res.status(404).json({
        ok: false,
        error: 'No matching invoice for this payment event.',
        referenceId: event.referenceId,
        sessionId: event.sessionId,
      });
    }

    // Best-effort: if this lead exists in website SQLite store, mark invoice paid there too.
    await withLeadsLock(async () => {
      await leadsStore.updateLead(paid.leadId, {
        invoiceStatus: 'paid',
        invoicePaidAt: paid.paidAt,
        zellerReferenceId: paid.referenceId,
        zellerPaymentUrl: paid.paymentUrl,
        sentInvoice: true,
      });
    }).catch(() => undefined);

    return res.json({
      ok: true,
      paid: true,
      leadId: paid.leadId,
      referenceId: paid.referenceId,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Webhook processing failed.';
    return res.status(500).json({ ok: false, error: message });
  }
});

if (isProduction) {
  app.use(express.static(distPath));

  app.get(/^\/(?!api).*/, (_req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

const port = Number(process.env.PORT || 3001);

await leadsStore.init();
await zellerInvoicesStore.init();
console.log(`[leads-db] SQLite: ${leadsStore.paths.dbPath}`);
console.log(`[leads-db] CSV export: ${leadsStore.paths.csvPath}`);
console.log(`[zeller] invoices: ${zellerInvoicesStore.paths.dbPath}`);

app.listen(port, '0.0.0.0', () => {
  console.log(`CareIT CRM server running on http://0.0.0.0:${port}`);
  if (isProduction) {
    console.log('Serving production build from /dist');
  } else {
    console.log('API only — run "npm run dev" separately for the frontend');
  }
});
