"use client";

import Image from "next/image";
import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import {
  toApiError,
  useCurrentUserQuery,
  useLoginMutation,
  useVerifyTwoFactorMutation,
} from "@/features/auth/auth.hooks";
import type { AuthUser } from "@/features/auth/auth.types";
import { authStore } from "@/lib/auth-store";
import { useToast } from "@/hooks/use-toast";
import { AuthShell } from "../_components/auth-shell";

const canAccessAdminPortal = (user: AuthUser) =>
  user.role === "ADMIN" || user.position === "REGISTRAR";

const Page = () => {
  const router = useRouter();
  const { toast } = useToast();
  const loginMutation = useLoginMutation();
  const verifyTwoFactorMutation = useVerifyTwoFactorMutation();
  const { data: currentUser } = useCurrentUserQuery();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [requiresMfa, setRequiresMfa] = useState(false);
  const [mfaToken, setMfaToken] = useState("");
  const [otpCode, setOtpCode] = useState("");

  useEffect(() => {
    if (!currentUser || !canAccessAdminPortal(currentUser)) return;
    router.replace("/admin/dashboard");
  }, [currentUser, router]);

  const handleAuthorizedLogin = (user: AuthUser) => {
    if (!canAccessAdminPortal(user)) {
      authStore.clear();
      toast({
        title: "Access restricted",
        description:
          "Only administrator and registrar accounts can access this portal.",
        variant: "error",
      });
      return;
    }

    toast({
      title: "Login successful",
      description: "Welcome to the Seminary Admin Portal.",
      variant: "success",
    });
    router.push("/admin/dashboard");
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const response = await loginMutation.mutateAsync({
        email,
        password,
        userAgent:
          typeof window !== "undefined"
            ? window.navigator.userAgent
            : undefined,
      });

      if (response.mfaRequired && response.mfaToken) {
        setRequiresMfa(true);
        setMfaToken(response.mfaToken);
        toast({
          title: "Two-factor required",
          description: "Enter the 6-digit code from your authenticator app.",
          variant: "info",
        });
        return;
      }

      handleAuthorizedLogin(response.user);
    } catch (error) {
      const apiError = toApiError(error);

      toast({
        title: "Login failed",
        description: apiError.message ?? "Invalid email address or password.",
        variant: "error",
      });
    }
  };

  const handleVerifyTwoFactor = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (otpCode.length !== 6 || !mfaToken) {
      toast({
        title: "Invalid code",
        description: "Please enter a valid 6-digit authentication code.",
        variant: "error",
      });
      return;
    }

    try {
      const response = await verifyTwoFactorMutation.mutateAsync({
        mfaToken,
        token: otpCode,
        userAgent:
          typeof window !== "undefined"
            ? window.navigator.userAgent
            : undefined,
      });

      handleAuthorizedLogin(response.user);
    } catch (error) {
      const apiError = toApiError(error);

      toast({
        title: "Verification failed",
        description: apiError.message ?? "Invalid authentication code.",
        variant: "error",
      });
    }
  };

  return (
    <AuthShell>
      <section className="rounded-md bg-white p-6 shadow-[0_18px_48px_rgba(10,51,39,0.12)] ring-1 ring-[#0b3327]/8">
        <div className="text-center">
          <div className="mx-auto flex size-18 items-center justify-center rounded-full bg-white shadow-[0_10px_24px_rgba(10,51,39,0.12)] ring-1 ring-[#0b3327]/10">
            <Image
              src="/main/logo.png"
              alt="Pearl of The Orient Theological Seminary and Colleges"
              width={58}
              height={58}
              className="size-14 rounded-full object-contain"
            />
          </div>
          <h2 className="mt-5 font-serif text-3xl font-bold">
            {requiresMfa ? "Two-factor Authentication" : "Admin Portal Login"}
          </h2>
          <p className="mt-2 text-sm leading-6 text-[#31463f]">
            {requiresMfa
              ? "Enter the 6-digit code from your authenticator app."
              : "Sign in with your staff email address and password."}
          </p>
        </div>

        <form
          className="mt-8 space-y-5"
          onSubmit={requiresMfa ? handleVerifyTwoFactor : handleSubmit}
        >
          {!requiresMfa ? (
            <>
              <label className="block">
                <span className="text-sm font-bold">Email Address</span>
                <div className="relative mt-2">
                  <Mail className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-[#0b4b39]" />
                  <Input
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="Enter email address"
                    className="h-10 border-[#0b3327]/10 bg-white pl-11 text-sm shadow-none focus-visible:border-[#0b4b39] focus-visible:ring-3 focus-visible:ring-[#0b4b39]/12"
                    required
                  />
                </div>
              </label>

              <label className="block">
                <span className="text-sm font-bold">Password</span>
                <div className="relative mt-2">
                  <LockKeyhole className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-[#0b4b39]" />
                  <Input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="Enter your password"
                    className="h-10 border-[#0b3327]/10 bg-white pl-11 text-sm shadow-none focus-visible:border-[#0b4b39] focus-visible:ring-3 focus-visible:ring-[#0b4b39]/12"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((current) => !current)}
                    className="absolute right-1 top-1/2 flex size-8 -translate-y-1/2 items-center justify-center rounded-md text-[#31463f]/65 transition hover:bg-[#eef5f2] hover:text-[#0b4b39]"
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? (
                      <EyeOff className="size-4" />
                    ) : (
                      <Eye className="size-4" />
                    )}
                  </button>
                </div>
              </label>

              <div className="flex items-center justify-between gap-4 text-sm">
                <label className="flex items-center gap-2 font-semibold text-[#31463f]">
                  <Checkbox
                    defaultChecked
                    className="border-[#003f2b] data-[state=checked]:border-[#003f2b] data-[state=checked]:bg-[#003f2b]"
                  />
                  Remember me
                </label>
                <Link
                  href="/auth/forgot-password"
                  className="font-bold text-[#0b4b39] hover:text-[#c48a17]"
                >
                  Forgot Password?
                </Link>
              </div>

              <Button
                type="submit"
                disabled={loginMutation.isPending}
                className="h-10 w-full rounded-md bg-[#003f2b] text-sm font-semibold text-white shadow-none hover:bg-[#07533a]"
              >
                {loginMutation.isPending ? "Signing in..." : "Log In"}
              </Button>
            </>
          ) : (
            <>
              <div className="flex justify-center">
                <InputOTP
                  autoFocus
                  maxLength={6}
                  value={otpCode}
                  onChange={setOtpCode}
                >
                  <InputOTPGroup>
                    {Array.from({ length: 6 }).map((_, index) => (
                      <InputOTPSlot key={index} index={index} />
                    ))}
                  </InputOTPGroup>
                </InputOTP>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setRequiresMfa(false);
                    setMfaToken("");
                    setOtpCode("");
                  }}
                >
                  Back
                </Button>
                <Button
                  type="submit"
                  disabled={verifyTwoFactorMutation.isPending}
                  className="bg-[#003f2b] text-white hover:bg-[#07533a]"
                >
                  {verifyTwoFactorMutation.isPending
                    ? "Verifying..."
                    : "Verify"}
                </Button>
              </div>
            </>
          )}
        </form>
      </section>
    </AuthShell>
  );
};

export default Page;
