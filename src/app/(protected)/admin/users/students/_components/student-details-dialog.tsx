"use client";

import { BookOpenText, Mail, MapPin, Phone, School, UserRound } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import type { StudentRecord } from "./student-data";

type StudentDetailsDialogProps = {
  onOpenChange: (open: boolean) => void;
  open: boolean;
  student: StudentRecord | null;
};

const infoCardClassName =
  "rounded-2xl border border-emerald-950/10 bg-emerald-950/[0.03] p-4 dark:border-emerald-100/10 dark:bg-emerald-100/[0.04]";

export const StudentDetailsDialog = ({
  onOpenChange,
  open,
  student,
}: StudentDetailsDialogProps) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent className="max-w-3xl border-emerald-950/10 p-0 dark:border-emerald-100/10">
      {student ? (
        <>
          <DialogHeader className="border-b border-emerald-950/10 bg-gradient-to-br from-emerald-950 to-emerald-900 px-6 py-6 text-left dark:border-emerald-100/10">
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <Badge className="rounded-full bg-white/12 text-white hover:bg-white/12">
                Student Directory
              </Badge>
              <Badge className="rounded-full bg-white/12 text-white hover:bg-white/12">
                {student.status}
              </Badge>
            </div>
            <DialogTitle className="font-serif text-3xl text-white">
              {student.name}
            </DialogTitle>
            <DialogDescription className="text-sm text-emerald-50/85">
              {student.id} • {student.program}
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
                  <div className="text-muted-foreground">Academic Year</div>
                  <div className="font-medium">{student.academicYear}</div>
                </div>
                <div>
                  <div className="text-muted-foreground">Enrollment Type</div>
                  <div className="font-medium">{student.enrollmentType}</div>
                </div>
                <div>
                  <div className="text-muted-foreground">Program Level</div>
                  <div className="font-medium">{student.programLevel}</div>
                </div>
                <div>
                  <div className="text-muted-foreground">Year Level</div>
                  <div className="font-medium">{student.yearLevel}</div>
                </div>
              </div>
            </div>

            <div className={infoCardClassName}>
              <div className="mb-3 flex items-center gap-2 font-medium text-emerald-950 dark:text-emerald-50">
                <School className="size-4" />
                Contact and Location
              </div>
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-2">
                  <Phone className="size-4 text-muted-foreground" />
                  <span>{student.contactNumber}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="size-4 text-muted-foreground" />
                  <span>{student.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="size-4 text-muted-foreground" />
                  <span>{student.townCity}</span>
                </div>
              </div>
            </div>

            <div className={`${infoCardClassName} md:col-span-2`}>
              <div className="mb-3 flex items-center gap-2 font-medium text-emerald-950 dark:text-emerald-50">
                <BookOpenText className="size-4" />
                Academic Snapshot
              </div>
              <div className="grid gap-3 md:grid-cols-4">
                <div className="rounded-xl border bg-background/70 p-3">
                  <div className="text-muted-foreground text-xs uppercase tracking-[0.2em]">
                    Program
                  </div>
                  <div className="mt-1 text-sm font-medium">{student.program}</div>
                </div>
                <div className="rounded-xl border bg-background/70 p-3">
                  <div className="text-muted-foreground text-xs uppercase tracking-[0.2em]">
                    Level
                  </div>
                  <div className="mt-1 text-sm font-medium">
                    {student.programLevel}
                  </div>
                </div>
                <div className="rounded-xl border bg-background/70 p-3">
                  <div className="text-muted-foreground text-xs uppercase tracking-[0.2em]">
                    Standing
                  </div>
                  <div className="mt-1 text-sm font-medium">{student.status}</div>
                </div>
                <div className="rounded-xl border bg-background/70 p-3">
                  <div className="text-muted-foreground text-xs uppercase tracking-[0.2em]">
                    Term
                  </div>
                  <div className="mt-1 text-sm font-medium">
                    {student.academicYear}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter showCloseButton className="border-t px-6 py-4" />
        </>
      ) : null}
    </DialogContent>
  </Dialog>
);
