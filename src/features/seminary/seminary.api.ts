import { api } from "@/lib/http-client";
import type {
  SeminaryApplicationsResponse,
  SeminaryApplicationAdminPayload,
  SeminaryApplicationPayload,
  SeminaryApplicationResponse,
  SeminaryApplicationStatus,
  SeminaryAssignmentPayload,
  SeminaryAssignmentResponse,
  SeminaryAssignmentsResponse,
  SeminaryAssignmentStatus,
  SeminaryExaminationPayload,
  SeminaryExaminationResponse,
  SeminaryExaminationsResponse,
  SeminaryExaminationStatus,
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
  MemberCredentialDocumentResponse,
  SeminaryGradeConfigurationPayload,
  SeminaryGradeConfigurationResponse,
  SeminaryFeeConfigurationPayload,
  SeminaryFeeConfigurationResponse,
  SeminaryFeeCollectionResponse,
  SeminaryFeeCollectionsResponse,
  SeminaryFeeCollectionPaymentPayload,
  SeminaryFeeCollectionStatus,
  SeminaryGradeRecordPayload,
  SeminaryGradeRecordResponse,
  SeminaryGradeRecordsResponse,
  SeminaryGradeRecordStatus,
  SeminaryInstructorPayload,
  SeminaryInstructorResponse,
  SeminaryInstructorInviteResponse,
  SeminaryInstructorsResponse,
  SeminaryInstructorStatus,
  SeminaryStudyMaterialPayload,
  SeminaryStudyMaterialResponse,
  SeminaryStudyMaterialsResponse,
  SeminaryStudyMaterialStatus,
  SeminaryStudyMaterialType,
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
  status: Exclude<SeminaryApplicationStatus, "SUBMITTED">;
}) {
  const { data } = await api.patch<SeminaryApplicationResponse>(
    `/seminary/applications/${id}/status`,
    { status, reviewRemarks },
  );

  return data;
}

export async function getSeminaryEnrollments(params?: {
  page?: number;
  limit?: number;
  search?: string;
  status?: SeminaryApplicationStatus;
}) {
  const { data } = await api.get<SeminaryApplicationsResponse>(
    "/seminary/enrollments",
    { params },
  );

  return data;
}

