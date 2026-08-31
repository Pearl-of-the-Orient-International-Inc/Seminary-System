"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";

import { useCurrentUserQuery } from "@/features/auth/auth.hooks";

export const instructorAllowedPaths = [
  "/portal/dashboard",
  "/portal/announcement",
  "/portal/users/students",
  "/portal/grade/records",
  "/portal/lms/assignments",
  "/portal/lms/examinations",
  "/portal/lms/study-materials",
  "/portal/academics/attendance",
  "/portal/academics/thesis-dissertation",
  "/portal/academics/timetable",
] as const;

export const isInstructorAllowedPath = (pathname: string) =>
  instructorAllowedPaths.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`),
  );

const getLoginPath = (pathname: string) =>
  pathname.startsWith("/portal") ? "/auth/access" : "/auth/registrar";

export const ProtectedAccessGuard = ({
  children,
}: {
  children: ReactNode;
}) => {
  const pathname = usePathname();
  const router = useRouter();
  const {
    data: currentUser,
    isError,
    isLoading,
  } = useCurrentUserQuery();

  useEffect(() => {
    if (isLoading) {
      return;
    }

    if (isError || !currentUser) {
      router.replace(getLoginPath(pathname));
      return;
    }

    if (
      currentUser.role === "INSTRUCTOR" &&
      !isInstructorAllowedPath(pathname)
    ) {
      router.replace("/portal/dashboard");
    }
  }, [currentUser, isError, isLoading, pathname, router]);

  if (
    isLoading ||
    isError ||
    !currentUser ||
    currentUser?.role === "INSTRUCTOR" &&
      !isInstructorAllowedPath(pathname)
  ) {
    return null;
  }

  return children;
};
