"use client";

import {
  MoreHorizontal,
  SquareArrowOutUpRight,
  UserCheck,
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

import type { StudentRecord } from "./student-data";

type CellActionsProps = {
  data: StudentRecord;
  onToggleStatus: (record: StudentRecord) => void;
  onView: (record: StudentRecord) => void;
};

export const CellActions = ({
  data,
  onToggleStatus,
  onView,
}: CellActionsProps) => (
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button variant="ghost" size="icon-sm" aria-label="Open student actions">
        <MoreHorizontal className="size-4" />
      </Button>
    </DropdownMenuTrigger>

    <DropdownMenuContent align="end" className="w-48">
      <DropdownMenuItem onClick={() => onView(data)}>
        <UserRoundSearch className="size-4" />
        View student
      </DropdownMenuItem>
      <DropdownMenuItem onClick={() => onToggleStatus(data)}>
        <UserCheck className="size-4" />
        {data.status === "Active" ? "Set inactive" : "Set active"}
      </DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem>
        <SquareArrowOutUpRight className="size-4" />
        Open profile
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
);
