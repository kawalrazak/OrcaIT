"use client";

import Image from "next/image";
import Link from "next/link";
import { MessageCircle, Send, X } from "lucide-react";
import { type FormEvent, useEffect, useRef, useState } from "react";
import { ORCA_EMAIL, ORCA_PHONE_DISPLAY, ORCA_PHONE_TEL } from "@/data/contact";

type Message = {
  from: "bot" | "user";
  text: string;
};

type Lead = {
  supportFor: string;
  existingCustomer: string;
  name: string;
  phone: string;
  email: string;
  suburb: string;
  issue: string;
  preferredContactTime: string;
  website: string;
};

type LeadField = Exclude<keyof Lead, "website">;

const emptyLead: Lead = {
  supportFor: "",
  existingCustomer: "",
  name: "",
  phone: "",
  email: "",
  suburb: "",
  issue: "",
  preferredContactTime: "",
  website: "",
};

const bookingQuestions: Array<{
  field: LeadField;
  prompt: string;
  placeholder: string;
  inputMode?: "email" | "tel" | "text";
}> = [
  {
    field: "existingCustomer",
    prompt: "Have you used Orca IT before?",
    placeholder: "Please answer yes or no",
  },
  {
    field: "phone",
    prompt: "Could I please have your phone number? Either mobile or landline.",
    placeholder: "Enter your phone number",
    inputMode: "tel",
  },
  {
    field: "name",
    prompt: "What is your full name?",
    placeholder: "Enter your full name",
  },
  {
    field: "supportFor",
    prompt: "Is this booking for your home or your business?",
    placeholder: "Please answer home or business",
  },
  {
    field: "email",
    prompt: "What is your email address?",
    placeholder: "Enter your email address",
    inputMode: "email",
  },
  {
    field: "suburb",
    prompt: "Which suburb are you located in?",
    placeholder: "Enter your suburb",
  },
  {
    field: "issue",
    prompt: "Please briefly describe the technology problem or service you need.",
    placeholder: "Tell us how we can help",
  },
  {
    field: "preferredContactTime",
    prompt: "What is the best day or time for our team to contact you?",
    placeholder: "For example: weekdays after 3pm",
  },
];

const quickQuestions = [
  "Book an appointment",
  "What services do you offer?",
  "How much will it cost?",
  "Can I speak to someone?",
];

const pricingPattern =
  /\b(price|prices|pricing|cost|costs|quote|quotes|charge|charges|how much|fee|fees|expensive|afford|rate|rates)\b/i;
const repairPattern =
  /\b(repair|repairs|fix|fixed|fixing|look at|sort out|help with|work on|troubleshoot|diagnose)\b/i;
const capabilityPattern =
  /\b(will you|can you|do you|would you|are you able|can u|will u|do u guys|can you guys|will you guys|do you guys)\b/i;
const servicesPattern =
  /\b(what services|what do you offer|what can you do|services do you|what do you do)\b/i;
const contactPattern =
  /\b(call|phone|email|contact|speak to|talk to|ring)\b/i;
const devicePattern = /\b(pc|computer|desktop|laptop|mac|imac|notebook)\b/i;
const noPowerPattern =
  /\b(not turning on|won't turn on|wont turn on|doesn't turn on|doesnt turn on|won't start|wont start|doesn't start|doesnt start|no power|dead|not powering|power off)\b/i;

type ReplyTopic =
  | "greeting"
  | "thanks"
  | "pricing"
  | "repair_pricing"
  | "capability"
  | "repair"
  | "services"
  | "contact"
  | "pc_no_power"
  | "virus"
  | "network"
  | "printer"
  | "email"
  | "slow_pc"
  | "device"
  | "general";

function detectIssueTopic(message: string): ReplyTopic | null {
  const text = message.toLowerCase();

  if (noPowerPattern.test(text) && devicePattern.test(text)) return "pc_no_power";
  if (noPowerPattern.test(text)) return "pc_no_power";
  if (/\b(virus|malware|hacked|ransomware|spyware)\b/.test(text)) return "virus";
  if (/\b(wifi|wi-fi|internet|network|router|broadband)\b/.test(text)) return "network";
  if (/\b(printer|printing)\b/.test(text)) return "printer";
  if (/\b(email|outlook|gmail)\b/.test(text)) return "email";
  if (/\b(slow|freezing|frozen|lagging)\b/.test(text) && devicePattern.test(text)) return "slow_pc";
  if (devicePattern.test(text)) return "device";
  return null;
}

