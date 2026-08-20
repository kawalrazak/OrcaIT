import { appendFile, mkdir, stat } from "node:fs/promises";
import path from "node:path";
import { forwardLeadToCrm } from "@/lib/forward-lead-to-crm";
import { getNotifyEmail, sendMail } from "@/lib/send-mail";

export const runtime = "nodejs";

type Lead = {
  supportFor: string;
  existingCustomer: string;
  name: string;
  phone: string;
  email: string;
  suburb: string;
  issue: string;
  preferredContactTime: string;
  website?: string;
};

const columns: Array<keyof Omit<Lead, "website">> = [
  "supportFor",
  "existingCustomer",
  "name",
  "phone",
  "email",
  "suburb",
  "issue",
  "preferredContactTime",
];

function csvCell(value: string) {
  const safeValue = /^[=+\-@]/.test(value) ? `'${value}` : value;
  return `"${safeValue.replaceAll('"', '""')}"`;
}

function isValidLead(value: unknown): value is Lead {
  if (!value || typeof value !== "object") return false;

  const lead = value as Record<string, unknown>;
  return columns.every(
    (column) =>
      typeof lead[column] === "string" &&
      lead[column].trim().length > 0 &&
      lead[column].length <= 1000,
  );
}

async function sendStaffLeadEmail(lead: Lead, source: string) {
  return sendMail({
    to: getNotifyEmail(),
    replyTo: lead.email,
    subject: `New website enquiry — ${lead.name}`,
    text: [
      "A new enquiry was submitted on the Orca IT website.",
      "",
      `Source: ${source}`,
      `Name: ${lead.name}`,
      `Email: ${lead.email}`,
      `Phone: ${lead.phone}`,
      `Suburb: ${lead.suburb}`,
      `Support for: ${lead.supportFor}`,
      `Existing customer: ${lead.existingCustomer}`,
      `Preferred contact time: ${lead.preferredContactTime}`,
      "",
      `Message: ${lead.issue}`,
      "",
      "Also saved in CRM → Manage Leads.",
    ].join("\n"),
    html: `
      <div style="font-family:Arial,sans-serif;line-height:1.6;color:#0c58ac">
        <h2 style="color:#f42c1c">New website enquiry</h2>
        <table style="border-collapse:collapse;width:100%;max-width:560px">
          <tr><td style="padding:6px 0;font-weight:bold">Source</td><td>${source}</td></tr>
          <tr><td style="padding:6px 0;font-weight:bold">Name</td><td>${lead.name}</td></tr>
          <tr><td style="padding:6px 0;font-weight:bold">Email</td><td><a href="mailto:${lead.email}">${lead.email}</a></td></tr>
          <tr><td style="padding:6px 0;font-weight:bold">Phone</td><td><a href="tel:${lead.phone}">${lead.phone}</a></td></tr>
          <tr><td style="padding:6px 0;font-weight:bold">Suburb</td><td>${lead.suburb}</td></tr>
          <tr><td style="padding:6px 0;font-weight:bold">Support for</td><td>${lead.supportFor}</td></tr>
          <tr><td style="padding:6px 0;font-weight:bold">Existing customer</td><td>${lead.existingCustomer}</td></tr>
          <tr><td style="padding:6px 0;font-weight:bold">Preferred contact</td><td>${lead.preferredContactTime}</td></tr>
          <tr><td style="padding:6px 0;font-weight:bold">Message</td><td>${lead.issue}</td></tr>
        </table>
        <p style="margin-top:16px">Also saved in CRM → Manage Leads.</p>
      </div>
    `,
  });
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

    const dataDirectory = path.join(process.cwd(), "data");
    const sheetPath = path.join(dataDirectory, "chatbot-responses.csv");
    await mkdir(dataDirectory, { recursive: true });

    let needsHeader = false;
    try {
      needsHeader = (await stat(sheetPath)).size === 0;
    } catch {
      needsHeader = true;
    }

    const header = [
      "Submitted At",
      "Support For",
      "Existing Customer",
      "Name",
      "Phone",
      "Email",
      "Suburb",
      "Support Needed",
      "Preferred Contact Time",
    ];
    const row = [
      new Date().toISOString(),
      ...columns.map((column) => lead[column].trim()),
    ];

    await appendFile(
      sheetPath,
      `${needsHeader ? `${header.map(csvCell).join(",")}\n` : ""}${row.map(csvCell).join(",")}\n`,
      "utf8",
    );

    const source =
      lead.supportFor.trim().toLowerCase() === "booking form" ? "booking-form" : "chat";

    await forwardLeadToCrm({
      source,
      supportFor: lead.supportFor.trim(),
      existingCustomer: lead.existingCustomer.trim(),
      name: lead.name.trim(),
      phone: lead.phone.trim(),
      email: lead.email.trim(),
      suburb: lead.suburb.trim(),
      issue: lead.issue.trim(),
      preferredContactTime: lead.preferredContactTime.trim(),
    });

    await sendStaffLeadEmail(
      {
        ...lead,
        supportFor: lead.supportFor.trim(),
        existingCustomer: lead.existingCustomer.trim(),
        name: lead.name.trim(),
        phone: lead.phone.trim(),
        email: lead.email.trim(),
        suburb: lead.suburb.trim(),
        issue: lead.issue.trim(),
        preferredContactTime: lead.preferredContactTime.trim(),
      },
      source,
    );

    return Response.json({ ok: true });
  } catch {
    return Response.json({ error: "We could not save your details. Please call us instead." }, { status: 500 });
  }
}
