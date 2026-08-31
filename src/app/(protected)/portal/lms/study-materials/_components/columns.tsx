"use client";

import type { ColumnDef } from "@tanstack/react-table";
import {
  ArrowUpDown,
  FileArchive,
  FileSpreadsheet,
  FileText,
  Presentation,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export const studyMaterialStatusOptions = ["Published", "Draft"] as const;
export const studyMaterialClassOptions = [
  "Theology I",
  "Theology II",
  "Theology III",
  "Philosophy IV",
] as const;
export const studyMaterialTopicOptions = [
  "Pentateuch",
  "Christology",
  "Sacramental Theology",
  "Patristics",
  "Pastoral Care",
  "Youth Catechesis",
] as const;
export const studyMaterialTypeOptions = [
  "Notes",
  "Presentation",
  "Document",
  "Chart",
  "Archive",
] as const;

export type StudyMaterialStatus = (typeof studyMaterialStatusOptions)[number];
export type StudyMaterialSubject = string;
export type StudyMaterialClass = (typeof studyMaterialClassOptions)[number];
export type StudyMaterialTopic = (typeof studyMaterialTopicOptions)[number];
export type StudyMaterialType = (typeof studyMaterialTypeOptions)[number];

export type StudyMaterialRecord = {
  id: string;
  order: number;
  title: string;
  subtitle: string;
  subject: StudyMaterialSubject;
  className: string;
  topic: string;
  type: StudyMaterialType;
  uploadedBy: string;
  uploadedRole: string;
  uploadedOnDate: string;
  uploadedOnTime: string;
  downloads: number;
  status: StudyMaterialStatus;
  fileUrl?: string;
  fileName?: string;
};

const typeTone: Record<StudyMaterialType, string> = {
  Notes: "bg-blue-100 text-blue-700",
  Presentation: "bg-amber-100 text-amber-700",
  Document: "bg-emerald-100 text-emerald-700",
  Chart: "bg-cyan-100 text-cyan-700",
  Archive: "bg-violet-100 text-violet-700",
};

const statusVariant: Record<
  StudyMaterialStatus,
  React.ComponentProps<typeof Badge>["variant"]
> = {
  Published: "success",
  Draft: "secondary",
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

const materialTypeIcon = (type: StudyMaterialType) => {
  switch (type) {
    case "Presentation":
      return <Presentation className="size-4" />;
    case "Document":
      return <FileSpreadsheet className="size-4" />;
    case "Chart":
      return <FileText className="size-4" />;
    case "Archive":
      return <FileArchive className="size-4" />;
    default:
      return <FileText className="size-4" />;
  }
};

export const columns: ColumnDef<StudyMaterialRecord>[] = [
  {
    accessorKey: "title",
    header: ({ column }) => <SortableHeader column={column} label="Title" />,
    cell: ({ row }) => (
      <div className="max-w-72 space-y-1">
        <div className="flex items-start gap-3">
          <div className="mt-0.5 shrink-0 rounded-lg bg-red-100 p-2 text-red-600">
            {materialTypeIcon(row.original.type)}
          </div>
          <div className="min-w-0">
            <p className="truncate font-medium text-foreground">
              {row.original.title}
            </p>
            <p className="truncate text-sm text-muted-foreground">
              Subject: {row.original.subject}
            </p>
          </div>
        </div>
      </div>
    ),
  },
  {
    accessorKey: "className",
    header: ({ column }) => <SortableHeader column={column} label="Class" />,
    cell: ({ row }) => <div className="max-w-52">
      <p className="truncate">{row.original.className}</p>
      <p className="truncate text-xs text-muted-foreground">
          Topic: {row.original.topic}
        </p>
    </div>,
  },
  {
    accessorKey: "type",
    header: ({ column }) => <SortableHeader column={column} label="Type" />,
    cell: ({ row }) => (
      <span
        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${typeTone[row.original.type]}`}
      >
        {row.original.type}
      </span>
    ),
  },
  {
    accessorKey: "uploadedBy",
    header: ({ column }) => (
      <SortableHeader column={column} label="Uploaded By" />
    ),
    cell: ({ row }) => (
      <div className="max-w-44 items-center gap-3">
        <p className="truncate text-sm font-medium text-foreground">
          {row.original.uploadedBy}
        </p>
        <p className="truncate text-xs text-muted-foreground">
          {row.original.uploadedRole}
        </p>
      </div>
    ),
  },
  {
    accessorKey: "uploadedOnDate",
    header: ({ column }) => (
      <SortableHeader column={column} label="Uploaded On" />
    ),
    cell: ({ row }) => (
      <div className="w-28 space-y-1 text-sm text-slate-700">
        <p>{row.original.uploadedOnDate}</p>
        <p className="text-xs text-slate-500">{row.original.uploadedOnTime}</p>
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
