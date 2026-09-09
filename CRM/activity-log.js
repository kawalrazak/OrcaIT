import { appendFile, mkdir, readFile } from 'fs/promises';
import path from 'path';

const ACTION_LABELS = {
  'lead.create.website': 'Created lead (website)',
  'lead.create.crm': 'Created lead (CRM)',
  'lead.update': 'Updated lead',
  'lead.delete': 'Deleted lead',
  'invoice.email': 'Sent invoice email',
};

function buildSummary(record) {
  if (record.summary) return record.summary;

  const action = ACTION_LABELS[record.action] || record.action || 'Performed action';
  const account = record.accountName || record.leadName || 'unknown account';
  const actor =
    record.performedByName ||
    record.performedByUsername ||
    record.deletedBy ||
    record.leadUser ||
    record.source ||
    'Unknown user';
  const result = record.success === false ? 'failed' : 'succeeded';

  let summary = `${actor} ${action.toLowerCase()} on account "${account}" (${result})`;
  if (record.status) summary += ` · status: ${record.status}`;
  if (record.outcome) summary += ` · outcome: ${record.outcome}`;
  if (record.error) summary += ` · error: ${record.error}`;
  return summary;
}

export function createActivityLogger({ dataDir }) {
  const logPath = path.join(dataDir, 'activity.log');

  async function ensureDir() {
    await mkdir(dataDir, { recursive: true });
  }

  async function log(entry = {}) {
    const at = new Date().toISOString();
    const record = {
      at,
      date: at.slice(0, 10),
      actionLabel: ACTION_LABELS[entry.action] || entry.action || 'Activity',
      accountName: entry.accountName || entry.leadName || '',
      ...entry,
      at,
      date: at.slice(0, 10),
    };
    record.summary = buildSummary(record);

    const line = `${JSON.stringify(record)}\n`;
    console.log(
      `[activity] ${record.action || 'event'} | by=${
        record.performedByName || record.performedByUsername || record.deletedBy || 'unknown'
      } | account=${record.accountName || record.leadId || ''} | success=${
        record.success !== false
      }${record.error ? ` | error=${record.error}` : ''}`,
    );

    try {
      await ensureDir();
      await appendFile(logPath, line, 'utf8');
    } catch (error) {
      console.error('[activity] failed to write log file', error);
    }

    return record;
  }

  async function read({ limit = 200 } = {}) {
    const max = Math.min(Math.max(Number(limit) || 200, 1), 1000);
    try {
      const raw = await readFile(logPath, 'utf8');
      const entries = raw
        .split('\n')
        .map((line) => line.trim())
        .filter(Boolean)
        .map((line) => {
          try {
            return JSON.parse(line);
          } catch {
            return null;
          }
        })
        .filter(Boolean)
        .reverse()
        .slice(0, max);
      return entries;
    } catch (error) {
      if (error && error.code === 'ENOENT') return [];
      throw error;
    }
  }

  return {
    log,
    read,
    paths: { logPath },
  };
}
