const GRAPH_URL = "https://graph.facebook.com/v21.0/me/messages";

const REPLY_DELAY_MS = Number(process.env.REPLY_DELAY_MS || 5000);
const BETWEEN_MESSAGES_MS = Number(process.env.BETWEEN_MESSAGES_MS || 1600);

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function getPageToken() {
  const pageToken = process.env.FACEBOOK_PAGE_ACCESS_TOKEN;
  if (!pageToken) {
    console.error("[facebook] FACEBOOK_PAGE_ACCESS_TOKEN is not set");
    return null;
  }
  return pageToken;
}

/** Vary delay by message length + small random pause so replies feel natural. */
export function humanDelayMs(text, baseMs = REPLY_DELAY_MS) {
  const lengthFactor = Math.min(2200, text.length * 20);
  const jitter = Math.floor(Math.random() * 1000) - 350;
  return Math.min(7500, Math.max(2800, Math.round(baseMs * 0.55 + lengthFactor + jitter)));
}

async function graphPost(body) {
  const pageToken = getPageToken();
  if (!pageToken) return;

  const response = await fetch(`${GRAPH_URL}?access_token=${encodeURIComponent(pageToken)}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const text = await response.text();
    console.error("[facebook] send failed:", response.status, text);
  }
}

export async function sendTypingOn(psid) {
  await graphPost({
    recipient: { id: psid },
    sender_action: "typing_on",
  });
}

export async function sendTypingOff(psid) {
  await graphPost({
    recipient: { id: psid },
    sender_action: "typing_off",
  });
}

async function humanWait(psid, ms) {
  await sendTypingOn(psid);
  let remaining = ms;
  while (remaining > 3000) {
    await sleep(3000);
    await sendTypingOn(psid);
    remaining -= 3000;
  }
  if (remaining > 0) await sleep(remaining);
}

async function sendTextImmediate(psid, text, quickReplies = []) {
  const message = { text };
  if (quickReplies.length) {
    message.quick_replies = quickReplies.map((title) => ({
      content_type: "text",
      title,
      payload: title,
    }));
  }

  await graphPost({
    recipient: { id: psid },
    messaging_type: "RESPONSE",
    message,
  });
}

export async function sendText(psid, text, quickReplies = [], delayMs) {
  const waitMs = delayMs ?? humanDelayMs(text);
  await humanWait(psid, waitMs);
  await sendTextImmediate(psid, text, quickReplies);
  await sendTypingOff(psid);
}

export async function sendTexts(psid, texts, lastQuickReplies = []) {
  for (let i = 0; i < texts.length; i += 1) {
    const isLast = i === texts.length - 1;
    const delayMs = i === 0 ? humanDelayMs(texts[i]) : humanDelayMs(texts[i], BETWEEN_MESSAGES_MS);
    await sendText(psid, texts[i], isLast ? lastQuickReplies : [], delayMs);
  }
}
