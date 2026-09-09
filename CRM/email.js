import nodemailer from 'nodemailer';

export function createEmailSender() {
  const host = process.env.SMTP_HOST || 'smtp.hostinger.com';
  const port = Number(process.env.SMTP_PORT || 465);
  const secure =
    process.env.SMTP_SECURE === 'false' ? false : process.env.SMTP_SECURE === 'true' || port === 465;
  const user = process.env.SMTP_USER || 'info@orcait.com.au';
  const pass = process.env.SMTP_PASS || '';
  const from = process.env.SMTP_FROM || user || 'info@orcait.com.au';
  const mockMode = process.env.SMTP_MOCK_MODE === 'true';

  function isConfigured() {
    return Boolean(host && user && pass);
  }

  async function sendMail({ to, subject, text, html }) {
    if (!to || !subject || (!text && !html)) {
      const error = new Error('Recipient, subject, and message body are required.');
      error.status = 400;
      throw error;
    }

    if (!isConfigured()) {
      if (mockMode) {
        console.log(`[email] mock send to=${to} subject=${subject}`);
        return { success: true, mock: true, message: 'Email simulated successfully in mock mode.' };
      }
      const error = new Error(
        'Email is not configured. Set SMTP_HOST, SMTP_USER, SMTP_PASS (and optional SMTP_FROM) in .env',
      );
      error.status = 500;
      throw error;
    }

    const transporter = nodemailer.createTransport({
      host,
      port,
      secure,
      auth: { user, pass },
    });

    const info = await transporter.sendMail({
      from: `"Orca IT" <${from}>`,
      to,
      subject,
      text: text || undefined,
      html: html || undefined,
    });

    return {
      success: true,
      mock: false,
      messageId: info.messageId,
    };
  }

  return {
    sendMail,
    isConfigured,
    from,
    mockMode,
  };
}
