export const ORCA_PHONE_DISPLAY = "0450 577 407";
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
    field: "visitType",
    prompt: "Do you need remote/online support, or someone to visit on-site?",
    quickReplies: ["Remote", "On-site"],
  },
  {
    field: "email",
    prompt: "What is your email address?",
  },
  {
    field: "suburb",
    prompt: "Which suburb are you located in? (needed for on-site visits)",
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
  visitType: "",
  suburb: "",
  issue: "",
  preferredContactTime: "",
};

export function isRemoteVisit(lead) {
  return String(lead?.visitType || "")
    .trim()
    .toLowerCase()
    .startsWith("remote");
}

/** Next question index after answering currentIndex — skips suburb for remote jobs. */
export function nextBookingStep(currentIndex, lead) {
  let next = currentIndex + 1;
  while (next < bookingQuestions.length) {
    const field = bookingQuestions[next].field;
    if (field === "suburb" && isRemoteVisit(lead)) {
      next += 1;
      continue;
    }
    return next;
  }
  return next;
}

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
    case "visitType":
      return value === "Remote" || value.toLowerCase().startsWith("remote")
        ? "Perfect — remote support, so we won’t need your address."
        : "Got it — on-site visit. I’ll need your suburb next.";
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

export function detectIssueTopic(message) {
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

function followUpVariant(topic, message) {
  const text = message.toLowerCase();

  if (pricingPattern.test(text) || capabilityPattern.test(text)) {
    return pickOne([
      "Yes — we can help with that. Pricing depends on the fault, but our team will give you a clear quote before any work starts. Say book when you’re ready.",
      "Absolutely, that’s something we handle. We’ll talk you through cost once we know what’s wrong — say book and I’ll pass your details to the team.",
    ]);
  }

  switch (topic) {
    case "pc_no_power":
      return "Yes, we definitely repair desktops and PCs that won’t turn on. Say book and I’ll grab your details for a callback.";
    case "device":
    case "repair":
      return "Yes, we can take a look at that for you. Say book when you’d like our team to call you back.";
    default:
      return pickOne([
        "Sorry if I wasn’t clear — yes, we can help. Say book and I’ll take a few details for our team.",
        "Yes, that’s the kind of thing we help with every day. Say book when you’re ready.",
      ]);
  }
}

function replyForIssueTopic(topic, { asksPrice, asksRepair }) {
  switch (topic) {
    case "pc_no_power":
      if (asksPrice) {
        return "Yes, we repair PCs and desktops that won’t turn on. We’d need to diagnose it first — remote support often starts from $99, and on-site repairs are quoted after we check the machine.";
      }
      return "Yes, we can help with that. A desktop that won’t turn on is often a power, connection, or hardware issue — our technicians can diagnose and fix it.";
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
      if (asksPrice) {
        return "Yes, we repair PCs, Macs, laptops, and desktops. The cost depends on the fault — we’ll give you a clear quote after a quick assessment.";
      }
      return "Yes, we repair PCs, Macs, laptops, and desktops for homes and businesses.";
    default:
      return null;
  }
}

export function buildBotReply(message, context = {}) {
  const text = message.toLowerCase().trim();
  const asksPrice = pricingPattern.test(text);
  const asksRepair = repairPattern.test(text);
  const asksCapability = capabilityPattern.test(text);
  const asksServices = servicesPattern.test(text) || text === "what services do you offer?";
  const asksContact = contactPattern.test(text) && !asksRepair && !asksPrice;
  const issueTopic = detectIssueTopic(message) || context.lastTopic || null;

  let replyText = "";
  let topic = issueTopic || "general";
  let suggestBooking = true;

  if (/^(hi|hello|hey|good morning|good afternoon|good evening)\b/.test(text) && text.length < 50) {
    return {
      text: pickOne([
        "Hi! How can I help you today?",
        "Hello there — what can I help you with?",
        "Hey! Happy to help — what do you need?",
      ]),
      topic: "greeting",
      suggestBooking: true,
    };
  }

  if (text.includes("thank")) {
    return {
      text: pickOne([
        "You’re very welcome!",
        "Happy to help!",
        "Any time — glad I could help.",
      ]),
      topic: "thanks",
      suggestBooking: false,
    };
  }

  if (asksRepair && asksPrice) {
    const issueReply = issueTopic ? replyForIssueTopic(issueTopic, { asksPrice: true, asksRepair: true }) : null;
    replyText =
      issueReply ||
      "Yes, we can repair that. Pricing depends on the fault — remote support often starts from $99, and we’ll give you a clear quote before any on-site work.";
    topic = issueTopic || "repair_pricing";
  } else if (asksPrice) {
    replyText =
      "Pricing depends on the job. Remote support often starts from $99, and on-site or hardware repairs are quoted after we assess the issue — there’s no surprise charge without your okay.";
    topic = "pricing";
  } else if (asksCapability || /\b(will you do|can you do|do you do)\b/.test(text)) {
    if (issueTopic && !detectIssueTopic(message)) {
      replyText = pickOne([
        "Yes, absolutely — we can help with that. Say book when you’re ready and I’ll pass your details to our team.",
        "Yes, that’s exactly the kind of thing we fix. Say book and I’ll arrange a callback for you.",
      ]);
      topic = issueTopic;
    } else {
      const issueReply = issueTopic ? replyForIssueTopic(issueTopic, { asksPrice: false, asksRepair: true }) : null;
      replyText =
        issueReply ||
        pickOne([
          "Yes, absolutely — that’s the kind of work we do. Our team can talk through the next steps with you.",
          "Yes, we can help with that. Our technicians handle PC and Mac issues like this regularly.",
        ]);
      topic = issueTopic || "capability";
    }
  } else if (issueTopic) {
    const issueReply = replyForIssueTopic(issueTopic, { asksPrice, asksRepair });
    if (issueReply) {
      replyText = issueReply;
      topic = issueTopic;
    }
  } else if (asksRepair) {
    replyText =
      "Yes, we repair PCs, Macs, laptops, printers, networks, and more. Tell me what’s going wrong and I can point you in the right direction.";
    topic = "repair";
  } else if (asksServices) {
    replyText =
      "We look after PC and Mac repairs, internet and networking, virus removal, email, printers, data recovery, Smart TV setup, broadband, managed IT, cloud, and websites.";
    topic = "services";
    suggestBooking = true;
  } else if (asksContact) {
    replyText = `Of course — call us on ${ORCA_PHONE_DISPLAY} or email ${ORCA_EMAIL} and someone from our team will help you.`;
    topic = "contact";
    suggestBooking = false;
  } else {
    replyText = pickOne([
      `I can help with that. Tell me a bit more about the problem, or say book and I’ll take your details for a callback.`,
      `No worries — describe what’s happening and I’ll let you know how we can help, or say book to arrange a callback.`,
    ]);
    topic = context.lastTopic || "general";
  }

  if (context.lastReply && context.lastReply === replyText) {
    replyText = followUpVariant(topic, message);
    suggestBooking = true;
  }

  return { text: replyText, topic, suggestBooking };
}

export function composeGeneralResponse(message, context = {}) {
  const result = buildBotReply(message, context);
  const texts = [result.text];

  if (result.suggestBooking && !/\b(say book|just book|book a callback|book when)\b/i.test(result.text)) {
    texts.push(
      pickOne([
        "If you’d like, I can help you book — just say book.",
        "Say book when you’re ready and I’ll take a few details for our team.",
      ]),
    );
  }

  return { texts, topic: result.topic, mainReply: result.text };
}

export function generalReply(message, context = {}) {
  return buildBotReply(message, context).text;
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
  if (field === "visitType") {
    const normalised = value.trim().toLowerCase();
    if (
      !(
        normalised.includes("remote") ||
        normalised.includes("online") ||
        normalised.includes("on-site") ||
        normalised.includes("onsite") ||
        normalised.includes("on site") ||
        normalised === "visit"
      )
    ) {
      return "Just checking — is this remote/online support, or on-site?";
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
  if (field === "visitType") {
    const normalised = trimmed.toLowerCase();
    if (normalised.includes("remote") || normalised.includes("online")) return "Remote";
    if (
      normalised.includes("on-site") ||
      normalised.includes("onsite") ||
      normalised.includes("on site") ||
      normalised === "visit"
    ) {
      return "On-site";
    }
  }
  return trimmed;
}
