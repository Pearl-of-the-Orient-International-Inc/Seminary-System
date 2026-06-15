import { api } from "@/lib/http-client";
import type {
  SeminaryApplicationsResponse,
  SeminaryApplicationPayload,
  SeminaryApplicationResponse,
  SeminaryApplicationStatus,
} from "./seminary.types";

export async function upsertCurrentSeminaryApplication(
  payload: SeminaryApplicationPayload
) {
  const { data } = await api.put<SeminaryApplicationResponse>(
    "/seminary/current/application",
    payload
  );

  return data;
}

export async function getCurrentSeminaryApplication() {
  const { data } = await api.get<SeminaryApplicationResponse>(
    "/seminary/current/application"
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
    { params }
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
    { status, reviewRemarks }
  );

  return data;
}
