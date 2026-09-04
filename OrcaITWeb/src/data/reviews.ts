export const reviewStats = {
  averageRating: 4.9,
  totalReviews: 110,
  label: "customer reviews",
  summary: "Trusted by homes and businesses across Melbourne and beyond",
};

export type CustomerReview = {
  quote: string;
  name: string;
  place: string;
  service: string;
};

/** Featured quotes shown in teasers / homepage */
export const featuredReviews: CustomerReview[] = [
  {
    quote:
      "Booked online in minutes and our Wi-Fi was sorted the same afternoon. Clear advice, no jargon.",
    name: "Priya S.",
    place: "South Yarra",
    service: "Home networking",
  },
  {
    quote:
      "Remote support fixed our email issue while we stayed at work. Friendly, fast and fair.",
    name: "Mark T.",
    place: "Box Hill",
    service: "Remote support",
  },
  {
    quote:
      "Patient with us as older computer users. Explained everything and left us feeling confident again.",
    name: "Helen & Ray",
    place: "Glen Waverley",
    service: "Home IT support",
  },
];

/** Extra reviews shown when customers open the full reviews panel */
export const moreReviews: CustomerReview[] = [
  {
    quote:
      "Virus cleanup was thorough and they explained how to stay safer online. Would book again.",
    name: "James L.",
    place: "Carlton",
    service: "Virus removal",
  },
  {
    quote:
      "Came to our office for printer and network issues. Sorted quickly with clear pricing upfront.",
    name: "Sofia R.",
    place: "Docklands",
    service: "Business IT",
  },
  {
    quote:
      "Mac was running painfully slow. After the visit it felt new again. Highly recommend Orca IT.",
    name: "Chris W.",
    place: "Hawthorn",
    service: "Mac support",
  },
  {
    quote:
      "Smart TV and streaming setup done in one visit. Kids were happy, and so were we.",
    name: "Anita P.",
    place: "Point Cook",
    service: "Smart TV setup",
  },
  {
    quote:
      "No solution, no fee gave us confidence to book. They fixed it — and explained every step.",
    name: "David K.",
    place: "Brunswick",
    service: "Desktop repair",
  },
  {
    quote:
      "Same-day remote help for a failed email login. Professional and easy to deal with.",
    name: "Michelle N.",
    place: "Ringwood",
    service: "Email setup",
  },
];

export const allReviews: CustomerReview[] = [...featuredReviews, ...moreReviews];
