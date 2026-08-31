"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export const academicYearSessionOptions = [
  "Current",
  "Previous",
  "Upcoming",
 ] as const;

export const academicYearStatusOptions = [
  "Active",
  "Upcoming",
  "Completed",
] as const;

export type AcademicYearSession = (typeof academicYearSessionOptions)[number];
export type AcademicYearStatus = (typeof academicYearStatusOptions)[number];

export type AcademicYearRecord = {
  id: string;
  order: number;
  academicYear: string;
  session: AcademicYearSession;
  status: AcademicYearStatus;
  startDate: string;
  endDate: string;
};

const sessionStyles: Record<AcademicYearSession, string> = {
  Current: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
  Previous: "bg-blue-500/10 text-blue-700 dark:text-blue-300",
  Upcoming: "bg-amber-500/10 text-amber-700 dark:text-amber-300",
};

const statusVariantMap: Record<
  AcademicYearStatus,
  React.ComponentProps<typeof Badge>["variant"]
> = {
  Active: "success",
  Upcoming: "info",
  Completed: "secondary",
};

const SortableHeader = ({
  column,
  label,
}: {
  column: { toggleSorting: (desc?: boolean) => void; getIsSorted: () => false | "asc" | "desc" };
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

export const columns: ColumnDef<AcademicYearRecord>[] = [
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
    accessorKey: "academicYear",
    header: ({ column }) => <SortableHeader column={column} label="Academic Year" />,
    cell: ({ row }) => (
      <span className="font-medium text-foreground">{row.original.academicYear}</span>
    ),
  },
  {
    accessorKey: "session",
    header: "Session",
    cell: ({ row }) => (
      <Badge
        variant="outline"
        className={`border-0 font-medium ${sessionStyles[row.original.session]}`}
      >
        {row.original.session}
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
  {
    accessorKey: "startDate",
    header: ({ column }) => <SortableHeader column={column} label="Start Date" />,
    cell: ({ row }) => <span>{row.original.startDate}</span>,
  },
  {
    accessorKey: "endDate",
    header: ({ column }) => <SortableHeader column={column} label="End Date" />,
    cell: ({ row }) => <span>{row.original.endDate}</span>,
  },
];
