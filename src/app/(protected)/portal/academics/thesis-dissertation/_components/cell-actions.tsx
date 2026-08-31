"use client";

import {
  BookOpenText,
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

import type { ResearchRecord } from "./research-data";

type CellActionsProps = {
  data: ResearchRecord;
  onAdvanceStage: (record: ResearchRecord) => void;
  onView: (record: ResearchRecord) => void;
};

export const CellActions = ({
  data,
  onAdvanceStage,
  onView,
}: CellActionsProps) => (
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button variant="ghost" size="icon-sm" aria-label="Open research actions">
        <MoreHorizontal className="size-4" />
      </Button>
    </DropdownMenuTrigger>

    <DropdownMenuContent align="end" className="w-52">
      <DropdownMenuItem onClick={() => onView(data)}>
        <UserRoundSearch className="size-4" />
        View research work
      </DropdownMenuItem>
      <DropdownMenuItem onClick={() => onAdvanceStage(data)}>
        <BookOpenText className="size-4" />
        Advance stage
      </DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem>
        <SquareArrowOutUpRight className="size-4" />
        Open archive record
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
);
