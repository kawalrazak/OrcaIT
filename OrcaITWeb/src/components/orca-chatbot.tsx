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

function generalReply(message: string) {
  const text = message.toLowerCase();

  if (text.includes("price") || text.includes("cost") || text.includes("quote")) {
    return "Pricing depends on the service and work required. Complete a booking and we’ll contact you with clear next steps.";
  }

  if (
    text.includes("call") ||
    text.includes("phone") ||
    text.includes("email") ||
    text.includes("contact")
  ) {
    return `Call ${ORCA_PHONE_DISPLAY} or email ${ORCA_EMAIL} and our friendly team will help you.`;
  }

  if (
    text.includes("service") ||
    text.includes("repair") ||
    text.includes("computer") ||
    text.includes("support")
  ) {
    return "We help with PC and Mac repairs, internet and networking, virus removal, email, printers, data recovery, Smart TV setup, broadband, managed IT, cloud services, websites and more.";
  }

  return `Thanks for your message. You can make a booking here, call ${ORCA_PHONE_DISPLAY}, or email ${ORCA_EMAIL}.`;
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
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isSubmitting]);

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

  function startBooking() {
    setLead(emptyLead);
    setBookingStep(0);
    addMessages(
      { from: "user", text: "I would like to book an appointment." },
      { from: "bot", text: "I can help you book an appointment." },
      {
        from: "bot",
        text: "You can fill our booking form now, or answer a few quick questions here.",
      },
      { from: "bot", text: bookingQuestions[0].prompt },
    );
  }

  function selectQuickQuestion(question: string) {
    if (question === "Book an appointment") {
      startBooking();
      return;
    }

    addMessages(
      { from: "user", text: question },
      { from: "bot", text: generalReply(question) },
    );
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

      addMessages({
        from: "bot",
        text: `Thank you, ${completedLead.name}. Your details have been saved and the Orca IT team will contact you on ${completedLead.phone}.`,
      });
      setBookingStep(null);
    } catch (error) {
      addMessages({
        from: "bot",
        text:
          error instanceof Error && error.message
            ? error.message
            : `I couldn’t save your details. Please call ${ORCA_PHONE_DISPLAY}.`,
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  async function answerBookingQuestion(answer: string) {
    if (bookingStep === null) return;

    const question = bookingQuestions[bookingStep];
    const error = validationError(question.field, answer);

    if (error) {
      addMessages({ from: "user", text: answer }, { from: "bot", text: error });
      return;
    }

    const updatedLead = { ...lead, [question.field]: answer };
    setLead(updatedLead);
    addMessages({ from: "user", text: answer });

    const nextStep = bookingStep + 1;
    if (nextStep < bookingQuestions.length) {
      setBookingStep(nextStep);
      addMessages({ from: "bot", text: bookingQuestions[nextStep].prompt });
    } else {
      await saveLead(updatedLead);
    }
  }

  async function submitMessage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const answer = message.trim();
    if (!answer || isSubmitting) return;
    setMessage("");

    if (bookingStep !== null) {
      await answerBookingQuestion(answer);
      return;
    }

    if (answer.toLowerCase().includes("book") || answer.toLowerCase().includes("appointment")) {
      startBooking();
      return;
    }

    addMessages(
      { from: "user", text: answer },
      { from: "bot", text: generalReply(answer) },
    );
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
              {isSubmitting && (
                <div className="pl-13 text-sm font-semibold text-slate-500">
                  Saving your booking details…
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {(bookingStep === 0 || bookingStep === 3) && (
              <div className="ml-13 mt-4 flex flex-wrap gap-2">
                {(bookingStep === 0 ? ["Yes", "No"] : ["Home", "Business"]).map((answer) => (
                  <button
                    key={answer}
                    type="button"
                    onClick={() => void answerBookingQuestion(answer)}
                    className="rounded-full bg-brand-blue px-5 py-2 font-bold text-white hover:bg-brand-ink"
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

            {bookingStep === null && !isSubmitting && (
              <div className="mt-6 flex flex-wrap gap-2">
                {quickQuestions.map((question) => (
                  <button
                    key={question}
                    type="button"
                    onClick={() => selectQuickQuestion(question)}
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
                disabled={isSubmitting}
                aria-label="Chat message"
                className="min-w-0 flex-1 rounded-full border-2 border-blue-300 px-5 py-3 text-base text-slate-800 outline-none placeholder:text-slate-400 focus:border-brand-blue disabled:bg-slate-100"
              />
              <button
                type="submit"
                disabled={isSubmitting}
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
