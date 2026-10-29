export type EnrollmentStatus =
  | "Pending"
  | "For Payment Review"
  | "Approved"
  | "Enrolled"
  | "Rejected"
  | "Cancelled";

export type EnrollmentProgram =
  | "Certificate"
  | "Bachelor"
  | "Masteral"
  | "Doctorate";

export type EnrollmentType = "New" | "Returning" | "Transferee";

export type EnrollmentRecord = {
  applicationDate: string;
  application?: SeminaryApplicationDetails;
  contactNumber: string;
  documentsStatus: "Complete" | "Pending" | "For Verification";
  email: string;
  enrollmentId: string;
  enrollmentType: EnrollmentType;
  paymentStatus: "Paid" | "Pending" | "For Verification" | "Awaiting Proof";
  program: string;
  programLevel: EnrollmentProgram;
  status: EnrollmentStatus;
  studentId: string;
  studentName: string;
};

export const enrollmentProgramOptions = [
  "Certificate",
  "Bachelor",
  "Masteral",
  "Doctorate",
] as const;

export const enrollmentStatusOptions = [
  "Pending",
  "For Payment Review",
  "Approved",
  "Enrolled",
  "Rejected",
  "Cancelled",
] as const;

export const enrollmentTypeOptions = [
  "New",
  "Returning",
  "Transferee",
] as const;

export const enrollmentRecords: EnrollmentRecord[] = [
  {
    enrollmentId: "POTSC-ENR-2026-0001",
    studentId: "POTSC-2026-0001",
    studentName: "Joyce C. Orog",
    email: "joyce.orog@potsc.edu.ph",
    contactNumber: "09171234567",
    enrollmentType: "New",
    program: "Bachelor of Theology",
    programLevel: "Bachelor",
    applicationDate: "2026-05-18",
    documentsStatus: "For Verification",
    paymentStatus: "For Verification",
    status: "Pending",
  },
  {
    enrollmentId: "POTSC-ENR-2026-0002",
    studentId: "POTSC-2026-0002",
    studentName: "Ramon D. Elma",
    email: "ramon.elma@potsc.edu.ph",
    contactNumber: "09182345678",
    enrollmentType: "Returning",
    program: "Certificate in Chaplaincy Ministry",
    programLevel: "Certificate",
    applicationDate: "2026-05-17",
    documentsStatus: "Complete",
    paymentStatus: "Paid",
    status: "Enrolled",
  },
  {
    enrollmentId: "POTSC-ENR-2026-0003",
    studentId: "POTSC-2026-0003",
    studentName: "Grace T. Tolentino",
    email: "grace.tolentino@potsc.edu.ph",
    contactNumber: "09193456789",
    enrollmentType: "Transferee",
    program: "Master of Arts in Christian Education",
    programLevel: "Masteral",
    applicationDate: "2026-05-13",
    documentsStatus: "Pending",
    paymentStatus: "Awaiting Proof",
    status: "For Payment Review",
  },
  {
    enrollmentId: "POTSC-ENR-2026-0004",
    studentId: "POTSC-2026-0004",
    studentName: "Noel P. Santos",
    email: "noel.santos@potsc.edu.ph",
    contactNumber: "09204567890",
    enrollmentType: "New",
    program: "Doctor of Ministry",
    programLevel: "Doctorate",
    applicationDate: "2026-05-10",
    documentsStatus: "Complete",
    paymentStatus: "Paid",
    status: "Approved",
  },
  {
    enrollmentId: "POTSC-ENR-2026-0005",
    studentId: "POTSC-2026-0005",
    studentName: "Mira S. Candelaria",
    email: "mira.candelaria@potsc.edu.ph",
    contactNumber: "09215678901",
    enrollmentType: "New",
    program: "Master of Divinity",
    programLevel: "Masteral",
    applicationDate: "2026-05-08",
    documentsStatus: "Pending",
    paymentStatus: "Pending",
    status: "Pending",
  },
  {
    enrollmentId: "POTSC-ENR-2026-0006",
    studentId: "POTSC-2026-0006",
    studentName: "Samuel P. Dizon",
    email: "samuel.dizon@potsc.edu.ph",
    contactNumber: "09226789012",
    enrollmentType: "Returning",
    program: "Certificate in Biblical Studies",
    programLevel: "Certificate",
    applicationDate: "2026-05-07",
    documentsStatus: "Complete",
    paymentStatus: "Paid",
    status: "Enrolled",
  },
  {
    enrollmentId: "POTSC-ENR-2026-0007",
    studentId: "POTSC-2026-0007",
    studentName: "Teresa V. Mendoza",
    email: "teresa.mendoza@potsc.edu.ph",
    contactNumber: "09237890123",
    enrollmentType: "Transferee",
    program: "Master of Religious Education",
    programLevel: "Masteral",
    applicationDate: "2026-05-05",
    documentsStatus: "For Verification",
    paymentStatus: "For Verification",
    status: "For Payment Review",
  },
  {
    enrollmentId: "POTSC-ENR-2026-0008",
    studentId: "POTSC-2026-0008",
    studentName: "David B. Aquino",
    email: "david.aquino@potsc.edu.ph",
    contactNumber: "09248901234",
    enrollmentType: "New",
    program: "Doctor of Philosophy in Theology",
    programLevel: "Doctorate",
    applicationDate: "2026-05-02",
    documentsStatus: "Complete",
    paymentStatus: "Paid",
    status: "Approved",
  },
];

