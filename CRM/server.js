import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { existsSync } from 'fs';
import { mkdir, readFile, writeFile } from 'fs/promises';
import { fileURLToPath } from 'url';
import { randomUUID } from 'crypto';
import twilio from 'twilio';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distPath = path.join(__dirname, 'dist');
const dataDir = path.join(__dirname, 'data');
const leadsFile = path.join(dataDir, 'website-leads.json');
const isProduction =
  process.env.NODE_ENV === 'production' ||
  (process.env.NODE_ENV !== 'development' && existsSync(path.join(distPath, 'index.html')));

const app = express();
app.use(express.json({ limit: '1mb' }));

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.sendStatus(204);
  next();
});

async function ensureLeadsFile() {
  await mkdir(dataDir, { recursive: true });
  if (!existsSync(leadsFile)) {
    await writeFile(leadsFile, '[]', 'utf8');
  }
}

let leadsWriteChain = Promise.resolve();

function withLeadsLock(fn) {
  const run = leadsWriteChain.then(fn, fn);
  leadsWriteChain = run.then(
    () => undefined,
    () => undefined,
  );
  return run;
}

async function readLeads() {
  await ensureLeadsFile();
  try {
    const raw = await readFile(leadsFile, 'utf8');
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

async function writeLeads(leads) {
  await ensureLeadsFile();
  await writeFile(leadsFile, JSON.stringify(leads, null, 2), 'utf8');
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

  return {
    id: randomUUID(),
    webSource: source === 'booking-form' ? 'booking-form' : 'chat',
    submittedAt: now.toISOString(),
    name,
    phone: asString(body.phone),
    email: asString(body.email) || undefined,
    callDate,
    issueType: supportFor || 'Computer/Laptop',
    issueDescription: issue || 'Website enquiry',
    address: suburb || undefined,
    comment: [
      `Source: Website ${source === 'booking-form' ? 'callback form' : 'chat'}`,
      supportFor && `Support for: ${supportFor}`,
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
    isOnsite: false,
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
  res.json({ ok: true, mode: isProduction ? 'production' : 'development' });
});

app.get('/api/leads', async (_req, res) => {
  try {
    const leads = await readLeads();
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
      const leads = await readLeads();
      leads.unshift(lead);
      await writeLeads(leads);
    });

    return res.status(201).json({ ok: true, lead });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unable to save lead.';
    return res.status(500).json({ ok: false, error: message });
  }
});

app.put('/api/leads/:id', async (req, res) => {
  try {
    const updates = req.body || {};
    const lead = await withLeadsLock(async () => {
      const leads = await readLeads();
      const index = leads.findIndex((item) => item.id === req.params.id);
      if (index < 0) return null;

      const { id: _id, ...safeUpdates } = updates;
      leads[index] = { ...leads[index], ...safeUpdates, id: leads[index].id };
      await writeLeads(leads);
      return leads[index];
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
    const deleted = await withLeadsLock(async () => {
      const leads = await readLeads();
      const next = leads.filter((item) => item.id !== req.params.id);
      if (next.length === leads.length) return false;
      await writeLeads(next);
      return true;
    });

    if (!deleted) {
      return res.status(404).json({ ok: false, error: 'Lead not found.' });
    }
    return res.json({ ok: true });
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

if (isProduction) {
  app.use(express.static(distPath));

  app.get(/^\/(?!api).*/, (_req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

const port = Number(process.env.PORT || 3001);
app.listen(port, '0.0.0.0', () => {
  console.log(`CareIT CRM server running on http://0.0.0.0:${port}`);
  if (isProduction) {
    console.log('Serving production build from /dist');
  } else {
    console.log('API only — run "npm run dev" separately for the frontend');
  }
});
