export interface SeminaryUploadedFile {
  fileUrl: string;
  fileName?: string;
  mimeType?: string;
  fileSize?: number | string;
}

export interface SeminaryApplicationPayload {
  personalInformation: {
    academicYear: string;
    surname: string;
    givenName: string;
    middleName: string;
    emailAddress: string;
    mobilePhone: string;
    homeAddress: string;
    dateOfBirth: string;
    birthPlace: string;
    age: string;
    gender: string;
    height: string;
    weight: string;
    civilStatus: string;
    officePhone: string;
  };
  ministry: {
    churchAttended: string;
    churchAddress: string;
    pastorName: string;
    contactNumber: string;
    ministryInvolved: string;
  };
  curriculum: {
    programLevel: string;
    programCourse: string;
  };
  educationalBackground: {
    highSchool: string;
    highSchoolYearGraduated: string;
    collegeSchool: string;
    collegeCourse: string;
    collegeYearGraduated: string;
    vocationalSchool: string;
    vocationalCourse: string;
    vocationalYearGraduated: string;
    othersSchool: string;
    othersCourse: string;
    othersYearGraduated: string;
  };
  requirements: {
    transcriptOfRecordsUrl?: string;
    transcriptOfRecordsFileName: string;
    transcriptOfRecordsMimeType?: string;
    transcriptOfRecordsFileSize: string;
    idPictureUrl?: string;
    idPictureFileName: string;
    idPictureMimeType?: string;
    idPictureFileSize: string;
    pastorRecommendationUrl?: string;
    pastorRecommendationFileName: string;
    pastorRecommendationMimeType?: string;
    pastorRecommendationFileSize: string;
    briefHistoryOfConversion: string;
  };
  payment: {
    type: string;
    method: string;
    amountPaid: string;
    proofOfReceiptUrl?: string;
    proofOfReceiptFileName: string;
    proofOfReceiptMimeType?: string;
    proofOfReceiptFileSize: string;
    totalAmountDue: string;
  };
}

export interface SeminaryApplicationAdminPayload {
  admissionDate: string;
  academicYear: string;
  surname: string;
  givenName: string;
  middleName: string;
  emailAddress: string;
  mobilePhone: string;
  mailingAddress: string;
  homeAddress: string;
  dateOfBirth: string;
  birthPlace: string;
  age: string;
  gender: string;
  height: string;
  weight: string;
  civilStatus: string;
  officePhone: string;
  churchAttended: string;
  churchAddress: string;
  pastorName: string;
  contactNumber: string;
  ministryInvolved: string;
  programLevel: string;
  programCourse: string;
  highSchool: string;
  highSchoolYearGraduated: string;
  collegeSchool: string;
  collegeCourse: string;
  collegeYearGraduated: string;
  vocationalSchool: string;
  vocationalCourse: string;
  vocationalYearGraduated: string;
  othersSchool: string;
  othersCourse: string;
  othersYearGraduated: string;
}

export interface SeminaryApplicationResponse {
  code: string;
  message: string;
  data: SeminaryApplicationDetails;
}

export type SeminaryApplicationStatus =
  | "SUBMITTED"
  | "UNDER_REVIEW"
  | "APPROVED"
  | "ENROLLED"
  | "REJECTED"
  | "CANCELLED";

export type SeminaryPaymentStatus = "PENDING" | "VERIFIED" | "REJECTED";

export type SeminaryFeeCollectionStatus =
  "PENDING" | "PARTIALLY_PAID" | "PAID" | "OVERDUE";

export type SeminaryStudentStatus =
  "ACTIVE" | "GRADUATING" | "LEAVE_OF_ABSENCE" | "INACTIVE";

export type SeminaryEnrollmentType =
  "REGULAR" | "TRANSFEREE" | "CROSS_ENROLLEE";

export type SeminarySchoolAffiliation = "IN_HOUSE" | "PARTNER_SCHOOL";

export type SeminaryCredentialDocumentType =
  "DIPLOMA" | "CERTIFICATE" | "TRANSCRIPT";

