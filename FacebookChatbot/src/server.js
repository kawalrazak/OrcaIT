import crypto from "node:crypto";
import express from "express";
import dotenv from "dotenv";
import {
  bookingQuestions,
  emptyLead,
  generalReply,
  normaliseField,
  validationError,
  wantsBooking,
  ORCA_PHONE_DISPLAY,
} from "./conversation.js";
import { sendText, sendTexts } from "./messenger.js";
import { saveLead } from "./save-lead.js";

dotenv.config();

const app = express();
const sessions = new Map();
const SESSION_TTL_MS = 1000 * 60 * 60 * 6;

app.use(
  express.json({
    verify: (req, _res, buf) => {
      req.rawBody = buf;
    },
  }),
);

function getSession(psid) {
  const existing = sessions.get(psid);
  if (existing && Date.now() - existing.updatedAt < SESSION_TTL_MS) {
    existing.updatedAt = Date.now();
    return existing;
  }

  const session = {
    bookingStep: null,
    lead: { ...emptyLead },
    updatedAt: Date.now(),
  };
  sessions.set(psid, session);
  return session;
}

function signatureIsValid(req) {
  const secret = process.env.FACEBOOK_APP_SECRET;
  if (!secret) return true;

  const header = req.get("X-Hub-Signature-256");
  if (!header?.startsWith("sha256=")) return false;

  const expected = crypto.createHmac("sha256", secret).update(req.rawBody).digest("hex");
  const provided = header.slice("sha256=".length);

  try {
    return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(provided));
  } catch {
    return false;
  }
}

async function startBooking(psid, session) {
  session.lead = { ...emptyLead };
  session.bookingStep = 0;
  const first = bookingQuestions[0];
  await sendTexts(
    psid,
    [
      "Hi, I can help you book an appointment with Orca IT.",
      "I’ll ask a few quick questions, then our team will contact you.",
      first.prompt,
    ],
    first.quickReplies || [],
  );
}

async function handleMessage(psid, text) {
  const session = getSession(psid);
  const answer = text.trim();
  if (!answer) return;

  if (session.bookingStep === null) {
    if (wantsBooking(answer)) {
      await startBooking(psid, session);
      return;
    }

    await sendTexts(
      psid,
      [generalReply(answer), "Would you like to book an appointment? Reply Book to start."],
      ["Book an appointment"],
    );
    return;
  }

  const question = bookingQuestions[session.bookingStep];
  const error = validationError(question.field, answer);
  if (error) {
    await sendText(psid, error, question.quickReplies || []);
    return;
  }

  session.lead[question.field] = normaliseField(question.field, answer);
  const nextStep = session.bookingStep + 1;

  if (nextStep < bookingQuestions.length) {
    session.bookingStep = nextStep;
    const next = bookingQuestions[nextStep];
    await sendText(psid, next.prompt, next.quickReplies || []);
    return;
  }

  try {
    await saveLead(session.lead);
    await sendText(
      psid,
      `Thank you, ${session.lead.name}. Your details have been saved and the Orca IT team will contact you on ${session.lead.phone}.`,
    );
  } catch (error) {
    console.error("[facebook] save lead failed:", error);
    await sendText(
      psid,
      `I couldn’t save your details. Please call ${ORCA_PHONE_DISPLAY} and we’ll help you book.`,
    );
  }

  session.bookingStep = null;
  session.lead = { ...emptyLead };
}

app.get("/health", (_req, res) => {
  res.json({
    ok: true,
    service: "facebook-chatbot",
    pageId: process.env.FACEBOOK_PAGE_ID || "1208194479052501",
    pageName: process.env.FACEBOOK_PAGE_NAME || "Orcait",
    hasPageToken: Boolean(process.env.FACEBOOK_PAGE_ACCESS_TOKEN),
  });
});

app.get("/webhook", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode === "subscribe" && token && token === process.env.FACEBOOK_VERIFY_TOKEN) {
    return res.status(200).send(challenge);
  }

  return res.sendStatus(403);
});

app.post("/webhook", async (req, res) => {
  if (!signatureIsValid(req)) {
    console.error("[facebook] webhook signature invalid — check FACEBOOK_APP_SECRET");
    return res.sendStatus(403);
  }

  res.sendStatus(200);

  const body = req.body;
  console.log("[facebook] webhook POST", JSON.stringify({
    object: body?.object,
    entries: (body?.entry || []).map((entry) => ({
      id: entry.id,
      messagingCount: (entry.messaging || []).length,
      texts: (entry.messaging || []).map((event) => ({
        sender: event.sender?.id,
        text: event.message?.text || event.postback?.payload || null,
        isEcho: Boolean(event.message?.is_echo),
      })),
    })),
  }));

  if (body.object !== "page") return;

  const allowedPageId = process.env.FACEBOOK_PAGE_ID || "1208194479052501";

  for (const entry of body.entry || []) {
    if (String(entry.id) !== String(allowedPageId)) {
      console.warn("[facebook] ignored event for other page:", entry.id);
      continue;
    }

    for (const event of entry.messaging || []) {
      const psid = event.sender?.id;
      const text = event.message?.text || event.postback?.payload;
      if (!psid || !text || event.message?.is_echo) continue;

      try {
        await handleMessage(psid, text);
      } catch (error) {
        console.error("[facebook] message handler failed:", error);
      }
    }
  }
});

const port = Number(process.env.PORT || 3002);
app.listen(port, "0.0.0.0", () => {
  const pageId = process.env.FACEBOOK_PAGE_ID || "1208194479052501";
  console.log(`Orca IT Facebook chatbot listening on http://0.0.0.0:${port}`);
  console.log(`Connected Page: Orcait (${pageId})`);
});