export const enrollmentTrend = [
  { week: "May 01", submitted: 3, enrolled: 1 },
  { week: "May 08", submitted: 5, enrolled: 2 },
  { week: "May 15", submitted: 7, enrolled: 4 },
  { week: "May 22", submitted: 6, enrolled: 5 },
  { week: "May 29", submitted: 4, enrolled: 3 },
] as const;

const programLevelLabelMap: Record<string, EnrollmentProgram> = {
  CERTIFICATE: "Certificate",
  BACHELOR: "Bachelor",
  MASTER_WITH_THESIS: "Masteral",
  DOCTORATE_WITH_DISSERTATION: "Doctorate",
};

const statusLabelMap: Record<string, EnrollmentStatus> = {
  SUBMITTED: "Pending",
  UNDER_REVIEW: "For Payment Review",
  APPROVED: "Approved",
  ENROLLED: "Enrolled",
  REJECTED: "Rejected",
  CANCELLED: "Cancelled",
};

const paymentStatusLabelMap: Record<
  string,
  EnrollmentRecord["paymentStatus"]
> = {
  PENDING: "For Verification",
  VERIFIED: "Paid",
  REJECTED: "Pending",
};

const enrollmentTypeLabelMap: Record<string, EnrollmentType> = {
  REGULAR: "New",
  TRANSFEREE: "Transferee",
  CROSS_ENROLLEE: "Returning",
};

const formatDate = (value?: string | null) => {
  if (!value) return "Not provided";

  return new Intl.DateTimeFormat("en", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
};

const getStudentName = (
  application: SeminaryApplicationDetails,
) =>
  [application.givenName, application.middleName, application.surname]
    .filter(Boolean)
    .join(" ");

const getDocumentsStatus = (
  application: SeminaryApplicationDetails,
): EnrollmentRecord["documentsStatus"] => {
  const requirements = application.requirements;

  if (!requirements) return "Pending";

  const uploadedCount = [
    requirements.transcriptOfRecordsUrl,
    requirements.idPictureUrl,
    requirements.pastorRecommendationUrl,
  ].filter(Boolean).length;

  if (uploadedCount === 3) return "Complete";
  if (uploadedCount > 0) return "For Verification";

  return "Pending";
};

export const mapSeminaryApplicationToEnrollmentRecord = (
  application: SeminaryApplicationDetails,
): EnrollmentRecord => ({
  application,
  applicationDate: formatDate(application.submittedAt ?? application.createdAt),
  contactNumber: application.mobilePhone ?? application.contactNumber ?? "Not provided",
  documentsStatus: getDocumentsStatus(application),
  email: application.emailAddress ?? application.member?.user?.email ?? "Not provided",
  enrollmentId: `POTSC-ENR-${application.createdAt.slice(0, 4)}-${application.id.slice(0, 8).toUpperCase()}`,
  enrollmentType:
    enrollmentTypeLabelMap[application.enrollmentType] ?? "New",
  paymentStatus: application.payment
    ? paymentStatusLabelMap[application.payment.status] ?? "For Verification"
    : "Awaiting Proof",
  program: application.programCourse ?? "No program set",
  programLevel: application.programLevel
    ? (programLevelLabelMap[application.programLevel] ?? "Certificate")
    : "Certificate",
  status: statusLabelMap[application.status] ?? "Pending",
  studentId:
    application.studentId ?? application.member?.uniqueId ?? "Pending student ID",
  studentName: getStudentName(application) || "Unnamed Applicant",
});
import type { SeminaryApplicationDetails } from "@/features/seminary/seminary.types";
