"use client";

import { useState } from "react";
import { CheckCircle2, Clock3, MoreHorizontal, Edit, Trash2 } from "lucide-react";

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
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  academicYearSessionOptions,
  academicYearStatusOptions,
  type AcademicYearRecord,
  type AcademicYearSession,
  type AcademicYearStatus,
} from "./columns";

type CellActionsProps = {
  onChangeSession: (record: AcademicYearRecord, session: AcademicYearSession) => void;
  onChangeStatus: (record: AcademicYearRecord, status: AcademicYearStatus) => void;
  data: AcademicYearRecord;
  onDelete: (record: AcademicYearRecord) => void;
  onEdit: (record: AcademicYearRecord) => void;
};

export const CellActions = ({
  onChangeSession,
  onChangeStatus,
  data,
  onDelete,
  onEdit,
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
        <DropdownMenuContent align="end" className="w-52">
          <DropdownMenuItem onClick={() => onEdit(data)}>
            <Edit className="size-4" />
            Edit academic year
          </DropdownMenuItem>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <Clock3 className="size-4" />
              Change session
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              {academicYearSessionOptions.map((session) => (
                <DropdownMenuItem
                  key={session}
                  onClick={() => onChangeSession(data, session)}
                >
                  {session}
                </DropdownMenuItem>
              ))}
            </DropdownMenuSubContent>
          </DropdownMenuSub>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <CheckCircle2 className="size-4" />
              Change status
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              {academicYearStatusOptions.map((status) => (
                <DropdownMenuItem
                  key={status}
                  onClick={() => onChangeStatus(data, status)}
                >
                  {status}
                </DropdownMenuItem>
              ))}
            </DropdownMenuSubContent>
          </DropdownMenuSub>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            variant="destructive"
            onClick={() => setDeleteDialogOpen(true)}
          >
            <Trash2 className="size-4" />
            Delete academic year
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete academic year?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently remove{" "}
              <span className="font-medium text-foreground">{data.academicYear}</span>.
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
