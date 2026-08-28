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
        "",
        "Saved in CRM → Manage Leads (SQLite + leads.csv).",
      ].join("\n"),
    });
  } catch (error) {
    console.error("[facebook] staff email not sent:", error);
  }
}

export async function saveLead(lead) {
  const cleaned = Object.fromEntries(columns.map((column) => [column, lead[column].trim()]));

  const saved = await forwardLeadToCrm({
    source: "facebook",
    ...cleaned,
  });

  if (!saved) {
    throw new Error("Could not save lead to CRM.");
  }

  await notifyStaff(cleaned);
}
