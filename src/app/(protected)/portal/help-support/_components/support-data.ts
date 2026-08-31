export type SupportTicketStatus =
  | "Open"
  | "In Progress"
  | "Escalated"
  | "Resolved";

export type SupportPriority = "Low" | "Medium" | "High" | "Urgent";

export type SupportCategory =
  | "Accounts"
  | "Enrollment"
  | "Grades"
  | "LMS"
  | "Payments"
  | "Reports";

export type SupportTicket = {
  ticketNumber: string;
  raisedBy: string;
  raisedByRole: "Student" | "Faculty" | "Staff";
  subject: string;
  category: SupportCategory;
  priority: SupportPriority;
  status: SupportTicketStatus;
  program: string;
  channel: "Portal" | "Email" | "Walk-in";
  assignedTo: string;
  raisedOn: string;
  lastUpdated: string;
  contactEmail: string;
  contactNumber: string;
  summary: string;
  resolutionNote: string;
};

export const supportStatusOptions: SupportTicketStatus[] = [
  "Open",
  "In Progress",
  "Escalated",
  "Resolved",
];

export const supportPriorityOptions: SupportPriority[] = [
  "Low",
  "Medium",
  "High",
  "Urgent",
];

export const supportCategoryOptions: SupportCategory[] = [
  "Accounts",
  "Enrollment",
  "Grades",
  "LMS",
  "Payments",
  "Reports",
];

export const supportTickets: SupportTicket[] = [
  {
    ticketNumber: "POTSC-SUP-2026-0001",
    raisedBy: "Joyce C. Oroo",
    raisedByRole: "Student",
    subject: "Unable to access enrollment confirmation page",
    category: "Enrollment",
    priority: "High",
    status: "In Progress",
    program: "Bachelor of Theology",
    channel: "Portal",
    assignedTo: "Registrar Desk",
    raisedOn: "2026-05-18 09:10 AM",
    lastUpdated: "2026-05-21 10:45 AM",
    contactEmail: "joyce.oroo@example.com",
    contactNumber: "09171234567",
    summary:
      "Student completed requirements but the portal returns to the enrollment checklist without showing confirmation.",
    resolutionNote:
      "Registrar is validating the enrollment status sync with the payment posting record.",
  },
  {
    ticketNumber: "POTSC-SUP-2026-0002",
    raisedBy: "Rev. Daniel Reyes",
    raisedByRole: "Faculty",
    subject: "Midterm grades cannot be submitted for Masteral class",
    category: "Grades",
    priority: "Urgent",
    status: "Escalated",
    program: "Master of Arts in Christian Education",
    channel: "Email",
    assignedTo: "Academic Systems Team",
    raisedOn: "2026-05-19 01:40 PM",
    lastUpdated: "2026-05-21 02:05 PM",
    contactEmail: "daniel.reyes@example.com",
    contactNumber: "09182345678",
    summary:
      "The faculty portal rejects grade submissions for one class section and displays a permission mismatch message.",
    resolutionNote:
      "Issue elevated to system admin due to grading term configuration mismatch.",
  },
  {
    ticketNumber: "POTSC-SUP-2026-0003",
    raisedBy: "Maria L. Santos",
    raisedByRole: "Student",
    subject: "Receipt not reflecting after partial payment",
    category: "Payments",
    priority: "Medium",
    status: "Open",
    program: "Bachelor of Theology",
    channel: "Portal",
    assignedTo: "Finance Office",
    raisedOn: "2026-05-20 08:25 AM",
    lastUpdated: "2026-05-20 08:25 AM",
    contactEmail: "maria.santos@example.com",
    contactNumber: "09193456789",
    summary:
      "Student uploaded proof of partial payment, but the ledger still shows the previous balance with no receipt reference.",
    resolutionNote:
      "Pending finance review of the uploaded proof of payment and manual validation.",
  },
  {
    ticketNumber: "POTSC-SUP-2026-0004",
    raisedBy: "Ruth A. Mendoza",
    raisedByRole: "Staff",
    subject: "Monthly reports export is timing out",
    category: "Reports",
    priority: "High",
    status: "Resolved",
    program: "Institutional",
    channel: "Walk-in",
    assignedTo: "IT Support",
    raisedOn: "2026-05-17 03:15 PM",
    lastUpdated: "2026-05-20 05:10 PM",
    contactEmail: "ruth.mendoza@example.com",
    contactNumber: "09204567890",
    summary:
      "Administrative reports for May were not exporting properly when filtered by the full semester range.",
    resolutionNote:
      "Print/export timeout was optimized and validated with the reports office.",
  },
  {
    ticketNumber: "POTSC-SUP-2026-0005",
    raisedBy: "Ezekiel M. Cruz",
    raisedByRole: "Student",
    subject: "Course materials in Chaplaincy 101 will not load",
    category: "LMS",
    priority: "Medium",
    status: "In Progress",
    program: "Certificate in Chaplaincy Ministry",
    channel: "Portal",
    assignedTo: "LMS Support",
    raisedOn: "2026-05-18 06:30 PM",
    lastUpdated: "2026-05-21 11:20 AM",
    contactEmail: "ezekiel.cruz@example.com",
    contactNumber: "09215678901",
    summary:
      "Two lesson resources in the LMS remain blank after opening, while other modules load successfully.",
    resolutionNote:
      "Content links are being refreshed and mirrored to the alternate viewer.",
  },
  {
    ticketNumber: "POTSC-SUP-2026-0006",
    raisedBy: "Priscilla V. Dizon",
    raisedByRole: "Student",
    subject: "Password reset email not received",
    category: "Accounts",
    priority: "Low",
    status: "Resolved",
    program: "Doctor of Ministry",
    channel: "Email",
    assignedTo: "IT Support",
    raisedOn: "2026-05-16 10:05 AM",
    lastUpdated: "2026-05-16 11:12 AM",
    contactEmail: "priscilla.dizon@example.com",
    contactNumber: "09226789012",
    summary:
      "User requested a password reset twice but the email did not appear in the inbox.",
    resolutionNote:
      "Verified spam filtering issue and confirmed successful reset delivery.",
  },
];