export type SeminaryCredentialDocumentStatus = "ACTIVE" | "REVOKED" | "VOID";

export type SeminaryProgramLevel =
  "CERTIFICATE" | "BACHELOR" | "MASTER_WITH_THESIS" | "DOCTORATE_WITH_DISSERTATION";

export type SeminaryCourseModality = "FACE_TO_FACE" | "ONLINE" | "BOTH";

export type SeminaryCourseStatus = "ACTIVE" | "INACTIVE";
export type SeminaryAnnouncementKind = "ANNOUNCEMENT" | "EVENT";
export type SeminaryAnnouncementCategory =
  | "ACADEMIC"
  | "ADMINISTRATION"
  | "FORMATION"
  | "ADMISSIONS";
export type SeminaryAnnouncementAudience =
  | "ALL"
  | "STUDENTS"
  | "INSTRUCTORS"
  | "STUDENTS_AND_INSTRUCTORS";
export type SeminaryAnnouncementStatus = "DRAFT" | "PUBLISHED";
export type SeminaryCourseScheduleStatus =
  | "DRAFT"
  | "SCHEDULED"
  | "CANCELLED"
  | "COMPLETED";
export type SeminaryDocumentDeliveryMethod = "PICKUP" | "EMAIL" | "COURIER";
export type SeminaryDocumentRequestStatus =
  | "PENDING"
  | "APPROVED"
  | "REJECTED"
  | "PROCESSING"
  | "READY_FOR_RELEASE"
  | "RELEASED";
export type SeminaryDocumentPaymentStatus =
  | "NOT_APPLICABLE"
  | "PENDING"
  | "PAID"
  | "WAIVED";
export type SeminaryScheduleWeekday =
  | "MONDAY"
  | "TUESDAY"
  | "WEDNESDAY"
  | "THURSDAY"
  | "FRIDAY"
  | "SATURDAY"
  | "SUNDAY";
export type SeminaryStudyMaterialType =
  | "NOTES"
  | "PRESENTATION"
  | "DOCUMENT"
  | "CHART"
  | "ARCHIVE";
export type SeminaryStudyMaterialStatus = "PUBLISHED" | "DRAFT";
export type SeminaryAssignmentStatus = "PUBLISHED" | "DRAFT" | "SCHEDULED";
export type SeminaryExaminationStatus =
  | "SCHEDULED"
  | "ONGOING"
  | "COMPLETED"
  | "DRAFT";
export type SeminaryExaminationQuestionType =
  | "MULTIPLE_CHOICE"
  | "TRUE_FALSE"
  | "SHORT_ANSWER"
  | "ESSAY";
export type SeminaryGradeRecordStatus =
  | "COMPLETE"
  | "PENDING_REVIEW"
  | "IN_PROGRESS"
  | "INCOMPLETE";
export type SeminaryGradeRecordRemark =
  | "PASSED"
  | "CONDITIONAL"
  | "FAILED"
  | "ONGOING";

export type SeminaryAcademicYearSession = "CURRENT" | "PREVIOUS" | "UPCOMING";

export type SeminaryAcademicYearStatus = "ACTIVE" | "UPCOMING" | "COMPLETED";

export type SeminaryInstructorStatus =
  "ACTIVE" | "PART_TIME" | "ON_LEAVE" | "INACTIVE";

export type SeminaryInstructorRank =
  | "ADJUNCT_INSTRUCTOR"
  | "LECTURER"
  | "ASSISTANT_PROFESSOR"
  | "ASSOCIATE_PROFESSOR"
  | "PROFESSOR";

