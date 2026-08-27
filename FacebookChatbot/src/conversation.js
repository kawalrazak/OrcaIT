export const ORCA_PHONE_DISPLAY = "0498 082 750";
export const ORCA_EMAIL = "info@orcait.com.au";

export const bookingQuestions = [
  {
    field: "existingCustomer",
    prompt: "Have you used Orca IT before? Reply Yes or No.",
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
    prompt: "Is this booking for your home or your business? Reply Home or Business.",
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

export function generalReply(message) {
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

  return `Thanks for your message. You can book an appointment here, call ${ORCA_PHONE_DISPLAY}, or email ${ORCA_EMAIL}.`;
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

export function validationError(field, value) {
  if (!value.trim()) return "Please enter a response so I can continue.";
  if (field === "phone" && !/^[+()\d\s-]{8,20}$/.test(value.trim())) {
    return "Please enter a valid phone number, including the area code if needed.";
  }
  if (field === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())) {
    return "Please enter a valid email address.";
  }
  if (field === "existingCustomer") {
    const normalised = value.trim().toLowerCase();
    if (!["yes", "no", "y", "n"].includes(normalised)) {
      return "Please answer Yes or No.";
    }
  }
  if (field === "supportFor") {
    const normalised = value.trim().toLowerCase();
    if (!["home", "business"].includes(normalised)) {
      return "Please answer Home or Business.";
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
