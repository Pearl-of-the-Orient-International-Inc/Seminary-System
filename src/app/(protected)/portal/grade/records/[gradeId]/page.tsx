"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Check,
  ChevronLeft,
  ChevronRight,
  Info,
  Save,
  UsersRound,
} from "lucide-react";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useCurrentUserQuery } from "@/features/auth/auth.hooks";
import {
  toApiError,
  useCreateSeminaryGradeRecordMutation,
  useSeminaryCoursesQuery,
  useSeminaryGradeConfigurationQuery,
  useSeminaryGradeRecordQuery,
  useSeminaryGradeRecordsQuery,
  useSeminaryStudentsQuery,
  useUpdateSeminaryGradeRecordMutation,
} from "@/features/seminary/seminary.hooks";
import type {
  SeminaryGradeCriteriaWeights,
  SeminaryGradeRecordPayload,
  SeminaryGradeRecordRemark,
  SeminaryGradeRecordStatus,
  SeminaryGradeScaleRow,
} from "@/features/seminary/seminary.types";
import { useToast } from "@/hooks/use-toast";

type Step = 0 | 1 | 2;
type EntryMode = "single" | "bulk";
type GradeComponent = "attendance" | "coursework" | "exam";

type SubjectOption = {
  courseCode: string;
  courseName: string;
  name: string;
  program: string;
};

type StudentGradeRow = {
  attendance: string;
  coursework: string;
  exam: string;
  finalGrade: string;
  notes: string;
  remarks: SeminaryGradeRecordRemark;
  selected: boolean;
  studentApplicationId: string;
  studentId: string;
  studentName: string;
};

const defaultWeights = {
  attendance: 20,
  coursework: 40,
  exam: 40,
} satisfies SeminaryGradeCriteriaWeights;

const statusOptions: Array<{
  label: string;
  value: SeminaryGradeRecordStatus;
}> = [
  { label: "Complete", value: "COMPLETE" },
  { label: "Pending Review", value: "PENDING_REVIEW" },
  { label: "In Progress", value: "IN_PROGRESS" },
  { label: "Incomplete", value: "INCOMPLETE" },
];

const normalizeProgram = (program?: string | null) => {
  if (program === "BACHELOR") return "Bachelor";
  if (program === "MASTER_WITH_THESIS") return "Masteral";
  if (program === "DOCTORATE_WITH_DISSERTATION") return "Doctorate";
  return "Certificate";
};

const numberOrZero = (value: string) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

const parseRange = (range: string) => {
  const normalized = range.toLowerCase();
  if (normalized.includes("below")) {
    const match = normalized.match(/\d+/);
    return { max: match ? Number(match[0]) - 0.01 : 74.99, min: 0 };
  }

  const [min, max] = range.match(/\d+(\.\d+)?/g)?.map(Number) ?? [];
  return {
    max: max ?? min ?? 100,
    min: min ?? 0,
  };
};

const equivalentFromPercentage = (
  percentage: number,
  scale: SeminaryGradeScaleRow[] | undefined,
) => {
  const row = (scale ?? []).find((scaleRow) => {
    const range = parseRange(scaleRow.percentageRange);
    return percentage >= range.min && percentage <= range.max;
  });

  return row?.equivalent ?? (percentage >= 75 ? "3.00" : "5.00");
};

const remarkFromGrade = (
  finalGrade: string,
  passingEquivalent: string,
  showConditionalRemark: boolean,
): SeminaryGradeRecordRemark => {
  const grade = Number(finalGrade);
  const passing = Number(passingEquivalent);

  if (!Number.isFinite(grade)) return "ONGOING";
  if (Number.isFinite(passing) && grade <= passing) return "PASSED";
  if (showConditionalRemark && grade < 5) return "CONDITIONAL";
  return "FAILED";
};

