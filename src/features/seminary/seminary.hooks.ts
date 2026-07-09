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
