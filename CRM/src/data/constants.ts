export const ISSUE_TYPES = [
  'Printer',
  'Social Media',
  'Google/Gmail',
  'Outlook',
  'Onsite - Misc',
  'Computer/Laptop',
  'Network',
  'Software',
  'Web development',
];

export const DEVICE_TYPES = [
  'Desktop',
  'Laptop',
  'Tablet',
  'Mobile',
  'Printer',
  'Router',
  'Others',
];

export const APPOINTMENT_TYPES = ['Online', 'Onsite'] as const;

export const OUTCOMES = [
  'Resolved',
  'Onsite Fixed',
  'Follow Up',
  'Appointment Booked',
  'Not Converted',
  'Missed Call',
  'Customer Converted',
];

export const LEAD_STATUSES = [
  'Assigned',
  'Not Fixed',
  'Appointment Done',
  'Converted',
  'Missed',
];

export const FAR_TECH_OPTIONS = ['No', 'Yes'] as const;

export const PAYMENT_METHODS = ['Card', 'Cash', 'Bank Transfer', 'PayPal'];

export const LEADS_STORAGE_KEY = 'careit_leads';

export const ACCOUNTS_STORAGE_KEY = 'careit_accounts';
