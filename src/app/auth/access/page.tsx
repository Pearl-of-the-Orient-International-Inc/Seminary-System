"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
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

const Page = () => {
  const [showPassword, setShowPassword] = useState(false);

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
            Sign in with your account to continue to your student portal.
          </p>
        </div>

        <form className="mt-8 space-y-5">
          <label className="block">
            <span className="text-sm font-bold">Student Number</span>
            <div className="relative mt-2">
              <IdCard className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-[#0b4b39]" />
              <Input
                type="text"
                inputMode="numeric"
                placeholder="Enter your student number"
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

          <Button className="h-10 w-full rounded-md bg-[#003f2b] text-sm font-semibold text-white shadow-none hover:bg-[#07533a]">
            Log In
          </Button>
        </form>
      </section>

      <section className="mt-6 rounded-md bg-[#f8faf9] p-6 shadow-[0_12px_30px_rgba(10,51,39,0.06)] ring-1 ring-[#0b3327]/5">
        <h2 className="text-lg font-bold">New Student?</h2>
        <p className="mt-1 text-sm text-[#31463f]">
          If you are a new student, please check your email for your account
          credentials or contact the Admissions Office for assistance.
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
