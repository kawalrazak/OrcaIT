export const ORCA_PHONE_DISPLAY = "0498 082 750";
export const ORCA_EMAIL = "info@orcait.com.au";
export const ORCA_BOOK_URL = "https://orcait.com.au/book";

// Same booking flow as OrcaITWeb/src/components/orca-chatbot.tsx
export const bookingQuestions = [
  {
    field: "existingCustomer",
    prompt: "Have you used Orca IT before?",
    quickReplies: ["Yes", "No"],
  },
  {
    field: "phone",
    prompt: "Could I please have your phone number? Either mobile or landline.",
  },
  {
    field: "name",
    prompt: "What is your full name?",
  },
  {
    field: "supportFor",
    prompt: "Is this booking for your home or your business?",
    quickReplies: ["Home", "Business"],
  },
  {
    field: "email",
    prompt: "What is your email address?",
  },
  {
    field: "suburb",
    prompt: "Which suburb are you located in?",
  },
  {
    field: "issue",
    prompt: "Please briefly describe the technology problem or service you need.",
  },
  {
    field: "preferredContactTime",
    prompt: "What is the best day or time for our team to contact you?",
  },
];

export const quickQuestions = [
  "Book an appointment",
  "What services do you offer?",
  "How much will it cost?",
  "Can I speak to someone?",
];

export const emptyLead = {
  supportFor: "",
  existingCustomer: "",
  name: "",
  phone: "",
  email: "",
  suburb: "",
  issue: "",
  preferredContactTime: "",
};

function pickOne(items) {
  return items[Math.floor(Math.random() * items.length)];
}

export function welcomeGreeting() {
  return pickOne([
    "Hi there! Thanks for messaging Orca IT.",
    "Hello! Good to hear from you.",
    "Hi! Thanks for getting in touch with Orca IT.",
  ]);
}

export function welcomeFollowUp() {
  return pickOne([
    "Would you like to book an appointment, or is there something I can help with?",
    "Are you looking to book a visit, or do you have a quick question?",
    "Happy to help — would you like to make a booking today?",
  ]);
}

export function bookingIntro() {
  return pickOne([
    "Absolutely — I can help you book that in.",
    "Sure thing, I’ll help you get booked in.",
    "No problem at all — let’s get your appointment sorted.",
  ]);
}

export function bookingIntroFollowUp() {
  return pickOne([
    "I’ll just ask a few quick questions so our team knows how to help.",
    "Just a few short questions and we’ll pass this to the team.",
    "It’ll only take a minute — a few quick details and we’re done.",
  ]);
}

export function bookingCompleteMessage(lead) {
  const firstName = lead.name?.trim().split(/\s+/)[0] || "there";
  return pickOne([
    `All done, ${firstName} — thanks for your patience. Our team will give you a call on ${lead.phone} soon.`,
    `Perfect, ${firstName}. Everything’s saved and someone from Orca IT will contact you on ${lead.phone}.`,
    `Thanks ${firstName}! We’ve got your details and the team will be in touch on ${lead.phone} shortly.`,
  ]);
}

export function bookingAcknowledgement(field, value) {
  const firstName = value.trim().split(/\s+/)[0];
  switch (field) {
    case "existingCustomer":
      return value === "Yes" ? "Welcome back — good to have you again." : "No worries at all.";
    case "phone":
      return "Thanks, I’ve got that number.";
    case "name":
      return firstName ? `Lovely to meet you, ${firstName}.` : "Thanks for that.";
    case "supportFor":
      return value === "Home" ? "Got it — this is for home." : "Got it — this is for your business.";
    case "email":
      return "Perfect, email noted.";
    case "suburb":
      return `${value} — thanks.`;
    case "issue":
      return "Thanks for explaining — that helps a lot.";
    case "preferredContactTime":
      return "Great, I’ve noted when suits you best.";
    default:
      return pickOne(["Thanks!", "Got it, thanks.", "Perfect, thank you."]);
  }
}

export function generalReply(message) {
  const text = message.toLowerCase();

  if (/^(hi|hello|hey|good morning|good afternoon|good evening)\b/.test(text)) {
    return pickOne([
      "Hi! How can I help you today?",
      "Hello there — what can I help you with?",
      "Hey! Happy to help — what do you need?",
    ]);
  }

  if (text.includes("thank")) {
    return pickOne([
      "You’re very welcome!",
      "Happy to help!",
      "Any time — glad I could help.",
    ]);
  }

  if (text.includes("price") || text.includes("cost") || text.includes("quote")) {
    return "Pricing really depends on the job, but once you book in our team can talk you through the options clearly.";
  }

  if (
    text.includes("call") ||
    text.includes("phone") ||
    text.includes("email") ||
    text.includes("contact") ||
    text.includes("speak")
  ) {
    return `Of course — you can call us on ${ORCA_PHONE_DISPLAY} or email ${ORCA_EMAIL} and someone friendly will help you out.`;
  }

  if (
    text.includes("service") ||
    text.includes("repair") ||
    text.includes("computer") ||
    text.includes("support")
  ) {
    return "We look after things like PC and Mac repairs, internet and networking, virus removal, email, printers, data recovery, Smart TV setup, broadband, managed IT, cloud, websites and more.";
  }

  return `Happy to help. You can book here, call ${ORCA_PHONE_DISPLAY}, or email ${ORCA_EMAIL}.`;
}

