import crypto from "node:crypto";
import express from "express";
import dotenv from "dotenv";
import {
  bookingAcknowledgement,
  bookingCompleteMessage,
  bookingIntro,
  bookingIntroFollowUp,
  bookingQuestions,
  emptyLead,
  existingBookingReply,
  followUpChoicePrompt,
  followUpQuickReplies,
  generalReply,
  isAskingAboutAppointment,
  isExistingBookingChoice,
  isNewBookingChoice,
  isQuickQuestion,
  normaliseField,
  quickQuestions,
  returningUserGreeting,
  returningUserPrompt,
  validationError,
  wantsBooking,
  welcomeFollowUp,
  welcomeGreeting,
  ORCA_PHONE_DISPLAY,
} from "./conversation.js";
import { sendText, sendTexts } from "./messenger.js";
import { saveLead } from "./save-lead.js";
import { getSavedBooking, saveUserBooking } from "./user-bookings.js";

dotenv.config();

const app = express();
const sessions = new Map();
const SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 30;

app.use(
  express.json({
    verify: (req, _res, buf) => {
      req.rawBody = buf;
    },
  }),
);

async function ensureSession(psid) {
  const existing = sessions.get(psid);
  if (existing && Date.now() - existing.updatedAt < SESSION_TTL_MS) {
    existing.updatedAt = Date.now();
    if (!existing.lastCompletedLead) {
      existing.lastCompletedLead = await getSavedBooking(psid);
    }
    return existing;
  }

  const persistedLead = await getSavedBooking(psid);
  const session = {
    bookingStep: null,
    lead: { ...emptyLead },
    greeted: false,
    lastCompletedLead: persistedLead,
    followUpStep: null,
    updatedAt: Date.now(),
  };
  sessions.set(psid, session);
  return session;
}

function signatureIsValid(req) {
  const secret = (process.env.FACEBOOK_APP_SECRET || "").trim();
  if (!secret) return true;

  const header = req.get("X-Hub-Signature-256");
  if (!header?.startsWith("sha256=")) {
    console.error("[facebook] missing X-Hub-Signature-256");
    return false;
  }

  if (!req.rawBody || !Buffer.isBuffer(req.rawBody)) {
    console.error("[facebook] raw body missing for signature check");
    return false;
  }

  const expected = crypto.createHmac("sha256", secret).update(req.rawBody).digest("hex");
  const provided = header.slice("sha256=".length).trim();

  try {
    const expectedBuf = Buffer.from(expected, "utf8");
    const providedBuf = Buffer.from(provided, "utf8");
    if (expectedBuf.length !== providedBuf.length) return false;
    return crypto.timingSafeEqual(expectedBuf, providedBuf);
  } catch {
    return false;
  }
}

async function startBooking(psid, session) {
  session.lead = { ...emptyLead };
  session.bookingStep = 0;
  session.followUpStep = null;
  const first = bookingQuestions[0];
  await sendTexts(
    psid,
    [bookingIntro(), bookingIntroFollowUp(), first.prompt],
    first.quickReplies || [],
  );
}

async function handleFollowUpChoice(psid, session, answer) {
  if (isExistingBookingChoice(answer) || isAskingAboutAppointment(answer)) {
    await sendText(psid, existingBookingReply(session.lastCompletedLead), followUpQuickReplies);
    session.followUpStep = "done";
    return;
  }

  if (isNewBookingChoice(answer)) {
    await startBooking(psid, session);
    return;
  }

  await sendText(
    psid,
    'Please choose "Recent booking" for an update on your appointment, or "New booking" to start again.',
    followUpQuickReplies,
  );
}

async function handleReturningUser(psid, session, answer) {
  const lead = session.lastCompletedLead;
  if (!lead || session.bookingStep !== null) return false;

  if (session.followUpStep === "awaiting_choice") {
    await handleFollowUpChoice(psid, session, answer);
    return true;
  }

  if (isNewBookingChoice(answer) && answer !== "Recent booking") {
    await startBooking(psid, session);
    return true;
  }

  if (isExistingBookingChoice(answer) || isAskingAboutAppointment(answer)) {
    await sendText(psid, existingBookingReply(lead), followUpQuickReplies);
    session.followUpStep = "done";
    return true;
  }

  if (/^(hi|hello|hey|good morning|good afternoon|good evening)\b/i.test(answer)) {
    await sendTexts(
      psid,
      [returningUserGreeting(lead), existingBookingReply(lead), returningUserPrompt(lead)],
      followUpQuickReplies,
    );
    session.followUpStep = "awaiting_choice";
    session.greeted = true;
    return true;
  }

  if (answer.toLowerCase().includes("thank")) {
    await sendTexts(
      psid,
      [
        "You’re very welcome!",
        existingBookingReply(lead),
        "Reply Recent booking if you need anything else about that appointment.",
      ],
      followUpQuickReplies,
    );
    session.followUpStep = "awaiting_choice";
    return true;
  }

  if (isQuickQuestion(answer)) {
    await sendTexts(
      psid,
      [generalReply(answer), returningUserPrompt(lead)],
      followUpQuickReplies,
    );
    session.followUpStep = "awaiting_choice";
    return true;
  }

  await sendTexts(psid, [followUpChoicePrompt(lead)], followUpQuickReplies);
  session.followUpStep = "awaiting_choice";
  return true;
}

async function replyToGeneral(psid, answer) {
  if (answer === "Book an appointment") {
    await startBooking(psid, ensureSession(psid));
    return;
  }

  await sendTexts(psid, [generalReply(answer)], quickQuestions);
}

async function handleMessage(psid, text) {
  const session = await ensureSession(psid);
  const answer = text.trim();
  if (!answer) return;

  if (session.bookingStep !== null) {
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
      const ack = bookingAcknowledgement(question.field, session.lead[question.field]);
      await sendTexts(psid, [ack, next.prompt], next.quickReplies || []);
      return;
    }

    try {
      await saveLead(session.lead);
      const completedLead = { ...session.lead };
      session.lastCompletedLead = completedLead;
      session.followUpStep = null;
      await saveUserBooking(psid, completedLead);
      await sendText(psid, bookingCompleteMessage(completedLead));
    } catch (error) {
      console.error("[facebook] save lead failed:", error);
      await sendText(
        psid,
        `I couldn’t save your details. Please call ${ORCA_PHONE_DISPLAY} and we’ll help you book.`,
      );
    }

    session.bookingStep = null;
    session.lead = { ...emptyLead };
    return;
  }

  if (await handleReturningUser(psid, session, answer)) {
    return;
  }

  if (!session.greeted) {
    session.greeted = true;
    if (!wantsBooking(answer) && !isQuickQuestion(answer)) {
      await sendTexts(
        psid,
        [welcomeGreeting(), welcomeFollowUp(), generalReply(answer)],
        quickQuestions,
      );
      return;
    }
  }

  if (wantsBooking(answer) || answer === "Book an appointment") {
    await startBooking(psid, session);
    return;
  }

  if (isQuickQuestion(answer)) {
    await replyToGeneral(psid, answer);
    return;
  }

  await sendTexts(
    psid,
    [generalReply(answer), "If you’d like, I can help you book an appointment — just say book."],
    quickQuestions,
  );
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
  if (body.object !== "page") return;

  const allowedPageId = process.env.FACEBOOK_PAGE_ID || "1208194479052501";

  for (const entry of body.entry || []) {
    if (String(entry.id) !== String(allowedPageId)) continue;

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