export interface SeminaryAcademicYear {
  id: string;
  academicYear: string;
  session: SeminaryAcademicYearSession;
  status: SeminaryAcademicYearStatus;
  startDate: string;
  endDate: string;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface SeminaryAcademicYearPayload {
  academicYear: string;
  session: string;
  status: string;
  startDate: string;
  endDate: string;
  sortOrder?: number;
}

export interface SeminaryGradeScaleRow {
  equivalent: string;
  percentageRange: string;
  remarks: string;
}

export interface SeminaryGradeCriteriaWeights {
  attendance: number;
  coursework: number;
  character: number;
  exam: number;
}

export interface SeminaryGradeConfiguration {
  id: string;
  passingEquivalent: string;
  releaseWindow: string;
  weightProfile: string;
  completionWindowDays: number;
  approvalWorkflow: boolean;
  allowFacultyOverride: boolean;
  autoPublishApproved: boolean;
  showConditionalRemark: boolean;
  gradeScale: SeminaryGradeScaleRow[];
  criteriaWeights: SeminaryGradeCriteriaWeights;
  createdAt: string;
  updatedAt: string;
}

export interface SeminaryFeeBreakdownItem {
  label: string;
  amount: number;
}

export interface SeminaryFeeConfiguration {
  id: string;
  feeBreakdowns: Record<
    "Certificate" | "Bachelor" | "Masteral" | "Doctorate",
    SeminaryFeeBreakdownItem[]
  >;
  createdAt: string;
  updatedAt: string;
}

export interface SeminaryFeeCollectionAccount {
  id: string;
  referenceNumber: string;
  studentId: string;
  studentName: string;
  program: string;
  programLevel: SeminaryProgramLevel;
  programLevelLabel: string;
  totalCharges: number;
  amountPaid: number;
  balance: number;
  dueDate: string;
  paymentMethod: string;
  status: SeminaryFeeCollectionStatus;
  statusLabel: string;
  createdAt: string;
  updatedAt: string;
}

export interface SeminaryFeeCollectionPaymentPayload {
  amountPaid: number;
  dueDate?: string;
  paymentMethod: string;
  status?: SeminaryFeeCollectionStatus;
}

export type SeminaryGradeConfigurationPayload = Partial<
  Pick<
    SeminaryGradeConfiguration,
    | "passingEquivalent"
    | "releaseWindow"
    | "weightProfile"
    | "completionWindowDays"
    | "approvalWorkflow"
    | "allowFacultyOverride"
    | "autoPublishApproved"
    | "showConditionalRemark"
    | "gradeScale"
    | "criteriaWeights"
  >
>;

export type SeminaryFeeConfigurationPayload = Pick<
  SeminaryFeeConfiguration,
  "feeBreakdowns"
>;

export interface SeminaryCourse {
  id: string;
  courseName: string;
  courseCode: string;
  program: SeminaryProgramLevel;
  units: number;
  modality: SeminaryCourseModality;
  subjects: SeminaryCourseSubject[];
  status: SeminaryCourseStatus;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface SeminaryCourseSubject {
  date?: string;
  subjectName: string;
  units: number;
  time?: string;
  startTime: string;
  endTime: string;
  professor: string;
  modality: SeminaryCourseModality;
}

export interface SeminaryCoursePayload {
  courseName: string;
  courseCode: string;
  program: string;
  subjects: SeminaryCourseSubject[];
  status?: string;
  sortOrder?: number;
}

export interface SeminaryCourseSchedule {
  id: string;
  period: string;
  academicYear: string;
  className: string;
  courseId: string;
  instructorId: string;
  subjectName: string;
  units: number;
  scheduledDate: string | null;
  recurrenceDays: SeminaryScheduleWeekday[];
  recurrenceEndDate: string | null;
  startTime: string;
  endTime: string;
  deliveryMode: SeminaryCourseModality;
  location: string | null;
  meetingLink: string | null;
  status: SeminaryCourseScheduleStatus;
  course: Pick<SeminaryCourse, "id" | "courseCode" | "courseName" | "program">;
  instructor: { id: string; name: string; userId: string | null };
}

export interface SeminaryCourseSchedulePayload {
  academicYear: string;
  period: string;
  className: string;
  courseId: string;
  instructorId: string;
  subjectName: string;
  units: number;
  scheduledDate?: string;
  recurrenceDays?: SeminaryScheduleWeekday[];
  recurrenceEndDate?: string;
  startTime: string;
  endTime: string;
  deliveryMode: SeminaryCourseModality;
  location?: string;
  meetingLink?: string;
  status?: SeminaryCourseScheduleStatus;
}

export interface SeminaryAnnouncement {
  id: string;
  title: string;
  summary: string | null;
  kind: SeminaryAnnouncementKind;
  category: SeminaryAnnouncementCategory;
  audience: SeminaryAnnouncementAudience;
  location: string | null;
  allDay: boolean;
  startsAt: string;
  endsAt: string | null;
  status: SeminaryAnnouncementStatus;
  createdAt: string;
  updatedAt: string;
  createdByUser: { id: string; name: string };
}

export interface SeminaryAnnouncementPayload {
  title: string;
  summary?: string | null;
  kind: SeminaryAnnouncementKind;
  category: SeminaryAnnouncementCategory;
  audience: SeminaryAnnouncementAudience;
  location?: string | null;
  allDay?: boolean;
  startsAt: string;
  endsAt?: string | null;
  status?: SeminaryAnnouncementStatus;
}

export interface SeminaryDashboardData {
  academicYear: string;
  kpis: {
    totalStudents: number;
    pendingEnrollments: number;
    pendingPayments: number;
    submittedDocuments: number;
  };
  enrollmentTrend: { date: string; enrolled: number; pending: number }[];
  paymentStatusTrend: { period: string; verified: number; pending: number; rejected: number }[];
  programDistribution: { name: SeminaryProgramLevel | null; value: number }[];
  recentApplications: {
    id: string;
    student: string;
    studentId: string | null;
    program: string;
    programLevel: SeminaryProgramLevel | null;
    applicationType: string;
    enrollmentStatus: SeminaryApplicationStatus;
    paymentStatus: SeminaryPaymentStatus | "NOT_SUBMITTED";
    submittedAt: string;
  }[];
  events: {
    id: string;
    title: string;
    category: SeminaryAnnouncementCategory;
    startsAt: string;
    endsAt: string | null;
    allDay: boolean;
    location: string | null;
  }[];
}

export interface SeminaryDashboardResponse {
  code: string;
  message: string;
  data: SeminaryDashboardData;
}

export type SeminaryReportScope = "INSTITUTIONAL" | "ACADEMIC" | "FINANCE" | "REGISTRAR";

export interface SeminaryReportsData {
  period: { startDate: string; endDate: string };
  scope: SeminaryReportScope;
  summary: { totalEnrollees: number; totalCollections: number; completionRate: number; retentionRate: number };
  monthlyPerformance: { month: string; enrollment: number; collection: number; completionRate: number }[];
  programs: { name: SeminaryProgramLevel; enrollees: number; collection: number; collectionRate: number; completionRate: number; retentionRate: number; gradeRecords: number }[];
  operationalReports: { reportId: string; reportName: string; program: string; generatedOn: string; pendingItems: number; collectionRate: number; status: "Healthy" | "Watchlist" | "Critical" }[];
}

export interface SeminaryReportsResponse {
  code: string;
  message: string;
  data: SeminaryReportsData;
}

export interface SeminaryDocumentRequestType {
  id: string;
  name: string;
  description: string | null;
  fee: number | string | null;
  requiresSupportingDetails: boolean;
  isActive: boolean;
  sortOrder: number;
}

export interface SeminaryDocumentRequest {
  id: string;
  referenceNumber: string;
  purpose: string;
  deliveryMethod: SeminaryDocumentDeliveryMethod;
  supportingDetails: string | null;
  fee: number | string | null;
  paymentStatus: SeminaryDocumentPaymentStatus;
  status: SeminaryDocumentRequestStatus;
  reviewRemarks: string | null;
  reviewedAt: string | null;
  processedAt: string | null;
  readyAt: string | null;
  releasedAt: string | null;
  releaseReference: string | null;
  receivedBy: string | null;
  createdAt: string;
  documentType: SeminaryDocumentRequestType;
  studentApplication: Pick<
    SeminaryApplicationDetails,
    "id" | "studentId" | "givenName" | "middleName" | "surname" | "emailAddress" | "mobilePhone" | "programLevel" | "programCourse"
  >;
  reviewedByUser: { id: string; name: string } | null;
  releasedByUser: { id: string; name: string } | null;
}

export interface SeminaryDocumentRequestPayload {
  documentTypeId: string;
  purpose: string;
  deliveryMethod: SeminaryDocumentDeliveryMethod;
  supportingDetails?: string;
}

export interface SeminaryDocumentRequestStatusPayload {
  status: SeminaryDocumentRequestStatus;
  reviewRemarks?: string;
  paymentStatus?: SeminaryDocumentPaymentStatus;
  releaseReference?: string;
  receivedBy?: string;
}

export interface SeminaryStudyMaterial {
  id: string;
  title: string;
  subtitle: string | null;
  subject: string;
  type: SeminaryStudyMaterialType;
  status: SeminaryStudyMaterialStatus;
  fileUrl: string;
  fileName: string;
  mimeType: string | null;
  fileSize: number | null;
  downloads: number;
  uploadedByName: string;
  uploadedByRole: string;
  uploadedByUserId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface SeminaryStudyMaterialPayload {
  title: string;
  subtitle?: string;
  subject: string;
  type: SeminaryStudyMaterialType;
  status?: SeminaryStudyMaterialStatus;
  fileUrl: string;
  fileName: string;
  mimeType?: string;
  fileSize?: number;
}

export interface SeminaryAssignment {
  id: string;
  title: string;
  description: string;
  subject: string;
  courseId: string | null;
  courseName: string | null;
  courseCode: string | null;
  instructorUserId: string | null;
  instructorName: string;
  assignmentType: string;
  dueAt: string;
  status: SeminaryAssignmentStatus;
  totalMarks: string;
  additionalInstructions: string | null;
  allowLateSubmission: boolean;
  lateSubmissionDeadline: string | null;
  notifyStudents: boolean;
  attachmentLabel: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface SeminaryAssignmentPayload {
  title: string;
  description: string;
  subject: string;
  assignmentType: string;
  dueAt: string;
  status?: SeminaryAssignmentStatus;
  totalMarks: string;
  additionalInstructions?: string;
  allowLateSubmission?: boolean;
  lateSubmissionDeadline?: string;
  notifyStudents?: boolean;
  attachmentLabel?: string;
}

export interface SeminaryExaminationQuestion {
  id: string;
  type: SeminaryExaminationQuestionType;
  prompt: string;
  points: number | string;
  options?: string[];
  answer?: string;
}

export interface SeminaryExamination {
  id: string;
  title: string;
  coverage: string;
  subject: string;
  courseId: string | null;
  courseName: string | null;
  courseCode: string | null;
  instructorUserId: string | null;
  instructorName: string;
  examType: string;
  scheduledAt: string;
  durationMinutes: string;
  status: SeminaryExaminationStatus;
  totalPoints: string;
  passingScore: string;
  instructions: string | null;
  randomizeQuestions: boolean;
  showResults: boolean;
  questions: SeminaryExaminationQuestion[];
  createdAt: string;
  updatedAt: string;
}

export interface SeminaryExaminationPayload {
  title: string;
  coverage: string;
  subject: string;
  examType: string;
  scheduledAt: string;
  durationMinutes: string;
  status?: SeminaryExaminationStatus;
  totalPoints: string;
  passingScore: string;
  instructions?: string;
  randomizeQuestions?: boolean;
  showResults?: boolean;
  questions: SeminaryExaminationQuestion[];
}

export interface SeminaryGradeRecord {
  id: string;
  recordNumber: string;
  studentApplicationId: string | null;
  studentId: string;
  studentName: string;
  program: string;
  programLevel: SeminaryProgramLevel | null;
  subject: string;
  courseId: string | null;
  courseTitle: string;
  courseCode: string;
  instructorUserId: string | null;
  instructorName: string;
  term: string;
  attendanceEarned: number | null;
  attendanceTotal: number | null;
  courseworkEarned: number | null;
  courseworkTotal: number | null;
  characterEarned: number | null;
  characterTotal: number | null;
  examEarned: number | null;
  examTotal: number | null;
  weightedPercentage: number | null;
  finalGrade: string;
  remarks: SeminaryGradeRecordRemark;
  status: SeminaryGradeRecordStatus;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface SeminaryStudentPortalData {
  student: SeminaryApplicationDetails;
  grades: SeminaryGradeRecord[];
  materials: SeminaryStudyMaterial[];
  assignments: SeminaryAssignment[];
  examinations: SeminaryExamination[];
}

export interface SeminaryStudentPortalResponse {
  code: string;
  message: string;
  data: SeminaryStudentPortalData;
}

export interface SeminaryGradeRecordPayload {
  studentApplicationId: string;
  subject: string;
  term: string;
  finalGrade: string;
  remarks?: SeminaryGradeRecordRemark;
  status?: SeminaryGradeRecordStatus;
  notes?: string;
}

export interface SeminaryBulkGradeEncodingPayload {
  subject: string;
  entries: Array<{
    studentApplicationId: string;
    attendanceEarned: number;
    attendanceTotal: number;
    courseworkEarned: number;
    courseworkTotal: number;
    characterEarned: number;
    characterTotal: number;
    examEarned: number;
    examTotal: number;
  }>;
}

export interface SeminaryInstructorEvaluation {
  attendanceParticipation: number;
  leadershipCharacter: number;
  ministryCommunityEngagement: number;
  knowledgeSkillsAssessment: number;
  professionalConductEthics: number;
  totalScore: number;
  rating: string;
  rankingClassification: string;
  award: string;
}

export interface SeminaryInstructor {
  id: string;
  facultyId: string;
  name: string;
  professionalTitle: string;
  email: string;
  contactNumber: string;
  teachingPrograms: SeminaryProgramLevel[];
  teachingProgramLabels: string[];
  rank: SeminaryInstructorRank;
  rankLabel: string;
  status: SeminaryInstructorStatus;
  statusLabel: string;
  loadUnits: number;
  biography: string;
  educationalBackground: string;
  areasOfExpertise: string[];
  credentials: string[];
  formalPhotoUrl: string;
  isFilipinoCitizen: boolean;
  highSchoolGraduateOrEquivalent: boolean;
  ministerialExperienceYears: number;
  submissionDeadline: string;
  evaluation: SeminaryInstructorEvaluation;
  inviteAcceptedAt: string | null;
  inviteTokenSentAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface SeminaryInstructorPayload {
  name: string;
  professionalTitle: string;
  email: string;
  contactNumber: string;
  teachingPrograms: string[];
  rank: string;
  status?: string;
  loadUnits: number;
  biography: string;
  educationalBackground: string;
  areasOfExpertise: string[];
  credentials: string[];
  formalPhotoUrl: string;
  isFilipinoCitizen: boolean;
  highSchoolGraduateOrEquivalent: boolean;
  ministerialExperienceYears: number;
  submissionDeadline?: string;
  evaluation: Pick<
    SeminaryInstructorEvaluation,
    | "attendanceParticipation"
    | "leadershipCharacter"
    | "ministryCommunityEngagement"
    | "knowledgeSkillsAssessment"
    | "professionalConductEthics"
  >;
}

export interface SeminaryCredentialDocument {
  id: string;
  documentNumber: string;
  barcodeNumber: string | null;
  verificationToken: string;
  type: SeminaryCredentialDocumentType;
  status: SeminaryCredentialDocumentStatus;
  title: string | null;
  remarks: string | null;
  issuedAt: string;
  revokedAt: string | null;
  applicationId: string;
  createdAt: string;
  updatedAt: string;
  application?: {
    id: string;
    studentId: string | null;
    surname: string | null;
    givenName: string | null;
    middleName: string | null;
    programLevel: string | null;
    programCourse: string | null;
    academicYear: string | null;
  };
}

export interface SeminaryStudentPayload {
  studentId?: string;
  academicYear?: string;
  surname?: string;
  givenName?: string;
  middleName?: string;
  gender?: string;
  emailAddress?: string;
  mobilePhone?: string;
  homeAddress?: string;
  birthPlace?: string;
  civilStatus?: string;
  churchAttended?: string;
  churchAddress?: string;
  pastorName?: string;
  contactNumber?: string;
  ministryInvolved?: string;
  programLevel?: string;
  programCourse?: string;
  enrollmentType?: string;
  schoolAffiliation?: string;
  yearLevel?: string;
  studentStatus?: string;
}

export interface SeminaryApplicationDetails {
  id: string;
  status: SeminaryApplicationStatus;
  targetMemberType: string;
  admissionNumber: string | null;
  studentId: string | null;
  studentStatus: SeminaryStudentStatus;
  enrollmentType: SeminaryEnrollmentType;
  schoolAffiliation: SeminarySchoolAffiliation;
  yearLevel: string | null;
  academicYear: string | null;
  surname: string | null;
  givenName: string | null;
  middleName: string | null;
  emailAddress: string | null;
  mobilePhone: string | null;
  mailingAddress: string | null;
  homeAddress: string | null;
  dateOfBirth: string | null;
  birthPlace: string | null;
  age: number | null;
  gender: string | null;
  height: string | null;
  weight: string | null;
  civilStatus: string | null;
  officePhone: string | null;
  churchAttended: string | null;
  churchAddress: string | null;
  pastorName: string | null;
  contactNumber: string | null;
  ministryInvolved: string | null;
  programLevel: string | null;
  programCourse: string | null;
  highSchool: string | null;
  highSchoolYearGraduated: string | null;
  collegeSchool: string | null;
  collegeCourse: string | null;
  collegeYearGraduated: string | null;
  vocationalSchool: string | null;
  vocationalCourse: string | null;
  vocationalYearGraduated: string | null;
  othersSchool: string | null;
  othersCourse: string | null;
  othersYearGraduated: string | null;
  submittedAt: string;
  reviewedAt: string | null;
  reviewRemarks: string | null;
  memberId: string | null;
  createdAt: string;
  updatedAt: string;
  member?: {
    id: string;
    uniqueId: string | null;
    memberType: string;
    status: string;
    firstName: string;
    lastName: string;
    user?: {
      id: string;
      name: string;
      email: string;
    };
  } | null;
  requirements?: {
    transcriptOfRecordsUrl: string | null;
    transcriptOfRecordsFileName: string | null;
    transcriptOfRecordsMimeType: string | null;
    transcriptOfRecordsFileSize: string | null;
    idPictureUrl: string | null;
    idPictureFileName: string | null;
    idPictureMimeType: string | null;
    idPictureFileSize: string | null;
    pastorRecommendationUrl: string | null;
    pastorRecommendationFileName: string | null;
    pastorRecommendationMimeType: string | null;
    pastorRecommendationFileSize: string | null;
    briefHistoryOfConversion: string | null;
  } | null;
  payment?: {
    paymentType: string;
    paymentMethod: string;
    amountPaid: string;
    totalAmountDue: string;
    status: SeminaryPaymentStatus;
    submittedAt: string;
    verifiedAt: string | null;
    reviewRemarks: string | null;
    proofOfReceiptUrl: string | null;
    proofOfReceiptFileName: string | null;
    proofOfReceiptMimeType: string | null;
    proofOfReceiptFileSize: string | null;
  } | null;
  credentialDocuments?: SeminaryCredentialDocument[];
}

export interface SeminaryApplicationsResponse {
  code: string;
  message: string;
  data: SeminaryApplicationDetails[];
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface SeminaryStudentResponse {
  code: string;
  message: string;
  data: SeminaryApplicationDetails;
}

export interface SeminaryStudentsResponse {
  code: string;
  message: string;
  data: SeminaryApplicationDetails[];
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface SeminaryStudentBulkImportResponse {
  code: string;
  message: string;
  data: SeminaryApplicationDetails[];
}

export interface SeminaryCoursesResponse {
  code: string;
  message: string;
  data: SeminaryCourse[];
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface SeminaryCourseResponse {
  code: string;
  message: string;
  data: SeminaryCourse;
}

export interface SeminaryCourseSchedulesResponse {
  code: string;
  message: string;
  data: SeminaryCourseSchedule[];
}

export interface SeminaryCourseScheduleResponse {
  code: string;
  message: string;
  data: SeminaryCourseSchedule;
}

export interface SeminaryAnnouncementsResponse {
  code: string;
  message: string;
  data: SeminaryAnnouncement[];
}

export interface SeminaryAnnouncementResponse {
  code: string;
  message: string;
  data: SeminaryAnnouncement;
}

export interface SeminaryDocumentRequestTypesResponse {
  code: string;
  message: string;
  data: SeminaryDocumentRequestType[];
}

export interface SeminaryDocumentRequestTypeResponse {
  code: string;
  message: string;
  data: SeminaryDocumentRequestType;
}

export interface SeminaryDocumentRequestsResponse {
  code: string;
  message: string;
  data: SeminaryDocumentRequest[];
}

export interface SeminaryDocumentRequestResponse {
  code: string;
  message: string;
  data: SeminaryDocumentRequest;
}

export interface SeminaryStudyMaterialsResponse {
  code: string;
  message: string;
  data: SeminaryStudyMaterial[];
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface SeminaryStudyMaterialResponse {
  code: string;
  message: string;
  data: SeminaryStudyMaterial;
}

export interface SeminaryAssignmentsResponse {
  code: string;
  message: string;
  data: SeminaryAssignment[];
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface SeminaryAssignmentResponse {
  code: string;
  message: string;
  data: SeminaryAssignment;
}

export interface SeminaryExaminationsResponse {
  code: string;
  message: string;
  data: SeminaryExamination[];
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface SeminaryExaminationResponse {
  code: string;
  message: string;
  data: SeminaryExamination;
}

export interface SeminaryGradeRecordsResponse {
  code: string;
  message: string;
  data: SeminaryGradeRecord[];
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface SeminaryGradeRecordResponse {
  code: string;
  message: string;
  data: SeminaryGradeRecord;
}

export interface SeminaryInstructorsResponse {
  code: string;
  message: string;
  data: SeminaryInstructor[];
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface SeminaryInstructorResponse {
  code: string;
  message: string;
  data: SeminaryInstructor;
}

export interface SeminaryInstructorInviteResponse {
  code: string;
  message: string;
}

export interface SeminaryAcademicYearsResponse {
  code: string;
  message: string;
  data: SeminaryAcademicYear[];
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface SeminaryAcademicYearResponse {
  code: string;
  message: string;
  data: SeminaryAcademicYear;
}

export interface SeminaryGradeConfigurationResponse {
  code: string;
  message: string;
  data: SeminaryGradeConfiguration;
}

export interface SeminaryFeeConfigurationResponse {
  code: string;
  message: string;
  data: SeminaryFeeConfiguration;
}

export interface SeminaryFeeCollectionsResponse {
  code: string;
  message: string;
  data: SeminaryFeeCollectionAccount[];
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface SeminaryFeeCollectionResponse {
  code: string;
  message: string;
  data: SeminaryFeeCollectionAccount;
}

export interface SeminaryCredentialDocumentResponse {
  code: string;
  message: string;
  data: SeminaryCredentialDocument;
}

export type MemberCredentialDocumentType = "CERTIFICATE" | "RECOGNITION";

export interface MemberCredentialDocument {
  id: string;
  documentNumber: string;
  barcodeNumber: string | null;
  verificationToken: string;
  type: MemberCredentialDocumentType;
  status: "ACTIVE" | "REVOKED";
  title: string | null;
  issuedAt: string;
  memberId: string;
  createdAt: string;
  updatedAt: string;
  member?: {
    id: string;
    uniqueId: string | null;
    firstName: string;
    lastName: string;
    user?: {
      email: string;
    };
  };
}

export interface MemberCredentialDocumentResponse {
  code: string;
  message: string;
  data: MemberCredentialDocument;
}

export interface SeminaryCredentialDocumentsResponse {
  code: string;
  message: string;
  data: SeminaryCredentialDocument[];
}
