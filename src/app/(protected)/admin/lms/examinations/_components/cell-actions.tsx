"use client";

import { useState } from "react";
import {
  CheckCircle2,
  Edit,
  Eye,
  MoreHorizontal,
  PlayCircle,
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

import type { ExaminationRecord, ExaminationStatus } from "./columns";

type CellActionsProps = {
  data: ExaminationRecord;
  onDelete: (record: ExaminationRecord) => void;
  onEdit: (record: ExaminationRecord) => void;
  onPreview: (record: ExaminationRecord) => void;
  onChangeStatus: (
    record: ExaminationRecord,
    status: ExaminationStatus,
  ) => void;
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
            Preview examination
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onEdit(data)}>
            <Edit className="size-4" />
            Edit examination
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onChangeStatus(data, "Ongoing")}>
            <PlayCircle className="size-4" />
            Mark ongoing
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onChangeStatus(data, "Completed")}>
            <CheckCircle2 className="size-4" />
            Mark completed
          </DropdownMenuItem>
          <DropdownMenuItem
            variant="destructive"
            onClick={() => setDeleteDialogOpen(true)}
          >
            <Trash2 className="size-4" />
            Delete examination
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete examination?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently remove{" "}
              <span className="font-medium text-foreground">{data.examTitle}</span>.
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
