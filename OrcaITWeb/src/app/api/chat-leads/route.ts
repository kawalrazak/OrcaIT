import { forwardLeadToCrm } from "@/lib/forward-lead-to-crm";
import { getNotifyEmail, sendMail } from "@/lib/send-mail";

export const runtime = "nodejs";

type Lead = {
  supportFor: string;
  existingCustomer: string;
  name: string;
  phone: string;
  email: string;
  visitType: string;
  suburb: string;
  issue: string;
  preferredContactTime: string;
  website?: string;
};

const requiredColumns: Array<keyof Omit<Lead, "website" | "suburb" | "visitType">> = [
  "supportFor",
  "existingCustomer",
  "name",
  "phone",
  "email",
  "issue",
  "preferredContactTime",
];

function isRemoteVisit(visitType: string) {
  return visitType.trim().toLowerCase().startsWith("remote");
}

function isValidLead(value: unknown): value is Lead {
  if (!value || typeof value !== "object") return false;

  const lead = value as Record<string, unknown>;
  const requiredOk = requiredColumns.every(
    (column) =>
      typeof lead[column] === "string" &&
      lead[column].trim().length > 0 &&
      lead[column].length <= 1000,
  );
  if (!requiredOk) return false;

  const visitType = typeof lead.visitType === "string" ? lead.visitType.trim() : "";
  const suburb = typeof lead.suburb === "string" ? lead.suburb.trim() : "";

  if (visitType.length > 1000 || suburb.length > 1000) return false;

  // Suburb is required only for on-site / non-remote visits.
  if (visitType && !isRemoteVisit(visitType) && !suburb) return false;

  // Older clients may omit visitType — then suburb stays required.
  if (!visitType && !suburb) return false;

  return true;
}

async function sendStaffLeadEmail(lead: Lead, source: string) {
  const sourceLabel =
    source === "chat"
      ? "Website chat"
      : source === "booking-form"
        ? "Booking form"
        : "Website enquiry";

  const subject =
    source === "chat"
      ? `New chat enquiry — ${lead.name}`
      : `New website enquiry — ${lead.name}`;

  const suburbLabel = lead.suburb
    ? lead.suburb
    : isRemoteVisit(lead.visitType)
      ? "Not needed (remote)"
      : "Not provided";

  const result = await sendMail({
    to: getNotifyEmail(),
    replyTo: lead.email,
    subject,
    text: [
      `A new ${sourceLabel.toLowerCase()} enquiry was submitted on the Orca IT website.`,
      "",
      `Source: ${sourceLabel}`,
      `Name: ${lead.name}`,
      `Email: ${lead.email}`,
      `Phone: ${lead.phone}`,
      `Visit type: ${lead.visitType || "Not specified"}`,
      `Suburb: ${suburbLabel}`,
      `Support for: ${lead.supportFor}`,
      `Existing customer: ${lead.existingCustomer}`,
      `Preferred contact time: ${lead.preferredContactTime}`,
      "",
      `Message: ${lead.issue}`,
      "",
      "Also saved in CRM → Manage Leads (SQLite + leads.csv).",
    ].join("\n"),
    html: `
      <div style="font-family:Arial,sans-serif;line-height:1.6;color:#0c58ac">
        <h2 style="color:#f42c1c">${subject}</h2>
        <table style="border-collapse:collapse;width:100%;max-width:560px">
          <tr><td style="padding:6px 0;font-weight:bold">Source</td><td>${sourceLabel}</td></tr>
          <tr><td style="padding:6px 0;font-weight:bold">Name</td><td>${lead.name}</td></tr>
          <tr><td style="padding:6px 0;font-weight:bold">Email</td><td><a href="mailto:${lead.email}">${lead.email}</a></td></tr>
          <tr><td style="padding:6px 0;font-weight:bold">Phone</td><td><a href="tel:${lead.phone}">${lead.phone}</a></td></tr>
          <tr><td style="padding:6px 0;font-weight:bold">Visit type</td><td>${lead.visitType || "Not specified"}</td></tr>
          <tr><td style="padding:6px 0;font-weight:bold">Suburb</td><td>${suburbLabel}</td></tr>
          <tr><td style="padding:6px 0;font-weight:bold">Support for</td><td>${lead.supportFor}</td></tr>
          <tr><td style="padding:6px 0;font-weight:bold">Existing customer</td><td>${lead.existingCustomer}</td></tr>
          <tr><td style="padding:6px 0;font-weight:bold">Preferred contact</td><td>${lead.preferredContactTime}</td></tr>
          <tr><td style="padding:6px 0;font-weight:bold">Message</td><td>${lead.issue}</td></tr>
        </table>
        <p style="margin-top:16px">Also saved in CRM → Manage Leads (SQLite + leads.csv).</p>
      </div>
    `,
  });

  if (!result.sent) {
    console.error("[chat-leads] staff email not sent:", result.reason);
  }

  return result;
}

export async function POST(request: Request) {
  try {
    const lead: unknown = await request.json();

    if (!isValidLead(lead)) {
      return Response.json({ error: "Please complete all required fields." }, { status: 400 });
    }

    if (lead.website) {
      return Response.json({ ok: true });
    }

    if (!/^[+()\d\s-]{8,20}$/.test(lead.phone.trim())) {
      return Response.json({ error: "Please provide a valid phone number." }, { status: 400 });
    }

    const source =
      lead.supportFor.trim().toLowerCase() === "booking form" ? "booking-form" : "chat";

    const cleaned: Lead = {
      supportFor: lead.supportFor.trim(),
      existingCustomer: lead.existingCustomer.trim(),
      name: lead.name.trim(),
      phone: lead.phone.trim(),
      email: lead.email.trim(),
      visitType: (lead.visitType || "").trim(),
      suburb: lead.suburb.trim(),
      issue: lead.issue.trim(),
      preferredContactTime: lead.preferredContactTime.trim(),
    };

    await forwardLeadToCrm({
      source,
      ...cleaned,
    });

    await sendStaffLeadEmail(cleaned, source);

    return Response.json({ ok: true });
  } catch {
    return Response.json({ error: "We could not save your details. Please call us instead." }, { status: 500 });
  }
}
