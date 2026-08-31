"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export const courseProgramOptions = [
  "Certificate",
  "Bachelor",
  "Masteral",
  "Doctorate",
] as const;
export const courseModalityOptions = ["Online", "Face to Face", "Both"] as const;
export const courseStatusOptions = ["Active", "Inactive"] as const;

export type CourseProgram = (typeof courseProgramOptions)[number];
export type CourseModality = (typeof courseModalityOptions)[number];
export type CourseStatus = (typeof courseStatusOptions)[number];

export type CourseRecord = {
  id: string;
  order: number;
  courseName: string;
  courseCode: string;
  program: CourseProgram;
  units: number;
  modalities: CourseModality[];
  subjects: {
    date: string;
    subjectName: string;
    units: number;
    time?: string;
    startTime: string;
    endTime: string;
    professor: string;
    modality: CourseModality;
  }[];
  status: CourseStatus;
};

const modalityVariantMap: Record<
  CourseModality,
  React.ComponentProps<typeof Badge>["variant"]
> = {
  "Face to Face": "secondary",
  Online: "info",
  Both: "warning",
};

const statusVariantMap: Record<
  CourseStatus,
  React.ComponentProps<typeof Badge>["variant"]
> = {
  Active: "success",
  Inactive: "error",
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

export const columns: ColumnDef<CourseRecord>[] = [
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
    accessorKey: "courseName",
    header: ({ column }) => <SortableHeader column={column} label="Course Name" />,
    cell: ({ row }) => (
      <span className="font-medium text-foreground">{row.original.courseName}</span>
    ),
  },
  {
    accessorKey: "courseCode",
    header: ({ column }) => <SortableHeader column={column} label="Course Code" />,
    cell: ({ row }) => <span>{row.original.courseCode}</span>,
  },
  {
    accessorKey: "program",
    header: "Program",
    cell: ({ row }) => <span>{row.original.program}</span>,
  },
  {
    accessorKey: "subjects",
    header: "Subjects",
    cell: ({ row }) => (
      <div className="space-y-1">
        <div className="font-medium">
          {row.original.subjects.length}
        </div>
      </div>
    ),
  },
  {
    accessorKey: "units",
    header: ({ column }) => <SortableHeader column={column} label="Units" />,
    cell: ({ row }) => <span>{row.original.units}</span>,
  },
  {
    accessorKey: "modalities",
    header: "Modality",
    cell: ({ row }) => (
      <div className="flex flex-wrap gap-1">
        {row.original.modalities.map((modality) => (
          <Badge key={modality} variant={modalityVariantMap[modality]}>
            {modality}
          </Badge>
        ))}
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <Badge variant={statusVariantMap[row.original.status]}>
        {row.original.status}
      </Badge>
    ),
  },
];
