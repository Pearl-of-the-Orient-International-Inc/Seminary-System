import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toApiError } from "@/lib/http-client";
import * as seminaryApi from "./seminary.api";
import {
  uploadSeminaryPaymentReceipt,
  uploadSeminaryRequirement,
} from "./seminary-upload.api";

export const useCurrentSeminaryApplicationQuery = () =>
  useQuery({
    queryKey: ["seminary", "current", "application"],
    queryFn: seminaryApi.getCurrentSeminaryApplication,
    staleTime: 60_000,
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
}) =>
  useQuery({
    queryKey: ["seminary", "courses", params],
    queryFn: () => seminaryApi.getSeminaryCourses(params),
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
