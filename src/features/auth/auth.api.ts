import { authStore } from "@/lib/auth-store";
import { api } from "@/lib/http-client";
import type {
  AuthSuccessResponse,
  LoginRequest,
  UserEnvelopeResponse,
  VerifyTwoFactorRequest,
} from "./auth.types";

export async function login(payload: LoginRequest) {
  const { data } = await api.post<AuthSuccessResponse>("/auth/login", payload);

  if (data.accessToken && !data.mfaRequired) {
    authStore.setAccessToken(data.accessToken);
  }

  return data;
}

export async function verifyTwoFactor(payload: VerifyTwoFactorRequest) {
  const { data } = await api.post<AuthSuccessResponse>(
    "/auth/verify-two-factor",
    payload
  );

  if (data.accessToken) {
    authStore.setAccessToken(data.accessToken);
  }

  return data;
}

export async function getCurrentUser() {
  const { data } = await api.get<UserEnvelopeResponse>("/users/current");
  return data.user;
}

export async function logout() {
  try {
    await api.delete("/auth/logout");
  } finally {
    authStore.clear();
  }
}
