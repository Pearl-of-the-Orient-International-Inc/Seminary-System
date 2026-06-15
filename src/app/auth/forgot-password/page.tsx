import Link from "next/link";
import { ArrowLeft, Mail } from "lucide-react";

import { AuthShell } from "../_components/auth-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";

const Page = () => {
  return (
    <AuthShell>
      <section className="rounded-xl bg-white p-8 shadow-[0_18px_48px_rgba(10,51,39,0.12)] ring-1 ring-[#0b3327]/8">
        <Link
          href="/auth/access"
          className="inline-flex items-center gap-2 text-sm font-bold text-[#0b4b39] hover:text-[#c48a17]"
        >
          <ArrowLeft className="size-4" />
          Back to Login
        </Link>

        <div className="mt-6 text-center">
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
            Forgot Password?
          </h1>
          <p className="mt-2 text-sm text-[#31463f]">
            No problem! Enter your email address and we&apos;ll send you a link
            to reset your password.
          </p>
        </div>

        <form className="mt-8 space-y-5">
          <label className="block">
            <span className="text-sm font-bold">Email Address</span>
            <div className="relative mt-2">
              <Mail className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-[#0b4b39]" />
              <Input
                type="email"
                placeholder="Enter your registered email address"
                className="h-10 border-[#0b3327]/10 bg-white pl-11 text-sm shadow-none focus-visible:border-[#0b4b39] focus-visible:ring-3 focus-visible:ring-[#0b4b39]/12"
              />
            </div>
          </label>

          <Button className="h-10 w-full rounded-md bg-[#003f2b] text-sm font-semibold text-white shadow-none hover:bg-[#07533a]">
            Send Reset Link
          </Button>

          <div className="flex items-center gap-4 text-sm text-[#31463f]/60">
            <span className="h-px flex-1 bg-[#0b3327]/10" />
            or
            <span className="h-px flex-1 bg-[#0b3327]/10" />
          </div>

          <Button
            variant="outline"
            className="h-10 w-full rounded-md bg-white text-sm font-bold text-[#0b4b39] shadow-none"
          >
            Answer Security Questions Instead
          </Button>
        </form>
      </section>
    </AuthShell>
  );
};

export default Page;
