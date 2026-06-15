"use client";

import type { ColumnDef } from "@tanstack/react-table";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

import type { GradeProgram, GradeRecord } from "./grade-record-data";

const getInitials = (name: string) =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

const programVariantMap: Record<
  GradeProgram,
  "outline" | "secondary" | "info" | "warning"
> = {
  Certificate: "outline",
  Bachelor: "secondary",
  Masteral: "info",
  Doctorate: "warning",
};

const remarksVariantMap: Record<
  GradeRecord["remarks"],
  "success" | "warning" | "error" | "info"
> = {
  Passed: "success",
  Conditional: "warning",
  Failed: "error",
  Ongoing: "info",
};

export const columns: ColumnDef<GradeRecord>[] = [
  {
    accessorKey: "studentName",
    header: "Student",
    cell: ({ row }) => {
      const record = row.original;

      return (
        <div className="flex min-w-50 items-center gap-3">
          <Avatar size="lg" className="ring-2 ring-emerald-950/8">
            <AvatarFallback className="bg-emerald-900/10 font-semibold text-emerald-900 dark:bg-emerald-100/10 dark:text-emerald-100">
              {getInitials(record.studentName)}
            </AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <div className="font-medium text-foreground">{record.studentName}</div>
            <div className="text-muted-foreground text-xs">{record.studentId}</div>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "program",
    header: "Program",
    cell: ({ row }) => (
      <Badge variant={programVariantMap[row.original.program]} className="rounded-full">
        {row.original.program}
      </Badge>
    ),
  },
  {
    accessorKey: "courseTitle",
    header: "Course",
    cell: ({ row }) => {
      const record = row.original;

      return (
        <div className="min-w-50 space-y-1">
          <div className="font-medium">{record.courseTitle}</div>
          <div className="text-muted-foreground text-sm">{record.courseCode}</div>
        </div>
      );
    },
  },
  {
    accessorKey: "instructor",
    header: "Instructor",
    cell: ({ row }) => (
      <div className="min-w-48 text-sm font-medium">{row.original.instructor}</div>
    ),
  },
  {
    accessorKey: "finalGrade",
    header: "Final Grade",
    cell: ({ row }) => (
      <div className="min-w-24 font-semibold text-foreground">
        {row.original.finalGrade}
      </div>
    ),
  },
  {
    accessorKey: "remarks",
    header: "Remarks",
    cell: ({ row }) => (
      <Badge variant={remarksVariantMap[row.original.remarks]} className="rounded-full">
        {row.original.remarks}
      </Badge>
    ),
  },
];