export function wantsBooking(message) {
  const text = message.toLowerCase();
  return (
    text.includes("book") ||
    text.includes("appointment") ||
    text.includes("booking") ||
    text === "yes"
  );
}

export function isQuickQuestion(message) {
  return quickQuestions.some((question) => question.toLowerCase() === message.trim().toLowerCase());
}

export function followUpChoicePrompt(lead) {
  const issue = lead.issue?.trim() || "your enquiry";
  const when = lead.preferredContactTime?.trim();
  const whenText = when ? ` (${when})` : "";
  return `Welcome back! Just checking — is this about your recent booking for "${issue}"${whenText}, or would you like to start a new one?`;
}

export const followUpQuickReplies = ["Recent booking", "New booking"];

export function isAskingAboutAppointment(message) {
  const text = message.trim().toLowerCase();

  if (wantsBooking(message) && !text.includes("my ")) {
    return false;
  }

  return (
    text.includes("my appointment") ||
    text.includes("my booking") ||
    text.includes("when will") ||
    text.includes("when are you") ||
    text.includes("when do you") ||
    text.includes("will you call") ||
    text.includes("will someone call") ||
    text.includes("appointment status") ||
    text.includes("already booked") ||
    text.includes("already submitted") ||
    text.includes("follow up") ||
    text.includes("follow-up") ||
    text.includes("recent booking") ||
    text.includes("update on") ||
    text.includes("status of") ||
    (text.includes("appointment") && (text.includes("?") || text.includes("my") || text.includes("about")))
  );
}

export function returningUserGreeting(lead) {
  const firstName = lead.name?.trim().split(/\s+/)[0] || "there";
  return pickOne([
    `Welcome back, ${firstName}!`,
    `Hi again, ${firstName}!`,
    `Good to hear from you again, ${firstName}.`,
  ]);
}

export function returningUserPrompt(lead) {
  const issue = lead.issue?.trim() || "your enquiry";
  return `I can see your booking about ${issue}. Would you like an update on that, or make a new appointment?`;
}

export function isExistingBookingChoice(message) {
  const text = message.trim().toLowerCase();
  return (
    text === "recent booking" ||
    text.includes("recent") ||
    text.includes("existing") ||
    text.includes("old booking") ||
    text.includes("same booking") ||
    text.includes("follow up") ||
    text.includes("follow-up") ||
    text === "existing appointment" ||
    text === "my booking"
  );
}

export function isNewBookingChoice(message) {
  const text = message.trim().toLowerCase();
  return (
    text === "new booking" ||
    text.includes("new appointment") ||
    text.includes("another booking") ||
    text.includes("book again") ||
    text.includes("book") ||
    text.includes("appointment")
  );
}

export function existingBookingReply(lead) {
  const name = lead.name?.trim().split(/\s+/)[0] || "there";
  const issue = lead.issue?.trim() || "your enquiry";
  const phone = lead.phone?.trim() || ORCA_PHONE_DISPLAY;
  const suburb = lead.suburb?.trim();
  const when = lead.preferredContactTime?.trim();
  const whenLine = when ? ` around ${when}` : " soon";
  const suburbLine = suburb ? ` in ${suburb}` : "";

  return `Hi ${name}, your booking is saved with us. Issue: ${issue}${suburbLine}. Our team will call you on ${phone}${whenLine}. If it’s urgent, ring ${ORCA_PHONE_DISPLAY}.`;
}

export function validationError(field, value) {
  if (!value.trim()) return "Sorry, I didn’t catch that — could you type that again for me?";
  if (field === "phone" && !/^[+()\d\s-]{8,20}$/.test(value.trim())) {
    return "That phone number doesn’t look quite right — could you include the area code?";
  }
  if (field === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())) {
    return "Hmm, that email doesn’t look right — could you double-check it?";
  }
  if (field === "existingCustomer") {
    const normalised = value.trim().toLowerCase();
    if (!["yes", "no", "y", "n"].includes(normalised)) {
      return "Just a quick yes or no is fine for that one.";
    }
  }
  if (field === "supportFor") {
    const normalised = value.trim().toLowerCase();
    if (!["home", "business"].includes(normalised)) {
      return "No worries — is this for home or business?";
    }
  }
  return null;
}

export function normaliseField(field, value) {
  const trimmed = value.trim();
  if (field === "existingCustomer") {
    const normalised = trimmed.toLowerCase();
    if (normalised === "y" || normalised === "yes") return "Yes";
    if (normalised === "n" || normalised === "no") return "No";
  }
  if (field === "supportFor") {
    const normalised = trimmed.toLowerCase();
    if (normalised === "home") return "Home";
    if (normalised === "business") return "Business";
  }
  return trimmed;
}
