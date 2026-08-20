import nodemailer from "nodemailer";
import { ORCA_EMAIL } from "@/data/contact";

export type MailResult = {
  sent: boolean;
  reason: string | null;
};

function cleanEnv(value: string | undefined) {
  if (!value) return "";
  return value.trim().replace(/^["']|["']$/g, "");
}

function getSmtpConfig() {
  const host = cleanEnv(process.env.SMTP_HOST);
  const user = cleanEnv(process.env.SMTP_USER);
  const pass = cleanEnv(process.env.SMTP_PASS);
  const from = cleanEnv(process.env.EMAIL_FROM) || ORCA_EMAIL;
  const notifyTo = cleanEnv(process.env.EMAIL_NOTIFY_TO) || ORCA_EMAIL;
  const port = Number(cleanEnv(process.env.SMTP_PORT) || "587");
  const secure =
    cleanEnv(process.env.SMTP_SECURE).toLowerCase() === "true" || port === 465;

  const hasPlaceholderConfig =
    !host ||
    !user ||
    !pass ||
    host === "smtp.example.com" ||
    user === "your-smtp-username" ||
    pass === "your-smtp-password";

  if (hasPlaceholderConfig) {
    return null;
  }

  return { host, port, secure, user, pass, from, notifyTo };
}

export function getNotifyEmail() {
  return cleanEnv(process.env.EMAIL_NOTIFY_TO) || ORCA_EMAIL;
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
      auth: {
        user: config.user,
        pass: config.pass,
      },
      // Helps with some Hostinger / Windows TLS handshakes
      tls: {
        minVersion: "TLSv1.2",
        rejectUnauthorized: true,
      },
      connectionTimeout: 20000,
      greetingTimeout: 20000,
      socketTimeout: 20000,
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
    const err = error as { code?: string; responseCode?: number; message?: string };
    const detail = [err.code, err.responseCode, err.message].filter(Boolean).join(" — ");
    console.error("[mail] send failed:", detail);
    return {
      sent: false,
      reason: `Email could not be sent (${err.code || "SMTP_ERROR"}). Submission was saved successfully.`,
    };
  }
}
