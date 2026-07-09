import { api } from "@/lib/http-client";
import type {
  SeminaryApplicationsResponse,
  SeminaryApplicationPayload,
  SeminaryApplicationResponse,
  SeminaryApplicationStatus,
  SeminaryCredentialDocumentResponse,
  SeminaryCredentialDocumentsResponse,
  SeminaryCredentialDocumentType,
  SeminaryStudentPayload,
  SeminaryStudentBulkImportResponse,
  SeminaryStudentResponse,
  SeminaryStudentsResponse,
} from "./seminary.types";

export async function upsertCurrentSeminaryApplication(
  payload: SeminaryApplicationPayload
) {
  const { data } = await api.put<SeminaryApplicationResponse>(
    "/seminary/current/application",
    payload
  );

  return data;
}

export async function getCurrentSeminaryApplication() {
  const { data } = await api.get<SeminaryApplicationResponse>(
    "/seminary/current/application"
  );

  return data;
}

export async function getSeminaryApplications(params?: {
  page?: number;
  limit?: number;
  search?: string;
  status?: SeminaryApplicationStatus;
}) {
  const { data } = await api.get<SeminaryApplicationsResponse>(
    "/seminary/applications",
    { params }
  );

  return data;
}

export async function updateSeminaryApplicationStatus({
  id,
  reviewRemarks,
  status,
}: {
  id: string;
  reviewRemarks?: string;
  status: Exclude<SeminaryApplicationStatus, "SUBMITTED" | "CANCELLED">;
}) {
  const { data } = await api.patch<SeminaryApplicationResponse>(
    `/seminary/applications/${id}/status`,
    { status, reviewRemarks }
  );

  return data;
}

export async function getSeminaryStudents(params?: {
  academicYear?: string;
  limit?: number;
  page?: number;
  programLevel?: string;
  search?: string;
  studentStatus?: string;
}) {
  const { data } = await api.get<SeminaryStudentsResponse>(
    "/seminary/students",
    { params }
  );

  return data;
}

export async function getSeminaryStudent(studentId: string) {
  const { data } = await api.get<SeminaryStudentResponse>(
    `/seminary/students/${encodeURIComponent(studentId)}`
  );

  return data;
}

export async function createSeminaryStudent(payload: SeminaryStudentPayload) {
  const { data } = await api.post<SeminaryStudentResponse>(
    "/seminary/students",
    payload
  );

  return data;
}

export async function updateSeminaryStudent({
  payload,
  studentId,
}: {
  payload: SeminaryStudentPayload;
  studentId: string;
}) {
  const { data } = await api.put<SeminaryStudentResponse>(
    `/seminary/students/${encodeURIComponent(studentId)}`,
    payload
  );

  return data;
}

export async function bulkImportSeminaryStudents(payload: {
  students: SeminaryStudentPayload[];
}) {
  const { data } = await api.post<SeminaryStudentBulkImportResponse>(
    "/seminary/students/bulk-import",
    payload
  );

  return data;
}

export async function generateSeminaryCredentialDocument({
  payload,
  studentId,
}: {
  payload: {
    remarks?: string;
    title?: string;
    type: SeminaryCredentialDocumentType;
  };
  studentId: string;
}) {
  const { data } = await api.post<SeminaryCredentialDocumentResponse>(
    `/seminary/students/${encodeURIComponent(studentId)}/credential-documents`,
    payload
  );

  return data;
}

export async function getSeminaryCredentialDocuments({
  studentId,
  type,
}: {
  studentId: string;
  type?: SeminaryCredentialDocumentType;
}) {
  const { data } = await api.get<SeminaryCredentialDocumentsResponse>(
    `/seminary/students/${encodeURIComponent(studentId)}/credential-documents`,
    { params: { type } }
  );

  return data;
}

export async function verifySeminaryCredentialDocument(token: string) {
  const { data } = await api.get<SeminaryCredentialDocumentResponse>(
    `/seminary/credential-documents/verify/${encodeURIComponent(token)}`
  );

  return data;
}
