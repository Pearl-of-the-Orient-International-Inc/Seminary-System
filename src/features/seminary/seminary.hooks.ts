import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toApiError } from "@/lib/http-client";
import * as seminaryApi from "./seminary.api";
import {
  uploadSeminaryPaymentReceipt,
  uploadSeminaryRequirement,
  uploadSeminaryStudyMaterial,
} from "./seminary-upload.api";

export const useCurrentSeminaryApplicationQuery = () =>
  useQuery({
    queryKey: ["seminary", "current", "application"],
    queryFn: seminaryApi.getCurrentSeminaryApplication,
    staleTime: 60_000,
  });

export const useCurrentStudentPortalQuery = () =>
  useQuery({
    queryKey: ["seminary", "current", "student-portal"],
    queryFn: seminaryApi.getCurrentStudentPortal,
    staleTime: 30_000,
  });

export const useSeminaryApplicationsQuery = (params?: {
  limit?: number;
  page?: number;
}) =>
  useQuery({
    queryKey: ["seminary", "applications", params],
    queryFn: () => seminaryApi.getSeminaryApplications(params),
    staleTime: 30_000,
  });

export const useUpsertCurrentSeminaryApplicationMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: seminaryApi.upsertCurrentSeminaryApplication,
    throwOnError: false,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["seminary", "current", "application"],
      });
    },
    meta: { feature: "seminary.application.upsert" },
  });
};

export const useCreateSeminaryApplicationMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: seminaryApi.createSeminaryApplication,
    throwOnError: false,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["seminary", "applications"],
      });
      await queryClient.invalidateQueries({
        queryKey: ["seminary", "students"],
      });
    },
    meta: { feature: "seminary.application.create" },
  });
};

export const useUploadSeminaryRequirementMutation = () =>
  useMutation({
    mutationFn: uploadSeminaryRequirement,
    throwOnError: false,
    meta: { feature: "seminary.requirement.upload" },
  });

export const useUploadSeminaryPaymentReceiptMutation = () =>
  useMutation({
    mutationFn: uploadSeminaryPaymentReceipt,
    throwOnError: false,
    meta: { feature: "seminary.paymentReceipt.upload" },
  });

export const useUploadSeminaryStudyMaterialMutation = () =>
  useMutation({
    mutationFn: uploadSeminaryStudyMaterial,
    throwOnError: false,
    meta: { feature: "seminary.studyMaterial.upload" },
  });

export const useUpdateSeminaryApplicationStatusMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: seminaryApi.updateSeminaryApplicationStatus,
    throwOnError: false,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["seminary", "applications"],
      });
    },
    meta: { feature: "seminary.application.status.update" },
  });
};

export const useSeminaryEnrollmentsQuery = (params?: {
  limit?: number;
  page?: number;
}) =>
  useQuery({
    queryKey: ["seminary", "enrollments", params],
    queryFn: () => seminaryApi.getSeminaryEnrollments(params),
    staleTime: 30_000,
  });

export const useUpdateSeminaryEnrollmentStatusMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: seminaryApi.updateSeminaryEnrollmentStatus,
    throwOnError: false,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["seminary", "enrollments"],
      });
      await queryClient.invalidateQueries({
        queryKey: ["seminary", "applications"],
      });
      await queryClient.invalidateQueries({
        queryKey: ["seminary", "students"],
      });
    },
    meta: { feature: "seminary.enrollment.status.update" },
  });
};

export const useSeminaryStudentsQuery = (params?: {
  academicYear?: string;
  limit?: number;
  page?: number;
  programLevel?: string;
  search?: string;
  schoolAffiliation?: string;
  studentStatus?: string;
}) =>
  useQuery({
    queryKey: ["seminary", "students", params],
    queryFn: () => seminaryApi.getSeminaryStudents(params),
    staleTime: 30_000,
  });

export const useSeminaryStudentQuery = (
  studentId: string,
  options?: { enabled?: boolean },
) =>
  useQuery({
    queryKey: ["seminary", "students", studentId],
    queryFn: () => seminaryApi.getSeminaryStudent(studentId),
    enabled: options?.enabled ?? true,
    staleTime: 30_000,
  });

export const useCreateSeminaryStudentMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: seminaryApi.createSeminaryStudent,
    throwOnError: false,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["seminary", "students"],
      });
    },
    meta: { feature: "seminary.student.create" },
  });
};

export const useUpdateSeminaryStudentMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: seminaryApi.updateSeminaryStudent,
    throwOnError: false,
    onSuccess: async (_data, variables) => {
      await queryClient.invalidateQueries({
        queryKey: ["seminary", "students"],
      });
      await queryClient.invalidateQueries({
        queryKey: ["seminary", "students", variables.studentId],
      });
    },
    meta: { feature: "seminary.student.update" },
  });
};

export const useDeleteSeminaryStudentMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: seminaryApi.deleteSeminaryStudent,
    throwOnError: false,
    onSuccess: async (_data, studentId) => {
      await queryClient.invalidateQueries({
        queryKey: ["seminary", "students"],
      });
      await queryClient.removeQueries({
        queryKey: ["seminary", "students", studentId],
      });
    },
    meta: { feature: "seminary.student.delete" },
  });
};

export const useChangeSeminaryStudentPasswordMutation = () =>
  useMutation({
    mutationFn: seminaryApi.changeSeminaryStudentPassword,
    throwOnError: false,
    meta: { feature: "seminary.student.password.change" },
  });

export const useBulkImportSeminaryStudentsMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: seminaryApi.bulkImportSeminaryStudents,
    throwOnError: false,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["seminary", "students"],
      });
    },
    meta: { feature: "seminary.student.bulkImport" },
  });
};

export const useBulkDeleteSeminaryStudentsMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: seminaryApi.bulkDeleteSeminaryStudents,
    throwOnError: false,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["seminary", "students"],
      });
    },
    meta: { feature: "seminary.student.bulkDelete" },
  });
};

export const useSeminaryCoursesQuery = (params?: {
  limit?: number;
  modality?: string;
  page?: number;
  program?: string;
  search?: string;
  status?: string;
}, options?: { enabled?: boolean }) =>
  useQuery({
    queryKey: ["seminary", "courses", params],
    queryFn: () => seminaryApi.getSeminaryCourses(params),
    enabled: options?.enabled ?? true,
    staleTime: 30_000,
  });

export const useCreateSeminaryCourseMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: seminaryApi.createSeminaryCourse,
    throwOnError: false,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["seminary", "courses"],
      });
    },
    meta: { feature: "seminary.course.create" },
  });
};

export const useUpdateSeminaryCourseMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: seminaryApi.updateSeminaryCourse,
    throwOnError: false,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["seminary", "courses"],
      });
    },
    meta: { feature: "seminary.course.update" },
  });
};

export const useUpdateSeminaryCourseStatusMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: seminaryApi.updateSeminaryCourseStatus,
    throwOnError: false,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["seminary", "courses"],
      });
    },
    meta: { feature: "seminary.course.status.update" },
  });
};

export const useDeleteSeminaryCourseMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: seminaryApi.deleteSeminaryCourse,
    throwOnError: false,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["seminary", "courses"],
      });
    },
    meta: { feature: "seminary.course.delete" },
  });
};

export const useSeminaryDashboardQuery = (
  params?: Parameters<typeof seminaryApi.getSeminaryDashboard>[0],
  options?: { enabled?: boolean },
) =>
  useQuery({
    queryKey: ["seminary", "dashboard", params],
    queryFn: () => seminaryApi.getSeminaryDashboard(params),
    enabled: options?.enabled ?? true,
    staleTime: 30_000,
  });

export const useSeminaryReportsQuery = (
  params?: Parameters<typeof seminaryApi.getSeminaryReports>[0],
  options?: { enabled?: boolean },
) =>
  useQuery({
    queryKey: ["seminary", "reports", params],
    queryFn: () => seminaryApi.getSeminaryReports(params),
    enabled: options?.enabled ?? true,
    staleTime: 30_000,
  });

export const useSeminaryAnnouncementsQuery = () =>
  useQuery({
    queryKey: ["seminary", "announcements"],
    queryFn: seminaryApi.getSeminaryAnnouncements,
    staleTime: 30_000,
  });

const invalidateSeminaryAnnouncements = (queryClient: ReturnType<typeof useQueryClient>) =>
  queryClient.invalidateQueries({ queryKey: ["seminary", "announcements"] });

export const useCreateSeminaryAnnouncementMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: seminaryApi.createSeminaryAnnouncement,
    throwOnError: false,
    onSuccess: () => invalidateSeminaryAnnouncements(queryClient),
  });
};

export const useUpdateSeminaryAnnouncementMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: seminaryApi.updateSeminaryAnnouncement,
    throwOnError: false,
    onSuccess: () => invalidateSeminaryAnnouncements(queryClient),
  });
};

export const useDeleteSeminaryAnnouncementMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: seminaryApi.deleteSeminaryAnnouncement,
    throwOnError: false,
    onSuccess: () => invalidateSeminaryAnnouncements(queryClient),
  });
};

export const useSeminaryCourseSchedulesQuery = (
  params?: Parameters<typeof seminaryApi.getSeminaryCourseSchedules>[0],
) =>
  useQuery({
    queryKey: ["seminary", "course-schedules", params],
    queryFn: () => seminaryApi.getSeminaryCourseSchedules(params),
    staleTime: 30_000,
  });

const invalidateSeminaryCourseSchedules = (queryClient: ReturnType<typeof useQueryClient>) =>
  queryClient.invalidateQueries({ queryKey: ["seminary", "course-schedules"] });

export const useCreateSeminaryCourseScheduleMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: seminaryApi.createSeminaryCourseSchedule,
    throwOnError: false,
    onSuccess: () => invalidateSeminaryCourseSchedules(queryClient),
  });
};

export const useUpdateSeminaryCourseScheduleMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: seminaryApi.updateSeminaryCourseSchedule,
    throwOnError: false,
    onSuccess: () => invalidateSeminaryCourseSchedules(queryClient),
  });
};

export const useDeleteSeminaryCourseScheduleMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: seminaryApi.deleteSeminaryCourseSchedule,
    throwOnError: false,
    onSuccess: () => invalidateSeminaryCourseSchedules(queryClient),
  });
};

const invalidateSeminaryDocumentRequests = (queryClient: ReturnType<typeof useQueryClient>) =>
  queryClient.invalidateQueries({ queryKey: ["seminary", "document-requests"] });

const invalidateSeminaryDocumentRequestTypes = (queryClient: ReturnType<typeof useQueryClient>) =>
  queryClient.invalidateQueries({ queryKey: ["seminary", "document-request-types"] });

export const useSeminaryDocumentRequestTypesQuery = (
  params?: Parameters<typeof seminaryApi.getSeminaryDocumentRequestTypes>[0],
) =>
  useQuery({
    queryKey: ["seminary", "document-request-types", params],
    queryFn: () => seminaryApi.getSeminaryDocumentRequestTypes(params),
    staleTime: 30_000,
  });

export const useSeminaryDocumentRequestsQuery = (
  params?: Parameters<typeof seminaryApi.getSeminaryDocumentRequests>[0],
) =>
  useQuery({
    queryKey: ["seminary", "document-requests", params],
    queryFn: () => seminaryApi.getSeminaryDocumentRequests(params),
    staleTime: 30_000,
  });

export const useCreateSeminaryDocumentRequestMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: seminaryApi.createSeminaryDocumentRequest,
    throwOnError: false,
    onSuccess: () => invalidateSeminaryDocumentRequests(queryClient),
  });
};

export const useUpdateSeminaryDocumentRequestStatusMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: seminaryApi.updateSeminaryDocumentRequestStatus,
    throwOnError: false,
    onSuccess: () => invalidateSeminaryDocumentRequests(queryClient),
  });
};

export const useCreateSeminaryDocumentRequestTypeMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: seminaryApi.createSeminaryDocumentRequestType,
    throwOnError: false,
    onSuccess: () => invalidateSeminaryDocumentRequestTypes(queryClient),
  });
};

export const useUpdateSeminaryDocumentRequestTypeMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: seminaryApi.updateSeminaryDocumentRequestType,
    throwOnError: false,
    onSuccess: () => invalidateSeminaryDocumentRequestTypes(queryClient),
  });
};

export const useSeminaryStudyMaterialsQuery = (
  params?: Parameters<typeof seminaryApi.getSeminaryStudyMaterials>[0],
) =>
  useQuery({
    queryKey: ["seminary", "study-materials", params],
    queryFn: () => seminaryApi.getSeminaryStudyMaterials(params),
    staleTime: 30_000,
  });

export const useCreateSeminaryStudyMaterialMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: seminaryApi.createSeminaryStudyMaterial,
    throwOnError: false,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["seminary", "study-materials"],
      });
    },
    meta: { feature: "seminary.studyMaterial.create" },
  });
};

export const useUpdateSeminaryStudyMaterialMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: seminaryApi.updateSeminaryStudyMaterial,
    throwOnError: false,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["seminary", "study-materials"],
      });
    },
    meta: { feature: "seminary.studyMaterial.update" },
  });
};

export const useDeleteSeminaryStudyMaterialMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: seminaryApi.deleteSeminaryStudyMaterial,
    throwOnError: false,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["seminary", "study-materials"],
      });
    },
    meta: { feature: "seminary.studyMaterial.delete" },
  });
};

export const useSeminaryAssignmentsQuery = (
  params?: Parameters<typeof seminaryApi.getSeminaryAssignments>[0],
) =>
  useQuery({
    queryKey: ["seminary", "assignments", params],
    queryFn: () => seminaryApi.getSeminaryAssignments(params),
    staleTime: 30_000,
  });

export const useCreateSeminaryAssignmentMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: seminaryApi.createSeminaryAssignment,
    throwOnError: false,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["seminary", "assignments"],
      });
    },
    meta: { feature: "seminary.assignment.create" },
  });
};

export const useUpdateSeminaryAssignmentMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: seminaryApi.updateSeminaryAssignment,
    throwOnError: false,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["seminary", "assignments"],
      });
    },
    meta: { feature: "seminary.assignment.update" },
  });
};

export const useUpdateSeminaryAssignmentStatusMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: seminaryApi.updateSeminaryAssignmentStatus,
    throwOnError: false,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["seminary", "assignments"],
      });
    },
    meta: { feature: "seminary.assignment.status.update" },
  });
};

export const useDeleteSeminaryAssignmentMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: seminaryApi.deleteSeminaryAssignment,
    throwOnError: false,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["seminary", "assignments"],
      });
    },
    meta: { feature: "seminary.assignment.delete" },
  });
};

export const useSeminaryExaminationsQuery = (
  params?: Parameters<typeof seminaryApi.getSeminaryExaminations>[0],
) =>
  useQuery({
    queryKey: ["seminary", "examinations", params],
    queryFn: () => seminaryApi.getSeminaryExaminations(params),
    staleTime: 30_000,
  });

export const useSeminaryExaminationQuery = (
  id: string,
  options?: { enabled?: boolean },
) =>
  useQuery({
    queryKey: ["seminary", "examinations", id],
    queryFn: () => seminaryApi.getSeminaryExamination(id),
    enabled: options?.enabled ?? true,
    staleTime: 30_000,
  });

export const useCreateSeminaryExaminationMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: seminaryApi.createSeminaryExamination,
    throwOnError: false,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["seminary", "examinations"],
      });
    },
    meta: { feature: "seminary.examination.create" },
  });
};

export const useUpdateSeminaryExaminationMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: seminaryApi.updateSeminaryExamination,
    throwOnError: false,
    onSuccess: async (_data, variables) => {
      await queryClient.invalidateQueries({
        queryKey: ["seminary", "examinations"],
      });
      await queryClient.invalidateQueries({
        queryKey: ["seminary", "examinations", variables.id],
      });
    },
    meta: { feature: "seminary.examination.update" },
  });
};

export const useUpdateSeminaryExaminationStatusMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: seminaryApi.updateSeminaryExaminationStatus,
    throwOnError: false,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["seminary", "examinations"],
      });
    },
    meta: { feature: "seminary.examination.status.update" },
  });
};

export const useDeleteSeminaryExaminationMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: seminaryApi.deleteSeminaryExamination,
    throwOnError: false,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["seminary", "examinations"],
      });
    },
    meta: { feature: "seminary.examination.delete" },
  });
};

export const useSeminaryInstructorsQuery = (
  params?: Parameters<typeof seminaryApi.getSeminaryInstructors>[0],
  options?: { enabled?: boolean },
) =>
  useQuery({
    queryKey: ["seminary", "instructors", params],
    queryFn: () => seminaryApi.getSeminaryInstructors(params),
    enabled: options?.enabled ?? true,
    staleTime: 30_000,
  });

export const useSeminaryInstructorQuery = (
  id: string,
  options?: { enabled?: boolean },
) =>
  useQuery({
    queryKey: ["seminary", "instructors", id],
    queryFn: () => seminaryApi.getSeminaryInstructor(id),
    enabled: options?.enabled ?? true,
    staleTime: 30_000,
  });

export const useCreateSeminaryInstructorMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: seminaryApi.createSeminaryInstructor,
    throwOnError: false,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["seminary", "instructors"],
      });
    },
    meta: { feature: "seminary.instructor.create" },
  });
};

export const useUpdateSeminaryInstructorMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: seminaryApi.updateSeminaryInstructor,
    throwOnError: false,
    onSuccess: async (_data, variables) => {
      await queryClient.invalidateQueries({
        queryKey: ["seminary", "instructors"],
      });
      await queryClient.invalidateQueries({
        queryKey: ["seminary", "instructors", variables.id],
      });
    },
    meta: { feature: "seminary.instructor.update" },
  });
};

export const useUpdateSeminaryInstructorStatusMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: seminaryApi.updateSeminaryInstructorStatus,
    throwOnError: false,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["seminary", "instructors"],
      });
    },
    meta: { feature: "seminary.instructor.status.update" },
  });
};

export const useInviteSeminaryInstructorMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: seminaryApi.inviteSeminaryInstructor,
    throwOnError: false,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["seminary", "instructors"],
      });
    },
    meta: { feature: "seminary.instructor.invite" },
  });
};

export const useAcceptSeminaryInstructorInviteMutation = () =>
  useMutation({
    mutationFn: seminaryApi.acceptSeminaryInstructorInvite,
    throwOnError: false,
    meta: { feature: "seminary.instructor.invite.accept" },
  });

export const useDeleteSeminaryInstructorMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: seminaryApi.deleteSeminaryInstructor,
    throwOnError: false,
    onSuccess: async (_data, id) => {
      await queryClient.invalidateQueries({
        queryKey: ["seminary", "instructors"],
      });
      await queryClient.removeQueries({
        queryKey: ["seminary", "instructors", id],
      });
    },
    meta: { feature: "seminary.instructor.delete" },
  });
};

export const useSeminaryAcademicYearsQuery = (params?: {
  limit?: number;
  page?: number;
  search?: string;
  session?: string;
  status?: string;
}) =>
  useQuery({
    queryKey: ["seminary", "academic-years", params],
    queryFn: () => seminaryApi.getSeminaryAcademicYears(params),
    staleTime: 30_000,
  });

export const useCreateSeminaryAcademicYearMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: seminaryApi.createSeminaryAcademicYear,
    throwOnError: false,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["seminary", "academic-years"],
      });
    },
    meta: { feature: "seminary.academicYear.create" },
  });
};

export const useUpdateSeminaryAcademicYearMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: seminaryApi.updateSeminaryAcademicYear,
    throwOnError: false,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["seminary", "academic-years"],
      });
    },
    meta: { feature: "seminary.academicYear.update" },
  });
};

export const useUpdateSeminaryAcademicYearSessionMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: seminaryApi.updateSeminaryAcademicYearSession,
    throwOnError: false,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["seminary", "academic-years"],
      });
    },
    meta: { feature: "seminary.academicYear.session.update" },
  });
};

export const useUpdateSeminaryAcademicYearStatusMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: seminaryApi.updateSeminaryAcademicYearStatus,
    throwOnError: false,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["seminary", "academic-years"],
      });
    },
    meta: { feature: "seminary.academicYear.status.update" },
  });
};

export const useDeleteSeminaryAcademicYearMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: seminaryApi.deleteSeminaryAcademicYear,
    throwOnError: false,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["seminary", "academic-years"],
      });
    },
    meta: { feature: "seminary.academicYear.delete" },
  });
};

export const useSeminaryGradeConfigurationQuery = () =>
  useQuery({
    queryKey: ["seminary", "grade-configuration"],
    queryFn: seminaryApi.getSeminaryGradeConfiguration,
    staleTime: 30_000,
  });

export const useUpdateSeminaryGradeConfigurationMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: seminaryApi.updateSeminaryGradeConfiguration,
    throwOnError: false,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["seminary", "grade-configuration"],
      });
    },
    meta: { feature: "seminary.gradeConfiguration.update" },
  });
};

export const useSeminaryFeeConfigurationQuery = () =>
  useQuery({
    queryKey: ["seminary", "fee-configuration"],
    queryFn: seminaryApi.getSeminaryFeeConfiguration,
    staleTime: 30_000,
  });

export const useUpdateSeminaryFeeConfigurationMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: seminaryApi.updateSeminaryFeeConfiguration,
    throwOnError: false,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["seminary", "fee-configuration"],
      });
    },
    meta: { feature: "seminary.feeConfiguration.update" },
  });
};

export const useSeminaryGradeRecordsQuery = (
  params?: Parameters<typeof seminaryApi.getSeminaryGradeRecords>[0],
) =>
  useQuery({
    queryKey: ["seminary", "grade-records", params],
    queryFn: () => seminaryApi.getSeminaryGradeRecords(params),
    staleTime: 30_000,
  });

export const useSeminaryGradeRecordQuery = (
  id: string,
  options?: { enabled?: boolean },
) =>
  useQuery({
    queryKey: ["seminary", "grade-records", id],
    queryFn: () => seminaryApi.getSeminaryGradeRecord(id),
    enabled: options?.enabled ?? Boolean(id),
    staleTime: 30_000,
  });

export const useCreateSeminaryGradeRecordMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: seminaryApi.createSeminaryGradeRecord,
    throwOnError: false,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["seminary", "grade-records"],
      });
    },
    meta: { feature: "seminary.gradeRecord.create" },
  });
};

export const useBulkEncodeSeminaryGradesMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: seminaryApi.bulkEncodeSeminaryGrades,
    throwOnError: false,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["seminary", "grade-records"],
      });
    },
    meta: { feature: "seminary.gradeRecord.bulkEncode" },
  });
};

export const useUpdateSeminaryGradeRecordMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: seminaryApi.updateSeminaryGradeRecord,
    throwOnError: false,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["seminary", "grade-records"],
      });
    },
    meta: { feature: "seminary.gradeRecord.update" },
  });
};

export const useUpdateSeminaryGradeRecordStatusMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: seminaryApi.updateSeminaryGradeRecordStatus,
    throwOnError: false,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["seminary", "grade-records"],
      });
    },
    meta: { feature: "seminary.gradeRecord.status.update" },
  });
};

export const useDeleteSeminaryGradeRecordMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: seminaryApi.deleteSeminaryGradeRecord,
    throwOnError: false,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["seminary", "grade-records"],
      });
    },
    meta: { feature: "seminary.gradeRecord.delete" },
  });
};

export const useSeminaryFeeCollectionsQuery = (
  params?: Parameters<typeof seminaryApi.getSeminaryFeeCollections>[0],
) =>
  useQuery({
    queryKey: ["seminary", "fee-collections", params],
    queryFn: () => seminaryApi.getSeminaryFeeCollections(params),
    staleTime: 30_000,
  });

export const useUpdateSeminaryFeeCollectionStatusMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: seminaryApi.updateSeminaryFeeCollectionStatus,
    throwOnError: false,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["seminary", "fee-collections"],
      });
    },
    meta: { feature: "seminary.feeCollection.status.update" },
  });
};

export const useUpdateSeminaryFeeCollectionPaymentMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: seminaryApi.updateSeminaryFeeCollectionPayment,
    throwOnError: false,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["seminary", "fee-collections"],
      });
    },
    meta: { feature: "seminary.feeCollection.payment.update" },
  });
};

export const useGenerateSeminaryCredentialDocumentMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: seminaryApi.generateSeminaryCredentialDocument,
    throwOnError: false,
    onSuccess: async (_data, variables) => {
      await queryClient.invalidateQueries({
        queryKey: [
          "seminary",
          "students",
          variables.studentId,
          "credential-documents",
        ],
      });
      await queryClient.invalidateQueries({
        queryKey: ["seminary", "students", variables.studentId],
      });
    },
    meta: { feature: "seminary.credentialDocument.generate" },
  });
};

export const useSeminaryCredentialDocumentsQuery = (
  params: Parameters<typeof seminaryApi.getSeminaryCredentialDocuments>[0],
  options?: { enabled?: boolean },
) =>
  useQuery({
    queryKey: [
      "seminary",
      "students",
      params.studentId,
      "credential-documents",
      params.type,
    ],
    queryFn: () => seminaryApi.getSeminaryCredentialDocuments(params),
    enabled: options?.enabled ?? true,
    staleTime: 30_000,
  });

export { toApiError };
