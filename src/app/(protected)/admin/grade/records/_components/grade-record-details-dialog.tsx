"use client";

import { BookOpenText, GraduationCap, ReceiptText, UserRound } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import type { GradeRecord } from "./grade-record-data";

type GradeRecordDetailsDialogProps = {
  onOpenChange: (open: boolean) => void;
  open: boolean;
  record: GradeRecord | null;
};

const infoCardClassName =
  "rounded-2xl border border-emerald-950/10 bg-emerald-950/[0.03] p-4 dark:border-emerald-100/10 dark:bg-emerald-100/[0.04]";

export const GradeRecordDetailsDialog = ({
  onOpenChange,
  open,
  record,
}: GradeRecordDetailsDialogProps) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent className="max-w-3xl border-emerald-950/10 p-0 dark:border-emerald-100/10">
      {record ? (
        <>
          <DialogHeader className="border-b border-emerald-950/10 bg-gradient-to-br from-emerald-950 to-emerald-900 px-6 py-6 text-left dark:border-emerald-100/10">
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <Badge className="rounded-full bg-white/12 text-white hover:bg-white/12">
                Grade Record
              </Badge>
              <Badge className="rounded-full bg-white/12 text-white hover:bg-white/12">
                {record.status}
              </Badge>
            </div>
            <DialogTitle className="font-serif text-3xl text-white">
              {record.studentName}
            </DialogTitle>
            <DialogDescription className="text-sm text-emerald-50/85">
              {record.recordId} • {record.courseCode}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 px-6 py-6 md:grid-cols-2">
            <div className={infoCardClassName}>
              <div className="mb-3 flex items-center gap-2 font-medium text-emerald-950 dark:text-emerald-50">
                <UserRound className="size-4" />
                Student Information
              </div>
              <div className="space-y-3 text-sm">
                <div>
                  <div className="text-muted-foreground">Student ID</div>
                  <div className="font-medium">{record.studentId}</div>
                </div>
                <div>
                  <div className="text-muted-foreground">Program</div>
                  <div className="font-medium">{record.program}</div>
                </div>
                <div>
                  <div className="text-muted-foreground">Term</div>
                  <div className="font-medium">{record.term}</div>
                </div>
              </div>
            </div>

            <div className={infoCardClassName}>
              <div className="mb-3 flex items-center gap-2 font-medium text-emerald-950 dark:text-emerald-50">
                <BookOpenText className="size-4" />
                Course Information
              </div>
              <div className="space-y-3 text-sm">
                <div>
                  <div className="text-muted-foreground">Course Title</div>
                  <div className="font-medium">{record.courseTitle}</div>
                </div>
                <div>
                  <div className="text-muted-foreground">Course Code</div>
                  <div className="font-medium">{record.courseCode}</div>
                </div>
                <div>
                  <div className="text-muted-foreground">Instructor</div>
                  <div className="font-medium">{record.instructor}</div>
                </div>
              </div>
            </div>

            <div className={`${infoCardClassName} md:col-span-2`}>
              <div className="mb-3 flex items-center gap-2 font-medium text-emerald-950 dark:text-emerald-50">
                <ReceiptText className="size-4" />
                Evaluation Summary
              </div>
              <div className="grid gap-3 md:grid-cols-4">
                <div className="rounded-xl border bg-background/70 p-3">
                  <div className="text-muted-foreground text-xs uppercase tracking-[0.2em]">
                    Final Grade
                  </div>
                  <div className="mt-1 text-sm font-medium">{record.finalGrade}</div>
                </div>
                <div className="rounded-xl border bg-background/70 p-3">
                  <div className="text-muted-foreground text-xs uppercase tracking-[0.2em]">
                    Remarks
                  </div>
                  <div className="mt-1 text-sm font-medium">{record.remarks}</div>
                </div>
                <div className="rounded-xl border bg-background/70 p-3">
                  <div className="text-muted-foreground text-xs uppercase tracking-[0.2em]">
                    Status
                  </div>
                  <div className="mt-1 text-sm font-medium">{record.status}</div>
                </div>
                <div className="rounded-xl border bg-background/70 p-3">
                  <div className="text-muted-foreground text-xs uppercase tracking-[0.2em]">
                    Record No.
                  </div>
                  <div className="mt-1 text-sm font-medium">{record.recordId}</div>
                </div>
              </div>
            </div>

            <div className={`${infoCardClassName} md:col-span-2`}>
              <div className="mb-3 flex items-center gap-2 font-medium text-emerald-950 dark:text-emerald-50">
                <GraduationCap className="size-4" />
                Registrar Note
              </div>
              <p className="text-sm leading-6 text-muted-foreground">
                This record reflects the current posted grade for{" "}
                {record.studentName} in {record.courseTitle}. Any adjustment
                should pass through the academic review and registrar validation workflow.
              </p>
            </div>
          </div>

          <DialogFooter showCloseButton className="border-t px-6 py-4" />
        </>
      ) : null}
    </DialogContent>
  </Dialog>
);
