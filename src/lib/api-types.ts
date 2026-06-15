export interface ApiErrorIssue {
  path: string;
  message: string;
}

export interface ApiErrorResponse {
  code: string;
  message?: string;
  errors?: ApiErrorIssue[];
  error?: unknown;
}

export interface RefreshTokenResponse {
  accessToken: string;
}
