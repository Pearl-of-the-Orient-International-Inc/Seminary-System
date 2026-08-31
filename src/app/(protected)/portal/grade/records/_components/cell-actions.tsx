"use client";

import { useState } from "react";
import {
  Edit,
  FileCheck2,
  MoreHorizontal,
  SquareArrowOutUpRight,
  Trash2,
  UserRoundSearch,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
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
  onDelete: (record: GradeRecord) => void;
  onEdit: (record: GradeRecord) => void;
  onOpenStudent: (record: GradeRecord) => void;
  onToggleReview: (record: GradeRecord) => void;
  onView: (record: GradeRecord) => void;
};

export const CellActions = ({
  data,
  onDelete,
  onEdit,
  onOpenStudent,
  onToggleReview,
  onView,
}: CellActionsProps) => {
  const [deleteOpen, setDeleteOpen] = useState(false);

  return (
    <>
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
          <DropdownMenuItem onClick={() => onEdit(data)}>
            <Edit className="size-4" />
            Edit grade
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onToggleReview(data)}>
            <FileCheck2 className="size-4" />
            {data.status === "Pending Review" ? "Mark complete" : "Send for review"}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => onOpenStudent(data)}>
            <SquareArrowOutUpRight className="size-4" />
            Open student profile
          </DropdownMenuItem>
          <DropdownMenuItem
            variant="destructive"
            onClick={() => setDeleteOpen(true)}
          >
            <Trash2 className="size-4" />
            Delete grade
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete grade record?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently remove{" "}
              <span className="font-medium text-foreground">{data.recordId}</span>.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              onClick={() => {
                onDelete(data);
                setDeleteOpen(false);
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
