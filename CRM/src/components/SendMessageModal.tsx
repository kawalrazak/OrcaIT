import { useEffect, useState } from 'react';
import { X, Send, User, Wrench, MapPin, Calendar, MessageSquare, Clock, FileText, Link2 } from 'lucide-react';
import {
  buildInvoiceMessage,
  buildOnlineQuoteMessage,
  buildQuoteMessage,
  defaultInvoiceAmount,
  defaultQuoteFees,
} from '../utils/sms';
import type { Lead } from '../types';

export type MessageTarget = 'customer' | 'technician' | 'invoice' | 'quote';

interface SendMessageModalProps {
  open: boolean;
  target: MessageTarget;
  lead: Lead;
  recipientName: string;
  recipientPhone: string;
  message: string;
  sending: boolean;
  result: { type: 'success' | 'error'; text: string } | null;
  onClose: () => void;
  onMessageChange: (value: string) => void;
  onSend: () => void;
  invoiceAmount?: string;
  onInvoiceAmountChange?: (value: string) => void;
  invoicePaymentUrl?: string;
  invoiceReferenceId?: string;
  creatingCheckout?: boolean;
  onCreateCheckout?: () => void;
}

export default function SendMessageModal({
  open,
  target,
  lead,
  recipientPhone,
  message,
  sending,
  result,
  onClose,
  onMessageChange,
  onSend,
  invoiceAmount,
  onInvoiceAmountChange,
  invoicePaymentUrl,
  invoiceReferenceId,
  creatingCheckout = false,
  onCreateCheckout,
}: SendMessageModalProps) {
  const isOnsiteQuote = target === 'customer';
  const isOnlineQuote = target === 'quote';
  const isInvoice = target === 'invoice';
  const isTechnician = target === 'technician';
  const isQuote = isOnsiteQuote || isOnlineQuote;
  const defaults = defaultQuoteFees(lead);
  const [visitTime, setVisitTime] = useState('');
  const [calloutFee, setCalloutFee] = useState(String(defaults.calloutFee));
  const [troubleshootingFee, setTroubleshootingFee] = useState(String(defaults.troubleshootingFee));

  useEffect(() => {
    if (!open) return;

    const fees = defaultQuoteFees(lead);
    const time =
      lead.technicianTimeDetail?.trim() ||
      lead.appointmentDate?.trim() ||
      '';

    setVisitTime(time);
    setCalloutFee(String(fees.calloutFee));
    setTroubleshootingFee(String(fees.troubleshootingFee));

    if (isOnsiteQuote) {
      onMessageChange(
        buildQuoteMessage(lead, {
          visitTime: time,
          calloutFee: fees.calloutFee,
          troubleshootingFee: fees.troubleshootingFee,
        }),
      );
    } else if (isOnlineQuote) {
      onMessageChange(
        buildOnlineQuoteMessage(lead, {
          troubleshootingFee: fees.troubleshootingFee,
        }),
      );
    } else if (isInvoice) {
      const amount = Number(invoiceAmount) || defaultInvoiceAmount(lead);
      onMessageChange(
        buildInvoiceMessage(lead, {
          amountDollars: amount,
          paymentUrl: invoicePaymentUrl,
          referenceId: invoiceReferenceId,
        }),
      );
    }
  }, [open, target, lead.id]);

  useEffect(() => {
    if (!open || !isInvoice) return;
    const amount = Number(invoiceAmount) || 0;
    onMessageChange(
      buildInvoiceMessage(lead, {
        amountDollars: amount,
        paymentUrl: invoicePaymentUrl,
        referenceId: invoiceReferenceId,
      }),
    );
  }, [invoiceAmount, invoicePaymentUrl, invoiceReferenceId, isInvoice, open, lead]);

  function applyOnsiteQuoteTemplate(time: string, callout: string, troubleshooting: string) {
    onMessageChange(
      buildQuoteMessage(lead, {
        visitTime: time,
        calloutFee: parseFloat(callout) || 49,
        troubleshootingFee: parseFloat(troubleshooting) || 149,
      }),
    );
  }

  function applyOnlineQuoteTemplate(troubleshooting: string) {
    onMessageChange(
      buildOnlineQuoteMessage(lead, {
        troubleshootingFee: parseFloat(troubleshooting) || 149,
      }),
    );
  }

  function handleVisitTimeChange(value: string) {
    setVisitTime(value);
    applyOnsiteQuoteTemplate(value, calloutFee, troubleshootingFee);
  }

  function handleCalloutChange(value: string) {
    setCalloutFee(value);
    applyOnsiteQuoteTemplate(visitTime, value, troubleshootingFee);
  }

  function handleTroubleshootingChange(value: string) {
    setTroubleshootingFee(value);
    if (isOnlineQuote) {
      applyOnlineQuoteTemplate(value);
    } else {
      applyOnsiteQuoteTemplate(visitTime, calloutFee, value);
    }
  }

  if (!open) return null;

  const canSendQuote = isOnsiteQuote ? visitTime.trim().length > 0 : true;
  const canSendInvoice = isInvoice
    ? Number(invoiceAmount) > 0 && Boolean(invoicePaymentUrl?.trim())
    : true;
  const headerTitle = isInvoice
    ? 'Send Invoice'
    : isOnlineQuote
      ? 'Send Quote'
      : isOnsiteQuote
        ? 'Send Quote'
        : 'Send to Technician';
  const headerSubtitle = isInvoice
    ? 'Creates a Zeller checkout link, then sends it by SMS'
    : isQuote
      ? 'Quote message auto-fills with customer name & fees'
      : 'Review message details before sending';
  const HeaderIcon = isInvoice ? FileText : isTechnician ? Wrench : User;
  const headerGradient = isTechnician
    ? 'bg-gradient-to-r from-emerald-600 to-emerald-700'
    : isInvoice
      ? 'bg-gradient-to-r from-violet-600 to-violet-700'
      : 'bg-gradient-to-r from-blue-600 to-blue-700';
  const sendLabel = isInvoice
    ? 'Send Invoice SMS'
    : isQuote
      ? 'Send Quote'
      : 'Send Message';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
        onClick={onClose}
        aria-label="Close modal"
      />

      <div className="relative z-10 flex max-h-[92vh] w-full max-w-lg flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
        <div className={`flex shrink-0 items-center justify-between px-6 py-4 text-white ${headerGradient}`}>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20">
              <HeaderIcon size={20} />
            </div>
            <div>
              <h2 className="text-lg font-semibold">{headerTitle}</h2>
              <p className="text-sm text-white/80">{headerSubtitle}</p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="rounded-lg p-1.5 transition hover:bg-white/20">
            <X size={20} />
          </button>
        </div>

        <div className="min-h-0 flex-1 space-y-4 overflow-y-auto p-6">
          {isOnsiteQuote && (
            <div className="rounded-xl border border-blue-100 bg-blue-50/50 p-4">
              <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-blue-700">Quote Details</p>
              <div className="grid gap-3 sm:grid-cols-3">
                <div className="sm:col-span-3">
                  <label className="mb-1 flex items-center gap-1 text-xs font-medium text-slate-700">
                    <Clock size={12} />
                    Technician arrival time *
                  </label>
                  <input
                    type="text"
                    value={visitTime}
                    onChange={(e) => handleVisitTimeChange(e.target.value)}
                    placeholder="e.g. 5-6pm"
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-700">Callout fee $</label>
                  <input
                    type="number"
                    min="0"
                    value={calloutFee}
                    onChange={(e) => handleCalloutChange(e.target.value)}
                    className="input-field"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="mb-1 block text-xs font-medium text-slate-700">Troubleshooting fee $/hr</label>
                  <input
                    type="number"
                    min="0"
                    value={troubleshootingFee}
                    onChange={(e) => handleTroubleshootingChange(e.target.value)}
                    className="input-field"
                  />
                </div>
              </div>
            </div>
          )}

          {isOnlineQuote && (
            <div className="rounded-xl border border-blue-100 bg-blue-50/50 p-4">
              <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-blue-700">Online Quote Details</p>
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-700">Troubleshooting fee $/hr</label>
                <input
                  type="number"
                  min="0"
                  value={troubleshootingFee}
                  onChange={(e) => handleTroubleshootingChange(e.target.value)}
                  className="input-field"
                />
              </div>
            </div>
          )}

          {isInvoice && (
            <div className="rounded-xl border border-violet-100 bg-violet-50/50 p-4">
              <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-violet-700">
                Zeller Checkout Session
              </p>
              <div className="space-y-3">
                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-700">Invoice amount $ AUD *</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={invoiceAmount ?? ''}
                    onChange={(e) => onInvoiceAmountChange?.(e.target.value)}
                    className="input-field"
                    placeholder="e.g. 149.00"
                  />
                </div>
                <button
                  type="button"
                  onClick={onCreateCheckout}
                  disabled={creatingCheckout || !(Number(invoiceAmount) > 0)}
                  className="btn-secondary w-full"
                >
                  <Link2 size={14} />
                  {creatingCheckout
                    ? 'Creating Zeller link...'
                    : invoicePaymentUrl
                      ? 'Refresh Zeller payment link'
                      : 'Create Zeller payment link'}
                </button>
                {invoiceReferenceId && (
                  <p className="text-[11px] text-slate-600">
                    Reference: <span className="font-semibold">{invoiceReferenceId}</span>
                  </p>
                )}
                {invoicePaymentUrl ? (
                  <p className="break-all rounded-lg bg-white px-3 py-2 text-[11px] text-violet-700 ring-1 ring-violet-200">
                    {invoicePaymentUrl}
                  </p>
                ) : (
                  <p className="text-[11px] text-amber-700">
                    Create a Zeller payment link before sending the invoice SMS.
                  </p>
                )}
              </div>
            </div>
          )}

          <div className="rounded-xl border border-slate-200 p-4">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-500">Lead Details</p>
            <div className="grid gap-2 text-sm">
              <div className="flex justify-between gap-4">
                <span className="text-slate-500">Customer</span>
                <span className="font-medium text-slate-800">{lead.name}</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-slate-500">Issue</span>
                <span className="font-medium text-slate-800">{lead.issueType}</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-slate-500">Call Date</span>
                <span className="font-medium text-slate-800">{lead.callDate}</span>
              </div>
              {lead.address && (
                <div className="flex items-start justify-between gap-4">
                  <span className="flex items-center gap-1 text-slate-500">
                    <MapPin size={13} /> Address
                  </span>
                  <span className="max-w-[60%] text-right font-medium text-slate-800">{lead.address}</span>
                </div>
              )}
              {lead.appointmentDate && (
                <div className="flex items-start justify-between gap-4">
                  <span className="flex items-center gap-1 text-slate-500">
                    <Calendar size={13} /> Appointment
                  </span>
                  <span className="max-w-[60%] text-right font-medium text-slate-800">{lead.appointmentDate}</span>
                </div>
              )}
              {isTechnician && lead.assignedClientName && (
                <div className="flex justify-between gap-4">
                  <span className="text-slate-500">Technician</span>
                  <span className="font-medium text-slate-800">{lead.assignedClientName}</span>
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700">
              <MessageSquare size={16} />
              {isInvoice ? 'Invoice Message' : isQuote ? 'Quote Message' : 'Message'}
            </label>
            <textarea
              value={message}
              onChange={(e) => onMessageChange(e.target.value)}
              rows={isQuote || isInvoice ? 14 : 6}
              className="input-field resize-none text-sm leading-relaxed"
              placeholder="Enter your message..."
            />
          </div>

          {result && (
            <div className={`rounded-lg px-4 py-3 text-sm ${
              result.type === 'success'
                ? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200'
                : 'bg-red-50 text-red-700 ring-1 ring-red-200'
            }`}>
              {result.text}
            </div>
          )}
        </div>

        <div className="flex shrink-0 gap-3 border-t border-slate-100 bg-slate-50 px-6 py-4">
          <button type="button" onClick={onClose} className="btn-secondary flex-1" disabled={sending}>
            Cancel
          </button>
          <button
            type="button"
            onClick={onSend}
            disabled={
              sending ||
              creatingCheckout ||
              !message.trim() ||
              !recipientPhone ||
              !canSendQuote ||
              !canSendInvoice
            }
            className={`btn-primary flex-1 ${
              isTechnician
                ? '!bg-emerald-600 hover:!bg-emerald-700'
                : isInvoice
                  ? '!bg-violet-600 hover:!bg-violet-700'
                  : ''
            }`}
          >
            <Send size={16} />
            {sending ? 'Sending...' : sendLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
