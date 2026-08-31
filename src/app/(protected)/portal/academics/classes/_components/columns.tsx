"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export const classAcademicYearOptions = [
  "2024-2025",
  "2025-2026",
  "2026-2027",
] as const;

export const classStatusOptions = ["Active", "Inactive"] as const;

export type ClassAcademicYear = (typeof classAcademicYearOptions)[number];
export type ClassStatus = (typeof classStatusOptions)[number];

export type ClassRecord = {
  id: string;
  order: number;
  className: string;
  classCode: string;
  academicYear: ClassAcademicYear;
  totalSections: number;
  status: ClassStatus;
};

const statusVariantMap: Record<
  ClassStatus,
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

export const columns: ColumnDef<ClassRecord>[] = [
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
    accessorKey: "className",
    header: ({ column }) => <SortableHeader column={column} label="Class Name" />,
    cell: ({ row }) => (
      <span className="font-medium text-foreground">{row.original.className}</span>
    ),
  },
  {
    accessorKey: "classCode",
    header: ({ column }) => <SortableHeader column={column} label="Class Code" />,
    cell: ({ row }) => <span>{row.original.classCode}</span>,
  },
  {
    accessorKey: "academicYear",
    header: ({ column }) => <SortableHeader column={column} label="Academic Year" />,
    cell: ({ row }) => <span>{row.original.academicYear}</span>,
  },
  {
    accessorKey: "totalSections",
    header: ({ column }) => <SortableHeader column={column} label="Total Sections" />,
    cell: ({ row }) => (
      <Badge variant="info" className="min-w-8 justify-center">
        {row.original.totalSections}
      </Badge>
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
