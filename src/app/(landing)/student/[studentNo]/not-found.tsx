import Image from "next/image";
import Link from "next/link";
import { House } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function StudentProfileNotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-stone-50 px-4 py-20">
      <section className="w-full text-center">
        <Image
          src="/main/logo.png"
          alt="Pearl of the Orient Theological Seminary and Colleges"
          width={280}
          height={280}
          className="mx-auto h-auto w-full max-w-70"
          priority
        />
        <h1 className="mt-2 text-4xl font-semibold tracking-tight text-neutral-950 sm:text-5xl">
          Student Record Not Verified
        </h1>
        <p className="mx-auto mt-4 max-w-lg text-sm leading-7 text-neutral-600 sm:text-base">
          This student record does not exist, is no longer current, or the link
          may be incorrect.
        </p>
        <Button asChild className="mt-8 h-11 min-w-52.5 rounded-md bg-[#0b5d34] px-6 hover:bg-[#094f2d]">
          <Link href="/">
            <House className="size-4" />
            Go to homepage
          </Link>
        </Button>
      </section>
    </main>
  );
}
