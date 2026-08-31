"use client";

import type { ColumnDef } from "@tanstack/react-table";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

import type { ResearchRecord, ResearchStage } from "./research-data";

const getInitials = (name: string) =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

const stageVariantMap: Record<
  ResearchStage,
  "warning" | "info" | "secondary" | "success"
> = {
  "Proposal Review": "warning",
  Writing: "info",
  "For Defense": "secondary",
  Completed: "success",
};

export const columns: ColumnDef<ResearchRecord>[] = [
  {
    accessorKey: "researcherName",
    header: "Researcher",
    cell: ({ row }) => {
      const record = row.original;

      return (
        <div className="flex min-w-50 items-center gap-3">
          <Avatar size="lg" className="ring-2 ring-emerald-950/8">
            <AvatarFallback className="bg-emerald-900/10 font-semibold text-emerald-900 dark:bg-emerald-100/10 dark:text-emerald-100">
              {getInitials(record.researcherName)}
            </AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <div className="font-medium text-foreground">{record.researcherName}</div>
            <div className="text-muted-foreground text-xs">
              {record.researcherStudentId}
            </div>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "title",
    header: "Title",
    cell: ({ row }) => (
      <div className="min-w-50 space-y-1">
        <div className="font-medium leading-6">{row.original.title}</div>
        <div className="text-muted-foreground text-xs">{row.original.referenceNumber}</div>
      </div>
    ),
  },
  {
    accessorKey: "adviser",
    header: "Adviser",
    cell: ({ row }) => (
      <div className="min-w-40 space-y-1">
        <div className="font-medium leading-6">{row.original.adviser}</div>
      </div>
    ),
  },
  {
    accessorKey: "defenseDate",
    header: "Defense Date",
    cell: ({ row }) => <span>{row.original.defenseDate ?? "TBA"}</span>,
  },
  {
    accessorKey: "stage",
    header: "Stage",
    cell: ({ row }) => (
      <Badge variant={stageVariantMap[row.original.stage]} className="rounded-full px-2.5 py-1">
        {row.original.stage}
      </Badge>
    ),
  },
];
