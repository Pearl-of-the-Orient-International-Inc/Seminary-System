"use client";

import {
  BadgeCheck,
  ClipboardCheck,
  MoreHorizontal,
  SquareArrowOutUpRight,
  XCircle,
  UserRoundSearch,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import type { EnrollmentRecord } from "./enrollment-data";
import type { SeminaryApplicationStatus } from "@/features/seminary/seminary.types";

type CellActionsProps = {
  data: EnrollmentRecord;
  onChangeStatus: (
    record: EnrollmentRecord,
    status: Exclude<SeminaryApplicationStatus, "SUBMITTED" | "CANCELLED">,
  ) => void;
  onView: (record: EnrollmentRecord) => void;
};

export const CellActions = ({
  data,
  onChangeStatus,
  onView,
}: CellActionsProps) => (
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button variant="ghost" size="icon-sm" aria-label="Open enrollment actions">
        <MoreHorizontal className="size-4" />
      </Button>
    </DropdownMenuTrigger>

    <DropdownMenuContent align="end" className="w-52">
      <DropdownMenuItem onClick={() => onView(data)}>
        <UserRoundSearch className="size-4" />
        View enrollment
      </DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem onClick={() => onChangeStatus(data, "UNDER_REVIEW")}>
        <ClipboardCheck className="size-4" />
        Mark as under review
      </DropdownMenuItem>
      <DropdownMenuItem onClick={() => onChangeStatus(data, "APPROVED")}>
        <BadgeCheck className="size-4" />
        Mark as approved
      </DropdownMenuItem>
      <DropdownMenuItem
        className="text-destructive focus:text-destructive"
        onClick={() => onChangeStatus(data, "REJECTED")}
      >
        <XCircle className="size-4" />
        Mark as rejected
      </DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem onClick={() => onView(data)}>
        <SquareArrowOutUpRight className="size-4" />
        Open application
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
);
