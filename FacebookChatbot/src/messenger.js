const GRAPH_URL = "https://graph.facebook.com/v21.0/me/messages";

const REPLY_DELAY_MS = Number(process.env.REPLY_DELAY_MS || 7000);
const BETWEEN_MESSAGES_MS = Number(process.env.BETWEEN_MESSAGES_MS || 1800);

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

/** Shows typing, waits like a human, then sends the message. */
export async function sendText(psid, text, quickReplies = [], delayMs = REPLY_DELAY_MS) {
  await sendTypingOn(psid);
  await sleep(delayMs);
  await sendTextImmediate(psid, text, quickReplies);
  await sendTypingOff(psid);
}

/** First bubble waits ~7s; following bubbles use a shorter pause. */
export async function sendTexts(psid, texts, lastQuickReplies = []) {
  for (let i = 0; i < texts.length; i += 1) {
    const isLast = i === texts.length - 1;
    const delayMs = i === 0 ? REPLY_DELAY_MS : BETWEEN_MESSAGES_MS;
    await sendText(psid, texts[i], isLast ? lastQuickReplies : [], delayMs);
  }
}
