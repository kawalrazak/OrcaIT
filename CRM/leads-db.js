import { DatabaseSync } from 'node:sqlite';
import { existsSync, readFileSync } from 'fs';
import { appendFile, mkdir, writeFile } from 'fs/promises';
import path from 'path';

const CSV_COLUMNS = [
  'Submitted At',
  'Source',
  'Name',
  'Phone',
  'Email',
  'Suburb',
  'Support For',
  'Existing Customer',
  'Issue',
  'Preferred Contact Time',
  'Appointment Date',
  'Address',
  'Post Code',
  'Status',
  'Outcome',
  'Comment',
];

function csvCell(value) {
  const text = value == null ? '' : String(value);
  const safeValue = /^[=+\-@]/.test(text) ? `'${text}` : text;
  return `"${safeValue.replaceAll('"', '""')}"`;
}

function leadToCsvRow(lead) {
  return [
    lead.submittedAt || '',
    lead.webSource || '',
    lead.name || '',
    lead.phone || '',
    lead.email || '',
    lead.suburb || lead.address || '',
    lead.issueType || lead.raw?.supportFor || '',
    lead.raw?.existingCustomer || '',
    lead.issueDescription || lead.raw?.issue || '',
    lead.preferredContactTime || lead.raw?.preferredContactTime || '',
    lead.appointmentDate || '',
    lead.address || '',
    lead.postCode || '',
    lead.status || '',
    lead.outcome || '',
    lead.comment || '',
  ];
}

function leadToCsvLine(lead) {
  return `${leadToCsvRow(lead).map(csvCell).join(',')}\n`;
}

