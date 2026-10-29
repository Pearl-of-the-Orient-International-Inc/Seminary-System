"use client";

import type { ColumnDef } from "@tanstack/react-table";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

import type {
  InstructorProgram,
  InstructorRank,
  InstructorRecord,
  InstructorStatus,
} from "./instructor-data";

const getInitials = (name: string) =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

const statusVariantMap: Record<
  InstructorStatus,
  "success" | "warning" | "info" | "secondary"
> = {
  Active: "success",
  "Part-time": "info",
  "On Leave": "warning",
  Inactive: "secondary",
};

const programVariantMap: Record<
  InstructorProgram,
  "outline" | "secondary" | "info" | "warning"
> = {
  Certificate: "outline",
  Bachelor: "secondary",
  Masteral: "info",
  Doctorate: "warning",
};

const rankVariantMap: Record<
  InstructorRank,
  "outline" | "secondary" | "info"
> = {
  "Adjunct Instructor": "outline",
  Lecturer: "secondary",
  "Assistant Professor": "info",
  "Associate Professor": "info",
  Professor: "info",
};

export const columns: ColumnDef<InstructorRecord>[] = [
  {
    accessorKey: "name",
    header: "Instructor",
    cell: ({ row }) => {
      const record = row.original;

      return (
        <div className="flex min-w-50 items-center gap-3">
          <Avatar size="lg" className="ring-2 ring-emerald-950/8">
            {record.formalPhotoUrl ? (
              <AvatarImage
                src={record.formalPhotoUrl}
                alt={`${record.name} profile photo`}
                className="object-cover"
              />
            ) : null}
            <AvatarFallback className="bg-emerald-900/10 font-semibold text-emerald-900 dark:bg-emerald-100/10 dark:text-emerald-100">
              {getInitials(record.name)}
            </AvatarFallback>
          </Avatar>

          <div className="space-y-1">
            <div className="font-medium text-foreground">{record.name}</div>
            <div className="text-muted-foreground text-xs">{record.facultyId}</div>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "rank",
    header: "Rank",
    cell: ({ row }) => (
      <Badge variant={rankVariantMap[row.original.rank]} className="rounded-full">
        {row.original.rank}
      </Badge>
    ),
  },
  {
    accessorKey: "teachingPrograms",
    header: "Programs",
    cell: ({ row }) => (
      <div className="flex min-w-48 flex-wrap gap-1.5">
        {row.original.teachingPrograms.map((program) => (
          <Badge
            key={program}
            variant={programVariantMap[program]}
            className="rounded-full"
          >
            {program}
          </Badge>
        ))}
      </div>
    ),
  },
  {
    accessorKey: "loadUnits",
    header: "Teaching Load",
    cell: ({ row }) => (
      <div className="min-w-28">
        <div className="font-medium">{row.original.loadUnits} units</div>
      </div>
    ),
  },
  {
    accessorKey: "evaluation.totalScore",
    header: "Score",
    cell: ({ row }) => (
      <div className="min-w-32">
        <div className="font-medium">{row.original.evaluation.totalScore}%</div>
        <div className="text-xs text-muted-foreground">
          {row.original.evaluation.award}
        </div>
      </div>
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
