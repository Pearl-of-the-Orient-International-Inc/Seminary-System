"use client";

import {
  BadgeCheck,
  LifeBuoy,
  MoreHorizontal,
  ShieldAlert,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import type { SupportTicket } from "./support-data";

type CellActionsProps = {
  data: SupportTicket;
  onAdvanceStatus: (record: SupportTicket) => void;
  onView: (record: SupportTicket) => void;
};

export const CellActions = ({
  data,
  onAdvanceStatus,
  onView,
}: CellActionsProps) => (
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button variant="ghost" size="icon-sm" aria-label="Open support actions">
        <MoreHorizontal className="size-4" />
      </Button>
    </DropdownMenuTrigger>

    <DropdownMenuContent align="end" className="w-52">
      <DropdownMenuItem onClick={() => onView(data)}>
        <LifeBuoy className="size-4" />
        View ticket
      </DropdownMenuItem>
      <DropdownMenuItem onClick={() => onAdvanceStatus(data)}>
        <BadgeCheck className="size-4" />
        Advance status
      </DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem>
        <ShieldAlert className="size-4" />
        Escalate to admin
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
);
