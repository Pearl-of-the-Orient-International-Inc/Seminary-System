"use client";

import {
  FileCheck2,
  MoreHorizontal,
  SquareArrowOutUpRight,
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

import type { GradeRecord } from "./grade-record-data";

type CellActionsProps = {
  data: GradeRecord;
  onToggleReview: (record: GradeRecord) => void;
  onView: (record: GradeRecord) => void;
};

export const CellActions = ({
  data,
  onToggleReview,
  onView,
}: CellActionsProps) => (
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button variant="ghost" size="icon-sm" aria-label="Open record actions">
        <MoreHorizontal className="size-4" />
      </Button>
    </DropdownMenuTrigger>

    <DropdownMenuContent align="end" className="w-52">
      <DropdownMenuItem onClick={() => onView(data)}>
        <UserRoundSearch className="size-4" />
        View record
      </DropdownMenuItem>
      <DropdownMenuItem onClick={() => onToggleReview(data)}>
        <FileCheck2 className="size-4" />
        {data.status === "Pending Review" ? "Mark complete" : "Send for review"}
      </DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem>
        <SquareArrowOutUpRight className="size-4" />
        Open student profile
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
);
