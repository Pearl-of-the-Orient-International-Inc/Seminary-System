"use client";

import Link from "next/link";
import { BadgeCheck, CreditCard, FileText, UserRound } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

import type { EnrollmentRecord } from "./enrollment-data";

type EnrollmentDetailsDialogProps = {
  onOpenChange: (open: boolean) => void;
  open: boolean;
  record: EnrollmentRecord | null;
};

const infoCardClassName =
  "rounded-2xl border border-emerald-950/10 bg-emerald-950/[0.03] p-4 dark:border-emerald-100/10 dark:bg-emerald-100/[0.04]";

const getRequirementLinks = (record: EnrollmentRecord) => {
  const requirements = record.application?.requirements;

  return [
    {
      label: "Transcript of Records",
      name: requirements?.transcriptOfRecordsFileName,
      url: requirements?.transcriptOfRecordsUrl,
    },
    {
      label: "2x2 ID Picture",
      name: requirements?.idPictureFileName,
      url: requirements?.idPictureUrl,
    },
    {
      label: "Pastor's Recommendation Letter",
      name: requirements?.pastorRecommendationFileName,
      url: requirements?.pastorRecommendationUrl,
    },
    {
      label: "Proof of Receipt",
      name: record.application?.payment?.proofOfReceiptFileName,
      url: record.application?.payment?.proofOfReceiptUrl,
    },
  ];
};

export const EnrollmentDetailsDialog = ({
  onOpenChange,
  open,
  record,
}: EnrollmentDetailsDialogProps) => (
  <Sheet open={open} onOpenChange={onOpenChange}>
    <SheetContent
      side="right"
      className="w-full overflow-y-auto border-emerald-950/10 p-0 sm:max-w-2xl lg:max-w-4xl dark:border-emerald-100/10"
      showCloseButton={false}
    >
      {record ? (
        <>
          <SheetHeader className="border-b border-emerald-950/10 bg-linear-to-br from-emerald-950 to-emerald-900 px-6 py-6 text-left dark:border-emerald-100/10">
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <Badge className="rounded-full bg-white/12 text-white hover:bg-white/12">
                Enrollment Record
              </Badge>
              <Badge className="rounded-full bg-white/12 text-white hover:bg-white/12">
                {record.status}
              </Badge>
            </div>
            <SheetTitle className="font-serif text-3xl text-white">
              {record.studentName}
            </SheetTitle>
            <SheetDescription className="text-sm text-emerald-50/85">
              {record.enrollmentId} - {record.program}
            </SheetDescription>
          </SheetHeader>

          <div className="grid gap-4 px-6 py-6 md:grid-cols-2">
            <div className={infoCardClassName}>
              <div className="mb-3 flex items-center gap-2 font-medium text-emerald-950 dark:text-emerald-50">
                <UserRound className="size-4" />
                Applicant Profile
              </div>
              <div className="space-y-3 text-sm">
                <div>
                  <div className="text-muted-foreground">Student ID</div>
                  <div className="font-medium">{record.studentId}</div>
                </div>
                <div>
                  <div className="text-muted-foreground">Enrollment Type</div>
                  <div className="font-medium">{record.enrollmentType}</div>
                </div>
                <div>
                  <div className="text-muted-foreground">Home Address</div>
                  <div className="font-medium">
                    {record.application?.homeAddress ?? "Not provided"}
                  </div>
                </div>
                <div>
                  <div className="text-muted-foreground">Application Date</div>
                  <div className="font-medium">{record.applicationDate}</div>
                </div>
                <div>
                  <div className="text-muted-foreground">Program Level</div>
                  <div className="font-medium">{record.programLevel}</div>
                </div>
              </div>
            </div>

            <div className={infoCardClassName}>
              <div className="mb-3 flex items-center gap-2 font-medium text-emerald-950 dark:text-emerald-50">
                <CreditCard className="size-4" />
                Verification Status
              </div>
              <div className="space-y-3 text-sm">
                <div>
                  <div className="text-muted-foreground">Payment Status</div>
                  <div className="font-medium">{record.paymentStatus}</div>
                </div>
                <div>
                  <div className="text-muted-foreground">Amount Paid</div>
                  <div className="font-medium">
                    PHP {record.application?.payment?.amountPaid ?? "0.00"}
                  </div>
                </div>
                <div>
                  <div className="text-muted-foreground">Documents</div>
                  <div className="font-medium">{record.documentsStatus}</div>
                </div>
                <div>
                  <div className="text-muted-foreground">Email</div>
                  <div className="font-medium">{record.email}</div>
                </div>
                <div>
                  <div className="text-muted-foreground">Contact Number</div>
                  <div className="font-medium">{record.contactNumber}</div>
                </div>
              </div>
            </div>

            <div className={`${infoCardClassName} md:col-span-2`}>
              <div className="mb-3 flex items-center gap-2 font-medium text-emerald-950 dark:text-emerald-50">
                <FileText className="size-4" />
                Submitted Files
              </div>
              <div className="grid gap-3 md:grid-cols-2">
                {getRequirementLinks(record).map((file) => (
                  <div
                    key={file.label}
                    className="rounded-xl border bg-background/70 p-3"
                  >
                    <div className="text-muted-foreground text-xs uppercase">
                      {file.label}
                    </div>
                    {file.url ? (
                      <Link
                        href={file.url}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-1 block truncate text-sm font-semibold text-emerald-700 underline-offset-4 hover:underline dark:text-emerald-300"
                      >
                        {file.name ?? "Open file"}
                      </Link>
                    ) : (
                      <div className="mt-1 text-sm font-medium">To follow</div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className={`${infoCardClassName} md:col-span-2`}>
              <div className="mb-3 flex items-center gap-2 font-medium text-emerald-950 dark:text-emerald-50">
                <BadgeCheck className="size-4" />
                Enrollment Summary
              </div>
              <div className="grid gap-3 md:grid-cols-4">
                {[
                  ["Program", record.program],
                  ["Level", record.programLevel],
                  ["Payment", record.paymentStatus],
                  ["Status", record.status],
                ].map(([label, value]) => (
                  <div key={label} className="rounded-xl border bg-background/70 p-3">
                    <div className="text-muted-foreground text-xs uppercase">
                      {label}
                    </div>
                    <div className="mt-1 text-sm font-medium">{value}</div>
                  </div>
                ))}
              </div>
              {record.application?.reviewRemarks ? (
                <div className="mt-4 rounded-xl border border-amber-500/20 bg-amber-50 p-3 text-sm text-amber-950 dark:bg-amber-500/10 dark:text-amber-100">
                  <div className="font-semibold">Review Remarks</div>
                  <p className="mt-1 leading-6">
                    {record.application.reviewRemarks}
                  </p>
                </div>
              ) : null}
            </div>

            <div className={`${infoCardClassName} md:col-span-2`}>
              <div className="mb-3 flex items-center gap-2 font-medium text-emerald-950 dark:text-emerald-50">
                <FileText className="size-4" />
                Brief History of Conversion
              </div>
              <p className="text-sm leading-6 text-muted-foreground">
                {record.application?.requirements?.briefHistoryOfConversion ??
                  `This applicant is currently under the ${record.status.toLowerCase()} stage for ${record.program}. Final enrollment activation should follow payment and document verification.`}
              </p>
            </div>
          </div>

          <SheetFooter className="border-t px-6 py-4">
            <p className="text-xs text-muted-foreground">
              Review payment, files, and application notes before advancing the
              enrollment status.
            </p>
          </SheetFooter>
        </>
      ) : null}
    </SheetContent>
  </Sheet>
);
