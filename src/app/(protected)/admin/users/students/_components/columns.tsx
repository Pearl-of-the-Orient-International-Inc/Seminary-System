"use client";

import type { ColumnDef } from "@tanstack/react-table";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

import type { StudentRecord, StudentStatus } from "./student-data";

const statusVariantMap: Record<
  StudentStatus,
  "success" | "warning" | "info" | "secondary"
> = {
  Active: "success",
  Graduating: "info",
  "Leave of Absence": "warning",
  Inactive: "secondary",
};

const getInitials = (name: string) =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

export const columns: ColumnDef<StudentRecord>[] = [
  {
    accessorKey: "name",
    header: "Student",
    cell: ({ row }) => {
      const record = row.original;

      return (
        <div className="flex min-w-55 items-center gap-3">
          <Avatar size="lg" className="ring-2 ring-emerald-950/8">
            <AvatarFallback className="bg-emerald-900/10 font-semibold text-emerald-900 dark:bg-emerald-100/10 dark:text-emerald-100">
              {getInitials(record.name)}
            </AvatarFallback>
          </Avatar>

          <div className="space-y-1">
            <div className="font-medium text-foreground">{record.name}</div>
            <div className="text-muted-foreground text-xs">{record.id}</div>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "program",
    header: "Program",
    cell: ({ row }) => {
      const record = row.original;

      return (
        <div className="space-y-1">
          <div className="min-w-60 font-medium">{record.program}</div>
          <Badge variant="outline" className="rounded-full">
            {record.programLevel}
          </Badge>
        </div>
      );
    },
  },
  {
    accessorKey: "academicYear",
    header: "Academic Year",
  },
  {
    accessorKey: "enrollmentType",
    header: "Enrollment",
    cell: ({ row }) => (
      <Badge variant="outline" className="rounded-full">
        {row.original.enrollmentType}
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
