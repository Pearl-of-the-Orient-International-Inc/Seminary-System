"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export const examinationStatusOptions = [
  "Scheduled",
  "Ongoing",
  "Completed",
  "Draft",
] as const;
export const examinationSubjectOptions = [
  "Sacred Scripture",
  "Biblical Theology",
  "Liturgy",
  "Church History",
  "Pastoral Theology",
  "Catechetics",
] as const;
export const examinationClassOptions = [
  "Theology I",
  "Theology II",
  "Theology III",
  "Philosophy IV",
] as const;
export const examinationTypeOptions = [
  "Unit Test",
  "Quarterly",
  "Midterm",
  "Practical",
  "Comprehensive",
  "Annual",
] as const;

export type ExaminationStatus = (typeof examinationStatusOptions)[number];
export type ExaminationSubject = (typeof examinationSubjectOptions)[number];
export type ExaminationClass = (typeof examinationClassOptions)[number];
export type ExaminationType = (typeof examinationTypeOptions)[number];

export type ExaminationRecord = {
  id: string;
  order: number;
  examTitle: string;
  coverage: string;
  subject: ExaminationSubject;
  className: string;
  examType: ExaminationType;
  dateLabel: string;
  timeLabel: string;
  duration: string;
  status: ExaminationStatus;
};

const statusVariant: Record<
  ExaminationStatus,
  React.ComponentProps<typeof Badge>["variant"]
> = {
  Scheduled: "info",
  Ongoing: "warning",
  Completed: "success",
  Draft: "secondary",
};

const typeTone: Record<ExaminationType, string> = {
  "Unit Test": "bg-blue-100 text-blue-700",
  Quarterly: "bg-violet-100 text-violet-700",
  Midterm: "bg-amber-100 text-amber-700",
  Practical: "bg-cyan-100 text-cyan-700",
  Comprehensive: "bg-emerald-100 text-emerald-700",
  Annual: "bg-rose-100 text-rose-700",
};

const SortableHeader = ({
  column,
  label,
}: {
  column: {
    toggleSorting: (desc?: boolean) => void;
    getIsSorted: () => false | "asc" | "desc";
  };
  label: string;
}) => (
  <Button
    variant="ghost"
    className="-ml-3 h-8 px-3 text-left font-semibold text-foreground hover:bg-transparent"
    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
  >
    {label}
    <ArrowUpDown className="ml-2 size-4" />
  </Button>
);

export const columns: ColumnDef<ExaminationRecord>[] = [
  {
    accessorKey: "order",
    header: "#",
    cell: ({ row }) => (
      <span className="font-medium text-muted-foreground">
        {row.original.order}
      </span>
    ),
  },
  {
    accessorKey: "examTitle",
    header: ({ column }) => (
      <SortableHeader column={column} label="Exam Title" />
    ),
    cell: ({ row }) => (
      <div className="space-y-1 min-w-60">
        <p className="font-medium text-foreground">{row.original.examTitle}</p>
        <p className="text-sm text-muted-foreground">
          {row.original.coverage}
        </p>
      </div>
    ),
  },
  {
    accessorKey: "className",
    header: ({ column }) => <SortableHeader column={column} label="Class" />,
    cell: ({ row }) => (
      <div className="space-y-1 min-w-50">
        <p className="font-medium text-foreground">{row.original.className}</p>
        <p className="truncate text-sm text-muted-foreground">
          Subject: {row.original.subject}
        </p>
      </div>
    ),
  },
  {
    accessorKey: "examType",
    header: ({ column }) => (
      <SortableHeader column={column} label="Exam Type" />
    ),
    cell: ({ row }) => (
      <span
        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
          typeTone[row.original.examType]
        }`}
      >
        {row.original.examType}
      </span>
    ),
  },
  {
    accessorKey: "dateLabel",
    header: ({ column }) => (
      <SortableHeader column={column} label="Date & Time" />
    ),
    cell: ({ row }) => (
      <div className="min-w-32 space-y-1 text-sm text-slate-700">
        <p>{row.original.dateLabel}</p>
        <p className="text-xs text-slate-500">{row.original.timeLabel}</p>
      </div>
    ),
  },
  {
    accessorKey: "duration",
    header: ({ column }) => <SortableHeader column={column} label="Duration" />,
    cell: ({ row }) => <span>{row.original.duration}</span>,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <Badge variant={statusVariant[row.original.status]}>
        {row.original.status}
      </Badge>
    ),
  },
];
