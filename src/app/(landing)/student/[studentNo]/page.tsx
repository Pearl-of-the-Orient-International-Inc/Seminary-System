import type { Metadata } from "next";
import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import {
  BadgeCheck,
  CalendarDays,
  GraduationCap,
  Layers3,
  School,
  UserRound,
  UsersRound,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

type PageProps = {
  params: Promise<{ studentNo: string }>;
};

type PublicStudent = {
  studentId: string;
  surname: string | null;
  givenName: string | null;
  middleName: string | null;
  programLevel: string | null;
  programCourse: string | null;
  academicYear: string | null;
  yearLevel: string | null;
  studentStatus: "ACTIVE" | "GRADUATING";
  enrollmentType: "REGULAR" | "TRANSFEREE" | "CROSS_ENROLLEE";
  schoolAffiliation: "IN_HOUSE" | "PARTNER_SCHOOL";
};

type PublicStudentResponse = {
  data: PublicStudent;
};

const apiBaseUrl =
  process.env.NODE_ENV === "development"
    ? process.env.NEXT_PUBLIC_API_BASE_URL_DEV
    : process.env.NEXT_PUBLIC_API_BASE_URL_PROD;

async function getPublicStudent(
  studentNo: string,
): Promise<PublicStudent | null> {
  if (!apiBaseUrl) {
    throw new Error("API base URL is not configured.");
  }

  const response = await fetch(
    `${apiBaseUrl}/seminary/public/students/${encodeURIComponent(studentNo)}`,
    { cache: "no-store" },
  );

  if (response.status === 404) return null;
  if (!response.ok) throw new Error("Failed to load public student profile.");

  return ((await response.json()) as PublicStudentResponse).data;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { studentNo } = await params;
  const student = await getPublicStudent(studentNo);

  if (!student) {
    return { title: "Student Record Not Verified" };
  }

  const studentName = formatStudentName(student);
  return {
    title: `${studentName} | Student Verification`,
    description: `Official student verification for ${studentName} of Pearl of the Orient Theological Seminary and Colleges.`,
    alternates: {
      canonical: `/student/${encodeURIComponent(student.studentId)}`,
    },
  };
}

export default async function StudentProfilePage({ params }: PageProps) {
  const { studentNo } = await params;
  const student = await getPublicStudent(studentNo);

  if (!student) notFound();

  const studentName = formatStudentName(student);

  return (
    <main className="min-h-screen bg-[linear-gradient(135deg,#f7f5ef_0%,#edf5ee_45%,#f7f5ef_100%)] text-[#032a0d]">
      <section className="relative overflow-hidden bg-[#032a0d] text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_0%,rgba(255,194,49,0.16),transparent_32%)]" />
        <div className="relative mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
          <p className="text-sm font-semibold uppercase text-green-200">
            Pearl of the Orient Theological Seminary and Colleges
          </p>
          <h1 className="mt-2 font-serif text-4xl tracking-tight sm:text-5xl">
            Student Verification
          </h1>
        </div>
      </section>

      <section className="relative mx-auto max-w-6xl px-4 pb-12 sm:px-6 lg:px-8">
        <Card className="-mt-8 overflow-hidden rounded-2xl border-[#032a0d]/10 bg-white gap-0! py-0! shadow-xl shadow-green-950/10">
          <CardHeader className="gap-5 border-b border-[#032a0d]/10 bg-green-50/60 p-6">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
              <Avatar className="size-24 shrink-0 rounded-2xl border-4 border-white shadow-md sm:size-28">
                <AvatarFallback className="rounded-2xl bg-[#032a0d] text-4xl font-semibold text-white">
                  {getFirstNameInitial(student)}{getLastNameInitial(student)}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-green-700 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white">
                    <BadgeCheck className="size-3.5" aria-hidden="true" />
                    Verified student
                  </span>
                  <span className="rounded-full border border-green-900/15 bg-white px-3 py-1 text-xs font-semibold text-green-900">
                    {formatStudentStatus(student.studentStatus)}
                  </span>
                </div>
                <CardTitle className="mt-3 font-serif text-3xl tracking-tight text-[#032a0d] sm:text-4xl">
                  {studentName}
                </CardTitle>
                <p className="mt-3 text-sm text-neutral-700">
                  This student is verified as a bona fide student of Pearl of
                  the Orient Theological Seminary and Colleges.
                </p>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-5 sm:p-8">
            <div className="grid gap-8 lg:grid-cols-2">
              <div>
                <h2 className="text-lg font-semibold text-[#032a0d]">
                  Academic profile
                </h2>
                <p className="mt-1 text-sm text-neutral-600">
                  Current program and academic standing.
                </p>
                <div className="mt-4 grid gap-3">
                  <VerificationField
                    icon={<GraduationCap className="size-4" />}
                    label="Program"
                    value={student.programCourse ?? "Not available"}
                  />
                  <VerificationField
                    icon={<Layers3 className="size-4" />}
                    label="Program Level"
                    value={formatProgramLevel(student.programLevel)}
                  />
                  <VerificationField
                    icon={<UserRound className="size-4" />}
                    label="Year Level"
                    value={student.yearLevel ?? "Not available"}
                  />
                </div>
              </div>

              <div>
                <h2 className="text-lg font-semibold text-[#032a0d]">
                  Enrollment record
                </h2>
                <p className="mt-1 text-sm text-neutral-600">
                  Official current enrollment information.
                </p>
                <div className="mt-4 grid gap-3">
                  <VerificationField
                    icon={<CalendarDays className="size-4" />}
                    label="Academic Year"
                    value={student.academicYear ?? "Not available"}
                  />
                  <VerificationField
                    icon={<UsersRound className="size-4" />}
                    label="Enrollment Type"
                    value={formatEnumLabel(student.enrollmentType)}
                  />
                  <VerificationField
                    icon={<School className="size-4" />}
                    label="School Affiliation"
                    value={formatEnumLabel(student.schoolAffiliation)}
                  />
                </div>
              </div>
            </div>

            <div className="mt-8 rounded-xl border border-green-900/10 bg-green-50/70 p-5">
              <div className="flex items-center gap-2 text-sm font-semibold text-[#032a0d]">
                <BadgeCheck className="size-5 text-green-700" />
                Verification notice
              </div>
              <p className="mt-2 text-sm leading-6 text-neutral-700">
                This result was issued from the official seminary registry.
                Records that are inactive, on leave, or otherwise not current
                are not presented as verified student profiles.
              </p>
            </div>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}

function VerificationField({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-lg border border-[#032a0d]/10 p-4">
      <div className="flex items-center gap-2 text-sm font-medium text-neutral-600">
        {icon}
        {label}
      </div>
      <p className="mt-2 wrap-break-word font-semibold text-[#032a0d]">
        {value}
      </p>
    </div>
  );
}

function formatStudentName(student: PublicStudent) {
  return (
    [student.givenName, `${student.middleName}.`, student.surname]
      .filter(Boolean)
      .join(" ") || student.studentId
  );
}

function formatProgramLevel(value: string | null) {
  const labels: Record<string, string> = {
    BACHELOR: "Bachelor Program",
    CERTIFICATE: "Certificate Program",
    DOCTORATE_WITH_DISSERTATION: "Doctorate Program",
    MASTER_WITH_THESIS: "Masteral Program",
  };

  return value ? (labels[value] ?? value) : "Not available";
}

function formatEnumLabel(value: string) {
  return value
    .split("_")
    .map((word) => word.charAt(0) + word.slice(1).toLowerCase())
    .join(" ");
}

function formatStudentStatus(value: PublicStudent["studentStatus"]) {
  return value === "GRADUATING" ? "Graduating" : "Active";
}

function getFirstNameInitial(student: PublicStudent) {
  return (
    student.givenName?.trim().charAt(0) || student.studentId.charAt(0)
  ).toUpperCase();
}

function getLastNameInitial(student: PublicStudent) {
  return (
    student.surname?.trim().charAt(0) || student.studentId.charAt(0)
  ).toUpperCase();
}
