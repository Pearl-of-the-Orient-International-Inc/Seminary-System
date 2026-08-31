export type DocumentRequestStatus =
  | "Pending"
  | "Processing"
  | "Ready for Release"
  | "Released";

export type RequestedDocument =
  | "Transcript of Records"
  | "Certificate of Enrollment"
  | "Certificate of Grades"
  | "Good Moral Certificate"
  | "Honorable Dismissal";

export type RequestProgram =
  | "Certificate"
  | "Bachelor"
  | "Masteral"
  | "Doctorate";

export type DeliveryMethod = "Pickup" | "Courier" | "Email";

export type DocumentRequestRecord = {
  contactNumber: string;
  deliveryMethod: DeliveryMethod;
  email: string;
  purpose: string;
  referenceNumber: string;
  requestedDocument: RequestedDocument;
  requestedOn: string;
  requesterName: string;
  requesterStudentId: string;
  status: DocumentRequestStatus;
  studentProgram: string;
  studentProgramLevel: RequestProgram;
};

export const documentStatusOptions = [
  "Pending",
  "Processing",
  "Ready for Release",
  "Released",
] as const;

export const requestedDocumentOptions = [
  "Transcript of Records",
  "Certificate of Enrollment",
  "Certificate of Grades",
  "Good Moral Certificate",
  "Honorable Dismissal",
] as const;

export const requestProgramOptions = [
  "Certificate",
  "Bachelor",
  "Masteral",
  "Doctorate",
] as const;

export const documentRequestRecords: DocumentRequestRecord[] = [
  {
    referenceNumber: "POTSC-DOC-2026-0001",
    requesterStudentId: "POTSC-2026-0002",
    requesterName: "Maria L. Santos",
    email: "maria.santos@potsc.edu.ph",
    contactNumber: "09181234567",
    requestedDocument: "Transcript of Records",
    studentProgram: "Bachelor of Theology",
    studentProgramLevel: "Bachelor",
    purpose: "Transfer credential evaluation",
    deliveryMethod: "Pickup",
    requestedOn: "2026-05-18",
    status: "Processing",
  },
  {
    referenceNumber: "POTSC-DOC-2026-0002",
    requesterStudentId: "POTSC-2026-0005",
    requesterName: "Josephine M. Rivera",
    email: "josephine.rivera@potsc.edu.ph",
    contactNumber: "09213456789",
    requestedDocument: "Certificate of Grades",
    studentProgram: "Master of Arts in Christian Education",
    studentProgramLevel: "Masteral",
    purpose: "Scholarship renewal",
    deliveryMethod: "Email",
    requestedOn: "2026-05-17",
    status: "Ready for Release",
  },
  {
    referenceNumber: "POTSC-DOC-2026-0003",
    requesterStudentId: "POTSC-2026-0001",
    requesterName: "Juan Dela Cruz",
    email: "juan.delacruz@potsc.edu.ph",
    contactNumber: "09171234567",
    requestedDocument: "Certificate of Enrollment",
    studentProgram: "Certificate in Chaplaincy Ministry",
    studentProgramLevel: "Certificate",
    purpose: "Ministry deployment requirement",
    deliveryMethod: "Email",
    requestedOn: "2026-05-16",
    status: "Released",
  },
  {
    referenceNumber: "POTSC-DOC-2026-0004",
    requesterStudentId: "POTSC-2026-0010",
    requesterName: "David B. Aquino",
    email: "david.aquino@potsc.edu.ph",
    contactNumber: "09268901234",
    requestedDocument: "Good Moral Certificate",
    studentProgram: "Doctor of Philosophy in Theology",
    studentProgramLevel: "Doctorate",
    purpose: "External ministry endorsement",
    deliveryMethod: "Pickup",
    requestedOn: "2026-05-15",
    status: "Pending",
  },
  {
    referenceNumber: "POTSC-DOC-2026-0005",
    requesterStudentId: "POTSC-2026-0008",
    requesterName: "Michael C. Gamboa",
    email: "michael.gamboa@potsc.edu.ph",
    contactNumber: "09246789012",
    requestedDocument: "Honorable Dismissal",
    studentProgram: "Bachelor of Theology",
    studentProgramLevel: "Bachelor",
    purpose: "Transfer to another institution",
    deliveryMethod: "Courier",
    requestedOn: "2026-05-12",
    status: "Processing",
  },
  {
    referenceNumber: "POTSC-DOC-2026-0006",
    requesterStudentId: "POTSC-2026-0009",
    requesterName: "Teresa V. Mendoza",
    email: "teresa.mendoza@potsc.edu.ph",
    contactNumber: "09257890123",
    requestedDocument: "Certificate of Enrollment",
    studentProgram: "Master of Religious Education",
    studentProgramLevel: "Masteral",
    purpose: "Visa extension processing",
    deliveryMethod: "Email",
    requestedOn: "2026-05-10",
    status: "Released",
  },
  {
    referenceNumber: "POTSC-DOC-2026-0007",
    requesterStudentId: "POTSC-2026-0006",
    requesterName: "Benjamin T. Reyes",
    email: "benjamin.reyes@potsc.edu.ph",
    contactNumber: "09224567890",
    requestedDocument: "Transcript of Records",
    studentProgram: "Doctor of Ministry",
    studentProgramLevel: "Doctorate",
    purpose: "Academic portfolio submission",
    deliveryMethod: "Courier",
    requestedOn: "2026-05-09",
    status: "Ready for Release",
  },
  {
    referenceNumber: "POTSC-DOC-2026-0008",
    requesterStudentId: "POTSC-2026-0012",
    requesterName: "Samuel P. Dizon",
    email: "samuel.dizon@potsc.edu.ph",
    contactNumber: "09280123456",
    requestedDocument: "Certificate of Grades",
    studentProgram: "Certificate in Chaplaincy Ministry",
    studentProgramLevel: "Certificate",
    purpose: "Internal clearance",
    deliveryMethod: "Pickup",
    requestedOn: "2026-05-08",
    status: "Pending",
  },
];
