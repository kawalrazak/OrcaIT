import { appendFile, mkdir, stat } from "node:fs/promises";
import path from "node:path";
import nodemailer from "nodemailer";

const columns = [
  "supportFor",
  "existingCustomer",
  "name",
  "phone",
  "email",
  "suburb",
  "issue",
  "preferredContactTime",
];

function csvCell(value) {
  const safeValue = /^[=+\-@]/.test(value) ? `'${value}` : value;
  return `"${safeValue.replaceAll('"', '""')}"`;
}

async function forwardLeadToCrm(payload) {
  const baseUrl = (process.env.CRM_INTERNAL_URL || "http://localhost:3001").replace(/\/$/, "");

  try {
    const response = await fetch(`${baseUrl}/api/leads`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      console.error("[crm-forward]", response.status, await response.text());
      return false;
    }

    return true;
  } catch (error) {
    console.error("[crm-forward] failed:", error);
    return false;
  }
}

function getTransporter() {
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  if (!host || !user || !pass) return null;

  const port = Number(process.env.SMTP_PORT || "587");
  const secure = String(process.env.SMTP_SECURE).toLowerCase() === "true" || port === 465;

  return nodemailer.createTransport({
    host,
    port,
    secure,
    auth: { user, pass },
  });
}

// nodemailer is optional — keep CSV + CRM even if SMTP is missing
async function notifyStaff(lead) {
  const transporter = getTransporter();
  if (!transporter) return;

  const to = process.env.EMAIL_NOTIFY_TO || process.env.EMAIL_FROM || process.env.SMTP_USER;
  const from = process.env.EMAIL_FROM || process.env.SMTP_USER;

  try {
    await transporter.sendMail({
      from,
      to,
      replyTo: lead.email,
      subject: `New Facebook Messenger enquiry — ${lead.name}`,
      text: [
        "A new Facebook Messenger booking was submitted.",
        "",
        `Name: ${lead.name}`,
        `Email: ${lead.email}`,
        `Phone: ${lead.phone}`,
        `Suburb: ${lead.suburb}`,
        `Support for: ${lead.supportFor}`,
        `Existing customer: ${lead.existingCustomer}`,
        `Preferred contact time: ${lead.preferredContactTime}`,
        "",
        `Message: ${lead.issue}`,
      ].join("\n"),
    });
  } catch (error) {
    console.error("[facebook] staff email not sent:", error);
  }
}

export async function saveLead(lead) {
  const dataDirectory = path.join(process.cwd(), "data");
  const sheetPath = path.join(dataDirectory, "facebook-leads.csv");
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
  const row = [new Date().toISOString(), ...columns.map((column) => lead[column].trim())];

  await appendFile(
    sheetPath,
    `${needsHeader ? `${header.map(csvCell).join(",")}\n` : ""}${row.map(csvCell).join(",")}\n`,
    "utf8",
  );

  const cleaned = Object.fromEntries(columns.map((column) => [column, lead[column].trim()]));

  await forwardLeadToCrm({
    source: "facebook",
    ...cleaned,
  });

  await notifyStaff(cleaned);
}
