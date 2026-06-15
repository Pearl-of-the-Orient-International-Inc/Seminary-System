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

import type { InstructorRecord } from "./instructor-data";

type CellActionsProps = {
  data: InstructorRecord;
  onToggleStatus: (record: InstructorRecord) => void;
  onView: (record: InstructorRecord) => void;
};

export const CellActions = ({
  data,
  onToggleStatus,
  onView,
}: CellActionsProps) => (
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button variant="ghost" size="icon-sm" aria-label="Open instructor actions">
        <MoreHorizontal className="size-4" />
      </Button>
    </DropdownMenuTrigger>

    <DropdownMenuContent align="end" className="w-48">
      <DropdownMenuItem onClick={() => onView(data)}>
        <UserRoundSearch className="size-4" />
        View instructor
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
