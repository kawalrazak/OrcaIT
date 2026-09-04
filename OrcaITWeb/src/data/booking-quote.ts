export type QuoteServiceMode = "remote" | "onsite";

export type QuoteService = {
  id: string;
  label: string;
  mode: QuoteServiceMode;
  hint?: string;
};

/** Services shown on the Jim's-style /booking quote flow */
export const quoteServices: QuoteService[] = [
  {
    id: "home-it",
    label: "Home IT Support / Assistance",
    mode: "onsite",
  },
  {
    id: "business-it",
    label: "Business IT Support / Assistance",
    mode: "onsite",
  },
  {
    id: "hardware",
    label: "Hardware Repairs and Installations",
    mode: "onsite",
  },
  {
    id: "software",
    label: "Software Repairs and Installations",
    mode: "onsite",
  },
  {
    id: "remote-support",
    label: "IT Remote Support - Internet must be active",
    mode: "remote",
    hint: "Online / phone help — no site visit",
  },
  {
    id: "data-backup",
    label: "Data Backup and Recovery",
    mode: "onsite",
  },
  {
    id: "mobile-tablets",
    label: "Mobile / Tablets",
    mode: "onsite",
  },
  {
    id: "websites-seo",
    label: "Websites / SEO / Digital Marketing",
    mode: "remote",
  },
  {
    id: "health-check",
    label: "Full PC / Mac Health Check",
    mode: "onsite",
  },
  {
    id: "virus-removal",
    label: "Virus & Malware Removal",
    mode: "remote",
  },
  {
    id: "wifi-networking",
    label: "Wi-Fi & Home Networking",
    mode: "onsite",
  },
  {
    id: "smart-setup",
    label: "Smart TV / Printer Setup",
    mode: "onsite",
  },
];

export function getQuoteServicesByIds(ids: string[]) {
  return quoteServices.filter((service) => ids.includes(service.id));
}

export function selectionNeedsOnsiteVisit(ids: string[]) {
  return getQuoteServicesByIds(ids).some((service) => service.mode === "onsite");
}

export function selectionIsRemoteOnly(ids: string[]) {
  const selected = getQuoteServicesByIds(ids);
  return selected.length > 0 && selected.every((service) => service.mode === "remote");
}
