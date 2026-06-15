"use client";

import { BookOpen, Monitor, Pencil, Trash2, UserRound } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import type { TimetableEntry } from "./data";

type TimetableDetailDialogProps = {
  entry: TimetableEntry | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  timeLabel?: string;
  className?: string;
  section?: string;
  onEdit: () => void;
  onDelete: () => void;
};

export const TimetableDetailDialog = ({
  entry,
  open,
  onOpenChange,
  timeLabel,
  className,
  section,
  onEdit,
  onDelete,
}: TimetableDetailDialogProps) => {
  if (!entry || !entry.subject) {
    return null;
  }

  const { subject } = entry;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{subject.title}</DialogTitle>
          <DialogDescription>
            {entry.day}
            {timeLabel ? ` • ${timeLabel}` : ""}
            {className ? ` • ${className}` : ""}
            {section ? ` • Section ${section}` : ""}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 rounded-lg border border-border/70 bg-muted/20 p-4">
          <div className="flex items-center gap-2 text-sm">
            <BookOpen className="size-4 text-primary" />
            <span className="font-medium text-foreground">{subject.code}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <UserRound className="size-4 text-primary" />
            <span>{subject.lecturer}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Monitor className="size-4 text-primary" />
            <span>{subject.modality}</span>
          </div>
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={onEdit}>
            <Pencil className="size-4" />
            Edit Slot
          </Button>
          <Button type="button" variant="destructive" onClick={onDelete}>
            <Trash2 className="size-4" />
            Delete Slot
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
