export type VisitMode = "remote" | "onsite";

export type BookableService = {
  id: string;
  title: string;
  description: string;
  durationMinutes: number;
  price: number;
  /** Where this service can be delivered */
  mode: VisitMode | "both";
  melbourneOnly?: boolean;
};

export type BookingStaff = {
  id: string;
  name: string;
  role: string;
  phone?: string;
};

export const bookableServices: BookableService[] = [
  {
    id: "remote-45",
    title: "Remote Support - 45 Minutes",
    description: "We help online or by phone — internet must be active",
    durationMinutes: 45,
    price: 99,
    mode: "remote",
  },
  {
    id: "virus-60",
    title: "Virus Removal & Cleanup - 60 Minutes",
    description: "Malware cleanup and security checks",
    durationMinutes: 60,
    price: 129,
    mode: "both",
  },
  {
    id: "onsite-60",
    title: "On-site Home Support - 60 Minutes",
    description: "A technician visits your home — Melbourne only",
    durationMinutes: 60,
    price: 149,
    mode: "onsite",
    melbourneOnly: true,
  },
  {
    id: "business-60",
    title: "Business IT Support - 60 Minutes",
    description: "Priority help for workplace systems on-site",
    durationMinutes: 60,
    price: 179,
    mode: "onsite",
  },
];

/** Greater Melbourne metropolitan postcode ranges */
const melbournePostcodeRanges: Array<[number, number]> = [
  [3000, 3207],
  [3335, 3341],
  [3427, 3444],
  [3750, 3811],
  [3910, 3920],
  [3926, 3944],
  [3975, 3978],
  [3980, 3983],
];

export function isMelbournePostcode(postcode: string) {
  const code = Number(postcode.trim());
  if (!Number.isInteger(code)) return false;
  return melbournePostcodeRanges.some(([from, to]) => code >= from && code <= to);
}

export function serviceMatchesVisitMode(service: BookableService, visitMode: VisitMode) {
  return service.mode === "both" || service.mode === visitMode;
}

export function getAvailableServices(postcode: string, visitMode?: VisitMode | null) {
  const melbourne = isMelbournePostcode(postcode);
  return bookableServices.filter((service) => {
    if (service.melbourneOnly && !melbourne) return false;
    if (visitMode && !serviceMatchesVisitMode(service, visitMode)) return false;
    return true;
  });
}

export const bookingStaff: BookingStaff[] = [
  { id: "alex-g", name: "Alex G.", role: "Technician" },
  {
    id: "styla-b",
    name: "Styla B.",
    role: "Technician",
    phone: "+61 450 577 407",
  },
];

export function formatCurrency(amount: number) {
  return amount.toLocaleString("en-AU", {
    style: "currency",
    currency: "AUD",
  });
}

export function formatBookingDate(date: Date) {
  return date.toLocaleDateString("en-AU", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function formatShortDay(date: Date) {
  return date.toLocaleDateString("en-AU", { weekday: "short" });
}

export function formatShortMonthDay(date: Date) {
  return date.toLocaleDateString("en-AU", { month: "short", day: "numeric" });
}

export function getBookingDates(count = 14) {
  const dates: Date[] = [];
  const cursor = new Date();
  cursor.setHours(0, 0, 0, 0);

  while (dates.length < count) {
    dates.push(new Date(cursor));
    cursor.setDate(cursor.getDate() + 1);
  }

  return dates;
}

export function getTimeSlotsForDate(date: Date) {
  const day = date.getDay();
  // Sunday: no slots (empty state demo)
  if (day === 0) return [] as string[];

  const baseSlots = [
    "08:00 am",
    "08:30 am",
    "09:00 am",
    "10:00 am",
    "11:30 am",
    "01:00 pm",
    "02:30 pm",
    "04:00 pm",
  ];

  // Saturday: fewer slots
  if (day === 6) return ["09:00 am", "10:00 am", "11:30 am"];

  return baseSlots;
}

export function getStaffForSlot(date: Date, time: string) {
  const seed = date.getDate() + time.length;
  if (seed % 3 === 0) return [bookingStaff[0]];
  if (seed % 2 === 0) return [bookingStaff[1]];
  return [...bookingStaff];
}