function replyForIssueTopic(
  topic: ReplyTopic,
  { asksPrice }: { asksPrice: boolean },
) {
  switch (topic) {
    case "pc_no_power":
      return asksPrice
        ? "Yes, we repair PCs and desktops that won’t turn on. We’d need to diagnose it first — remote support often starts from $99, and on-site repairs are quoted after we check the machine."
        : "Yes, we can help with that. A desktop that won’t turn on is often a power, connection, or hardware issue — our technicians can diagnose and fix it.";
    case "virus":
      return asksPrice
        ? "Yes, we remove viruses and malware. Cost depends on how infected the machine is — remote cleanup often starts from $99, and we’ll confirm before any work."
        : "Yes, we can help remove viruses and malware and get your computer running safely again.";
    case "network":
      return asksPrice
        ? "Yes, we fix Wi‑Fi and internet issues. Pricing depends on whether it’s a quick remote fix or an on-site visit — our team will quote before starting."
        : "Yes, we troubleshoot Wi‑Fi, router, and internet connection problems for homes and businesses.";
    case "printer":
      return "Yes, we help with printer setup, connection issues, and driver problems.";
    case "email":
      return "Yes, we can help with email setup and issues on Outlook, Gmail, and other accounts.";
    case "slow_pc":
      return asksPrice
        ? "Yes, we can speed up slow PCs and laptops. We’ll check what’s causing it and quote before any repair — remote tune-ups often start from $99."
        : "Yes, slow computers are something we fix all the time — often it’s storage, startup programs, or malware.";
    case "device":
      return asksPrice
        ? "Yes, we repair PCs, Macs, laptops, and desktops. The cost depends on the fault — we’ll give you a clear quote after a quick assessment."
        : "Yes, we repair PCs, Macs, laptops, and desktops for homes and businesses.";
    default:
      return null;
  }
}

function followUpVariant(topic: ReplyTopic | null) {
  if (topic === "pc_no_power" || topic === "device" || topic === "repair") {
    return "Yes, we definitely handle issues like that. Say book when you’re ready and I’ll take your details for a callback.";
  }
  return "Yes, that’s something we can help with. Say book when you’re ready and I’ll pass your details to our team.";
}

