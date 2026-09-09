export function normalizeAustralianNumber(value: string) {
  const cleaned = value.replace(/[^\d+]/g, '').trim();
  if (!cleaned) return '';
  if (cleaned.startsWith('+61')) return cleaned;
  if (cleaned.startsWith('61')) return `+${cleaned}`;
  if (cleaned.startsWith('04')) return `+61${cleaned.slice(1)}`;
  if (cleaned.startsWith('4')) return `+61${cleaned}`;
  return cleaned;
}

export function isValidAustralianNumber(value: string) {
  const normalized = normalizeAustralianNumber(value);
  return /^\+614\d{8}$/.test(normalized);
}

export function getFirstName(fullName: string): string {
  const trimmed = fullName.trim();
  if (!trimmed) return 'there';
  return trimmed.split(/\s+/)[0];
}

export function buildQuoteMessage(
  lead: {
    name: string;
    calloutFee?: number;
    troubleshootingFee?: number;
  },
  options: {
    visitTime: string;
    calloutFee: number;
    troubleshootingFee: number;
  },
): string {
  const firstName = getFirstName(lead.name);
  const time = options.visitTime.trim() || 'the agreed time';

  return `Hi ${firstName},

Good afternoon, It was lovely talking to you today regarding your Issue.

The technician assigned to your case shall reach around ${time}

As mentioned, there are callout charge of $${options.calloutFee} plus GST and also a troubleshooting charge of $${options.troubleshootingFee} per hour plus GST (Minimum 1 Hour, Non Refundable)

Please reply to this message, so that i can lock in the time for you.

If in case there is a issue that can not be fixed partly or fully or an hardware issue, the technician will let you know within the first hour.

You can choose to pay by cash or card.

Thanks see you soon. 😊`;
}

export function buildOnlineQuoteMessage(
  lead: { name: string },
  options: { troubleshootingFee: number },
): string {
  const firstName = getFirstName(lead.name);

  return `Hi ${firstName},

Good afternoon, It was lovely talking to you today regarding your issue.

For online/remote support, the troubleshooting charge is $${options.troubleshootingFee} per hour plus GST (Minimum 1 Hour, Non Refundable).

Please reply to this message to confirm your appointment time.

You can choose to pay by card or bank transfer.

Thanks.`;
}

export function buildInvoiceMessage(
  lead: {
    name: string;
    paymentAmount?: number;
    troubleshootingFee?: number;
    calloutFee?: number;
  },
  options?: {
    amountDollars?: number;
    paymentUrl?: string;
    referenceId?: string;
  },
): string {
  const firstName = getFirstName(lead.name);
  const amount =
    (options?.amountDollars && options.amountDollars > 0
      ? options.amountDollars
      : undefined) ??
    (lead.paymentAmount && lead.paymentAmount > 0
      ? lead.paymentAmount
      : undefined) ??
    (lead.troubleshootingFee && lead.troubleshootingFee > 0
      ? lead.troubleshootingFee
      : undefined) ??
    (lead.calloutFee && lead.calloutFee > 0 ? lead.calloutFee : 0);
  const amountText = amount > 0 ? `$${amount.toFixed(2)}` : 'as discussed';
  const paymentUrl = options?.paymentUrl?.trim() || '';
  const reference = options?.referenceId?.trim() || '';

  const lines = [
    `Hi ${firstName},`,
    '',
    'Thank you for choosing Orca IT.',
    '',
    `Your invoice amount is ${amountText} AUD (plus GST where applicable).`,
  ];

  if (reference) {
    lines.push(`Invoice reference: ${reference}`);
  }

  if (paymentUrl) {
    lines.push('', 'Pay securely online with Zeller:', paymentUrl);
  } else {
    lines.push('', 'Please arrange payment at your earliest convenience.');
  }

  lines.push('', 'Reply to this message if you have any questions.', '', 'Thanks, Orca IT');
  return lines.join('\n');
}

export function defaultInvoiceAmount(lead: {
  paymentAmount?: number;
  troubleshootingFee?: number;
  calloutFee?: number;
}) {
  if (lead.paymentAmount && lead.paymentAmount > 0) return lead.paymentAmount;
  if (lead.troubleshootingFee && lead.troubleshootingFee > 0) return lead.troubleshootingFee;
  if (lead.calloutFee && lead.calloutFee > 0) return lead.calloutFee;
  return 0;
}

export function defaultQuoteFees(lead: { calloutFee?: number; troubleshootingFee?: number }) {
  return {
    calloutFee: lead.calloutFee && lead.calloutFee > 0 ? lead.calloutFee : 49,
    troubleshootingFee:
      lead.troubleshootingFee && lead.troubleshootingFee > 0
        ? lead.troubleshootingFee
        : 149,
  };
}

export function buildLeadMessage(lead: {
  issueType: string;
  name: string;
  phone: string;
  comment: string;
  issueDescription?: string;
  address?: string;
  appointmentDate?: string;
}) {
  const lines = [
    `Issue: ${lead.issueType}`,
    `Name: ${lead.name}`,
    `Phone: ${lead.phone}`,
  ];
  if (lead.issueDescription) lines.push(`Details: ${lead.issueDescription}`);
  if (lead.address) lines.push(`Address: ${lead.address}`);
  if (lead.appointmentDate) lines.push(`Appointment: ${lead.appointmentDate}`);
  lines.push(`Comment: ${lead.comment || '—'}`);
  return lines.join('\n');
}

export async function sendSms(to: string, message: string) {
  const res = await fetch('/api/send-sms', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ to, message }),
  });
  const body = await res.json();
  return { ok: res.ok && body.success, error: body.error as string | undefined };
}

export async function sendEmail(options: {
  to: string;
  subject: string;
  text: string;
  leadId?: string;
  leadName?: string;
  performedByName?: string;
}) {
  const res = await fetch('/api/send-email', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(options),
  });
  const body = await res.json();
  return {
    ok: res.ok && body.success !== false,
    error: body.error as string | undefined,
    mock: Boolean(body.mock),
  };
}

