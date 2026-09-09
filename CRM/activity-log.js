import { appendFile, mkdir, readFile } from 'fs/promises';
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