function buildBotReply(
  message: string,
  context: { lastTopic?: ReplyTopic | null; lastReply?: string | null } = {},
) {
  const text = message.toLowerCase().trim();
  const asksPrice = pricingPattern.test(text);
  const asksRepair = repairPattern.test(text);
  const asksCapability = capabilityPattern.test(text);
  const asksServices = servicesPattern.test(text) || text === "how much will it cost?";
  const asksContact = contactPattern.test(text) && !asksRepair && !asksPrice;
  const issueTopic = detectIssueTopic(message) || context.lastTopic || null;

  let replyText = "";
  let topic: ReplyTopic = issueTopic || "general";

  if (/^(hi|hello|hey|good morning|good afternoon|good evening)\b/.test(text) && text.length < 50) {
    return { text: "Hi! How can I help you today?", topic: "greeting" as const };
  }

  if (text.includes("thank")) {
    return { text: "You’re very welcome!", topic: "thanks" as const };
  }

  if (asksRepair && asksPrice) {
    const issueReply = issueTopic ? replyForIssueTopic(issueTopic, { asksPrice: true }) : null;
    replyText =
      issueReply ||
      "Yes, we can repair that. Pricing depends on the fault — remote support often starts from $99, and we’ll give you a clear quote before any on-site work.";
    topic = issueTopic || "repair_pricing";
  } else if (asksPrice) {
    replyText =
      "Pricing depends on the job. Remote support often starts from $99, and on-site or hardware repairs are quoted after we assess the issue.";
    topic = "pricing";
  } else if (asksCapability || /\b(will you do|can you do|do you do)\b/.test(text)) {
    if (issueTopic && !detectIssueTopic(message)) {
      replyText =
        "Yes, absolutely — we can help with that. Say book when you’re ready and I’ll pass your details to our team.";
      topic = issueTopic;
    } else {
      const issueReply = issueTopic ? replyForIssueTopic(issueTopic, { asksPrice: false }) : null;
      replyText =
        issueReply ||
        "Yes, absolutely — that’s the kind of work we do. Our team can talk through the next steps with you.";
      topic = issueTopic || "capability";
    }
  } else if (issueTopic) {
    const issueReply = replyForIssueTopic(issueTopic, { asksPrice });
    if (issueReply) {
      replyText = issueReply;
      topic = issueTopic;
    }
  } else if (asksRepair) {
    replyText =
      "Yes, we repair PCs, Macs, laptops, printers, networks, and more. Tell me what’s going wrong and I can point you in the right direction.";
    topic = "repair";
  } else if (asksServices || text.includes("what services do you offer?")) {
    replyText =
      "We help with PC and Mac repairs, internet and networking, virus removal, email, printers, data recovery, Smart TV setup, broadband, managed IT, cloud services, websites and more.";
    topic = "services";
  } else if (asksContact || text.includes("can i speak to someone?")) {
    replyText = `Call ${ORCA_PHONE_DISPLAY} or email ${ORCA_EMAIL} and our friendly team will help you.`;
    topic = "contact";
  } else {
    replyText = `Tell me a bit more about the problem, or say book and I’ll take your details for a callback. You can also call ${ORCA_PHONE_DISPLAY}.`;
    topic = context.lastTopic || "general";
  }

  if (context.lastReply && context.lastReply === replyText) {
    replyText = followUpVariant(topic);
  }

  return { text: replyText, topic };
}

function validationError(field: LeadField, value: string) {
  if (!value.trim()) return "Please enter a response so I can continue.";
  if (field === "phone" && !/^[+()\d\s-]{8,20}$/.test(value.trim())) {
    return "Please enter a valid phone number, including the area code if needed.";
  }
  if (field === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())) {
    return "Please enter a valid email address.";
  }
  return null;
}

function typingDelayMs(text: string) {
  return Math.min(2200, Math.max(850, 650 + text.length * 18));
}

function TypingIndicator() {
  return (
    <div className="flex items-start gap-3">
      <div className="grid size-10 shrink-0 place-items-center overflow-hidden rounded-full bg-brand-mist">
        <Image
          src="/orca-icon.png?v=4"
          alt="Orca IT assistant"
          width={40}
          height={40}
          className="size-full object-contain"
          unoptimized
        />
      </div>
      <div>
        <p className="mb-1 text-xs font-semibold text-slate-600">Orca IT</p>
        <div
          className="inline-flex items-center gap-1.5 rounded-2xl rounded-tl-sm bg-slate-100 px-4 py-3"
          aria-label="Orca IT is typing"
        >
          <span className="size-2 animate-bounce rounded-full bg-slate-400 [animation-delay:-0.3s]" />
          <span className="size-2 animate-bounce rounded-full bg-slate-400 [animation-delay:-0.15s]" />
          <span className="size-2 animate-bounce rounded-full bg-slate-400" />
        </div>
      </div>
    </div>
  );
}

