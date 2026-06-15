"use client";

import Link from "next/link";
import Image from "next/image";
import { useMemo, useState } from "react";
import {
  ArrowLeft,
  Check,
  Eye,
  EyeOff,
  LockKeyhole,
} from "lucide-react";

import { AuthShell } from "../_components/auth-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const passwordRules = [
  {
    label: "At least 8 characters long",
    test: (password: string) => password.length >= 8,
  },
  {
    label: "Contains uppercase letter (A-Z)",
    test: (password: string) => /[A-Z]/.test(password),
  },
  {
    label: "Contains lowercase letter (a-z)",
    test: (password: string) => /[a-z]/.test(password),
  },
  {
    label: "Contains number and special character",
    test: (password: string) => /\d/.test(password) && /[^A-Za-z0-9]/.test(password),
  },
];

const Page = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const ruleResults = useMemo(
    () =>
      passwordRules.map((rule) => ({
        ...rule,
        passed: rule.test(password),
      })),
    [password]
  );

  const strengthScore = ruleResults.filter((rule) => rule.passed).length;
  const strength =
    strengthScore <= 1
      ? { label: "Weak", color: "#c0372d" }
      : strengthScore <= 3
        ? { label: "Good", color: "#d99a21" }
        : { label: "Strong", color: "#0b4b39" };

  return (
    <AuthShell>
      <section className="rounded-xl bg-white p-8 shadow-[0_18px_48px_rgba(10,51,39,0.12)] ring-1 ring-[#0b3327]/8">
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
          <h1 className="mt-5 font-serif text-3xl font-bold">
            Reset New Password
          </h1>
          <p className="mt-2 text-sm text-[#31463f]">
            Please enter and confirm your new password.
          </p>
        </div>

        <form className="mt-8 space-y-5">
          <label className="block">
            <span className="text-sm font-bold">New Password</span>
            <div className="relative mt-2">
              <LockKeyhole className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-[#0b4b39]" />
              <Input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Enter your new password"
                className="h-10 border-[#0b3327]/10 bg-white pl-11 pr-11 text-sm shadow-none focus-visible:border-[#0b4b39] focus-visible:ring-3 focus-visible:ring-[#0b4b39]/12"
              />
              <button
                type="button"
                onClick={() => setShowPassword((current) => !current)}
                className="absolute right-2 top-1/2 flex size-8 -translate-y-1/2 items-center justify-center rounded-md text-[#31463f]/65 transition hover:bg-[#eef5f2] hover:text-[#0b4b39]"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff className="size-4" />
                ) : (
                  <Eye className="size-4" />
                )}
              </button>
            </div>
            <p className="mt-2 text-xs leading-5 text-[#31463f]">
              Use 8-16 characters with a mix of uppercase, lowercase, numbers,
              and special characters.
            </p>
          </label>

          <div>
            <div className="flex items-center gap-3 text-xs font-bold">
              <span>Password Strength:</span>
              <span style={{ color: strength.color }}>{strength.label}</span>
              <div className="flex flex-1 gap-2">
                {[1, 2, 3, 4].map((segment) => (
                  <span
                    key={segment}
                    className="h-1 flex-1 rounded-full"
                    style={{
                      backgroundColor:
                        segment <= strengthScore
                          ? strength.color
                          : "rgba(11,51,39,0.15)",
                    }}
                  />
                ))}
              </div>
            </div>
          </div>

          <label className="block">
            <span className="text-sm font-bold">Confirm New Password</span>
            <div className="relative mt-2">
              <LockKeyhole className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-[#0b4b39]" />
              <Input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                placeholder="Confirm your new password"
                className="h-10 border-[#0b3327]/10 bg-white pl-11 pr-11 text-sm shadow-none focus-visible:border-[#0b4b39] focus-visible:ring-3 focus-visible:ring-[#0b4b39]/12"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((current) => !current)}
                className="absolute right-2 top-1/2 flex size-8 -translate-y-1/2 items-center justify-center rounded-md text-[#31463f]/65 transition hover:bg-[#eef5f2] hover:text-[#0b4b39]"
                aria-label={
                  showConfirmPassword
                    ? "Hide confirm password"
                    : "Show confirm password"
                }
              >
                {showConfirmPassword ? (
                  <EyeOff className="size-4" />
                ) : (
                  <Eye className="size-4" />
                )}
              </button>
            </div>
            {confirmPassword && confirmPassword !== password ? (
              <p className="mt-2 text-xs font-semibold text-[#c0372d]">
                Passwords do not match.
              </p>
            ) : null}
          </label>

          <div className="rounded-md bg-[#f8faf9] p-3">
            <ul className="space-y-2">
              {ruleResults.map((rule) => (
                <li
                  key={rule.label}
                  className="flex items-center gap-2 text-xs font-semibold text-[#31463f]"
                >
                  <Check
                    className={`size-3.5 ${
                      rule.passed ? "text-[#0b4b39]" : "text-[#31463f]/30"
                    }`}
                  />
                  {rule.label}
                </li>
              ))}
            </ul>
          </div>

          <Button className="h-10 w-full rounded-md bg-[#003f2b] text-sm font-semibold text-white shadow-none hover:bg-[#07533a]">
            Reset Password
          </Button>

          <Button
            asChild
            variant="link"
            className="mx-auto flex h-auto w-fit p-0 text-sm font-bold text-[#0b4b39]"
          >
            <Link href="/auth/access">
              <ArrowLeft className="size-4" />
              Back to Login
            </Link>
          </Button>
        </form>
      </section>
    </AuthShell>
  );
};

export default Page;
