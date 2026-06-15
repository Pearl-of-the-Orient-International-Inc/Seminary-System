"use client";

import {
  BookOpenText,
  GraduationCap,
  ScrollText,
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

import type { ResearchRecord } from "./research-data";

type ResearchDetailsDialogProps = {
  onOpenChange: (open: boolean) => void;
  open: boolean;
  record: ResearchRecord | null;
};

const infoCardClassName =
  "rounded-2xl border border-emerald-950/10 bg-emerald-950/[0.03] p-4 dark:border-emerald-100/10 dark:bg-emerald-100/[0.04]";

export const ResearchDetailsDialog = ({
  onOpenChange,
  open,
  record,
}: ResearchDetailsDialogProps) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent className="max-h-[90vh] max-w-4xl overflow-hidden border-emerald-950/10 p-0 dark:border-emerald-100/10">
      {record ? (
        <>
          <DialogHeader className="border-b border-emerald-950/10 bg-gradient-to-br from-emerald-950 to-emerald-900 px-6 py-6 text-left dark:border-emerald-100/10">
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <Badge className="rounded-full bg-white/12 text-white hover:bg-white/12">
                Research Registry
              </Badge>
              <Badge className="rounded-full bg-white/12 text-white hover:bg-white/12">
                {record.stage}
              </Badge>
            </div>
            <DialogTitle className="font-serif text-3xl text-white">
              {record.researcherName}
            </DialogTitle>
            <DialogDescription className="text-sm text-emerald-50/85">
              {`${record.referenceNumber} | ${record.type}`}
            </DialogDescription>
          </DialogHeader>

          <div className="max-h-[calc(90vh-14rem)] overflow-y-auto px-6 py-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className={infoCardClassName}>
                <div className="mb-3 flex items-center gap-2 font-medium text-emerald-950 dark:text-emerald-50">
                  <UserRound className="size-4" />
                  Researcher Profile
                </div>
                <div className="space-y-3 text-sm">
                  <div>
                    <div className="text-muted-foreground">Student ID</div>
                    <div className="font-medium">{record.researcherStudentId}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Program</div>
                    <div className="font-medium">{record.program}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Track</div>
                    <div className="font-medium">{record.track}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Type</div>
                    <div className="font-medium">{record.type}</div>
                  </div>
                </div>
              </div>

              <div className={infoCardClassName}>
                <div className="mb-3 flex items-center gap-2 font-medium text-emerald-950 dark:text-emerald-50">
                  <GraduationCap className="size-4" />
                  Advising and Defense
                </div>
                <div className="space-y-3 text-sm">
                  <div>
                    <div className="text-muted-foreground">Adviser</div>
                    <div className="font-medium">{record.adviser}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Panel Chair</div>
                    <div className="font-medium">{record.panelChair}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Defense Date</div>
                    <div className="font-medium">{record.defenseDate ?? "TBA"}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Stage</div>
                    <div className="font-medium">{record.stage}</div>
                  </div>
                </div>
              </div>

              <div className={`${infoCardClassName} md:col-span-2`}>
                <div className="mb-3 flex items-center gap-2 font-medium text-emerald-950 dark:text-emerald-50">
                  <BookOpenText className="size-4" />
                  Research Title
                </div>
                <p className="text-base leading-7 font-medium text-foreground">
                  {record.title}
                </p>
              </div>

              <div className={`${infoCardClassName} md:col-span-2`}>
                <div className="mb-3 flex items-center gap-2 font-medium text-emerald-950 dark:text-emerald-50">
                  <ScrollText className="size-4" />
                  Academic Note
                </div>
                <p className="text-sm leading-6 text-muted-foreground">
                  This {record.type.toLowerCase()} is currently under the{" "}
                  {record.stage.toLowerCase()} stage for the {record.program} program.
                  Defense scheduling and archive endorsement should proceed according
                  to graduate school approval and panel clearance.
                </p>
              </div>
            </div>
          </div>

          <DialogFooter showCloseButton className="border-t px-6 py-4" />
        </>
      ) : null}
    </DialogContent>
  </Dialog>
);