export function createLeadsStore({ dataDir }) {
  const dbPath = path.join(dataDir, 'leads.db');
  const csvPath = path.join(dataDir, 'leads.csv');
  const legacyJsonPath = path.join(dataDir, 'website-leads.json');

  let db;

  function openDb() {
    if (!db) {
      db = new DatabaseSync(dbPath);
      db.exec(`
        CREATE TABLE IF NOT EXISTS leads (
          id TEXT PRIMARY KEY,
          payload TEXT NOT NULL,
          submitted_at TEXT NOT NULL,
          web_source TEXT,
          name TEXT,
          phone TEXT,
          status TEXT,
          updated_at TEXT NOT NULL
        );
        CREATE TABLE IF NOT EXISTS deleted_leads (
          id TEXT PRIMARY KEY,
          deleted_at TEXT NOT NULL
        );
        CREATE INDEX IF NOT EXISTS idx_leads_submitted ON leads(submitted_at DESC);
        CREATE INDEX IF NOT EXISTS idx_leads_phone ON leads(phone);
      `);
    }
    return db;
  }

  async function writeCsvFromDb() {
    const rows = openDb()
      .prepare('SELECT payload FROM leads ORDER BY submitted_at DESC')
      .all()
      .map((row) => JSON.parse(row.payload));

    const header = `${CSV_COLUMNS.map(csvCell).join(',')}\n`;
    const body = rows.map((lead) => leadToCsvLine(lead).trimEnd()).join('\n');
    const content = body ? `${header}${body}\n` : header;
    await writeFile(csvPath, content, 'utf8');
  }

  async function appendLeadToCsv(lead) {
    await mkdir(dataDir, { recursive: true });
    let needsHeader = false;
    try {
      needsHeader = !existsSync(csvPath) || readFileSync(csvPath, 'utf8').trim().length === 0;
    } catch {
      needsHeader = true;
    }

    const header = needsHeader ? `${CSV_COLUMNS.map(csvCell).join(',')}\n` : '';
    await appendFile(csvPath, `${header}${leadToCsvLine(lead)}`, 'utf8');
  }

  function migrateLegacyJson() {
    if (!existsSync(legacyJsonPath)) return 0;

    const count = openDb().prepare('SELECT COUNT(*) AS total FROM leads').get().total;
    if (count > 0) return 0;

    let legacy = [];
    try {
      legacy = JSON.parse(readFileSync(legacyJsonPath, 'utf8'));
    } catch {
      return 0;
    }

    if (!Array.isArray(legacy) || legacy.length === 0) return 0;

    const insert = openDb().prepare(`
      INSERT OR IGNORE INTO leads (id, payload, submitted_at, web_source, name, phone, status, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

    for (const lead of legacy) {
      if (!lead?.id) continue;
      const submittedAt = lead.submittedAt || new Date().toISOString();
      insert.run(
        lead.id,
        JSON.stringify(lead),
        submittedAt,
        lead.webSource || '',
        lead.name || '',
        lead.phone || '',
        lead.status || '',
        submittedAt,
      );
    }

    return legacy.length;
  }

  async function init() {
    await mkdir(dataDir, { recursive: true });
    openDb();
    const migrated = migrateLegacyJson();
    if (migrated > 0) {
      await writeCsvFromDb();
      console.log(`[leads-db] migrated ${migrated} leads from website-leads.json`);
    }
  }

  function getAllLeads() {
    return openDb()
      .prepare('SELECT payload FROM leads ORDER BY submitted_at DESC')
      .all()
      .map((row) => JSON.parse(row.payload));
  }

  async function insertLead(lead) {
    const deleted = openDb().prepare('SELECT id FROM deleted_leads WHERE id = ?').get(lead.id);
    if (deleted) {
      return { skipped: true, reason: 'deleted' };
    }

    const submittedAt = lead.submittedAt || new Date().toISOString();
    const updatedAt = new Date().toISOString();

    openDb()
      .prepare(`
        INSERT INTO leads (id, payload, submitted_at, web_source, name, phone, status, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `)
      .run(
        lead.id,
        JSON.stringify(lead),
        submittedAt,
        lead.webSource || '',
        lead.name || '',
        lead.phone || '',
        lead.status || '',
        updatedAt,
      );

    await appendLeadToCsv(lead);
    return lead;
  }

  async function upsertLead(lead) {
    if (!lead?.id) {
      throw new Error('Lead id is required.');
    }

    const deleted = openDb().prepare('SELECT id FROM deleted_leads WHERE id = ?').get(lead.id);
    if (deleted) {
      return { skipped: true, reason: 'deleted' };
    }

    const existing = openDb().prepare('SELECT id FROM leads WHERE id = ?').get(lead.id);
    if (existing) {
      return updateLead(lead.id, lead);
    }
    return insertLead(lead);
  }

  async function updateLead(id, updates) {
    const deleted = openDb().prepare('SELECT id FROM deleted_leads WHERE id = ?').get(id);
    if (deleted) {
      return null;
    }

    const existing = openDb().prepare('SELECT payload FROM leads WHERE id = ?').get(id);
    if (!existing) return null;

    const lead = { ...JSON.parse(existing.payload), ...updates, id };
    const updatedAt = new Date().toISOString();

    openDb()
      .prepare(`
        UPDATE leads
        SET payload = ?,
            web_source = ?,
            name = ?,
            phone = ?,
            status = ?,
            updated_at = ?
        WHERE id = ?
      `)
      .run(
        JSON.stringify(lead),
        lead.webSource || '',
        lead.name || '',
        lead.phone || '',
        lead.status || '',
        updatedAt,
        id,
      );

    await writeCsvFromDb();
    return lead;
  }

  async function deleteLead(id) {
    const deletedAt = new Date().toISOString();
    openDb()
      .prepare(
        `INSERT OR REPLACE INTO deleted_leads (id, deleted_at) VALUES (?, ?)`,
      )
      .run(id, deletedAt);

    openDb().prepare('DELETE FROM leads WHERE id = ?').run(id);
    await writeCsvFromDb();
    return true;
  }

  function isDeleted(id) {
    return Boolean(openDb().prepare('SELECT id FROM deleted_leads WHERE id = ?').get(id));
  }

  return {
    init,
    getAllLeads,
    insertLead,
    upsertLead,
    updateLead,
    deleteLead,
    isDeleted,
    paths: { dbPath, csvPath, legacyJsonPath },
  };
}
