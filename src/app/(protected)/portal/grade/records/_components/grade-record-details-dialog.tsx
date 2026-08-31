"use client";

import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

import type { GradeRecord } from "./grade-record-data";

type GradeRecordDetailsDialogProps = {
  onOpenChange: (open: boolean) => void;
  open: boolean;
  record: GradeRecord | null;
};

const parseBreakdown = (notes?: string) => {
  if (!notes) return [];

  return notes
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.includes(":"))
    .map((line) => {
      const [label, ...valueParts] = line.split(":");
      return {
        label: label.trim(),
        value: valueParts.join(":").trim(),
      };
    })
    .filter((item) => item.label !== "Notes" && item.value);
};

const listItemClassName =
  "flex items-start justify-between gap-4 border-b py-3 text-sm last:border-b-0";

export const GradeRecordDetailsDialog = ({
  onOpenChange,
  open,
  record,
}: GradeRecordDetailsDialogProps) => {
  const breakdown = parseBreakdown(record?.notes);
  const registrarNote =
    record?.notes
      ?.split("\n")
      .find((line) => line.trim().startsWith("Notes:"))
      ?.replace(/^Notes:\s*/, "")
      .trim() ?? "";

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full overflow-y-auto sm:max-w-xl">
        {record ? (
          <>
            <SheetHeader className="border-b">
              <SheetTitle>{record.studentName}</SheetTitle>
              <SheetDescription>
                {record.recordId} - {record.courseCode}
              </SheetDescription>
            </SheetHeader>

            <div className="space-y-8 px-4">
              <section>
                <div className="mb-2 flex items-center justify-between gap-3">
                  <h3 className="text-sm font-semibold">Record Details</h3>
                  <Badge variant="secondary">{record.status}</Badge>
                </div>
                <div>
                  <DetailRow label="Student ID" value={record.studentId} />
                  <DetailRow label="Program" value={record.program} />
                  <DetailRow label="Subject" value={record.subject} />
                  <DetailRow label="Course Code" value={record.courseCode} />
                  <DetailRow label="Instructor" value={record.instructor} />
                </div>
              </section>

              <section>
                <h3 className="mb-2 text-sm font-semibold">Grade Summary</h3>
                <div>
                  <DetailRow label="Final Grade" value={record.finalGrade} />
                  <DetailRow label="Remarks" value={record.remarks} />
                  <DetailRow label="Status" value={record.status} />
                  <DetailRow label="Record No." value={record.recordId} />
                </div>
              </section>

              <section>
                <h3 className="mb-2 text-sm font-semibold">Grade Breakdown</h3>
                {breakdown.length ? (
                  <div>
                    {breakdown.map((item) => (
                      <DetailRow
                        key={`${item.label}-${item.value}`}
                        label={item.label}
                        value={item.value}
                      />
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    No grade breakdown recorded.
                  </p>
                )}
              </section>

              {registrarNote ? (
                <section>
                  <h3 className="mb-2 text-sm font-semibold">Notes</h3>
                  <p className="text-sm leading-6 text-muted-foreground">
                    {registrarNote}
                  </p>
                </section>
              ) : null}
            </div>
          </>
        ) : null}
      </SheetContent>
    </Sheet>
  );
};

const DetailRow = ({ label, value }: { label: string; value: string }) => (
  <div className={listItemClassName}>
    <span className="text-muted-foreground">{label}</span>
    <span className="text-right font-medium">{value}</span>
  </div>
);
