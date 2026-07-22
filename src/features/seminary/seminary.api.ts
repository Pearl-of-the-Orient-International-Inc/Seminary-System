import { api } from "@/lib/http-client";
import type {
  SeminaryApplicationsResponse,
  SeminaryApplicationAdminPayload,
  SeminaryApplicationPayload,
  SeminaryApplicationResponse,
  SeminaryApplicationStatus,
  SeminaryAcademicYearPayload,
  SeminaryAcademicYearResponse,
  SeminaryAcademicYearsResponse,
  SeminaryAcademicYearSession,
  SeminaryAcademicYearStatus,
  SeminaryCoursePayload,
  SeminaryCourseResponse,
  SeminaryCoursesResponse,
  SeminaryCourseStatus,
  SeminaryCredentialDocumentResponse,
  SeminaryCredentialDocumentsResponse,
  SeminaryCredentialDocumentType,
  SeminaryGradeConfigurationPayload,
  SeminaryGradeConfigurationResponse,
  SeminaryStudentPayload,
  SeminaryStudentBulkImportResponse,
  SeminaryStudentResponse,
  SeminaryStudentsResponse,
} from "./seminary.types";

export async function upsertCurrentSeminaryApplication(
  payload: SeminaryApplicationPayload,
) {
  const { data } = await api.put<SeminaryApplicationResponse>(
    "/seminary/current/application",
    payload,
  );

  return data;
}

export async function getCurrentSeminaryApplication() {
  const { data } = await api.get<SeminaryApplicationResponse>(
    "/seminary/current/application",
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
    { params },
  );

  return data;
}

export async function createSeminaryApplication(
  payload: SeminaryApplicationAdminPayload,
) {
  const { data } = await api.post<SeminaryApplicationResponse>(
    "/seminary/applications",
    payload,
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
    { status, reviewRemarks },
  );

  return data;
}

export async function getSeminaryStudents(params?: {
  academicYear?: string;
  limit?: number;
  page?: number;
  programLevel?: string;
  search?: string;
  schoolAffiliation?: string;
  studentStatus?: string;
}) {
  const { data } = await api.get<SeminaryStudentsResponse>(
    "/seminary/students",
    { params },
  );

  return data;
}

export async function getSeminaryStudent(studentId: string) {
  const { data } = await api.get<SeminaryStudentResponse>(
    `/seminary/students/${encodeURIComponent(studentId)}`,
  );

  return data;
}

export async function createSeminaryStudent(payload: SeminaryStudentPayload) {
  const { data } = await api.post<SeminaryStudentResponse>(
    "/seminary/students",
    payload,
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
    payload,
  );

  return data;
}

export async function deleteSeminaryStudent(studentId: string) {
  const { data } = await api.delete<{ code: string; message: string }>(
    `/seminary/students/${encodeURIComponent(studentId)}`,
  );

  return data;
}

export async function bulkImportSeminaryStudents(payload: {
  students: SeminaryStudentPayload[];
}) {
  const { data } = await api.post<SeminaryStudentBulkImportResponse>(
    "/seminary/students/bulk-import",
    payload,
  );

  return data;
}

export async function bulkDeleteSeminaryStudents(payload: {
  studentIds: string[];
}) {
  const { data } = await api.delete<{
    code: string;
    data: { count: number };
    message: string;
  }>("/seminary/students/bulk-delete", { data: payload });

  return data;
}

export async function getSeminaryCourses(params?: {
  limit?: number;
  modality?: string;
  page?: number;
  program?: string;
  search?: string;
  status?: string;
}) {
  const { data } = await api.get<SeminaryCoursesResponse>(
    "/seminary/courses",
    { params },
  );

  return data;
}

export async function createSeminaryCourse(payload: SeminaryCoursePayload) {
  const { data } = await api.post<SeminaryCourseResponse>(
    "/seminary/courses",
    payload,
  );

  return data;
}

export async function updateSeminaryCourse({
  id,
  payload,
}: {
  id: string;
  payload: SeminaryCoursePayload;
}) {
  const { data } = await api.put<SeminaryCourseResponse>(
    `/seminary/courses/${encodeURIComponent(id)}`,
    payload,
  );

  return data;
}

export async function updateSeminaryCourseStatus({
  id,
  status,
}: {
  id: string;
  status: SeminaryCourseStatus;
}) {
  const { data } = await api.patch<SeminaryCourseResponse>(
    `/seminary/courses/${encodeURIComponent(id)}/status`,
    { status },
  );

  return data;
}

export async function deleteSeminaryCourse(id: string) {
  const { data } = await api.delete<{ code: string; message: string }>(
    `/seminary/courses/${encodeURIComponent(id)}`,
  );

  return data;
}

export async function getSeminaryAcademicYears(params?: {
  limit?: number;
  page?: number;
  search?: string;
  session?: string;
  status?: string;
}) {
  const { data } = await api.get<SeminaryAcademicYearsResponse>(
    "/seminary/academic-years",
    { params },
  );

  return data;
}

export async function createSeminaryAcademicYear(
  payload: SeminaryAcademicYearPayload,
) {
  const { data } = await api.post<SeminaryAcademicYearResponse>(
    "/seminary/academic-years",
    payload,
  );

  return data;
}

export async function updateSeminaryAcademicYear({
  id,
  payload,
}: {
  id: string;
  payload: SeminaryAcademicYearPayload;
}) {
  const { data } = await api.put<SeminaryAcademicYearResponse>(
    `/seminary/academic-years/${encodeURIComponent(id)}`,
    payload,
  );

  return data;
}

export async function updateSeminaryAcademicYearSession({
  id,
  session,
}: {
  id: string;
  session: SeminaryAcademicYearSession;
}) {
  const { data } = await api.patch<SeminaryAcademicYearResponse>(
    `/seminary/academic-years/${encodeURIComponent(id)}/session`,
    { session },
  );

  return data;
}

export async function updateSeminaryAcademicYearStatus({
  id,
  status,
}: {
  id: string;
  status: SeminaryAcademicYearStatus;
}) {
  const { data } = await api.patch<SeminaryAcademicYearResponse>(
    `/seminary/academic-years/${encodeURIComponent(id)}/status`,
    { status },
  );

  return data;
}

export async function deleteSeminaryAcademicYear(id: string) {
  const { data } = await api.delete<{ code: string; message: string }>(
    `/seminary/academic-years/${encodeURIComponent(id)}`,
  );

  return data;
}

export async function getSeminaryGradeConfiguration() {
  const { data } = await api.get<SeminaryGradeConfigurationResponse>(
    "/seminary/grade-configuration",
  );

  return data;
}

export async function updateSeminaryGradeConfiguration(
  payload: SeminaryGradeConfigurationPayload,
) {
  const { data } = await api.put<SeminaryGradeConfigurationResponse>(
    "/seminary/grade-configuration",
    payload,
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
    payload,
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
    { params: { type } },
  );

  return data;
}

export async function verifySeminaryCredentialDocument(token: string) {
  const { data } = await api.get<SeminaryCredentialDocumentResponse>(
    `/seminary/credential-documents/verify/${encodeURIComponent(token)}`,
  );

  return data;
}
