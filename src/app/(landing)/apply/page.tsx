"use client";

import { useEffect } from "react";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

const Page = () => {
  const router = useRouter();

  useEffect(() => {
    router.replace("/apply/step-1");
  }, [router]);

  return (
    <main className="flex min-h-[60vh] items-center justify-center bg-white px-6 text-[#0b3327]">
      <div className="text-center">
        <Loader2 className="mx-auto size-10 animate-spin text-[#0b4b39]" />
        <h1 className="mt-5 font-serif text-2xl font-bold">
          Preparing Your Application
        </h1>
        <p className="mt-2 text-sm text-[#31463f]">
          Redirecting you to the online application form.
        </p>
      </div>
    </main>
  );
};

export default Page;
