"use client";

import {
  BadgeDollarSign,
  CreditCard,
  ReceiptText,
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

import type {
  ChargeBreakdownItem,
  FeeCollectionRecord,
} from "./fee-collection-data";
import { currency } from "./columns";

type FeeAccountDetailsDialogProps = {
  breakdown: ChargeBreakdownItem[];
  onOpenChange: (open: boolean) => void;
  open: boolean;
  record: FeeCollectionRecord | null;
};

const infoCardClassName =
  "rounded-2xl border border-emerald-950/10 bg-emerald-950/[0.03] p-4 dark:border-emerald-100/10 dark:bg-emerald-100/[0.04]";

export const FeeAccountDetailsDialog = ({
  breakdown,
  onOpenChange,
  open,
  record,
}: FeeAccountDetailsDialogProps) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent showCloseButton={false} className="max-h-[90vh] max-w-4xl! overflow-hidden border-emerald-950/10 p-0 dark:border-emerald-100/10">
      {record ? (
        <>
          <DialogHeader className="border-b border-emerald-950/10 bg-linear-to-br from-emerald-950 to-emerald-900 px-6 py-6 text-left dark:border-emerald-100/10">
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <Badge className="rounded-full bg-white/12 text-white hover:bg-white/12">
                Fee Collection
              </Badge>
              <Badge className="rounded-full bg-white/12 text-white hover:bg-white/12">
                {record.status}
              </Badge>
            </div>
            <DialogTitle className="font-serif text-3xl text-white">
              {record.studentName}
            </DialogTitle>
            <DialogDescription className="text-sm text-emerald-50/85">
              {`${record.referenceNumber} | ${record.program}`}
            </DialogDescription>
          </DialogHeader>

          <div className="max-h-[calc(90vh-14rem)] overflow-y-auto px-6 py-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className={infoCardClassName}>
                <div className="mb-3 flex items-center gap-2 font-medium text-emerald-950 dark:text-emerald-50">
                  <UserRound className="size-4" />
                  Student Account
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
                    <div className="text-muted-foreground">Payment Method</div>
                    <div className="font-medium">{record.paymentMethod}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Due Date</div>
                    <div className="font-medium">{record.dueDate}</div>
                  </div>
                </div>
              </div>

              <div className={infoCardClassName}>
                <div className="mb-3 flex items-center gap-2 font-medium text-emerald-950 dark:text-emerald-50">
                  <CreditCard className="size-4" />
                  Payment Summary
                </div>
                <div className="space-y-3 text-sm">
                  <div>
                    <div className="text-muted-foreground">Total Charges</div>
                    <div className="font-medium">{currency.format(record.totalCharges)}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Amount Paid</div>
                    <div className="font-medium">{currency.format(record.amountPaid)}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Remaining Balance</div>
                    <div className="font-medium">{currency.format(record.balance)}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Payment Setup</div>
                    <div className="font-medium">
                      {record.balance > 0 && record.amountPaid > 0
                        ? "Partial payment accepted"
                        : record.balance === 0
                          ? "Fully settled"
                          : "Awaiting initial payment"}
                    </div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Status</div>
                    <div className="font-medium">{record.status}</div>
                  </div>
                </div>
              </div>

              <div className={`${infoCardClassName} md:col-span-2`}>
                <div className="mb-3 flex items-center gap-2 font-medium text-emerald-950 dark:text-emerald-50">
                  <ReceiptText className="size-4" />
                  Breakdown of Charges
                </div>
                <div className="space-y-3">
                  {breakdown.map((item) => (
                    <div
                      key={item.label}
                      className="flex items-center justify-between rounded-xl border bg-background/70 px-4 py-3 text-sm"
                    >
                      <span className="font-medium">{item.label}</span>
                      <span className="font-semibold">{currency.format(item.amount)}</span>
                    </div>
                  ))}
                  <div className="flex items-center justify-between rounded-xl border border-emerald-900/15 bg-emerald-900/4 px-4 py-4">
                    <span className="text-base font-semibold text-emerald-950 dark:text-emerald-50">
                      Total
                    </span>
                    <span className="text-lg font-bold text-rose-600 dark:text-rose-400">
                      {currency.format(record.totalCharges)}
                    </span>
                  </div>
                </div>
              </div>

              <div className={`${infoCardClassName} md:col-span-2`}>
                <div className="mb-3 flex items-center gap-2 font-medium text-emerald-950 dark:text-emerald-50">
                  <BadgeDollarSign className="size-4" />
                  Finance Note
                </div>
                <p className="text-sm leading-6 text-muted-foreground">
                  This account is currently tagged as {record.status.toLowerCase()} with
                  a remaining balance of {currency.format(record.balance)}. Partial
                  payments are accepted by the system, but final enrollment clearance
                  should only follow once finance confirms the required settlement.
                </p>
              </div>
            </div>
          </div>
        </>
      ) : null}
    </DialogContent>
  </Dialog>
);
