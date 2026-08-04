/** 3-Layer RBAC from CareIT Architecture + Field Technician */
export type UserRole =
  | 'administrator'       // Layer 3 — full system control
  | 'service_coordinator' // Layer 2 — assign & coordinate
  | 'support_associate'   // Layer 1 — intake & data entry
  | 'technician';         // Field worker — assigned tasks

export interface Permissions {
  viewDashboard: boolean;
  viewAddLead: boolean;
  viewManageLeads: boolean;
  viewOnsiteAppointments: boolean;
  viewMyTasks: boolean;
  editLeads: boolean;
  deleteLeads: boolean;
  assignTechnicians: boolean;
  manageAppointments: boolean;
  manageUsers: boolean;
  managePermissions: boolean;
}

export interface Account {
  id: string;
  username: string;
  password: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  permissions: Permissions;
  createdAt: string;
}

export interface User {
  id: string;
  username: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  permissions: Permissions;
  lastLogin: string;
}

export interface Lead {
  id: string;
  name: string;
  phone: string;
  email?: string;
  callDate: string;
  issueType: string;
  issueDescription: string;
  address?: string;
  appointmentDate?: string;
  comment: string;
  postCode: string;
  postCodeServiceable: boolean;
  deviceType: string;
  date: string;
  status: 'Assigned' | 'Not Fixed' | 'Appointment Done' | 'Converted' | 'Missed';
  leadUser: string;
  assignedClientId: string;
  assignedClientName: string;
  technician?: string;
  paymentAmount?: number;
  paymentMethod?: string;
  isOnsite: boolean;
  outcome?: string;
  assignedTo?: string;
  sentStatus?: 'SENT' | 'PENDING';
  sentToCustomer?: boolean;
  sentToTechnician?: boolean;
  technicianTimeDetail?: string;
  calloutFee?: number;
  troubleshootingFee?: number;
  /** Present when the lead came from the marketing website */
  webSource?: 'chat' | 'booking-form' | 'book-now' | string;
  submittedAt?: string;
}

export interface LeadFilters {
  name: string;
  phone: string;
  issueType: string;
  postCode: string;
  postCodeServiceable: string;
  callDateFrom: string;
  callDateTo: string;
  leadUser: string;
  leadStatus: string;
  deviceType: string;
  assignedClientId: string;
}

export interface OnsiteFilters {
  name: string;
  phone: string;
  paymentTakenThrough: string;
  issueStatus: string;
  appointmentDateFrom: string;
  appointmentDateTo: string;
  callDateFrom: string;
  callDateTo: string;
  leadUser: string;
  leadStatus: string;
  technician: string;
  assignedClientId: string;
}

export interface AddLeadForm {
  callDate: string;
  customerName: string;
  customerEmail: string;
  phoneNumber: string;
  customerAddress: string;
  postCode: string;
  outcome: string;
  issueType: string;
  deviceType: string;
  customerIssue: string;
  finalComments: string;
  assignedClientId: string;
}

export interface EditLeadForm {
  callDate: string;
  customerName: string;
  customerEmail: string;
  phoneNumber: string;
  customerAddress: string;
  postCode: string;
  outcome: string;
  assignedClientId: string;
  appointmentDateTime: string;
  technicianTimeDetail: string;
  calloutFee: string;
  troubleshootingFee: string;
  issueType: string;
  deviceType: string;
  customerIssue: string;
  finalComments: string;
}

export interface CreateClientForm {
  username: string;
  password: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  permissions: Permissions;
}
