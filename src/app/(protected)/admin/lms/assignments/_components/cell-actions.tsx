"use client";

import { useState } from "react";
import {
  CheckCircle2,
  Edit,
  Eye,
  MoreHorizontal,
  TimerReset,
  Trash2,
} from "lucide-react";

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
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import type { AssignmentRecord, AssignmentStatus } from "./columns";

type CellActionsProps = {
  data: AssignmentRecord;
  onDelete: (record: AssignmentRecord) => void;
  onEdit: (record: AssignmentRecord) => void;
  onPreview: (record: AssignmentRecord) => void;
  onChangeStatus: (record: AssignmentRecord, status: AssignmentStatus) => void;
};

export const CellActions = ({
  data,
  onDelete,
  onEdit,
  onPreview,
  onChangeStatus,
}: CellActionsProps) => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon-sm">
            <MoreHorizontal className="size-4" />
            <span className="sr-only">Open actions</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem onClick={() => onPreview(data)}>
            <Eye className="size-4" />
            Preview assignment
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onEdit(data)}>
            <Edit className="size-4" />
            Edit assignment
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onChangeStatus(data, "Published")}>
            <CheckCircle2 className="size-4" />
            Mark published
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onChangeStatus(data, "Scheduled")}>
            <TimerReset className="size-4" />
            Mark scheduled
          </DropdownMenuItem>
          <DropdownMenuItem
            variant="destructive"
            onClick={() => setDeleteDialogOpen(true)}
          >
            <Trash2 className="size-4" />
            Delete assignment
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete assignment?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently remove{" "}
              <span className="font-medium text-foreground">{data.title}</span>.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              onClick={() => onDelete(data)}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
