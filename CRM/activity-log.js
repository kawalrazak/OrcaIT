import { appendFile, mkdir } from 'fs/promises';
import path from 'path';

export function createActivityLogger({ dataDir }) {
  const logPath = path.join(dataDir, 'activity.log');

  async function ensureDir() {
    await mkdir(dataDir, { recursive: true });
  }

  async function log(entry = {}) {
    const record = {
      at: new Date().toISOString(),
      ...entry,
    };
    const line = `${JSON.stringify(record)}\n`;
    console.log(
      `[activity] ${record.action || 'event'} | success=${record.success !== false} | ${
        record.leadName || record.leadId || ''
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

  return {
    log,
    paths: { logPath },
  };
}
