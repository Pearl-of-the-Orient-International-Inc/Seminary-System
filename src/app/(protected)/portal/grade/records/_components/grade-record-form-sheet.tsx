"use client";

import { useEffect, useMemo, useState } from "react";
import { Save } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import type {
  SeminaryGradeRecordPayload,
  SeminaryGradeRecordRemark,
  SeminaryGradeRecordStatus,
} from "@/features/seminary/seminary.types";

import {
  gradeStatusOptions,
  gradeTermOptions,
  type GradeRecord,
} from "./grade-record-data";

type StudentOption = {
  id: string;
  label: string;
};

type GradeRecordFormSheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (payload: SeminaryGradeRecordPayload) => void;
  record: GradeRecord | null;
  studentOptions: StudentOption[];
  subjectOptions: string[];
  submitting?: boolean;
};

const remarkOptions: Array<{
  label: string;
  value: SeminaryGradeRecordRemark;
}> = [
  { label: "Passed", value: "PASSED" },
  { label: "Conditional", value: "CONDITIONAL" },
  { label: "Failed", value: "FAILED" },
  { label: "Ongoing", value: "ONGOING" },
];

const statusValueMap: Record<string, SeminaryGradeRecordStatus> = {
  Complete: "COMPLETE",
  "Pending Review": "PENDING_REVIEW",
  "In Progress": "IN_PROGRESS",
  Incomplete: "INCOMPLETE",
};

const statusOptions = gradeStatusOptions.map((status) => ({
  label: status,
  value: statusValueMap[status],
}));

const getRemarkFromGrade = (finalGrade: string): SeminaryGradeRecordRemark => {
  const grade = Number(finalGrade);
  if (!Number.isFinite(grade)) return "ONGOING";
  if (grade <= 2.5) return "PASSED";
  if (grade < 5) return "CONDITIONAL";
  return "FAILED";
};

export const GradeRecordFormSheet = ({
  onOpenChange,
  onSubmit,
  open,
  record,
  studentOptions,
  subjectOptions,
  submitting = false,
}: GradeRecordFormSheetProps) => {
  const [studentApplicationId, setStudentApplicationId] = useState("");
  const [subject, setSubject] = useState("");
  const [term, setTerm] = useState("1st Semester");
  const [finalGrade, setFinalGrade] = useState("");
  const [remarks, setRemarks] = useState<SeminaryGradeRecordRemark>("ONGOING");
  const [status, setStatus] =
    useState<SeminaryGradeRecordStatus>("PENDING_REVIEW");
  const [notes, setNotes] = useState("");
  const isEditing = Boolean(record);
  const selectedStudentLabel = useMemo(
    () =>
      studentOptions.find((student) => student.id === studentApplicationId)
        ?.label ?? "",
    [studentApplicationId, studentOptions],
  );

  // Reset sheet fields every time a new create/edit session opens.
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    if (!open) return;

    setStudentApplicationId(record?.studentApplicationId ?? studentOptions[0]?.id ?? "");
    setSubject(record?.subject ?? subjectOptions[0] ?? "");
    setTerm(record?.term ?? "1st Semester");
    setFinalGrade(record?.finalGrade === "--" ? "" : record?.finalGrade ?? "");
    setRemarks(
      record?.remarks === "Passed"
        ? "PASSED"
        : record?.remarks === "Conditional"
          ? "CONDITIONAL"
          : record?.remarks === "Failed"
            ? "FAILED"
            : "ONGOING",
    );
    setStatus(
      record?.status === "Complete"
        ? "COMPLETE"
        : record?.status === "Pending Review"
          ? "PENDING_REVIEW"
          : record?.status === "Incomplete"
            ? "INCOMPLETE"
            : "IN_PROGRESS",
    );
    setNotes(record?.notes ?? "");
  }, [open, record, studentOptions, subjectOptions]);
  /* eslint-enable react-hooks/set-state-in-effect */

  const handleSubmit = () => {
    if (!studentApplicationId || !subject || !finalGrade) return;

    onSubmit({
      finalGrade,
      notes: notes || undefined,
      remarks,
      status,
      studentApplicationId,
      subject,
      term,
    });
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full overflow-y-auto sm:max-w-xl">
        <SheetHeader className="border-b">
          <SheetTitle>
            {isEditing ? "Edit Grade Record" : "Create Grade Record"}
          </SheetTitle>
          <SheetDescription>
            Encode final grade for assigned subject and enrolled student.
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-5 px-4">
          <Field>
            <FieldLabel>Student</FieldLabel>
            <Select
              value={studentApplicationId}
              onValueChange={setStudentApplicationId}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select student" />
              </SelectTrigger>
              <SelectContent>
                {studentOptions.map((student) => (
                  <SelectItem key={student.id} value={student.id}>
                    {student.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {selectedStudentLabel ? (
              <p className="text-xs text-muted-foreground">{selectedStudentLabel}</p>
            ) : null}
          </Field>

          <Field>
            <FieldLabel>Subject</FieldLabel>
            <Select value={subject} onValueChange={setSubject}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select subject" />
              </SelectTrigger>
              <SelectContent>
                {subjectOptions.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field>
              <FieldLabel>Term</FieldLabel>
              <Select value={term} onValueChange={setTerm}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select term" />
                </SelectTrigger>
                <SelectContent>
                  {gradeTermOptions.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>

            <Field>
              <FieldLabel>Final Grade</FieldLabel>
              <Input
                value={finalGrade}
                onBlur={() => setRemarks(getRemarkFromGrade(finalGrade))}
                onChange={(event) => setFinalGrade(event.target.value)}
                placeholder="e.g. 1.50"
              />
            </Field>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field>
              <FieldLabel>Remarks</FieldLabel>
              <Select
                value={remarks}
                onValueChange={(value) =>
                  setRemarks(value as SeminaryGradeRecordRemark)
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select remarks" />
                </SelectTrigger>
                <SelectContent>
                  {remarkOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>

            <Field>
              <FieldLabel>Status</FieldLabel>
              <Select
                value={status}
                onValueChange={(value) =>
                  setStatus(value as SeminaryGradeRecordStatus)
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
          </div>

          <Field>
            <FieldLabel>Notes</FieldLabel>
            <Textarea
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              placeholder="Optional registrar or instructor note"
              className="min-h-24"
            />
          </Field>
        </div>

        <SheetFooter className="border-t">
          <Button
            onClick={handleSubmit}
            disabled={submitting || !studentApplicationId || !subject || !finalGrade}
          >
            <Save className="size-4" />
            {submitting ? "Saving..." : "Save Grade"}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};