export function OrcaChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      from: "bot",
      text: "Hi, would you like to make a booking? Or how can I help today?",
    },
  ]);
  const [bookingStep, setBookingStep] = useState<number | null>(null);
  const [lead, setLead] = useState<Lead>(emptyLead);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContextRef = useRef<{ lastTopic: ReplyTopic | null; lastReply: string | null }>({
    lastTopic: null,
    lastReply: null,
  });

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isSubmitting, isTyping]);

  useEffect(() => {
    function openChat() {
      setIsOpen(true);
    }

    window.addEventListener("orca-open-chat", openChat);
    return () => window.removeEventListener("orca-open-chat", openChat);
  }, []);

  function addMessages(...newMessages: Message[]) {
    setMessages((current) => [...current, ...newMessages]);
  }

  async function replyAsBot(...texts: string[]) {
    for (let i = 0; i < texts.length; i += 1) {
      setIsTyping(true);
      await new Promise((resolve) => {
        window.setTimeout(resolve, typingDelayMs(texts[i]));
      });
      setIsTyping(false);
      addMessages({ from: "bot", text: texts[i] });
      if (i < texts.length - 1) {
        await new Promise((resolve) => {
          window.setTimeout(resolve, 280);
        });
      }
    }
  }

  async function startBooking() {
    setLead(emptyLead);
    setBookingStep(0);
    addMessages({ from: "user", text: "I would like to book an appointment." });
    await replyAsBot(
      "I can help you book an appointment.",
      "You can fill our booking form now, or answer a few quick questions here.",
      bookingQuestions[0].prompt,
    );
  }

  async function replyWithContext(message: string) {
    const result = buildBotReply(message, chatContextRef.current);
    chatContextRef.current = { lastTopic: result.topic, lastReply: result.text };
    await replyAsBot(result.text);
  }

  async function selectQuickQuestion(question: string) {
    if (isTyping || isSubmitting) return;

    if (question === "Book an appointment") {
      await startBooking();
      return;
    }

    addMessages({ from: "user", text: question });
    await replyWithContext(question);
  }

  async function saveLead(completedLead: Lead) {
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/chat-leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(completedLead),
      });
      const result = (await response.json()) as { error?: string };

      if (!response.ok) throw new Error(result.error);

      await replyAsBot(
        `Thank you, ${completedLead.name}. Your details have been saved and the Orca IT team will contact you on ${completedLead.phone}.`,
      );
      setBookingStep(null);
    } catch (error) {
      await replyAsBot(
        error instanceof Error && error.message
          ? error.message
          : `I couldn’t save your details. Please call ${ORCA_PHONE_DISPLAY}.`,
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  async function answerBookingQuestion(answer: string) {
    if (bookingStep === null || isTyping || isSubmitting) return;

    const question = bookingQuestions[bookingStep];
    const error = validationError(question.field, answer);

    if (error) {
      addMessages({ from: "user", text: answer });
      await replyAsBot(error);
      return;
    }

    const updatedLead = { ...lead, [question.field]: answer };
    setLead(updatedLead);
    addMessages({ from: "user", text: answer });

    const nextStep = bookingStep + 1;
    if (nextStep < bookingQuestions.length) {
      setBookingStep(nextStep);
      await replyAsBot(bookingQuestions[nextStep].prompt);
    } else {
      await saveLead(updatedLead);
    }
  }

  async function submitMessage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const answer = message.trim();
    if (!answer || isSubmitting || isTyping) return;
    setMessage("");

    if (bookingStep !== null) {
      await answerBookingQuestion(answer);
      return;
    }

    if (answer.toLowerCase().includes("book") || answer.toLowerCase().includes("appointment")) {
      await startBooking();
      return;
    }

    addMessages({ from: "user", text: answer });
    await replyWithContext(answer);
  }

  const currentQuestion = bookingStep === null ? null : bookingQuestions[bookingStep];

  return (
    <div className="fixed bottom-5 right-5 z-50 sm:bottom-7 sm:right-7">
      {isOpen ? (
        <section
          role="dialog"
          aria-label="Orca IT help chatbot"
          className="flex h-[min(660px,calc(100vh-3rem))] w-[calc(100vw-2.5rem)] max-w-md flex-col overflow-hidden rounded-2xl border border-blue-100 bg-white shadow-[0_24px_70px_-20px_rgba(6,69,143,0.55)]"
        >
          <div className="flex min-h-20 items-center bg-brand-blue px-5 text-white">
            <p className="flex-1 text-xl font-black">Orca IT</p>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="grid size-10 place-items-center rounded-full hover:bg-white/15"
              aria-label="Close chatbot"
            >
              <X className="size-7" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto bg-white px-5 py-6">
            <div className="space-y-5">
              {messages.map((item, index) =>
                item.from === "user" ? (
                  <div
                    key={`${item.text}-${index}`}
                    className="ml-auto max-w-[82%] rounded-2xl rounded-br-sm bg-brand-blue px-5 py-3 text-base leading-7 text-white"
                  >
                    {item.text}
                  </div>
                ) : (
                  <div key={`${item.text}-${index}`} className="flex items-start gap-3">
                    <div className="grid size-10 shrink-0 place-items-center overflow-hidden rounded-full bg-brand-mist">
                      <Image
                        src="/orca-icon.png?v=4"
                        alt="Orca IT assistant"
                        width={40}
                        height={40}
                        className="size-full object-contain"
                        unoptimized
                      />
                    </div>
                    <div>
                      <p className="mb-1 text-xs font-semibold text-slate-600">Orca IT</p>
                      <div className="max-w-xs rounded-2xl rounded-tl-sm bg-slate-100 px-5 py-3 text-base leading-7 text-slate-800">
                        {item.text}
                      </div>
                    </div>
                  </div>
                ),
              )}
              {isTyping ? <TypingIndicator /> : null}
              {isSubmitting && !isTyping ? (
                <div className="pl-13 text-sm font-semibold text-slate-500">
                  Saving your booking details…
                </div>
              ) : null}
              <div ref={messagesEndRef} />
            </div>

            {(bookingStep === 0 || bookingStep === 3) && !isTyping && (
              <div className="ml-13 mt-4 flex flex-wrap gap-2">
                {(bookingStep === 0 ? ["Yes", "No"] : ["Home", "Business"]).map((answer) => (
                  <button
                    key={answer}
                    type="button"
                    onClick={() => void answerBookingQuestion(answer)}
                    disabled={isTyping || isSubmitting}
                    className="rounded-full bg-brand-blue px-5 py-2 font-bold text-white hover:bg-brand-ink disabled:opacity-50"
                  >
                    {answer}
                  </button>
                ))}
                {bookingStep === 0 ? (
                  <Link
                    href="/book"
                    className="rounded-full bg-[#31c4e8] px-5 py-2 font-bold text-white hover:bg-[#1fb5db]"
                  >
                    Fill booking form
                  </Link>
                ) : null}
              </div>
            )}

            {bookingStep === null && !isSubmitting && !isTyping && (
              <div className="mt-6 flex flex-wrap gap-2">
                {quickQuestions.map((question) => (
                  <button
                    key={question}
                    type="button"
                    onClick={() => void selectQuickQuestion(question)}
                    className="rounded-full border border-blue-200 px-3 py-2 text-xs font-bold text-brand-blue hover:bg-brand-mist"
                  >
                    {question}
                  </button>
                ))}
              </div>
            )}
          </div>

          <form onSubmit={submitMessage} className="border-t border-slate-200 bg-white p-4">
            <div className="flex items-center gap-2">
              <input
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                placeholder={currentQuestion?.placeholder ?? "Type your message..."}
                inputMode={currentQuestion?.inputMode}
                disabled={isSubmitting || isTyping}
                aria-label="Chat message"
                className="min-w-0 flex-1 rounded-full border-2 border-blue-300 px-5 py-3 text-base text-slate-800 outline-none placeholder:text-slate-400 focus:border-brand-blue disabled:bg-slate-100"
              />
              <button
                type="submit"
                disabled={isSubmitting || isTyping}
                className="grid size-13 shrink-0 place-items-center rounded-full bg-brand-blue text-white hover:bg-brand-ink disabled:opacity-50"
                aria-label="Send message"
              >
                <Send className="size-6" />
              </button>
            </div>
            <p className="mt-2 text-center text-xs text-slate-500">
              By submitting, you agree that Orca IT may contact you about this request. Call{" "}
              <a href={`tel:${ORCA_PHONE_TEL}`} className="font-bold text-brand-blue">
                {ORCA_PHONE_DISPLAY}
              </a>
            </p>
          </form>
        </section>
      ) : (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          aria-label="Open Orca IT chatbot"
          className="flex items-center gap-3 rounded-full border-4 border-white bg-brand-fun py-2.5 pl-2.5 pr-6 text-white shadow-[0_14px_35px_-10px_rgba(244,44,28,0.7)] transition hover:scale-105 hover:bg-red-600"
        >
          <span className="grid size-11 place-items-center rounded-full bg-white/15">
            <MessageCircle className="size-7" />
          </span>
          <span className="text-base font-black">Chat with us</span>
        </button>
      )}
    </div>
  );
}
