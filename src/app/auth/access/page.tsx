"use client";

import Link from "next/link";
import Image from "next/image";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Eye,
  EyeOff,
  IdCard,
  LockKeyhole,
} from "lucide-react";

import { AuthShell } from "../_components/auth-shell";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { useLoginMutation, toApiError } from "@/features/auth/auth.hooks";
import type { AuthUser } from "@/features/auth/auth.types";
import { authStore } from "@/lib/auth-store";
import { useToast } from "@/hooks/use-toast";

const Page = () => {
  const router = useRouter();
  const { toast } = useToast();
  const loginMutation = useLoginMutation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const response = await loginMutation.mutateAsync({ email, password });
      const user: AuthUser = response.user;
      if (user.role !== "MEMBER" || response.mfaRequired) {
        authStore.clear();
        toast({ title: "Access restricted", description: "Please use the correct portal for this account.", variant: "error" });
        return;
      }
      toast({ title: "Login successful", description: "Welcome to your student portal.", variant: "success" });
      router.push("/students/dashboard");
    } catch (error) {
      const apiError = toApiError(error);
      const validationMessage = apiError.errors?.map((issue) => issue.message).join(" ");
      toast({ title: "Login failed", description: validationMessage ?? apiError.message ?? "Check your student number and password.", variant: "error" });
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
          <h1 className="mt-5 font-serif text-3xl font-bold">
            Student Portal Login
          </h1>
          <p className="mt-2 text-sm leading-6 text-[#31463f]">
            Sign in with your student number and password.
          </p>
        </div>

        <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
          <label className="block">
            <span className="text-sm font-bold">Student number</span>
            <div className="relative mt-2">
              <IdCard className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-[#0b4b39]" />
              <Input
                type="text"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="Example: POTSC-26-0001"
                className="h-10 border-[#0b3327]/10 bg-white pl-11 text-sm shadow-none focus-visible:border-[#0b4b39] focus-visible:ring-3 focus-visible:ring-[#0b4b39]/12"
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
                className="h-10 border-[#0b3327]/10 bg-white pl-11 pr-11 text-sm shadow-none focus-visible:border-[#0b4b39] focus-visible:ring-3 focus-visible:ring-[#0b4b39]/12"
              />
              <button
                type="button"
                onClick={() => setShowPassword((current) => !current)}
                className="absolute right-3 top-1/2 flex size-8 -translate-y-1/2 items-center justify-center rounded-md text-[#31463f]/65 transition hover:bg-[#eef5f2] hover:text-[#0b4b39]"
                aria-label={showPassword ? "Hide password" : "Show password"}
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

          <Button type="submit" disabled={loginMutation.isPending} className="h-10 w-full rounded-md bg-[#003f2b] text-sm font-semibold text-white shadow-none hover:bg-[#07533a]">
            {loginMutation.isPending ? "Logging in…" : "Log In"}
          </Button>
        </form>
      </section>

      <section className="mt-6 rounded-md bg-[#f8faf9] p-6 shadow-[0_12px_30px_rgba(10,51,39,0.06)] ring-1 ring-[#0b3327]/5">
        <h2 className="text-lg font-bold">New Student?</h2>
        <p className="mt-1 text-sm text-[#31463f]">
          Your registrar provides your student number when your record is created.
          Your first password is <span className="font-semibold">Student123@</span>.
        </p>
      </section>

      <section className="mt-4 grid gap-3 rounded-md bg-white p-4 shadow-[0_12px_30px_rgba(10,51,39,0.06)] ring-1 ring-[#0b3327]/5 sm:grid-cols-2">
        <Button variant="outline" asChild>
          <Link href="/auth/registrar">Registrar Login</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/auth/instructor">Instructor Login</Link>
        </Button>
      </section>
    </AuthShell>
  );
};

export default Page;
