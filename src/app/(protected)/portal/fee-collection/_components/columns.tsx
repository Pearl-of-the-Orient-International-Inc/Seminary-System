"use client";

import type { ColumnDef } from "@tanstack/react-table";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

import type {
  CollectionProgram,
  CollectionStatus,
  FeeCollectionRecord,
} from "./fee-collection-data";

const currency = new Intl.NumberFormat("en-PH", {
  style: "currency",
  currency: "PHP",
  minimumFractionDigits: 2,
});

const getInitials = (name: string) =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

const statusVariantMap: Record<
  CollectionStatus,
  "warning" | "info" | "success" | "error"
> = {
  Pending: "warning",
  "Partially Paid": "info",
  Paid: "success",
  Overdue: "error",
};

const programVariantMap: Record<
  CollectionProgram,
  "outline" | "secondary" | "info" | "warning"
> = {
  Certificate: "outline",
  Bachelor: "secondary",
  Masteral: "info",
  Doctorate: "warning",
};

export const columns: ColumnDef<FeeCollectionRecord>[] = [
  {
    accessorKey: "studentName",
    header: "Student",
    cell: ({ row }) => {
      const record = row.original;

      return (
        <div className="flex min-w-50 items-center gap-3">
          <Avatar size="lg" className="ring-2 ring-emerald-950/8">
            <AvatarFallback className="bg-emerald-900/10 font-semibold text-emerald-900 dark:bg-emerald-100/10 dark:text-emerald-100">
              {getInitials(record.studentName)}
            </AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <div className="font-medium text-foreground">{record.studentName}</div>
            <div className="text-muted-foreground text-xs">{record.studentId}</div>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "program",
    header: "Program",
    cell: ({ row }) => (
      <div className="min-w-50 space-y-1">
        <div className="font-medium">{row.original.program}</div>
        <Badge variant={programVariantMap[row.original.programLevel]} className="rounded-full">
          {row.original.programLevel}
        </Badge>
      </div>
    ),
  },
  {
    accessorKey: "amountPaid",
    header: "Paid",
    cell: ({ row }) => <span className="font-medium text-emerald-700 dark:text-emerald-300">{currency.format(row.original.amountPaid)}</span>,
  },
  {
    accessorKey: "balance",
    header: "Balance",
    cell: ({ row }) => <span className="font-medium text-amber-700 dark:text-amber-300">{currency.format(row.original.balance)}</span>,
  },
  {
    accessorKey: "paymentMethod",
    header: "Method",
    cell: ({ row }) => (
      <Badge variant="outline" className="rounded-full">
        {row.original.paymentMethod}
      </Badge>
    ),
  },
  {
    accessorKey: "dueDate",
    header: "Due Date",
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

export { currency };
