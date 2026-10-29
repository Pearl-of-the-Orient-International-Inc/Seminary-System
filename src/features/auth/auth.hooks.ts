import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toApiError } from "@/lib/http-client";
import * as authApi from "./auth.api";

export const useLoginMutation = () =>
  useMutation({
    mutationFn: authApi.login,
    throwOnError: false,
    meta: { feature: "auth.login" },
  });

export const useVerifyTwoFactorMutation = () =>
  useMutation({
    mutationFn: authApi.verifyTwoFactor,
    throwOnError: false,
    meta: { feature: "auth.verifyTwoFactor" },
  });

export const useLogoutMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authApi.logout,
    throwOnError: false,
    onSettled: async () => {
      await queryClient.cancelQueries({ queryKey: ["auth"] });
      queryClient.removeQueries({ queryKey: ["auth"] });
    },
    meta: { feature: "auth.logout" },
  });
};

export const useCurrentUserQuery = () =>
  useQuery({
    queryKey: ["auth", "current-user"],
    queryFn: authApi.getCurrentUser,
    retry: false,
    staleTime: 60_000,
  });

export const useChangePasswordMutation = () =>
  useMutation({
    mutationFn: authApi.changePassword,
    throwOnError: false,
    meta: { feature: "auth.password.change" },
  });

export { toApiError };
