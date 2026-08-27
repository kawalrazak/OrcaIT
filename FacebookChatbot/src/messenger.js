const GRAPH_URL = "https://graph.facebook.com/v21.0/me/messages";

export async function sendText(psid, text, quickReplies = []) {
  const pageToken = process.env.FACEBOOK_PAGE_ACCESS_TOKEN;
  if (!pageToken) {
    console.error("[facebook] FACEBOOK_PAGE_ACCESS_TOKEN is not set");
    return;
  }

  const message = { text };
  if (quickReplies.length) {
    message.quick_replies = quickReplies.map((title) => ({
      content_type: "text",
      title,
      payload: title,
    }));
  }

  const response = await fetch(`${GRAPH_URL}?access_token=${encodeURIComponent(pageToken)}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      recipient: { id: psid },
      messaging_type: "RESPONSE",
      message,
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    console.error("[facebook] send failed:", response.status, body);
  }
}

export async function sendTexts(psid, texts, lastQuickReplies = []) {
  for (let i = 0; i < texts.length; i += 1) {
    const isLast = i === texts.length - 1;
    await sendText(psid, texts[i], isLast ? lastQuickReplies : []);
  }
}
