import { appendFile, mkdir, stat } from "node:fs/promises";
import path from "node:path";
import { isMelbournePostcode } from "@/data/book-now";
import { ORCA_EMAIL, ORCA_PHONE_DISPLAY } from "@/data/contact";
import { forwardLeadToCrm } from "@/lib/forward-lead-to-crm";
import { getNotifyEmail, sendMail } from "@/lib/send-mail";

export const runtime = "nodejs";

type BookingPayload = {
  postcode: string;
  serviceTitle: string;
  servicePrice: number;
  dateLabel: string;
  time: string;
  staffName: string;
  unit?: string;
  address: string;
  firstName: string;
  lastName: string;
  company?: string;
  email: string;
  phone: string;
  helpNeeded: string;
  discountCode?: string;
  website?: string;
};

function csvCell(value: string) {
  const safeValue = /^[=+\-@]/.test(value) ? `'${value}` : value;
  return `"${safeValue.replaceAll('"', '""')}"`;
}

function isValidBooking(value: unknown): value is BookingPayload {
  if (!value || typeof value !== "object") return false;
  const booking = value as Record<string, unknown>;
  const required = [
    "postcode",
    "serviceTitle",
    "dateLabel",
    "time",
    "staffName",
    "address",
    "firstName",
    "lastName",
    "email",
    "phone",
    "helpNeeded",
  ] as const;

  return (
    required.every(
      (field) =>
        typeof booking[field] === "string" &&
        booking[field].trim().length > 0 &&
        booking[field].length <= 2000,
    ) && typeof booking.servicePrice === "number"
  );
}

async function sendConfirmationEmail(booking: BookingPayload) {
  const customerName = `${booking.firstName} ${booking.lastName}`.trim();
  const price = booking.servicePrice.toLocaleString("en-AU", {
    style: "currency",
    currency: "AUD",
  });

  return sendMail({
    to: booking.email,
    replyTo: ORCA_EMAIL,
    subject: `Booking Confirmed — ${booking.serviceTitle}`,
    text: [
      `Hi ${booking.firstName},`,
      "",
      "Your Orca IT appointment has been successfully booked.",
      "",
      `Service: ${booking.serviceTitle}`,
      `Date: ${booking.dateLabel}`,
      `Time: ${booking.time}`,
      `Technician: ${booking.staffName}`,
      `Total (Inc. GST): ${price}`,
      "",
      `Address: ${booking.unit ? `${booking.unit}, ` : ""}${booking.address}`,
      `Phone: ${booking.phone}`,
      "",
      `If you need to change anything, call us on ${ORCA_PHONE_DISPLAY} or reply to this email.`,
      "",
      "Thanks,",
      "Orca IT Team",
    ].join("\n"),
    html: `
      <div style="font-family:Arial,sans-serif;line-height:1.6;color:#0c58ac">
        <h2 style="color:#0c58ac">Booking Confirmed!</h2>
        <p>Hi ${booking.firstName},</p>
        <p>Your Orca IT appointment has been successfully booked. Here are your details:</p>
        <table style="border-collapse:collapse;width:100%;max-width:520px">
          <tr><td style="padding:8px 0;font-weight:bold">Service</td><td>${booking.serviceTitle}</td></tr>
          <tr><td style="padding:8px 0;font-weight:bold">Date</td><td>${booking.dateLabel}</td></tr>
          <tr><td style="padding:8px 0;font-weight:bold">Time</td><td>${booking.time}</td></tr>
          <tr><td style="padding:8px 0;font-weight:bold">Technician</td><td>${booking.staffName}</td></tr>
          <tr><td style="padding:8px 0;font-weight:bold">Total (Inc. GST)</td><td>${price}</td></tr>
        </table>
        <p style="margin-top:20px">Need help? Call <strong>${ORCA_PHONE_DISPLAY}</strong> or email ${ORCA_EMAIL}.</p>
        <p>Thanks,<br/>Orca IT Team</p>
      </div>
    `,
  });
}

