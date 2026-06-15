"use client";

import { FileText, PackageCheck, ScrollText, UserRound } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import type { DocumentRequestRecord } from "./document-request-data";

type DocumentRequestDetailsDialogProps = {
  onOpenChange: (open: boolean) => void;
  open: boolean;
  record: DocumentRequestRecord | null;
};

const infoCardClassName =
  "rounded-2xl border border-emerald-950/10 bg-emerald-950/[0.03] p-4 dark:border-emerald-100/10 dark:bg-emerald-100/[0.04]";

export const DocumentRequestDetailsDialog = ({
  onOpenChange,
  open,
  record,
}: DocumentRequestDetailsDialogProps) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent className="max-w-3xl border-emerald-950/10 p-0 dark:border-emerald-100/10">
      {record ? (
        <>
          <DialogHeader className="border-b border-emerald-950/10 bg-gradient-to-br from-emerald-950 to-emerald-900 px-6 py-6 text-left dark:border-emerald-100/10">
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <Badge className="rounded-full bg-white/12 text-white hover:bg-white/12">
                Document Request
              </Badge>
              <Badge className="rounded-full bg-white/12 text-white hover:bg-white/12">
                {record.status}
              </Badge>
            </div>
            <DialogTitle className="font-serif text-3xl text-white">
              {record.requesterName}
            </DialogTitle>
            <DialogDescription className="text-sm text-emerald-50/85">
              {record.referenceNumber} • {record.requestedDocument}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 px-6 py-6 md:grid-cols-2">
            <div className={infoCardClassName}>
              <div className="mb-3 flex items-center gap-2 font-medium text-emerald-950 dark:text-emerald-50">
                <UserRound className="size-4" />
                Requester Information
              </div>
              <div className="space-y-3 text-sm">
                <div>
                  <div className="text-muted-foreground">Student ID</div>
                  <div className="font-medium">{record.requesterStudentId}</div>
                </div>
                <div>
                  <div className="text-muted-foreground">Program</div>
                  <div className="font-medium">{record.studentProgram}</div>
                </div>
                <div>
                  <div className="text-muted-foreground">Contact Number</div>
                  <div className="font-medium">{record.contactNumber}</div>
                </div>
                <div>
                  <div className="text-muted-foreground">Email</div>
                  <div className="font-medium">{record.email}</div>
                </div>
              </div>
            </div>

            <div className={infoCardClassName}>
              <div className="mb-3 flex items-center gap-2 font-medium text-emerald-950 dark:text-emerald-50">
                <ScrollText className="size-4" />
                Request Details
              </div>
              <div className="space-y-3 text-sm">
                <div>
                  <div className="text-muted-foreground">Requested Document</div>
                  <div className="font-medium">{record.requestedDocument}</div>
                </div>
                <div>
                  <div className="text-muted-foreground">Requested On</div>
                  <div className="font-medium">{record.requestedOn}</div>
                </div>
                <div>
                  <div className="text-muted-foreground">Delivery Method</div>
                  <div className="font-medium">{record.deliveryMethod}</div>
                </div>
                <div>
                  <div className="text-muted-foreground">Purpose</div>
                  <div className="font-medium">{record.purpose}</div>
                </div>
              </div>
            </div>

            <div className={`${infoCardClassName} md:col-span-2`}>
              <div className="mb-3 flex items-center gap-2 font-medium text-emerald-950 dark:text-emerald-50">
                <PackageCheck className="size-4" />
                Fulfillment Summary
              </div>
              <div className="grid gap-3 md:grid-cols-4">
                <div className="rounded-xl border bg-background/70 p-3">
                  <div className="text-muted-foreground text-xs uppercase tracking-[0.2em]">
                    Reference
                  </div>
                  <div className="mt-1 text-sm font-medium">{record.referenceNumber}</div>
                </div>
                <div className="rounded-xl border bg-background/70 p-3">
                  <div className="text-muted-foreground text-xs uppercase tracking-[0.2em]">
                    Status
                  </div>
                  <div className="mt-1 text-sm font-medium">{record.status}</div>
                </div>
                <div className="rounded-xl border bg-background/70 p-3">
                  <div className="text-muted-foreground text-xs uppercase tracking-[0.2em]">
                    Delivery
                  </div>
                  <div className="mt-1 text-sm font-medium">{record.deliveryMethod}</div>
                </div>
                <div className="rounded-xl border bg-background/70 p-3">
                  <div className="text-muted-foreground text-xs uppercase tracking-[0.2em]">
                    Program Level
                  </div>
                  <div className="mt-1 text-sm font-medium">
                    {record.studentProgramLevel}
                  </div>
                </div>
              </div>
            </div>

            <div className={`${infoCardClassName} md:col-span-2`}>
              <div className="mb-3 flex items-center gap-2 font-medium text-emerald-950 dark:text-emerald-50">
                <FileText className="size-4" />
                Registrar Note
              </div>
              <p className="text-sm leading-6 text-muted-foreground">
                This request is currently tagged as {record.status.toLowerCase()} for
                {` ${record.requestedDocument.toLowerCase()}`}. Release should follow the
                registrar verification and chosen delivery workflow.
              </p>
            </div>
          </div>

          <DialogFooter showCloseButton className="border-t px-6 py-4" />
        </>
      ) : null}
    </DialogContent>
  </Dialog>
);
