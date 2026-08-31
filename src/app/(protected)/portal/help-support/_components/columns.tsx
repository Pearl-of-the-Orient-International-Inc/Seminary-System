"use client";

import type { ColumnDef } from "@tanstack/react-table";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

import type {
  SupportPriority,
  SupportTicket,
  SupportTicketStatus,
} from "./support-data";

const getInitials = (name: string) =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

const statusVariantMap: Record<
  SupportTicketStatus,
  "warning" | "info" | "secondary" | "success"
> = {
  Open: "warning",
  "In Progress": "info",
  Escalated: "secondary",
  Resolved: "success",
};

const priorityVariantMap: Record<
  SupportPriority,
  "outline" | "secondary" | "warning" | "destructive"
> = {
  Low: "outline",
  Medium: "secondary",
  High: "warning",
  Urgent: "destructive",
};

export const columns: ColumnDef<SupportTicket>[] = [
  {
    accessorKey: "raisedBy",
    header: "Raised By",
    cell: ({ row }) => {
      const record = row.original;

      return (
        <div className="flex min-w-50 items-center gap-3">
          <Avatar className="ring-2 ring-emerald-950/8">
            <AvatarFallback className="bg-emerald-900/10 font-semibold text-emerald-900 dark:bg-emerald-100/10 dark:text-emerald-100">
              {getInitials(record.raisedBy)}
            </AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <div className="font-medium text-foreground">{record.raisedBy}</div>
            <div className="text-muted-foreground text-xs">
              {record.raisedByRole} • {record.program}
            </div>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "subject",
    header: "Issue Raised",
    cell: ({ row }) => (
      <div className="min-w-50 space-y-1">
        <div className="font-medium">{row.original.subject}</div>
        <div className="text-muted-foreground text-sm">
          {row.original.ticketNumber}
        </div>
      </div>
    ),
  },
  {
    accessorKey: "category",
    header: "Category",
    cell: ({ row }) => (
      <Badge variant="outline" className="rounded-full">
        {row.original.category}
      </Badge>
    ),
  },
  {
    accessorKey: "priority",
    header: "Priority",
    cell: ({ row }) => (
      <Badge
        variant={priorityVariantMap[row.original.priority]}
        className="rounded-full px-2.5 py-1"
      >
        {row.original.priority}
      </Badge>
    ),
  },
  {
    accessorKey: "assignedTo",
    header: "Assigned To",
    cell: ({ row }) => <div className="min-w-30">{row.original.assignedTo}</div>,
  },
  {
    accessorKey: "raisedOn",
    header: "Raised On",
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