export async function updateSeminaryEnrollmentStatus({
  id,
  reviewRemarks,
  status,
}: {
  id: string;
  reviewRemarks?: string;
  status: Exclude<SeminaryApplicationStatus, "SUBMITTED">;
}) {
  const { data } = await api.patch<SeminaryApplicationResponse>(
    `/seminary/enrollments/${id}/status`,
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

export async function getSeminaryStudyMaterials(params?: {
  limit?: number;
  page?: number;
  search?: string;
  status?: SeminaryStudyMaterialStatus;
  subject?: string;
  type?: SeminaryStudyMaterialType;
}) {
  const { data } = await api.get<SeminaryStudyMaterialsResponse>(
    "/seminary/study-materials",
    { params },
  );

  return data;
}

export async function createSeminaryStudyMaterial(
  payload: SeminaryStudyMaterialPayload,
) {
  const { data } = await api.post<SeminaryStudyMaterialResponse>(
    "/seminary/study-materials",
    payload,
  );

  return data;
}

export async function updateSeminaryStudyMaterial({
  id,
  payload,
}: {
  id: string;
  payload: Omit<
    SeminaryStudyMaterialPayload,
    "fileName" | "fileSize" | "fileUrl" | "mimeType"
  >;
}) {
  const { data } = await api.put<SeminaryStudyMaterialResponse>(
    `/seminary/study-materials/${encodeURIComponent(id)}`,
    payload,
  );

  return data;
}

export async function deleteSeminaryStudyMaterial(id: string) {
  const { data } = await api.delete<{ code: string; message: string }>(
    `/seminary/study-materials/${encodeURIComponent(id)}`,
  );

  return data;
}

export async function getSeminaryAssignments(params?: {
  limit?: number;
  page?: number;
  search?: string;
  status?: SeminaryAssignmentStatus;
  subject?: string;
}) {
  const { data } = await api.get<SeminaryAssignmentsResponse>(
    "/seminary/assignments",
    { params },
  );

  return data;
}

export async function createSeminaryAssignment(payload: SeminaryAssignmentPayload) {
  const { data } = await api.post<SeminaryAssignmentResponse>(
    "/seminary/assignments",
    payload,
  );

  return data;
}

export async function updateSeminaryAssignment({
  id,
  payload,
}: {
  id: string;
  payload: SeminaryAssignmentPayload;
}) {
  const { data } = await api.put<SeminaryAssignmentResponse>(
    `/seminary/assignments/${encodeURIComponent(id)}`,
    payload,
  );

  return data;
}

export async function updateSeminaryAssignmentStatus({
  id,
  status,
}: {
  id: string;
  status: SeminaryAssignmentStatus;
}) {
  const { data } = await api.patch<SeminaryAssignmentResponse>(
    `/seminary/assignments/${encodeURIComponent(id)}/status`,
    { status },
  );

  return data;
}

export async function deleteSeminaryAssignment(id: string) {
  const { data } = await api.delete<{ code: string; message: string }>(
    `/seminary/assignments/${encodeURIComponent(id)}`,
  );

  return data;
}

export async function getSeminaryExaminations(params?: {
  limit?: number;
  page?: number;
  search?: string;
  status?: SeminaryExaminationStatus;
  subject?: string;
}) {
  const { data } = await api.get<SeminaryExaminationsResponse>(
    "/seminary/examinations",
    { params },
  );

  return data;
}

export async function getSeminaryExamination(id: string) {
  const { data } = await api.get<SeminaryExaminationResponse>(
    `/seminary/examinations/${encodeURIComponent(id)}`,
  );

  return data;
}

export async function createSeminaryExamination(
  payload: SeminaryExaminationPayload,
) {
  const { data } = await api.post<SeminaryExaminationResponse>(
    "/seminary/examinations",
    payload,
  );

  return data;
}

export async function updateSeminaryExamination({
  id,
  payload,
}: {
  id: string;
  payload: SeminaryExaminationPayload;
}) {
  const { data } = await api.put<SeminaryExaminationResponse>(
    `/seminary/examinations/${encodeURIComponent(id)}`,
    payload,
  );

  return data;
}

export async function updateSeminaryExaminationStatus({
  id,
  status,
}: {
  id: string;
  status: SeminaryExaminationStatus;
}) {
  const { data } = await api.patch<SeminaryExaminationResponse>(
    `/seminary/examinations/${encodeURIComponent(id)}/status`,
    { status },
  );

  return data;
}

export async function deleteSeminaryExamination(id: string) {
  const { data } = await api.delete<{ code: string; message: string }>(
    `/seminary/examinations/${encodeURIComponent(id)}`,
  );

  return data;
}

export async function getSeminaryInstructors(params?: {
  limit?: number;
  page?: number;
  search?: string;
  status?: SeminaryInstructorStatus;
  teachingProgram?: string;
}) {
  const { data } = await api.get<SeminaryInstructorsResponse>(
    "/seminary/instructors",
    { params },
  );

  return data;
}

export async function getSeminaryInstructor(id: string) {
  const { data } = await api.get<SeminaryInstructorResponse>(
    `/seminary/instructors/${encodeURIComponent(id)}`,
  );

  return data;
}

export async function createSeminaryInstructor(
  payload: SeminaryInstructorPayload,
) {
  const { data } = await api.post<SeminaryInstructorResponse>(
    "/seminary/instructors",
    payload,
  );

  return data;
}

export async function updateSeminaryInstructor({
  id,
  payload,
}: {
  id: string;
  payload: SeminaryInstructorPayload;
}) {
  const { data } = await api.put<SeminaryInstructorResponse>(
    `/seminary/instructors/${encodeURIComponent(id)}`,
    payload,
  );

  return data;
}

export async function updateSeminaryInstructorStatus({
  id,
  status,
}: {
  id: string;
  status: SeminaryInstructorStatus;
}) {
  const { data } = await api.patch<SeminaryInstructorResponse>(
    `/seminary/instructors/${encodeURIComponent(id)}/status`,
    { status },
  );

  return data;
}

export async function inviteSeminaryInstructor(id: string) {
  const { data } = await api.post<SeminaryInstructorInviteResponse>(
    `/seminary/instructors/${encodeURIComponent(id)}/invite`,
  );

  return data;
}

export async function acceptSeminaryInstructorInvite({
  confirmPassword,
  password,
  token,
}: {
  confirmPassword: string;
  password: string;
  token: string;
}) {
  const { data } = await api.post<SeminaryInstructorResponse>(
    "/seminary/instructors/accept-invite",
    { confirmPassword, password },
    { params: { token } },
  );

  return data;
}

export async function deleteSeminaryInstructor(id: string) {
  const { data } = await api.delete<{ code: string; message: string }>(
    `/seminary/instructors/${encodeURIComponent(id)}`,
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

export async function getSeminaryFeeConfiguration() {
  const { data } = await api.get<SeminaryFeeConfigurationResponse>(
    "/seminary/fee-configuration",
  );

  return data;
}

export async function updateSeminaryFeeConfiguration(
  payload: SeminaryFeeConfigurationPayload,
) {
  const { data } = await api.put<SeminaryFeeConfigurationResponse>(
    "/seminary/fee-configuration",
    payload,
  );

  return data;
}

export async function getSeminaryGradeRecords(params?: {
  limit?: number;
  page?: number;
  program?: string;
  search?: string;
  status?: SeminaryGradeRecordStatus;
  term?: string;
}) {
  const { data } = await api.get<SeminaryGradeRecordsResponse>(
    "/seminary/grade-records",
    { params },
  );

  return data;
}

export async function getSeminaryGradeRecord(id: string) {
  const { data } = await api.get<SeminaryGradeRecordResponse>(
    `/seminary/grade-records/${encodeURIComponent(id)}`,
  );

  return data;
}

export async function createSeminaryGradeRecord(
  payload: SeminaryGradeRecordPayload,
) {
  const { data } = await api.post<SeminaryGradeRecordResponse>(
    "/seminary/grade-records",
    payload,
  );

  return data;
}

export async function updateSeminaryGradeRecord({
  id,
  payload,
}: {
  id: string;
  payload: SeminaryGradeRecordPayload;
}) {
  const { data } = await api.put<SeminaryGradeRecordResponse>(
    `/seminary/grade-records/${encodeURIComponent(id)}`,
    payload,
  );

  return data;
}

export async function updateSeminaryGradeRecordStatus({
  id,
  status,
}: {
  id: string;
  status: SeminaryGradeRecordStatus;
}) {
  const { data } = await api.patch<SeminaryGradeRecordResponse>(
    `/seminary/grade-records/${encodeURIComponent(id)}/status`,
    { status },
  );

  return data;
}

export async function deleteSeminaryGradeRecord(id: string) {
  const { data } = await api.delete<{ code: string; message: string }>(
    `/seminary/grade-records/${encodeURIComponent(id)}`,
  );

  return data;
}

export async function getSeminaryFeeCollections(params?: {
  limit?: number;
  page?: number;
  programLevel?: string;
  search?: string;
  status?: SeminaryFeeCollectionStatus;
}) {
  const { data } = await api.get<SeminaryFeeCollectionsResponse>(
    "/seminary/fee-collections",
    { params },
  );

  return data;
}

export async function updateSeminaryFeeCollectionStatus({
  id,
  status,
}: {
  id: string;
  status: SeminaryFeeCollectionStatus;
}) {
  const { data } = await api.patch<SeminaryFeeCollectionResponse>(
    `/seminary/fee-collections/${encodeURIComponent(id)}/status`,
    { status },
  );

  return data;
}

export async function updateSeminaryFeeCollectionPayment({
  id,
  payload,
}: {
  id: string;
  payload: SeminaryFeeCollectionPaymentPayload;
}) {
  const { data } = await api.patch<SeminaryFeeCollectionResponse>(
    `/seminary/fee-collections/${encodeURIComponent(id)}/payment`,
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

export async function verifyMemberCredentialDocument(token: string) {
  const { data } = await api.get<MemberCredentialDocumentResponse>(
    `/members/credential-documents/verify/${encodeURIComponent(token)}`,
  );

  return data;
}
