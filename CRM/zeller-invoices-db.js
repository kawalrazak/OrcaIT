import { DatabaseSync } from 'node:sqlite';
import { mkdir } from 'fs/promises';
import path from 'path';

export function createZellerInvoicesStore({ dataDir }) {
  const dbPath = path.join(dataDir, 'zeller-invoices.db');
  let db;

  function openDb() {
    if (!db) {
      db = new DatabaseSync(dbPath);
      db.exec(`
        CREATE TABLE IF NOT EXISTS zeller_invoices (
          id TEXT PRIMARY KEY,
          lead_id TEXT NOT NULL,
          reference_id TEXT NOT NULL UNIQUE,
          session_id TEXT,
          amount_cents INTEGER NOT NULL,
          currency TEXT NOT NULL,
          payment_url TEXT NOT NULL,
          status TEXT NOT NULL,
          customer_name TEXT,
          customer_phone TEXT,
          customer_email TEXT,
          created_at TEXT NOT NULL,
          paid_at TEXT,
          payload TEXT
        );
        CREATE INDEX IF NOT EXISTS idx_zeller_lead ON zeller_invoices(lead_id);
        CREATE INDEX IF NOT EXISTS idx_zeller_status ON zeller_invoices(status);
      `);
    }
    return db;
  }

  async function init() {
    await mkdir(dataDir, { recursive: true });
    openDb();
  }

  function insertInvoice(invoice) {
    const createdAt = invoice.createdAt || new Date().toISOString();
    openDb()
      .prepare(`
        INSERT INTO zeller_invoices (
          id, lead_id, reference_id, session_id, amount_cents, currency,
          payment_url, status, customer_name, customer_phone, customer_email,
          created_at, paid_at, payload
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `)
      .run(
        invoice.id,
        invoice.leadId,
        invoice.referenceId,
        invoice.sessionId || '',
        invoice.amountCents,
        invoice.currency || 'AUD',
        invoice.paymentUrl,
        invoice.status || 'pending',
        invoice.customerName || '',
        invoice.customerPhone || '',
        invoice.customerEmail || '',
        createdAt,
        invoice.paidAt || null,
        invoice.payload ? JSON.stringify(invoice.payload) : null,
      );
    return invoice;
  }

  function getByReferenceId(referenceId) {
    const row = openDb()
      .prepare('SELECT * FROM zeller_invoices WHERE reference_id = ?')
      .get(referenceId);
    return row ? mapRow(row) : null;
  }

  function getBySessionId(sessionId) {
    if (!sessionId) return null;
    const row = openDb()
      .prepare('SELECT * FROM zeller_invoices WHERE session_id = ?')
      .get(sessionId);
    return row ? mapRow(row) : null;
  }

  function listByLeadIds(leadIds = []) {
    if (!leadIds.length) return [];
    const placeholders = leadIds.map(() => '?').join(',');
    return openDb()
      .prepare(
        `SELECT * FROM zeller_invoices WHERE lead_id IN (${placeholders}) ORDER BY created_at DESC`,
      )
      .all(...leadIds)
      .map(mapRow);
  }

  function markPaid({ referenceId, sessionId, payload }) {
    const existing =
      (referenceId && getByReferenceId(referenceId)) ||
      (sessionId && getBySessionId(sessionId));
    if (!existing) return null;

    const paidAt = new Date().toISOString();
    openDb()
      .prepare(`
        UPDATE zeller_invoices
        SET status = 'paid',
            paid_at = ?,
            payload = ?
        WHERE id = ?
      `)
      .run(paidAt, payload ? JSON.stringify(payload) : existing.payload || null, existing.id);

    return { ...existing, status: 'paid', paidAt };
  }

  return {
    init,
    insertInvoice,
    getByReferenceId,
    getBySessionId,
    listByLeadIds,
    markPaid,
    paths: { dbPath },
  };
}

function mapRow(row) {
  return {
    id: row.id,
    leadId: row.lead_id,
    referenceId: row.reference_id,
    sessionId: row.session_id,
    amountCents: row.amount_cents,
    currency: row.currency,
    paymentUrl: row.payment_url,
    status: row.status,
    customerName: row.customer_name,
    customerPhone: row.customer_phone,
    customerEmail: row.customer_email,
    createdAt: row.created_at,
    paidAt: row.paid_at,
    payload: row.payload,
  };
}
