import { mkdir, readFile, writeFile } from 'fs/promises';
import path from 'path';

export function createPasswordStore({ dataDir }) {
  const filePath = path.join(dataDir, 'user-passwords.json');
  let cache = null;

  async function readAll() {
    if (cache) return cache;
    try {
      const parsed = JSON.parse(await readFile(filePath, 'utf8'));
      cache = parsed && typeof parsed === 'object' ? parsed : {};
    } catch {
      cache = {};
    }
    return cache;
  }

  async function writeAll(next) {
    cache = next;
    await mkdir(dataDir, { recursive: true });
    await writeFile(filePath, JSON.stringify(next), { mode: 0o600 });
  }

  return {
    async ids() {
      return new Set(Object.keys(await readAll()));
    },
    async get(id) {
      const all = await readAll();
      return typeof all[id] === 'string' ? all[id] : '';
    },
    async set(id, password) {
      if (!id || !password) return;
      const all = await readAll();
      all[id] = password;
      await writeAll(all);
    },
    async remove(id) {
      const all = await readAll();
      if (!all[id]) return;
      delete all[id];
      await writeAll(all);
    },
  };
}
