"use client";

import {
  BookOpenText,
  BriefcaseBusiness,
  GraduationCap,
  Mail,
  Phone,
  UserRound,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import type { InstructorRecord } from "./instructor-data";

type InstructorDetailsDialogProps = {
  instructor: InstructorRecord | null;
  onOpenChange: (open: boolean) => void;
  open: boolean;
};

const infoCardClassName =
  "rounded-2xl border border-emerald-950/10 bg-emerald-950/[0.03] p-4 dark:border-emerald-100/10 dark:bg-emerald-100/[0.04]";

export const InstructorDetailsDialog = ({
  instructor,
  onOpenChange,
  open,
}: InstructorDetailsDialogProps) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent className="max-w-3xl border-emerald-950/10 p-0 dark:border-emerald-100/10">
      {instructor ? (
        <>
          <DialogHeader className="border-b border-emerald-950/10 bg-gradient-to-br from-emerald-950 to-emerald-900 px-6 py-6 text-left dark:border-emerald-100/10">
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <Badge className="rounded-full bg-white/12 text-white hover:bg-white/12">
                Faculty Directory
              </Badge>
              <Badge className="rounded-full bg-white/12 text-white hover:bg-white/12">
                {instructor.status}
              </Badge>
            </div>
            <DialogTitle className="font-serif text-3xl text-white">
              {instructor.name}
            </DialogTitle>
            <DialogDescription className="text-sm text-emerald-50/85">
              {instructor.facultyId} • {instructor.rank}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 px-6 py-6 md:grid-cols-2">
            <div className={infoCardClassName}>
              <div className="mb-3 flex items-center gap-2 font-medium text-emerald-950 dark:text-emerald-50">
                <UserRound className="size-4" />
                Faculty Information
              </div>
              <div className="space-y-3 text-sm">
                <div>
                  <div className="text-muted-foreground">Rank</div>
                  <div className="font-medium">{instructor.rank}</div>
                </div>
                <div>
                  <div className="text-muted-foreground">Teaching Program</div>
                  <div className="font-medium">{instructor.teachingProgram}</div>
                </div>
                <div>
                  <div className="text-muted-foreground">Teaching Load</div>
                  <div className="font-medium">{instructor.loadUnits} units</div>
                </div>
                <div>
                  <div className="text-muted-foreground">Status</div>
                  <div className="font-medium">{instructor.status}</div>
                </div>
              </div>
            </div>

            <div className={infoCardClassName}>
              <div className="mb-3 flex items-center gap-2 font-medium text-emerald-950 dark:text-emerald-50">
                <BriefcaseBusiness className="size-4" />
                Contact and Department
              </div>
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-2">
                  <Phone className="size-4 text-muted-foreground" />
                  <span>{instructor.contactNumber}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="size-4 text-muted-foreground" />
                  <span>{instructor.email}</span>
                </div>
                <div>
                  <div className="text-muted-foreground">Department</div>
                  <div className="font-medium">{instructor.department}</div>
                </div>
              </div>
            </div>

            <div className={`${infoCardClassName} md:col-span-2`}>
              <div className="mb-3 flex items-center gap-2 font-medium text-emerald-950 dark:text-emerald-50">
                <BookOpenText className="size-4" />
                Instructional Snapshot
              </div>
              <div className="grid gap-3 md:grid-cols-4">
                <div className="rounded-xl border bg-background/70 p-3">
                  <div className="text-muted-foreground text-xs uppercase tracking-[0.2em]">
                    Specialization
                  </div>
                  <div className="mt-1 text-sm font-medium">
                    {instructor.specialization}
                  </div>
                </div>
                <div className="rounded-xl border bg-background/70 p-3">
                  <div className="text-muted-foreground text-xs uppercase tracking-[0.2em]">
                    Program
                  </div>
                  <div className="mt-1 text-sm font-medium">
                    {instructor.teachingProgram}
                  </div>
                </div>
                <div className="rounded-xl border bg-background/70 p-3">
                  <div className="text-muted-foreground text-xs uppercase tracking-[0.2em]">
                    Rank
                  </div>
                  <div className="mt-1 text-sm font-medium">{instructor.rank}</div>
                </div>
                <div className="rounded-xl border bg-background/70 p-3">
                  <div className="text-muted-foreground text-xs uppercase tracking-[0.2em]">
                    Teaching Load
                  </div>
                  <div className="mt-1 text-sm font-medium">
                    {instructor.loadUnits} units
                  </div>
                </div>
              </div>
            </div>

            <div className={`${infoCardClassName} md:col-span-2`}>
              <div className="mb-3 flex items-center gap-2 font-medium text-emerald-950 dark:text-emerald-50">
                <GraduationCap className="size-4" />
                Faculty Focus
              </div>
              <p className="text-sm leading-6 text-muted-foreground">
                {instructor.name} is assigned under the {instructor.department} unit
                and currently supports {instructor.teachingProgram.toLowerCase()}-level
                formation with a focus on {instructor.specialization.toLowerCase()}.
              </p>
            </div>
          </div>

          <DialogFooter showCloseButton className="border-t px-6 py-4" />
        </>
      ) : null}
    </DialogContent>
  </Dialog>
);
