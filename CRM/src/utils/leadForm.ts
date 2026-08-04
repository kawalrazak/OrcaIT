import type { EditLeadForm, Lead } from '../types';
import type { Account } from '../types';

export function leadToEditForm(lead: Lead): EditLeadForm {
  return {
    callDate: lead.callDate || '',
    customerName: lead.name || '',
    customerEmail: lead.email || '',
    phoneNumber: lead.phone || '',
    customerAddress: lead.address || '',
    postCode: lead.postCode || '',
    outcome: lead.outcome || '',
    assignedClientId: lead.assignedClientId || '',
    appointmentDateTime: lead.appointmentDate || '',
    technicianTimeDetail: lead.technicianTimeDetail || '',
    calloutFee: lead.calloutFee != null ? String(lead.calloutFee) : '',
    troubleshootingFee:
      lead.troubleshootingFee != null
        ? String(lead.troubleshootingFee)
        : lead.paymentAmount != null
          ? String(lead.paymentAmount)
          : '',
    issueType: lead.issueType || '',
    deviceType: lead.deviceType || '',
    customerIssue: lead.issueDescription || '',
    finalComments: lead.comment || '',
  };
}

export function editFormToLeadUpdates(
  form: EditLeadForm,
  technician?: Account | null,
): Partial<Lead> {
  const callout = parseFloat(form.calloutFee) || 0;
  const troubleshooting = parseFloat(form.troubleshootingFee) || 0;

  const updates: Partial<Lead> = {
    name: form.customerName.trim(),
    phone: form.phoneNumber.trim(),
    email: form.customerEmail.trim() || undefined,
    callDate: form.callDate,
    address: form.customerAddress.trim() || undefined,
    postCode: form.postCode.trim(),
    outcome: form.outcome,
    issueType: form.issueType,
    deviceType: form.deviceType,
    issueDescription: form.customerIssue.trim(),
    comment: form.finalComments.trim(),
    appointmentDate: form.appointmentDateTime.trim() || undefined,
    technicianTimeDetail: form.technicianTimeDetail.trim() || undefined,
    calloutFee: callout,
    troubleshootingFee: troubleshooting,
    paymentAmount: troubleshooting > 0 ? troubleshooting : undefined,
    assignedClientId: technician?.id ?? '',
    assignedClientName: technician?.name ?? '',
    technician: technician?.name ?? '',
    isOnsite: form.issueType.includes('Onsite') || form.outcome.includes('Onsite'),
  };

  if (technician?.id) {
    updates.status = 'Assigned';
  }

  return updates;
}
