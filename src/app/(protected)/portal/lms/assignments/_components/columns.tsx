"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export const assignmentStatusOptions = [
  "Published",
  "Draft",
  "Scheduled",
] as const;
export const assignmentTypeOptions = [
  "Reflection Paper",
  "Essay",
  "Practicum",
  "Research Output",
  "Lesson Plan",
  "Case Study",
] as const;

export type AssignmentStatus = (typeof assignmentStatusOptions)[number];
export type AssignmentSubject = string;
export type AssignmentType = (typeof assignmentTypeOptions)[number];

export type AssignmentRecord = {
  id: string;
  order: number;
  title: string;
  description: string;
  subject: AssignmentSubject;
  instructor: string;
  dueDate: string;
  dueTime: string;
  status: AssignmentStatus;
  submittedText: string;
  submissionRate: string;
  assignmentType?: AssignmentType;
  totalMarks?: string;
  additionalInstructions?: string;
  allowLateSubmission?: boolean;
  lateSubmissionDeadline?: string;
  notifyStudents?: boolean;
  attachmentLabel?: string;
};

const statusVariant: Record<
  AssignmentStatus,
  React.ComponentProps<typeof Badge>["variant"]
> = {
  Published: "success",
  Draft: "secondary",
  Scheduled: "info",
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

const toPlainText = (value: string) => {
  if (typeof window === "undefined") {
    return value.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
  }

  const document = new DOMParser().parseFromString(value, "text/html");
  return document.body.textContent?.replace(/\s+/g, " ").trim() ?? "";
};

export const columns: ColumnDef<AssignmentRecord>[] = [
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
    accessorKey: "title",
    header: ({ column }) => <SortableHeader column={column} label="Title" />,
    cell: ({ row }) => (
      <div className="space-y-1">
        <p className="font-medium">{row.original.title}</p>
        <p className="max-w-60 truncate text-sm text-muted-foreground">
          {toPlainText(row.original.description)}
        </p>
      </div>
    ),
  },
  {
    accessorKey: "subject",
    header: ({ column }) => <SortableHeader column={column} label="Subject" />,
    cell: ({ row }) => (
      <div className="min-w-44 space-y-1">
        <p>{row.original.subject}</p>
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          Instructor: {row.original.instructor}
        </div>
      </div>
    ),
  },
  {
    accessorKey: "dueDate",
    header: ({ column }) => <SortableHeader column={column} label="Due Date" />,
    cell: ({ row }) => (
      <div className="min-w-30 space-y-1 text-sm text-slate-700">
        <div className="flex items-center gap-2">
          <span>{row.original.dueDate}</span>
        </div>
        <p className="text-xs text-slate-500">{row.original.dueTime}</p>
      </div>
    ),
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
