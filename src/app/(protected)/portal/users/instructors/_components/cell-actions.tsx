"use client";

import {
  MoreHorizontal,
  Pencil,
  Send,
  SquareArrowOutUpRight,
  Trash2,
  UserCheck,
  UserRoundSearch,
} from "lucide-react";
import Link from "next/link";

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
  onDelete: (record: InstructorRecord) => void;
  onInvite: (record: InstructorRecord) => void;
  onToggleStatus: (record: InstructorRecord) => void;
  onView: (record: InstructorRecord) => void;
};

export const CellActions = ({
  data,
  onDelete,
  onInvite,
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
      {data.id ? (
        <DropdownMenuItem asChild>
          <Link href={`/admin/users/instructors/${data.id}`}>
            <Pencil className="size-4" />
            Edit instructor
          </Link>
        </DropdownMenuItem>
      ) : null}
      <DropdownMenuItem onClick={() => onToggleStatus(data)}>
        <UserCheck className="size-4" />
        {data.status === "Active" ? "Set inactive" : "Set active"}
      </DropdownMenuItem>
      <DropdownMenuItem
        disabled={Boolean(data.inviteAcceptedAt)}
        onClick={() => onInvite(data)}
      >
        <Send className="size-4" />
        {data.inviteAcceptedAt
          ? "Invite accepted"
          : data.inviteTokenSentAt
            ? "Resend invite"
            : "Invite instructor"}
      </DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem
        className="text-destructive focus:text-destructive"
        onClick={() => onDelete(data)}
      >
        <Trash2 className="size-4" />
        Delete instructor
      </DropdownMenuItem>
      <DropdownMenuItem>
        <SquareArrowOutUpRight className="size-4" />
        Open profile
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
);
