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

export { toApiError };
