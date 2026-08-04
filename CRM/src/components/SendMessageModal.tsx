import { useEffect, useState } from 'react';
import { X, Send, User, Wrench, MapPin, Calendar, MessageSquare, Clock } from 'lucide-react';
import {
  buildQuoteMessage,
  defaultQuoteFees,
} from '../utils/sms';
import type { Lead } from '../types';

export type MessageTarget = 'customer' | 'technician';

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
}: SendMessageModalProps) {
  const isCustomer = target === 'customer';
  const defaults = defaultQuoteFees(lead);
  const [visitTime, setVisitTime] = useState('');
  const [calloutFee, setCalloutFee] = useState(String(defaults.calloutFee));
  const [troubleshootingFee, setTroubleshootingFee] = useState(String(defaults.troubleshootingFee));

  useEffect(() => {
    if (!open || !isCustomer) return;

    const fees = defaultQuoteFees(lead);
    const time =
      lead.technicianTimeDetail?.trim() ||
      lead.appointmentDate?.trim() ||
      '';

    setVisitTime(time);
    setCalloutFee(String(fees.calloutFee));
    setTroubleshootingFee(String(fees.troubleshootingFee));

    onMessageChange(
      buildQuoteMessage(lead, {
        visitTime: time,
        calloutFee: fees.calloutFee,
        troubleshootingFee: fees.troubleshootingFee,
      }),
    );
  }, [open, isCustomer, lead.id]);

  function applyQuoteTemplate(time: string, callout: string, troubleshooting: string) {
    onMessageChange(
      buildQuoteMessage(lead, {
        visitTime: time,
        calloutFee: parseFloat(callout) || 49,
        troubleshootingFee: parseFloat(troubleshooting) || 149,
      }),
    );
  }

  function handleVisitTimeChange(value: string) {
    setVisitTime(value);
    applyQuoteTemplate(value, calloutFee, troubleshootingFee);
  }

  function handleCalloutChange(value: string) {
    setCalloutFee(value);
    applyQuoteTemplate(visitTime, value, troubleshootingFee);
  }

  function handleTroubleshootingChange(value: string) {
    setTroubleshootingFee(value);
    applyQuoteTemplate(visitTime, calloutFee, value);
  }

  if (!open) return null;

  const canSendQuote = isCustomer ? visitTime.trim().length > 0 : true;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
        onClick={onClose}
        aria-label="Close modal"
      />

      <div className="relative z-10 flex max-h-[92vh] w-full max-w-lg flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
        <div className={`flex shrink-0 items-center justify-between px-6 py-4 text-white ${
          isCustomer ? 'bg-gradient-to-r from-blue-600 to-blue-700' : 'bg-gradient-to-r from-emerald-600 to-emerald-700'
        }`}>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20">
              {isCustomer ? <User size={20} /> : <Wrench size={20} />}
            </div>
            <div>
              <h2 className="text-lg font-semibold">
                {isCustomer ? 'Send Quote' : 'Send to Technician'}
              </h2>
              <p className="text-sm text-white/80">
                {isCustomer
                  ? 'Quote message auto-fills with customer name & fees'
                  : 'Review message details before sending'}
              </p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="rounded-lg p-1.5 transition hover:bg-white/20">
            <X size={20} />
          </button>
        </div>

        <div className="min-h-0 flex-1 space-y-4 overflow-y-auto p-6">
          {isCustomer && (
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
              <p className="mt-2 text-[10px] text-slate-500">
                Customer name ({lead.name.split(/\s+/)[0]}) is inserted automatically in the message below.
              </p>
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
              {!isCustomer && lead.assignedClientName && (
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
              {isCustomer ? 'Quote Message' : 'Message'}
            </label>
            <textarea
              value={message}
              onChange={(e) => onMessageChange(e.target.value)}
              rows={isCustomer ? 14 : 6}
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
            disabled={sending || !message.trim() || !recipientPhone || !canSendQuote}
            className={`btn-primary flex-1 ${isCustomer ? '' : '!bg-emerald-600 hover:!bg-emerald-700'}`}
          >
            <Send size={16} />
            {sending ? 'Sending...' : isCustomer ? 'Send Quote' : 'Send Message'}
          </button>
        </div>
      </div>
    </div>
  );
}
