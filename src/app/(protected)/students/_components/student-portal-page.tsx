"use client";

import Link from "next/link";
import { type FormEvent, type ReactNode, useState } from "react";
import {
  BookOpenText,
  ClipboardCheck,
  FileText,
  GraduationCap,
  LibraryBig,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import {
  toApiError,
  useChangePasswordMutation,
} from "@/features/auth/auth.hooks";
import { useCurrentStudentPortalQuery } from "@/features/seminary/seminary.hooks";

type StudentView =
  | "dashboard"
  | "grades"
  | "materials"
  | "assignments"
  | "examinations"
  | "profile";

const dateLabel = (value: string) =>
  new Intl.DateTimeFormat("en", { dateStyle: "medium" }).format(
    new Date(value),
  );
const nameFor = (student: {
  givenName: string | null;
  middleName: string | null;
  surname: string | null;
}) =>
  [student.givenName, student.middleName, student.surname]
    .filter(Boolean)
    .join(" ") || "Student";

export function StudentPortalPage({ view }: { view: StudentView }) {
  const portalQuery = useCurrentStudentPortalQuery();
  const portal = portalQuery.data?.data;

  if (portalQuery.isLoading)
    return (
      <div className="p-10 text-sm text-muted-foreground">
        Loading your student portal…
      </div>
    );
  if (!portal)
    return (
      <div className="p-10">
        <Card className="py-0!">
          <CardContent className="p-6 text-sm text-muted-foreground">
            Your account does not yet have an active seminary student record.
            Please contact the registrar.
          </CardContent>
        </Card>
      </div>
    );

  const { student, grades, materials, assignments, examinations } = portal;
  const title: Record<StudentView, string> = {
    dashboard: "Student Dashboard",
    grades: "My Grades",
    materials: "Learning Materials",
    assignments: "Assignments",
    examinations: "Examinations",
    profile: "My Profile",
  };
  const description: Record<StudentView, string> = {
    dashboard: "Your academic information in one place.",
    grades: "View only your released and in-review grade records.",
    materials: "Published learning resources available to students.",
    assignments: "Published coursework and due dates.",
    examinations: "Your scheduled examinations and instructions.",
    profile: "Your student record on file with the seminary.",
  };

  const quickLinks = [
    { href: "/students/grades", label: "My grades", icon: ClipboardCheck },
    {
      href: "/students/materials",
      label: "Learning materials",
      icon: LibraryBig,
    },
    { href: "/students/assignments", label: "Assignments", icon: FileText },
    {
      href: "/students/examinations",
      label: "Examinations",
      icon: BookOpenText,
    },
  ];

  return (
    <section className="space-y-6 p-6 md:p-10">
      <div className="rounded-2xl bg-linear-to-r from-emerald-950 to-emerald-800 px-6 py-7 text-white shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-emerald-100/75">
              Pearl of the Orient Seminary
            </p>
            <h1 className="mt-2 font-serif text-3xl">{title[view]}</h1>
            <p className="mt-2 text-sm text-emerald-50/85">
              {description[view]}
            </p>
          </div>
          <div className="rounded-xl bg-white/10 px-4 py-3 text-sm">
            <p className="font-semibold">{nameFor(student)}</p>
            <p className="mt-1 text-emerald-50/75">
              {student.studentId ?? "Student record pending"}
            </p>
          </div>
        </div>
      </div>

      {view === "dashboard" ? (
        <>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {[
              {
                label: "Grade records",
                value: grades.length,
                icon: GraduationCap,
              },
              {
                label: "Learning materials",
                value: materials.length,
                icon: LibraryBig,
              },
              {
                label: "Assignments",
                value: assignments.length,
                icon: FileText,
              },
              {
                label: "Examinations",
                value: examinations.length,
                icon: BookOpenText,
              },
            ].map(({ label, value, icon: Icon }) => (
              <Card className="py-0!" key={label}>
                <CardContent className="flex items-center gap-4 p-5">
                  <span className="rounded-xl bg-emerald-700/10 p-3 text-emerald-800">
                    <Icon className="size-5" />
                  </span>
                  <div>
                    <p className="text-2xl font-semibold">{value}</p>
                    <p className="text-sm text-muted-foreground">{label}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="grid gap-6 xl:grid-cols-[1.25fr_1fr]">
            <Card className="py-0!">
              <CardContent className="p-6">
                <h2 className="font-semibold">Recent grades</h2>
                <div className="mt-4 space-y-3">
                  {grades.slice(0, 4).map((grade) => (
                    <div
                      key={grade.id}
                      className="flex items-center justify-between border-b pb-3 last:border-0"
                    >
                      <div>
                        <p className="font-medium">{grade.subject}</p>
                        <p className="text-xs text-muted-foreground">
                          {grade.courseCode}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">{grade.finalGrade}</p>
                        <Badge
                          variant={
                            grade.remarks === "PASSED" ? "success" : "warning"
                          }
                        >
                          {grade.remarks.replaceAll("_", " ")}
                        </Badge>
                      </div>
                    </div>
                  ))}
                  {!grades.length && (
                    <p className="text-sm text-muted-foreground">
                      No grades are available yet.
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
            <Card className="py-0!">
              <CardContent className="p-6">
                <h2 className="font-semibold">Quick access</h2>
                <div className="mt-4 grid gap-2">
                  {quickLinks.map(({ href, label, icon: Icon }) => (
                    <Link
                      key={href}
                      href={href}
                      className="flex items-center gap-3 rounded-xl border p-3 text-sm font-medium transition hover:bg-muted"
                    >
                      <Icon className="size-4 text-emerald-700" />
                      {label}
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      ) : null}

      {view === "grades" ? (
        <DataList
          empty="No grades are available yet."
          items={grades}
          render={(grade) => (
            <>
              <div>
                <p className="font-medium">{grade.subject}</p>
                <p className="text-sm text-muted-foreground">
                  {grade.courseCode} · Updated {dateLabel(grade.updatedAt)}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Badge
                  variant={grade.remarks === "PASSED" ? "success" : "warning"}
                >
                  {grade.remarks.replaceAll("_", " ")}
                </Badge>
                <span className="text-lg font-semibold">
                  {grade.finalGrade}
                </span>
              </div>
            </>
          )}
        />
      ) : null}
      {view === "materials" ? (
        <DataList
          empty="No published learning materials are available yet."
          items={materials}
          render={(material) => (
            <>
              <div>
                <p className="font-medium">{material.title}</p>
                <p className="text-sm text-muted-foreground">
                  {material.subject} · {material.fileName}
                </p>
              </div>
              <a
                className="text-sm font-medium text-emerald-700 hover:underline"
                href={material.fileUrl}
                target="_blank"
                rel="noreferrer"
              >
                Open file
              </a>
            </>
          )}
        />
      ) : null}
      {view === "assignments" ? (
        <DataList
          empty="No published assignments are available yet."
          items={assignments}
          render={(assignment) => (
            <>
              <div>
                <p className="font-medium">{assignment.title}</p>
                <p className="text-sm text-muted-foreground">
                  {assignment.subject} · Due {dateLabel(assignment.dueAt)}
                </p>
              </div>
              <Badge variant="info">{assignment.totalMarks} marks</Badge>
            </>
          )}
        />
      ) : null}
      {view === "examinations" ? (
        <DataList
          empty="No examinations are scheduled yet."
          items={examinations}
          render={(exam) => (
            <>
              <div>
                <p className="font-medium">{exam.title}</p>
                <p className="text-sm text-muted-foreground">
                  {exam.subject} · {dateLabel(exam.scheduledAt)} ·{" "}
                  {exam.durationMinutes} min
                </p>
              </div>
              <Badge variant="info">{exam.examType}</Badge>
            </>
          )}
        />
      ) : null}
      {view === "profile" ? (
        <div className="grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
          <Card className="py-0!">
            <CardContent className="grid gap-5 p-6 sm:grid-cols-2">
              <ProfileField label="Student ID" value={student.studentId} />
              <ProfileField label="Program" value={student.programCourse} />
              <ProfileField
                label="Program level"
                value={student.programLevel?.replaceAll("_", " ")}
              />
              <ProfileField label="Year level" value={student.yearLevel} />
              <ProfileField
                label="Academic year"
                value={student.academicYear}
              />
              <ProfileField label="Email" value={student.emailAddress} />
              <ProfileField label="Mobile number" value={student.mobilePhone} />
              <ProfileField
                label="Enrollment status"
                value={student.studentStatus.replaceAll("_", " ")}
              />
            </CardContent>
          </Card>
          <StudentPasswordCard />
        </div>
      ) : null}
    </section>
  );
}

function DataList<T>({
  empty,
  items,
  render,
}: {
  empty: string;
  items: T[];
  render: (item: T) => ReactNode;
}) {
  return (
    <Card className="py-0!">
      <CardContent className="divide-y p-0">
        {items.length ? (
          items.map((item, index) => (
            <div
              key={index}
              className="flex items-center justify-between gap-4 p-5"
            >
              {render(item)}
            </div>
          ))
        ) : (
          <p className="p-6 text-sm text-muted-foreground">{empty}</p>
        )}
      </CardContent>
    </Card>
  );
}
function ProfileField({
  label,
  value,
}: {
  label: string;
  value: string | null | undefined;
}) {
  return (
    <div>
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </p>
      <p className="mt-1 font-medium">{value || "Not provided"}</p>
    </div>
  );
}

function StudentPasswordCard() {
  const { toast } = useToast();
  const changePassword = useChangePasswordMutation();
  const [oldPassword, setOldPassword] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (password !== confirmPassword) {
      toast({
        title: "Passwords do not match",
        description: "Enter the same new password twice.",
        variant: "error",
      });
      return;
    }
    try {
      await changePassword.mutateAsync({
        oldPassword,
        password,
        confirmPassword,
      });
      setOldPassword("");
      setPassword("");
      setConfirmPassword("");
      toast({
        title: "Password changed",
        description: "Your Seminary portal password has been updated.",
        variant: "success",
      });
    } catch (error) {
      toast({
        title: "Password change failed",
        description: toApiError(error).message,
        variant: "error",
      });
    }
  };

  return (
    <Card className="py-0!">
      <CardContent className="p-6">
        <h2 className="font-semibold">Change password</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Use a new password that you can remember. Your student number stays
          the same.
        </p>
        <form className="mt-5 space-y-4" onSubmit={submit}>
          <label className="block text-sm font-medium">
            Current password
            <Input
              className="mt-2"
              type="password"
              autoComplete="current-password"
              value={oldPassword}
              onChange={(event) => setOldPassword(event.target.value)}
              required
            />
          </label>
          <label className="block text-sm font-medium">
            New password
            <Input
              className="mt-2"
              type="password"
              autoComplete="new-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </label>
          <label className="block text-sm font-medium">
            Confirm new password
            <Input
              className="mt-2"
              type="password"
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              required
            />
          </label>
          <Button
            className="w-full"
            type="submit"
            disabled={changePassword.isPending}
          >
            {changePassword.isPending ? "Saving…" : "Save new password"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
