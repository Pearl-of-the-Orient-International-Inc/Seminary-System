"use client";

import {
  BadgeCheck,
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

import type { DocumentRequestRecord } from "./document-request-data";

type CellActionsProps = {
  data: DocumentRequestRecord;
  onAdvanceStatus: (record: DocumentRequestRecord) => void;
  onView: (record: DocumentRequestRecord) => void;
};

export const CellActions = ({
  data,
  onAdvanceStatus,
  onView,
}: CellActionsProps) => (
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button variant="ghost" size="icon-sm" aria-label="Open request actions">
        <MoreHorizontal className="size-4" />
      </Button>
    </DropdownMenuTrigger>

    <DropdownMenuContent align="end" className="w-52">
      <DropdownMenuItem onClick={() => onView(data)}>
        <UserRoundSearch className="size-4" />
        View request
      </DropdownMenuItem>
      <DropdownMenuItem onClick={() => onAdvanceStatus(data)}>
        <BadgeCheck className="size-4" />
        Advance status
      </DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem>
        <SquareArrowOutUpRight className="size-4" />
        Open student profile
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
);
