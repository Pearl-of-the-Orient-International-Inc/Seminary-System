"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, Circle } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const attendanceStatusOptions = [
  "Present",
  "Absent",
  "Late",
] as const;

export type AttendanceStatus = (typeof attendanceStatusOptions)[number];

export type AttendanceRecord = {
  id: string;
  order: number;
  rollNo: string;
  studentName: string;
  status: AttendanceStatus;
  remarks: string;
};

const statusMeta: Record<
  AttendanceStatus,
  { dotClassName: string; labelClassName: string }
> = {
  Present: {
    dotClassName: "fill-green-500 text-green-500",
    labelClassName: "text-green-700 dark:text-green-400",
  },
  Absent: {
    dotClassName: "fill-red-500 text-red-500",
    labelClassName: "text-red-700 dark:text-red-400",
  },
  Late: {
    dotClassName: "fill-amber-500 text-amber-500",
    labelClassName: "text-amber-700 dark:text-amber-400",
  },
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

type GetColumnsOptions = {
  onChangeStatus: (record: AttendanceRecord, status: AttendanceStatus) => void;
  onChangeRemarks: (record: AttendanceRecord, remarks: string) => void;
};

const getInitials = (value: string) =>
  value
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

export const getColumns = ({
  onChangeStatus,
  onChangeRemarks,
}: GetColumnsOptions): ColumnDef<AttendanceRecord>[] => [
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
    accessorKey: "studentName",
    header: ({ column }) => <SortableHeader column={column} label="Student Name" />,
    cell: ({ row }) => (
      <div className="flex items-center gap-3">
        <Avatar size="lg">
          <AvatarFallback>{getInitials(row.original.studentName)}</AvatarFallback>
        </Avatar>
        <div>
          <p className="font-medium text-foreground">{row.original.studentName}</p>
          <p className="font-medium text-xs text-foreground">POTSC-2026-0001</p>
        </div>
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const meta = statusMeta[row.original.status];

      return (
        <Select
          value={row.original.status}
          onValueChange={(value) =>
            onChangeStatus(row.original, value as AttendanceStatus)
          }
        >
          <SelectTrigger className="min-w-32">
            <div className="flex items-center gap-2">
              <SelectValue
                placeholder="Select status"
                className={meta.labelClassName}
              />
            </div>
          </SelectTrigger>
          <SelectContent>
            {attendanceStatusOptions.map((status) => (
              <SelectItem key={status} value={status}>
                <div className="flex items-center gap-2">
                  <Circle
                    className={`size-2 fill-current ${statusMeta[status].dotClassName}`}
                  />
                  {status}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );
    },
  },
  {
    accessorKey: "remarks",
    header: "Remarks",
    cell: ({ row }) => (
      <Input
        value={row.original.remarks}
        onChange={(event) =>
          onChangeRemarks(row.original, event.target.value)
        }
        placeholder="Enter remarks (optional)"
        className="min-w-56"
      />
    ),
  },
];
