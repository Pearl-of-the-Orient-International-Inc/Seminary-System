import type { LucideIcon } from "lucide-react";
import {
  Award,
  FileCheck2,
  FileSpreadsheet,
  GraduationCap,
  ScrollText,
  ShieldCheck,
} from "lucide-react";

export type SeminaryDocumentType =
  | "CERTIFICATE"
  | "TRANSCRIPT"
  | "DIPLOMA"
  | "ACADEMIC_RECORD"
  | "CLEARANCE"
  | "OTHER";

export type SeminaryDocumentTemplate = {
  value: SeminaryDocumentType;
  title: string;
  description: string;
  icon: LucideIcon;
  available: boolean;
};

export type SeminaryDocumentRecord = {
  id: string;
  referenceNumber: string;
  type: SeminaryDocumentType;
  title: string;
  studentName: string;
  program: string;
  status: "DRAFT" | "READY" | "RELEASED";
  issuedAt: string;
};

export const seminaryDocumentTemplates: SeminaryDocumentTemplate[] = [
  { value: "CERTIFICATE", title: "Certificate", description: "Create certificates of completion, enrollment, or good moral character.", icon: Award, available: false },
  { value: "TRANSCRIPT", title: "Transcript of Records", description: "Prepare an official academic transcript with subjects, grades, and units.", icon: FileSpreadsheet, available: true },
  { value: "DIPLOMA", title: "Diploma", description: "Issue a formal diploma for a student who has completed a program.", icon: GraduationCap, available: false },
  { value: "ACADEMIC_RECORD", title: "Academic Record", description: "Generate a certified academic record or grade report for school use.", icon: ScrollText, available: false },
  { value: "CLEARANCE", title: "Clearance", description: "Prepare an official clearance or eligibility document for a student.", icon: ShieldCheck, available: false },
  { value: "OTHER", title: "Other Document", description: "Start a flexible school document for other registrar requirements.", icon: FileCheck2, available: false },
];

export const seminaryDocumentRecords: SeminaryDocumentRecord[] = [
  { id: "sem-doc-001", referenceNumber: "POTSC-2026-00041", type: "CERTIFICATE", title: "Certificate of Enrollment", studentName: "Maria C. Santos", program: "Bachelor of Theology", status: "RELEASED", issuedAt: "2026-11-21T09:30:00+08:00" },
  { id: "sem-doc-002", referenceNumber: "POTSC-2026-00042", type: "TRANSCRIPT", title: "Official Transcript of Records", studentName: "Joshua M. Reyes", program: "Master of Divinity", status: "READY", issuedAt: "2026-11-22T14:15:00+08:00" },
  { id: "sem-doc-003", referenceNumber: "POTSC-2026-00043", type: "DIPLOMA", title: "Diploma in Chaplaincy Studies", studentName: "Ruth A. Mendoza", program: "Certificate in Chaplaincy", status: "DRAFT", issuedAt: "2026-11-24T08:00:00+08:00" },
];

export const documentTypeLabels: Record<SeminaryDocumentType, string> = {
  CERTIFICATE: "Certificate",
  TRANSCRIPT: "Transcript",
  DIPLOMA: "Diploma",
  ACADEMIC_RECORD: "Academic Record",
  CLEARANCE: "Clearance",
  OTHER: "Other",
};
