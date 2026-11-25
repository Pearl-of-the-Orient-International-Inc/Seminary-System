"use client";

import type { ColumnDef } from "@tanstack/react-table";

import { Badge } from "@/components/ui/badge";

import {
  documentTypeLabels,
  type SeminaryDocumentRecord,
} from "./certifications-records-data";

const dateFormatter = new Intl.DateTimeFormat("en-PH", {
  dateStyle: "medium",
});

const statusVariant = {
  DRAFT: "secondary",
  READY: "outline",
  RELEASED: "default",
} as const;

export const documentRecordColumns: ColumnDef<SeminaryDocumentRecord>[] = [
  {
    accessorKey: "studentName",
    header: "Student",
    cell: ({ row }) => (
      <div className="min-w-44 space-y-1">
        <p className="font-medium">{row.original.studentName}</p>
        <p className="text-xs text-muted-foreground">{row.original.program}</p>
      </div>
    ),
  },
  {
    accessorKey: "title",
    header: "Document",
    cell: ({ row }) => (
      <div className="min-w-52 space-y-1">
        <p className="font-medium">{row.original.title}</p>
        <Badge variant="outline" className="rounded-full">
          {documentTypeLabels[row.original.type]}
        </Badge>
      </div>
    ),
  },
  {
    accessorKey: "referenceNumber",
    header: "Reference No.",
    cell: ({ row }) => (
      <span className="whitespace-nowrap font-mono text-xs">
        {row.original.referenceNumber}
      </span>
    ),
  },
  {
    accessorKey: "issuedAt",
    header: "Issued",
    cell: ({ row }) => (
      <span className="whitespace-nowrap text-muted-foreground">
        {dateFormatter.format(new Date(row.original.issuedAt))}
      </span>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <Badge variant={statusVariant[row.original.status]} className="rounded-full">
        {row.original.status.replaceAll("_", " ")}
      </Badge>
    ),
  },
];
