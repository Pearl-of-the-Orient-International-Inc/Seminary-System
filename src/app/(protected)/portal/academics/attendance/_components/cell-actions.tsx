"use client";

import { CheckCircle2, CircleMinus, Clock3, FileText, MoreHorizontal, RotateCcw } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import type { AttendanceRecord, AttendanceStatus } from "./columns";

type CellActionsProps = {
  data: AttendanceRecord;
  onChangeStatus: (record: AttendanceRecord, status: AttendanceStatus) => void;
  onReset: (record: AttendanceRecord) => void;
  onViewMonthlyRecord: (record: AttendanceRecord) => void;
  readOnly?: boolean;
};

export const CellActions = ({
  data,
  onChangeStatus,
  onReset,
  onViewMonthlyRecord,
  readOnly = false,
}: CellActionsProps) => (
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button variant="ghost" size="icon-sm">
        <MoreHorizontal className="size-4" />
        <span className="sr-only">Open actions</span>
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end" className="w-50">
      <DropdownMenuItem onClick={() => onViewMonthlyRecord(data)}>
        <FileText className="size-4" />
        View monthly record
      </DropdownMenuItem>
      {!readOnly && <DropdownMenuItem onClick={() => onChangeStatus(data, "Present")}>
        <CheckCircle2 className="size-4" />
        Mark present
      </DropdownMenuItem>}
      {!readOnly && <DropdownMenuItem onClick={() => onChangeStatus(data, "Absent")}>
        <CircleMinus className="size-4" />
        Mark absent
      </DropdownMenuItem>}
      {!readOnly && <DropdownMenuItem onClick={() => onChangeStatus(data, "Late")}>
        <Clock3 className="size-4" />
        Mark late
      </DropdownMenuItem>}
      {!readOnly && <DropdownMenuItem onClick={() => onReset(data)}>
        <RotateCcw className="size-4" />
        Reset row
      </DropdownMenuItem>}
    </DropdownMenuContent>
  </DropdownMenu>
);
