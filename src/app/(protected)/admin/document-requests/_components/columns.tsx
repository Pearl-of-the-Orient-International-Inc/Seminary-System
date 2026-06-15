"use client";

import type { ColumnDef } from "@tanstack/react-table";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

import type {
  DocumentRequestRecord,
  DocumentRequestStatus,
  RequestProgram,
} from "./document-request-data";

const getInitials = (name: string) =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

const statusVariantMap: Record<
  DocumentRequestStatus,
  "warning" | "info" | "secondary" | "success"
> = {
  Pending: "warning",
  Processing: "info",
  "Ready for Release": "secondary",
  Released: "success",
};

const programVariantMap: Record<
  RequestProgram,
  "outline" | "secondary" | "info" | "warning"
> = {
  Certificate: "outline",
  Bachelor: "secondary",
  Masteral: "info",
  Doctorate: "warning",
};

export const columns: ColumnDef<DocumentRequestRecord>[] = [
  {
    accessorKey: "requesterName",
    header: "Requester",
    cell: ({ row }) => {
      const record = row.original;

      return (
        <div className="flex min-w-50 items-center gap-3">
          <Avatar size="lg" className="ring-2 ring-emerald-950/8">
            <AvatarFallback className="bg-emerald-900/10 font-semibold text-emerald-900 dark:bg-emerald-100/10 dark:text-emerald-100">
              {getInitials(record.requesterName)}
            </AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <div className="font-medium text-foreground">{record.requesterName}</div>
            <div className="text-muted-foreground text-xs">
              {record.requesterStudentId}
            </div>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "requestedDocument",
    header: "Requested Document",
    cell: ({ row }) => {
      const record = row.original;
      return (
        <div className="min-w-50 space-y-1">
          <div className="font-medium">{record.requestedDocument}</div>
          <div className="text-muted-foreground text-sm">{record.referenceNumber}</div>
        </div>
      );
    },
  },
  {
    accessorKey: "studentProgram",
    header: "Program",
    cell: ({ row }) => (
      <div className="min-w-56 space-y-1">
        <div className="font-medium">{row.original.studentProgram}</div>
        <Badge
          variant={programVariantMap[row.original.studentProgramLevel]}
          className="rounded-full"
        >
          {row.original.studentProgramLevel}
        </Badge>
      </div>
    ),
  },
  {
    accessorKey: "deliveryMethod",
    header: "Delivery",
    cell: ({ row }) => (
      <Badge variant="outline" className="rounded-full">
        {row.original.deliveryMethod}
      </Badge>
    ),
  },
  {
    accessorKey: "requestedOn",
    header: "Requested On",
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
