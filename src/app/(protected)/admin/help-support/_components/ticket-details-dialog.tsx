"use client";

import {
  Clock3,
  LifeBuoy,
  Mail,
  ShieldCheck,
  UserRound,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import type { SupportTicket } from "./support-data";

type TicketDetailsDialogProps = {
  onOpenChange: (open: boolean) => void;
  open: boolean;
  ticket: SupportTicket | null;
};

const infoCardClassName =
  "rounded-2xl border border-emerald-950/10 bg-emerald-950/[0.03] p-4 dark:border-emerald-100/10 dark:bg-emerald-100/[0.04]";

export const TicketDetailsDialog = ({
  onOpenChange,
  open,
  ticket,
}: TicketDetailsDialogProps) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent showCloseButton={false} className="max-w-4xl! border-emerald-950/10 p-0 dark:border-emerald-100/10">
      {ticket ? (
        <>
          <DialogHeader className="border-b border-emerald-950/10 bg-linear-to-br from-emerald-950 to-emerald-900 px-6 py-6 text-left dark:border-emerald-100/10">
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <Badge className="rounded-full bg-white/12 text-white hover:bg-white/12">
                Help &amp; Support
              </Badge>
              <Badge className="rounded-full bg-white/12 text-white hover:bg-white/12">
                {ticket.status}
              </Badge>
              <Badge className="rounded-full bg-white/12 text-white hover:bg-white/12">
                {ticket.priority}
              </Badge>
            </div>
            <DialogTitle className="font-serif text-3xl text-white">
              {ticket.subject}
            </DialogTitle>
            <DialogDescription className="text-sm text-emerald-50/85">
              {ticket.ticketNumber} • {ticket.category} • {ticket.channel}
            </DialogDescription>
          </DialogHeader>

          <div className="max-h-[70vh] overflow-y-auto px-6 py-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className={infoCardClassName}>
                <div className="mb-3 flex items-center gap-2 font-medium text-emerald-950 dark:text-emerald-50">
                  <UserRound className="size-4" />
                  Requester Information
                </div>
                <div className="space-y-3 text-sm">
                  <div>
                    <div className="text-muted-foreground">Raised By</div>
                    <div className="font-medium">{ticket.raisedBy}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Role</div>
                    <div className="font-medium">{ticket.raisedByRole}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Program</div>
                    <div className="font-medium">{ticket.program}</div>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div>
                      <div className="text-muted-foreground flex items-center gap-2">
                        <Mail className="size-3.5" />
                        Email
                      </div>
                      <div className="font-medium">{ticket.contactEmail}</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className={infoCardClassName}>
                <div className="mb-3 flex items-center gap-2 font-medium text-emerald-950 dark:text-emerald-50">
                  <LifeBuoy className="size-4" />
                  Ticket Assignment
                </div>
                <div className="space-y-3 text-sm">
                  <div>
                    <div className="text-muted-foreground">Assigned To</div>
                    <div className="font-medium">{ticket.assignedTo}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Category</div>
                    <div className="font-medium">{ticket.category}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Priority</div>
                    <div className="font-medium">{ticket.priority}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Current Status</div>
                    <div className="font-medium">{ticket.status}</div>
                  </div>
                </div>
              </div>

              <div className={`${infoCardClassName} md:col-span-2`}>
                <div className="mb-3 flex items-center gap-2 font-medium text-emerald-950 dark:text-emerald-50">
                  <ShieldCheck className="size-4" />
                  Issue Summary
                </div>
                <p className="text-sm leading-6 text-muted-foreground">
                  {ticket.summary}
                </p>
              </div>

              <div className={`${infoCardClassName} md:col-span-2`}>
                <div className="mb-3 flex items-center gap-2 font-medium text-emerald-950 dark:text-emerald-50">
                  <Clock3 className="size-4" />
                  Support Timeline
                </div>
                <div className="grid gap-3 md:grid-cols-4">
                  <div className="rounded-xl border bg-background/70 p-3">
                    <div className="text-muted-foreground text-xs uppercase ">
                      Ticket No.
                    </div>
                    <div className="mt-1 text-sm font-medium">{ticket.ticketNumber}</div>
                  </div>
                  <div className="rounded-xl border bg-background/70 p-3">
                    <div className="text-muted-foreground text-xs uppercase ">
                      Raised On
                    </div>
                    <div className="mt-1 text-sm font-medium">{ticket.raisedOn}</div>
                  </div>
                  <div className="rounded-xl border bg-background/70 p-3">
                    <div className="text-muted-foreground text-xs uppercase ">
                      Last Updated
                    </div>
                    <div className="mt-1 text-sm font-medium">
                      {ticket.lastUpdated}
                    </div>
                  </div>
                  <div className="rounded-xl border bg-background/70 p-3">
                    <div className="text-muted-foreground text-xs uppercase ">
                      Channel
                    </div>
                    <div className="mt-1 text-sm font-medium">{ticket.channel}</div>
                  </div>
                </div>
              </div>

              <div className={`${infoCardClassName} md:col-span-2`}>
                <div className="mb-3 flex items-center gap-2 font-medium text-emerald-950 dark:text-emerald-50">
                  <ShieldCheck className="size-4" />
                  Resolution Note
                </div>
                <p className="text-sm leading-6 text-muted-foreground">
                  {ticket.resolutionNote}
                </p>
              </div>
            </div>
          </div>
        </>
      ) : null}
    </DialogContent>
  </Dialog>
);
