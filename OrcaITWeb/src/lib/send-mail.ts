import nodemailer from "nodemailer";
import { ORCA_EMAIL } from "@/data/contact";

export type MailResult = {
  sent: boolean;
  reason: string | null;
};

function getSmtpConfig() {
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const from = process.env.EMAIL_FROM || ORCA_EMAIL;
  const notifyTo = process.env.EMAIL_NOTIFY_TO || ORCA_EMAIL;

  const hasPlaceholderConfig =
    host === "smtp.example.com" ||
    user === "your-smtp-username" ||
    pass === "your-smtp-password";

  if (!host || !user || !pass || hasPlaceholderConfig) {
    return null;
  }

  return {
    host,
    port: Number(process.env.SMTP_PORT || 587),
    secure: process.env.SMTP_SECURE === "true",
    user,
    pass,
    from,
    notifyTo,
  };
}

export async function sendMail(options: {
  to: string;
  subject: string;
  text: string;
  html: string;
  replyTo?: string;
}): Promise<MailResult> {
  const config = getSmtpConfig();

  if (!config) {
    return {
      sent: false,
      reason: "SMTP is not configured. Submission was saved successfully.",
    };
  }

  try {
    const transporter = nodemailer.createTransport({
      host: config.host,
      port: config.port,
      secure: config.secure,
      auth: { user: config.user, pass: config.pass },
    });

    await transporter.sendMail({
      from: `Orca IT <${config.from}>`,
      to: options.to,
      replyTo: options.replyTo || config.from,
      subject: options.subject,
      text: options.text,
      html: options.html,
    });

    return { sent: true, reason: null };
  } catch (error) {
    console.error("[mail] send failed:", error);
    return {
      sent: false,
      reason: "Email could not be sent. Submission was saved successfully.",
    };
  }
}

export function getNotifyEmail() {
  return process.env.EMAIL_NOTIFY_TO || ORCA_EMAIL;
}
