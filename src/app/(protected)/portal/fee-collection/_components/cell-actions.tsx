"use client";

import {
  BadgeCheck,
  CreditCard,
  MoreHorizontal,
  ReceiptText,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import type { FeeCollectionRecord } from "./fee-collection-data";

type CellActionsProps = {
  data: FeeCollectionRecord;
  onAdvanceStatus: (record: FeeCollectionRecord) => void;
  onCollectPayment: (record: FeeCollectionRecord) => void;
  onView: (record: FeeCollectionRecord) => void;
};

export const CellActions = ({
  data,
  onAdvanceStatus,
  onCollectPayment,
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
      <DropdownMenuItem onClick={() => onCollectPayment(data)}>
        <CreditCard className="size-4" />
        Update payment collection
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
);