async function sendStaffBookingEmail(booking: BookingPayload) {
  const customerName = `${booking.firstName} ${booking.lastName}`.trim();
  const price = booking.servicePrice.toLocaleString("en-AU", {
    style: "currency",
    currency: "AUD",
  });
  const address = `${booking.unit ? `${booking.unit}, ` : ""}${booking.address}`;

  return sendMail({
    to: getNotifyEmail(),
    replyTo: booking.email,
    subject: `New booking — ${customerName} — ${booking.serviceTitle}`,
    text: [
      "A new Orca IT booking was submitted on the website.",
      "",
      `Customer: ${customerName}`,
      `Email: ${booking.email}`,
      `Phone: ${booking.phone}`,
      `Company: ${booking.company || "—"}`,
      "",
      `Service: ${booking.serviceTitle}`,
      `Price: ${price}`,
      `Date: ${booking.dateLabel}`,
      `Time: ${booking.time}`,
      `Technician: ${booking.staffName}`,
      `Postcode: ${booking.postcode}`,
      `Address: ${address}`,
      "",
      `Help needed: ${booking.helpNeeded}`,
      `Discount code: ${booking.discountCode || "—"}`,
      "",
      "Also saved in CRM → Manage Leads.",
    ].join("\n"),
    html: `
      <div style="font-family:Arial,sans-serif;line-height:1.6;color:#0c58ac">
        <h2 style="color:#f42c1c">New website booking</h2>
        <table style="border-collapse:collapse;width:100%;max-width:560px">
          <tr><td style="padding:6px 0;font-weight:bold">Customer</td><td>${customerName}</td></tr>
          <tr><td style="padding:6px 0;font-weight:bold">Email</td><td><a href="mailto:${booking.email}">${booking.email}</a></td></tr>
          <tr><td style="padding:6px 0;font-weight:bold">Phone</td><td><a href="tel:${booking.phone}">${booking.phone}</a></td></tr>
          <tr><td style="padding:6px 0;font-weight:bold">Company</td><td>${booking.company || "—"}</td></tr>
          <tr><td style="padding:6px 0;font-weight:bold">Service</td><td>${booking.serviceTitle}</td></tr>
          <tr><td style="padding:6px 0;font-weight:bold">Price</td><td>${price}</td></tr>
          <tr><td style="padding:6px 0;font-weight:bold">Date</td><td>${booking.dateLabel}</td></tr>
          <tr><td style="padding:6px 0;font-weight:bold">Time</td><td>${booking.time}</td></tr>
          <tr><td style="padding:6px 0;font-weight:bold">Technician</td><td>${booking.staffName}</td></tr>
          <tr><td style="padding:6px 0;font-weight:bold">Postcode</td><td>${booking.postcode}</td></tr>
          <tr><td style="padding:6px 0;font-weight:bold">Address</td><td>${address}</td></tr>
          <tr><td style="padding:6px 0;font-weight:bold">Help needed</td><td>${booking.helpNeeded}</td></tr>
        </table>
        <p style="margin-top:16px">Also saved in CRM → Manage Leads.</p>
      </div>
    `,
  });
}

export async function POST(request: Request) {
  try {
    const payload: unknown = await request.json();

    if (!isValidBooking(payload)) {
      return Response.json({ error: "Please complete all required booking fields." }, { status: 400 });
    }

    if (payload.website) {
      return Response.json({ ok: true, emailSent: true });
    }

    if (!/^\d{4}$/.test(payload.postcode.trim())) {
      return Response.json({ error: "Please enter a valid 4-digit Australian postcode." }, { status: 400 });
    }

    if (
      payload.serviceTitle.toLowerCase().includes("on-site home support") &&
      !isMelbournePostcode(payload.postcode)
    ) {
      return Response.json(
        {
          error:
            "On-site Home Support is only available in Melbourne. Please use a Melbourne postcode or choose another service.",
        },
        { status: 400 },
      );
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email.trim())) {
      return Response.json({ error: "Please enter a valid email address." }, { status: 400 });
    }

    const dataDirectory = path.join(process.cwd(), "data");
    const sheetPath = path.join(dataDirectory, "book-now-responses.csv");
    await mkdir(dataDirectory, { recursive: true });

    let needsHeader = false;
    try {
      needsHeader = (await stat(sheetPath)).size === 0;
    } catch {
      needsHeader = true;
    }

    const header = [
      "Submitted At",
      "Postcode",
      "Service",
      "Price",
      "Date",
      "Time",
      "Staff",
      "Unit",
      "Address",
      "First Name",
      "Last Name",
      "Company",
      "Email",
      "Phone",
      "Help Needed",
      "Discount Code",
    ];

    const row = [
      new Date().toISOString(),
      payload.postcode.trim(),
      payload.serviceTitle.trim(),
      String(payload.servicePrice),
      payload.dateLabel.trim(),
      payload.time.trim(),
      payload.staffName.trim(),
      (payload.unit || "").trim(),
      payload.address.trim(),
      payload.firstName.trim(),
      payload.lastName.trim(),
      (payload.company || "").trim(),
      payload.email.trim(),
      payload.phone.trim(),
      payload.helpNeeded.trim(),
      (payload.discountCode || "").trim(),
    ];

    await appendFile(
      sheetPath,
      `${needsHeader ? `${header.map(csvCell).join(",")}\n` : ""}${row.map(csvCell).join(",")}\n`,
      "utf8",
    );

    await forwardLeadToCrm({
      source: "book-now",
      postcode: payload.postcode.trim(),
      serviceTitle: payload.serviceTitle.trim(),
      servicePrice: payload.servicePrice,
      dateLabel: payload.dateLabel.trim(),
      time: payload.time.trim(),
      staffName: payload.staffName.trim(),
      unit: (payload.unit || "").trim(),
      address: payload.address.trim(),
      firstName: payload.firstName.trim(),
      lastName: payload.lastName.trim(),
      company: (payload.company || "").trim(),
      email: payload.email.trim(),
      phone: payload.phone.trim(),
      helpNeeded: payload.helpNeeded.trim(),
      discountCode: (payload.discountCode || "").trim(),
    });

    const [customerEmail, staffEmail] = await Promise.all([
      sendConfirmationEmail(payload),
      sendStaffBookingEmail(payload),
    ]);

    return Response.json({
      ok: true,
      emailSent: customerEmail.sent,
      emailNote: customerEmail.reason || staffEmail.reason,
      staffEmailSent: staffEmail.sent,
    });
  } catch {
    return Response.json(
      { error: "We could not complete your booking. Please call us instead." },
      { status: 500 },
    );
  }
}
