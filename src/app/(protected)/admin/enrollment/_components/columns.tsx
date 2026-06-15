"use client";

import type { ColumnDef } from "@tanstack/react-table";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

import type { EnrollmentProgram, EnrollmentRecord, EnrollmentStatus } from "./enrollment-data";

const getInitials = (name: string) =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

const statusVariantMap: Record<
  EnrollmentStatus,
  "warning" | "info" | "secondary" | "success" | "destructive" | "outline"
> = {
  Pending: "warning",
  "For Payment Review": "info",
  Approved: "secondary",
  Enrolled: "success",
  Rejected: "destructive",
  Cancelled: "outline",
};

const programVariantMap: Record<
  EnrollmentProgram,
  "outline" | "secondary" | "info" | "warning"
> = {
  Certificate: "outline",
  Bachelor: "secondary",
  Masteral: "info",
  Doctorate: "warning",
};

const paymentVariantMap: Record<
  EnrollmentRecord["paymentStatus"],
  "success" | "warning" | "info"
> = {
  Paid: "success",
  Pending: "warning",
  "For Verification": "info",
  "Awaiting Proof": "warning",
};

export const columns: ColumnDef<EnrollmentRecord>[] = [
  {
    accessorKey: "studentName",
    header: "Applicant",
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
      <div className="min-w-50 space-y-1">
        <div className="font-medium">{row.original.program}</div>
        <Badge variant={programVariantMap[row.original.programLevel]} className="rounded-full">
          {row.original.programLevel}
        </Badge>
      </div>
    ),
  },
  {
    accessorKey: "enrollmentType",
    header: "Type",
    cell: ({ row }) => (
      <Badge variant="outline" className="rounded-full">
        {row.original.enrollmentType}
      </Badge>
    ),
  },
  {
    accessorKey: "applicationDate",
    header: "Application Date",
  },
  {
    accessorKey: "paymentStatus",
    header: "Payment",
    cell: ({ row }) => (
      <Badge variant={paymentVariantMap[row.original.paymentStatus]} className="rounded-full">
        {row.original.paymentStatus}
      </Badge>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <Badge
        variant={statusVariantMap[row.original.status]}
        className="rounded-full px-2.5 py-1"
      >
        {row.original.status}
      </Badge>
    ),
  },
];
