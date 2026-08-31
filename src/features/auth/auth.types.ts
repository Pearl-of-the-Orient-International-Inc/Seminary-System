export type UserRole = "MEMBER" | "OFFICER" | "ADMIN" | "INSTRUCTOR";

export type UserPosition =
  | "CLERK"
  | "REGISTRAR"
  | "HR"
  | "IT"
  | "ACCOUNTING_FINANCE"
  | "OPERATIONS"
  | "SECRETARIAN";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  avatar: string | null;
  role: UserRole;
  position: UserPosition | null;
  accountStatus: "ACTIVE" | "PENDING" | "SUSPENDED";
  isEmailVerified: boolean;
  isTwoFactorEnabled: boolean;
}

export interface LoginRequest {
  email: string;
  password: string;
  userAgent?: string;
}

export interface VerifyTwoFactorRequest {
  mfaToken: string;
  token: string;
  userAgent?: string;
}

export interface AuthSuccessResponse {
  code: string;
  message: string;
  user: AuthUser;
  accessToken?: string;
  mfaRequired?: boolean;
  mfaToken?: string;
}

export interface UserEnvelopeResponse {
  user: AuthUser;
}
