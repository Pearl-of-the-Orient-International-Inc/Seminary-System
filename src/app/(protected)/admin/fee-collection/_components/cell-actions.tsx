"use client";

import {
  BadgeCheck,
  MoreHorizontal,
  ReceiptText,
  SquareArrowOutUpRight,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import type { FeeCollectionRecord } from "./fee-collection-data";

type CellActionsProps = {
  data: FeeCollectionRecord;
  onAdvanceStatus: (record: FeeCollectionRecord) => void;
  onView: (record: FeeCollectionRecord) => void;
};

export const CellActions = ({
  data,
  onAdvanceStatus,
  onView,
}: CellActionsProps) => (
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button variant="ghost" size="icon-sm" aria-label="Open fee actions">
        <MoreHorizontal className="size-4" />
      </Button>
    </DropdownMenuTrigger>

    <DropdownMenuContent align="end" className="w-65">
      <DropdownMenuItem onClick={() => onView(data)}>
        <ReceiptText className="size-4" />
        View account and charges
      </DropdownMenuItem>
      <DropdownMenuItem onClick={() => onAdvanceStatus(data)}>
        <BadgeCheck className="size-4" />
        Advance payment status
      </DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem>
        <SquareArrowOutUpRight className="size-4" />
        Open payment ledger
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
);
