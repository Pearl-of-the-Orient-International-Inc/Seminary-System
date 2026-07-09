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

export interface SeminaryApplicationResponse {
  code: string;
  message: string;
  data: unknown;
}

export type SeminaryApplicationStatus =
  | "SUBMITTED"
  | "UNDER_REVIEW"
  | "APPROVED"
  | "REJECTED"
  | "CANCELLED";

export type SeminaryPaymentStatus = "PENDING" | "VERIFIED" | "REJECTED";

export type SeminaryStudentStatus =
  | "ACTIVE"
  | "GRADUATING"
  | "LEAVE_OF_ABSENCE"
  | "INACTIVE";

export type SeminaryEnrollmentType =
  | "REGULAR"
  | "TRANSFEREE"
  | "CROSS_ENROLLEE";

export type SeminaryCredentialDocumentType =
  | "DIPLOMA"
  | "CERTIFICATE"
  | "TRANSCRIPT";

export type SeminaryCredentialDocumentStatus = "ACTIVE" | "REVOKED" | "VOID";

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
  yearLevel?: string;
  studentStatus?: string;
}

export interface SeminaryApplicationDetails {
  id: string;
  status: SeminaryApplicationStatus;
  targetMemberType: string;
  studentId: string | null;
  studentStatus: SeminaryStudentStatus;
  enrollmentType: SeminaryEnrollmentType;
  yearLevel: string | null;
  academicYear: string | null;
  surname: string | null;
  givenName: string | null;
  middleName: string | null;
  emailAddress: string | null;
  mobilePhone: string | null;
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

export interface SeminaryCredentialDocumentResponse {
  code: string;
  message: string;
  data: SeminaryCredentialDocument;
}

export interface SeminaryCredentialDocumentsResponse {
  code: string;
  message: string;
  data: SeminaryCredentialDocument[];
}