const componentNote = (row: StudentGradeRow, weightProfile: string) =>
  [
    `Grade components (${weightProfile})`,
    `Attendance: ${row.attendance || "0"}`,
    `Coursework: ${row.coursework || "0"}`,
    `Exam: ${row.exam || "0"}`,
    row.notes.trim() ? `Notes: ${row.notes.trim()}` : "",
  ]
    .filter(Boolean)
    .join("\n");

const GradeHeader = ({
  children,
  description,
}: {
  children: string;
  description: string;
}) => (
  <span className="inline-flex items-center gap-1.5">
    {children}
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          type="button"
          className="text-muted-foreground hover:text-foreground"
          aria-label={`${children} help`}
        >
          <Info className="size-3.5" />
        </button>
      </TooltipTrigger>
      <TooltipContent className="max-w-64" side="top">
        {description}
      </TooltipContent>
    </Tooltip>
  </span>
);

const Page = () => {
  const params = useParams<{ gradeId: string }>();
  const router = useRouter();
  const { toast } = useToast();
  const gradeId = params.gradeId;
  const isCreate = gradeId === "new";
  const [step, setStep] = useState<Step>(0);
  const [mode, setMode] = useState<EntryMode>("bulk");
  const [subject, setSubject] = useState("");
  const [term, setTerm] = useState("Final");
  const [status, setStatus] =
    useState<SeminaryGradeRecordStatus>("PENDING_REVIEW");
  const [rows, setRows] = useState<StudentGradeRow[]>([]);
  const [batchScores, setBatchScores] = useState<Record<GradeComponent, string>>({
    attendance: "",
    coursework: "",
    exam: "",
  });

  const { data: currentUser } = useCurrentUserQuery();
  const coursesQuery = useSeminaryCoursesQuery({ limit: 100, page: 1 });
  const studentsQuery = useSeminaryStudentsQuery({ limit: 200, page: 1 });
  const configurationQuery = useSeminaryGradeConfigurationQuery();
  const recordQuery = useSeminaryGradeRecordQuery(gradeId, {
    enabled: !isCreate,
  });
  const recordsQuery = useSeminaryGradeRecordsQuery({
    limit: 100,
    page: 1,
  });
  const createMutation = useCreateSeminaryGradeRecordMutation();
  const updateMutation = useUpdateSeminaryGradeRecordMutation();
  const currentName = currentUser?.name ?? "";
  const configuration = configurationQuery.data?.data;
  const weights = configuration?.criteriaWeights ?? defaultWeights;

  const subjectOptions = useMemo<SubjectOption[]>(() => {
    const isInstructor = currentUser?.role === "INSTRUCTOR";

    return (coursesQuery.data?.data ?? [])
      .flatMap((course) =>
        (course.subjects ?? []).map((courseSubject) => ({
          courseCode: course.courseCode,
          courseName: course.courseName,
          name: courseSubject.subjectName,
          professor: courseSubject.professor,
          program: normalizeProgram(course.program),
        })),
      )
      .filter(
        (option) =>
          !isInstructor ||
          option.professor.toLowerCase() === currentName.toLowerCase(),
      )
      .sort((first, second) => first.name.localeCompare(second.name));
  }, [coursesQuery.data?.data, currentName, currentUser?.role]);

  const selectedSubject = subjectOptions.find((option) => option.name === subject);

  const studentOptions = useMemo(
    () =>
      (studentsQuery.data?.data ?? [])
        .filter((student) => student.studentId)
        .filter(
          (student) =>
            !selectedSubject ||
            normalizeProgram(student.programLevel) === selectedSubject.program,
        )
        .map((student) => ({
          id: student.id,
          studentId: student.studentId ?? student.id,
          studentName:
            [student.givenName, student.middleName, student.surname]
              .filter(Boolean)
              .join(" ")
              .replace(/\s+/g, " ")
              .trim() || student.studentId || student.id,
        })),
    [selectedSubject, studentsQuery.data?.data],
  );

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    if (isCreate) {
      setSubject((current) => current || subjectOptions[0]?.name || "");
      return;
    }

    const record = recordQuery.data?.data;
    if (!record) return;

    setMode("single");
    setSubject(record.subject);
    setTerm(record.term);
    setStatus(record.status);
    setRows([
      {
        attendance: "",
        coursework: "",
        exam: "",
        finalGrade: record.finalGrade,
        notes: record.notes ?? "",
        remarks: record.remarks,
        selected: true,
        studentApplicationId: record.studentApplicationId ?? "",
        studentId: record.studentId,
        studentName: record.studentName,
      },
    ]);
  }, [isCreate, recordQuery.data?.data, subjectOptions]);

  useEffect(() => {
    if (!isCreate || !subject) return;

    setRows((current) => {
      const currentById = new Map(
        current.map((row) => [row.studentApplicationId, row]),
      );

      return studentOptions.map((student, index) => ({
        attendance: currentById.get(student.id)?.attendance ?? "",
        coursework: currentById.get(student.id)?.coursework ?? "",
        exam: currentById.get(student.id)?.exam ?? "",
        finalGrade: currentById.get(student.id)?.finalGrade ?? "",
        notes: currentById.get(student.id)?.notes ?? "",
        remarks: currentById.get(student.id)?.remarks ?? "ONGOING",
        selected:
          currentById.get(student.id)?.selected ?? (mode === "single" ? index === 0 : true),
        studentApplicationId: student.id,
        studentId: student.studentId,
        studentName: student.studentName,
      }));
    });
  }, [isCreate, mode, studentOptions, subject]);
  /* eslint-enable react-hooks/set-state-in-effect */

  const selectedRows = rows.filter((row) => row.selected);
  const progressValue = step === 0 ? 33 : step === 1 ? 66 : 100;

  const updateRow = (studentApplicationId: string, patch: Partial<StudentGradeRow>) => {
    setRows((current) =>
      current.map((row) =>
        row.studentApplicationId === studentApplicationId
          ? { ...row, ...patch }
          : row,
      ),
    );
  };

  const recalculateRow = (row: StudentGradeRow) => {
    const percentage =
      (numberOrZero(row.attendance) * weights.attendance +
        numberOrZero(row.coursework) * weights.coursework +
        numberOrZero(row.exam) * weights.exam) /
      100;
    const finalGrade = equivalentFromPercentage(
      percentage,
      configuration?.gradeScale,
    );

    return {
      finalGrade,
      remarks: remarkFromGrade(
        finalGrade,
        configuration?.passingEquivalent ?? "2.50",
        configuration?.showConditionalRemark ?? true,
      ),
    };
  };

  const updateScore = (
    studentApplicationId: string,
    field: GradeComponent,
    value: string,
  ) => {
    setRows((current) =>
      current.map((row) => {
        if (row.studentApplicationId !== studentApplicationId) return row;
        const nextRow = { ...row, [field]: value };
        return { ...nextRow, ...recalculateRow(nextRow) };
      }),
    );
  };

  const applyBatchScores = () => {
    const patch = Object.fromEntries(
      Object.entries(batchScores).filter(([, value]) => value.trim()),
    ) as Partial<Record<GradeComponent, string>>;

    if (!Object.keys(patch).length) {
      toast({
        title: "No batch score",
        description: "Enter at least one percentage score to apply.",
        variant: "error",
      });
      return;
    }

    setRows((current) =>
      current.map((row) => {
        if (!row.selected) return row;
        const nextRow = { ...row, ...patch };
        return { ...nextRow, ...recalculateRow(nextRow) };
      }),
    );
  };

  const validateStep = () => {
    if (step === 0) return Boolean(subject && term && status);
    if (step === 1) {
      return selectedRows.length > 0 && selectedRows.every((row) => row.finalGrade);
    }
    return true;
  };

  const saveRecords = async () => {
    if (!validateStep()) {
      toast({
        title: "Incomplete grade entries",
        description: "Select students and enter scores before saving.",
        variant: "error",
      });
      return;
    }

    try {
      if (isCreate) {
        await Promise.all(
          selectedRows.map((row) => {
            const existing = (recordsQuery.data?.data ?? []).find(
              (record) =>
                record.studentApplicationId === row.studentApplicationId &&
                record.subject === subject &&
                record.term === term,
            );
            const payload = toPayload(row);

            return existing
              ? updateMutation.mutateAsync({ id: existing.id, payload })
              : createMutation.mutateAsync(payload);
          }),
        );
      } else if (selectedRows[0]) {
        await updateMutation.mutateAsync({
          id: gradeId,
          payload: toPayload(selectedRows[0]),
        });
      }

      toast({
        title: isCreate ? "Grades saved" : "Grade updated",
        description: `${selectedRows.length} grade record${
          selectedRows.length === 1 ? "" : "s"
        } saved.`,
        variant: "success",
      });
      router.push("/portal/grade/records");
      router.refresh();
    } catch (error) {
      const apiError = toApiError(error);
      toast({
        title: "Save failed",
        description: apiError.message ?? "Unable to save grade records.",
        variant: "error",
      });
    }
  };

  const toPayload = (row: StudentGradeRow): SeminaryGradeRecordPayload => ({
    finalGrade: row.finalGrade,
    notes: componentNote(row, configuration?.weightProfile ?? "Standard Coursework"),
    remarks: row.remarks,
    status,
    studentApplicationId: row.studentApplicationId,
    subject,
    term,
  });

  const saving = createMutation.isPending || updateMutation.isPending;

  return (
    <section className="space-y-6 p-10">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
        <div className="space-y-2">
          <Button asChild variant="ghost" className="-ml-3">
            <Link href="/portal/grade/records">
              <ArrowLeft className="size-4" />
              Back to grade records
            </Link>
          </Button>
          <h1 className="font-serif text-4xl text-emerald-950 dark:text-emerald-50">
            {isCreate ? "Create Grade Records" : "Update Grade Record"}
          </h1>
          <p className="text-sm leading-6 text-muted-foreground">
            Use active grade configuration to compute final equivalents for assigned subjects.
          </p>
        </div>

        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/admin/dashboard">Dashboard</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/portal/grade/records">Grade Records</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{isCreate ? "Create" : "Edit"}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <Card className="border-emerald-950/10 shadow-sm">
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between gap-3 text-sm">
              <span className={step === 0 ? "font-medium" : "text-muted-foreground"}>
                1. Setup
              </span>
              <span className={step === 1 ? "font-medium" : "text-muted-foreground"}>
                2. Mark Students
              </span>
              <span className={step === 2 ? "font-medium" : "text-muted-foreground"}>
                3. Review
              </span>
            </div>
            <Progress value={progressValue} />
          </div>

          {step === 0 ? (
            <div className="grid gap-5 lg:grid-cols-2">
              <Field>
                <FieldLabel>Entry Mode</FieldLabel>
                <Select
                  value={mode}
                  onValueChange={(value) => setMode(value as EntryMode)}
                  disabled={!isCreate}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select entry mode" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="single">Single student</SelectItem>
                    <SelectItem value="bulk">Bulk add grades</SelectItem>
                  </SelectContent>
                </Select>
              </Field>

              <Field>
                <FieldLabel>Subject</FieldLabel>
                <Select value={subject} onValueChange={setSubject} disabled={!isCreate}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select assigned subject" />
                  </SelectTrigger>
                  <SelectContent>
                    {subjectOptions.map((option) => (
                      <SelectItem key={`${option.courseCode}-${option.name}`} value={option.name}>
                        {option.name} ({option.courseCode})
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

              <div className="rounded-md border bg-muted/30 p-4 lg:col-span-2">
                <div className="flex items-center gap-2 font-medium">
                  <UsersRound className="size-4 text-emerald-700" />
                  Configuration Match
                </div>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  Profile: {configuration?.weightProfile ?? "Standard Coursework"}.
                  Weights: Attendance {weights.attendance}%, Coursework{" "}
                  {weights.coursework}%, Exam {weights.exam}%. Passing equivalent:{" "}
                  {configuration?.passingEquivalent ?? "2.50"}.
                </p>
              </div>
            </div>
          ) : null}

          {step === 1 ? (
            <div className="space-y-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-medium">Student Marks</p>
                  <p className="text-sm text-muted-foreground">
                    {selectedRows.length} selected from {rows.length} eligible
                    students. Enter percentage scores from 0 to 100 for each
                    criterion. Final grade auto-computes from grade configuration.
                  </p>
                </div>
                {isCreate && mode === "bulk" ? (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      const allSelected = rows.every((row) => row.selected);
                      setRows((current) =>
                        current.map((row) => ({ ...row, selected: !allSelected })),
                      );
                    }}
                  >
                    Toggle all
                  </Button>
                ) : null}
              </div>

              <div className="rounded-md border bg-muted/30 p-4">
                <div className="grid gap-5 2xl:grid-cols-[minmax(18rem,1fr)_auto] 2xl:items-end">
                  <div className="max-w-2xl space-y-1">
                    <p className="font-medium">Batch apply scores</p>
                    <p className="text-sm text-muted-foreground">
                      Enter shared percentage scores, then apply to selected
                      students. Empty fields will not replace existing values.
                    </p>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-[9rem_9rem_9rem_auto] lg:items-end">
                    {(["attendance", "coursework", "exam"] as const).map(
                      (field) => (
                        <Field key={field}>
                          <FieldLabel className="capitalize">{field}</FieldLabel>
                          <Input
                            className="w-full"
                            min={0}
                            max={100}
                            placeholder="0-100"
                            type="number"
                            value={batchScores[field]}
                            onChange={(event) =>
                              setBatchScores((current) => ({
                                ...current,
                                [field]: event.target.value,
                              }))
                            }
                          />
                        </Field>
                      ),
                    )}
                    <Button
                      type="button"
                      className="w-full whitespace-nowrap lg:w-auto"
                      onClick={applyBatchScores}
                      disabled={!selectedRows.length}
                    >
                      Apply to selected
                    </Button>
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12" />
                      <TableHead>Student</TableHead>
                      <TableHead>
                        <GradeHeader description="Enter student attendance score as a percentage from 0 to 100. This uses the Attendance weight from Grade Configuration.">
                          Attendance
                        </GradeHeader>
                      </TableHead>
                      <TableHead>
                        <GradeHeader description="Enter quizzes, activities, participation, or class work score as a percentage from 0 to 100. This uses the Coursework weight.">
                          Coursework
                        </GradeHeader>
                      </TableHead>
                      <TableHead>
                        <GradeHeader description="Enter examination score as a percentage from 0 to 100. This uses the Exam weight.">
                          Exam
                        </GradeHeader>
                      </TableHead>
                      <TableHead>
                        <GradeHeader description="Auto-computed equivalent grade from the weighted percentage and grade matrix. You may override manually if needed.">
                          Final
                        </GradeHeader>
                      </TableHead>
                      <TableHead>
                        <GradeHeader description="Auto-set from final grade and passing equivalent in Grade Configuration.">
                          Remarks
                        </GradeHeader>
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {rows.map((row) => (
                      <TableRow key={row.studentApplicationId}>
                        <TableCell>
                          <Checkbox
                            checked={row.selected}
                            disabled={!isCreate}
                            onCheckedChange={(checked) => {
                              if (mode === "single") {
                                setRows((current) =>
                                  current.map((currentRow) => ({
                                    ...currentRow,
                                    selected:
                                      currentRow.studentApplicationId ===
                                      row.studentApplicationId,
                                  })),
                                );
                                return;
                              }
                              updateRow(row.studentApplicationId, {
                                selected: Boolean(checked),
                              });
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <div className="min-w-52">
                            <div className="font-medium">{row.studentName}</div>
                            <div className="text-xs text-muted-foreground">
                              {row.studentId}
                            </div>
                          </div>
                        </TableCell>
                        {(["attendance", "coursework", "exam"] as const).map((field) => (
                          <TableCell key={field}>
                            <Input
                              className="w-24"
                              min={0}
                              max={100}
                              placeholder="0-100"
                              type="number"
                              value={row[field]}
                              onChange={(event) =>
                                updateScore(
                                  row.studentApplicationId,
                                  field,
                                  event.target.value,
                                )
                              }
                            />
                          </TableCell>
                        ))}
                        <TableCell>
                          <Input
                            className="w-24"
                            placeholder="e.g. 1.50"
                            value={row.finalGrade}
                            onChange={(event) => {
                              const finalGrade = event.target.value;
                              updateRow(row.studentApplicationId, {
                                finalGrade,
                                remarks: remarkFromGrade(
                                  finalGrade,
                                  configuration?.passingEquivalent ?? "2.50",
                                  configuration?.showConditionalRemark ?? true,
                                ),
                              });
                            }}
                          />
                        </TableCell>
                        <TableCell className="min-w-32 text-sm">{row.remarks}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {selectedRows.length === 1 ? (
                <Field>
                  <FieldLabel>Notes</FieldLabel>
                  <Textarea
                    value={selectedRows[0]?.notes ?? ""}
                    onChange={(event) =>
                      updateRow(selectedRows[0].studentApplicationId, {
                        notes: event.target.value,
                      })
                    }
                    placeholder="Optional instructor note"
                    className="min-h-24"
                  />
                </Field>
              ) : null}
            </div>
          ) : null}

          {step === 2 ? (
            <div className="space-y-4">
              <div>
                <p className="font-medium">Review Grade Entries</p>
                <p className="text-sm text-muted-foreground">
                  {subject}. {selectedRows.length} record
                  {selectedRows.length === 1 ? "" : "s"} ready to save.
                </p>
              </div>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Student</TableHead>
                      <TableHead>Final Grade</TableHead>
                      <TableHead>Remarks</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedRows.map((row) => (
                      <TableRow key={row.studentApplicationId}>
                        <TableCell>
                          <div className="font-medium">{row.studentName}</div>
                          <div className="text-xs text-muted-foreground">
                            {row.studentId}
                          </div>
                        </TableCell>
                        <TableCell>{row.finalGrade}</TableCell>
                        <TableCell>{row.remarks}</TableCell>
                        <TableCell>{status}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          ) : null}

          <div className="flex flex-col-reverse gap-3 border-t pt-5 sm:flex-row sm:justify-between">
            <Button
              type="button"
              variant="outline"
              disabled={step === 0}
              onClick={() => setStep((current) => (current - 1) as Step)}
            >
              <ChevronLeft className="size-4" />
              Back
            </Button>
            {step < 2 ? (
              <Button
                type="button"
                onClick={() => {
                  if (!validateStep()) {
                    toast({
                      title: "Incomplete step",
                      description: "Complete required fields before continuing.",
                      variant: "error",
                    });
                    return;
                  }
                  setStep((current) => (current + 1) as Step);
                }}
              >
                Continue
                <ChevronRight className="size-4" />
              </Button>
            ) : (
              <Button type="button" onClick={saveRecords} disabled={saving}>
                {saving ? (
                  "Saving..."
                ) : (
                  <>
                    {isCreate ? <Check className="size-4" /> : <Save className="size-4" />}
                    {isCreate ? "Save Grades" : "Save Changes"}
                  </>
                )}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </section>
  );
};

export default Page;
