"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";

import { useCurrentUserQuery } from "@/features/auth/auth.hooks";

export default function StudentLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { data: user, isLoading } = useCurrentUserQuery();

  useEffect(() => {
    if (!isLoading && user?.role !== "MEMBER") {
      router.replace(user ? "/portal/dashboard" : "/auth/access");
    }
  }, [isLoading, router, user]);

  if (isLoading || user?.role !== "MEMBER") return null;

  return <>{children}</>;
}
