import { existsSync } from "node:fs";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const storePath = path.join(process.cwd(), "data", "messenger-users.json");
let cache = null;
let writeChain = Promise.resolve();

async function loadStore() {
  if (cache) return cache;

  await mkdir(path.dirname(storePath), { recursive: true });
  if (!existsSync(storePath)) {
    cache = {};
    return cache;
  }

  try {
    const parsed = JSON.parse(await readFile(storePath, "utf8"));
    cache = parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    cache = {};
  }

  return cache;
}

export async function getSavedBooking(psid) {
  const store = await loadStore();
  const entry = store[String(psid)];
  if (!entry?.lead || typeof entry.lead !== "object") return null;
  return entry.lead;
}

export async function saveUserBooking(psid, lead) {
  writeChain = writeChain.then(async () => {
    const store = await loadStore();
    store[String(psid)] = {
      lead,
      savedAt: new Date().toISOString(),
    };
    cache = store;
    await mkdir(path.dirname(storePath), { recursive: true });
    await writeFile(storePath, JSON.stringify(store, null, 2), "utf8");
  });

  await writeChain;
}
