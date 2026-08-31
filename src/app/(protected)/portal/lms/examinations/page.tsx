"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  BookCheck,
  CalendarCheck2,
  CheckSquare,
  ClipboardCheck,
  ExternalLink,
  Filter,
  PlayCircle,
  Plus,
} from "lucide-react";
import type { Row } from "@tanstack/react-table";

import { GlobalDataTable } from "@/components/DataTable";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useCurrentUserQuery } from "@/features/auth/auth.hooks";
import {
  toApiError,
  useDeleteSeminaryExaminationMutation,
  useSeminaryCoursesQuery,
  useSeminaryExaminationsQuery,
  useUpdateSeminaryExaminationStatusMutation,
} from "@/features/seminary/seminary.hooks";
import type {
  SeminaryExamination,
  SeminaryExaminationStatus,
} from "@/features/seminary/seminary.types";
import { useToast } from "@/hooks/use-toast";

import { CellActions } from "./_components/cell-actions";
import {
  columns,
  examinationStatusOptions,
  examinationTypeOptions,
  type ExaminationRecord,
  type ExaminationStatus,
  type ExaminationType,
} from "./_components/columns";

type AcademicYearOption = "2024-2025" | "2025-2026";
type SubjectFilterOption = "All Subjects" | string;
type TypeFilterOption = "All Types" | ExaminationType;

const academicYearOptions: AcademicYearOption[] = ["2024-2025", "2025-2026"];
const typeFilterOptions: TypeFilterOption[] = [
  "All Types",
  ...examinationTypeOptions,
];

const statusLabelMap: Record<SeminaryExaminationStatus, ExaminationStatus> = {
  SCHEDULED: "Scheduled",
  ONGOING: "Ongoing",
  COMPLETED: "Completed",
  DRAFT: "Draft",
};

const statusValueMap: Record<ExaminationStatus, SeminaryExaminationStatus> = {
  Scheduled: "SCHEDULED",
  Ongoing: "ONGOING",
  Completed: "COMPLETED",
  Draft: "DRAFT",
};

const toExaminationRecord = (
  examination: SeminaryExamination,
  index: number,
): ExaminationRecord => ({
  id: examination.id,
  order: index + 1,
  examTitle: examination.title,
  coverage: examination.coverage,
  subject: examination.subject,
  className: examination.courseName ?? examination.courseCode ?? "General",
  examType: examination.examType,
  dateLabel: formatDateLabel(new Date(examination.scheduledAt)),
  timeLabel: formatTimeLabel(new Date(examination.scheduledAt)),
  duration: `${examination.durationMinutes} min`,
  status: statusLabelMap[examination.status],
});

const Page = () => {
  const router = useRouter();
  const { data: currentUser } = useCurrentUserQuery();
  const { toast } = useToast();
  const [academicYear, setAcademicYear] =
    useState<AcademicYearOption>("2024-2025");
  const [subjectFilter, setSubjectFilter] =
    useState<SubjectFilterOption>("All Subjects");
  const [typeFilter, setTypeFilter] = useState<TypeFilterOption>("All Types");
  const [statusFilter, setStatusFilter] = useState<
    ExaminationStatus | "All Status"
  >("All Status");
  const [previewExamination, setPreviewExamination] =
    useState<SeminaryExamination | null>(null);
  const coursesQuery = useSeminaryCoursesQuery({ limit: 100, page: 1 });
  const examinationsQuery = useSeminaryExaminationsQuery({
    limit: 100,
    page: 1,
  });
  const updateStatusMutation = useUpdateSeminaryExaminationStatusMutation();
  const deleteMutation = useDeleteSeminaryExaminationMutation();
  const currentName = currentUser?.name ?? "";

  const subjectOptions = useMemo(() => {
    const isInstructor = currentUser?.role === "INSTRUCTOR";

    return Array.from(
      new Set(
        (coursesQuery.data?.data ?? [])
          .flatMap((course) => course.subjects ?? [])
          .filter(
            (subject) =>
              !isInstructor ||
              subject.professor.toLowerCase() === currentName.toLowerCase(),
          )
          .map((subject) => subject.subjectName)
          .filter(Boolean),
      ),
    ).sort((first, second) => first.localeCompare(second));
  }, [coursesQuery.data?.data, currentName, currentUser?.role]);

  const subjectFilterOptions = useMemo<SubjectFilterOption[]>(
    () => ["All Subjects", ...subjectOptions],
    [subjectOptions],
  );
  const examinations = useMemo(
    () => (examinationsQuery.data?.data ?? []).map(toExaminationRecord),
    [examinationsQuery.data?.data],
  );

  const stats = useMemo(() => {
    const scheduled = examinations.filter(
      (exam) => exam.status === "Scheduled",
    ).length;
    const ongoing = examinations.filter((exam) => exam.status === "Ongoing")
      .length;
    const completed = examinations.filter(
      (exam) => exam.status === "Completed",
    ).length;

    return [
      {
        title: "Total Examinations",
        value: String(examinations.length),
        description: "All time",
        icon: <BookCheck className="size-6" />,
        accentClassName:
          "bg-blue-500/10 text-blue-700 dark:bg-blue-400/10 dark:text-blue-300",
      },
      {
        title: "Scheduled Exams",
        value: String(scheduled),
        description: "Upcoming exams",
        icon: <CalendarCheck2 className="size-6" />,
        accentClassName:
          "bg-emerald-500/10 text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-300",
      },
      {
        title: "Ongoing Exams",
        value: String(ongoing),
        description: "Currently active",
        icon: <PlayCircle className="size-6" />,
        accentClassName:
          "bg-amber-500/10 text-amber-700 dark:bg-amber-400/10 dark:text-amber-300",
      },
      {
        title: "Completed Exams",
        value: String(completed),
        description: "Finished exams",
        icon: <CheckSquare className="size-6" />,
        accentClassName:
          "bg-violet-500/10 text-violet-700 dark:bg-violet-400/10 dark:text-violet-300",
      },
    ];
  }, [examinations]);

  const filteredExaminations = useMemo(
    () =>
      examinations.filter((exam) => {
        const subjectMatch =
          subjectFilter === "All Subjects" || exam.subject === subjectFilter;
        const typeMatch =
          typeFilter === "All Types" || exam.examType === typeFilter;
        const statusMatch =
          statusFilter === "All Status" || exam.status === statusFilter;

        return subjectMatch && typeMatch && statusMatch;
      }),
    [examinations, statusFilter, subjectFilter, typeFilter],
  );

  const handleChangeStatus = async (
    targetRecord: ExaminationRecord,
    status: ExaminationStatus,
  ) => {
    try {
      await updateStatusMutation.mutateAsync({
        id: targetRecord.id,
        status: statusValueMap[status],
      });
      toast({
        title: "Examination status updated",
        description: `${targetRecord.examTitle} is now ${status.toLowerCase()}.`,
        variant: "success",
      });
      await examinationsQuery.refetch();
      router.refresh();
    } catch (error) {
      const apiError = toApiError(error);
      toast({
        title: "Status update failed",
        description: apiError.message ?? "Unable to update examination status.",
        variant: "error",
      });
    }
  };

  const handleDelete = async (targetRecord: ExaminationRecord) => {
    try {
      await deleteMutation.mutateAsync(targetRecord.id);
      toast({
        title: "Examination deleted",
        description: `${targetRecord.examTitle} was removed.`,
        variant: "success",
      });
      await examinationsQuery.refetch();
      router.refresh();
    } catch (error) {
      const apiError = toApiError(error);
      toast({
        title: "Delete failed",
        description: apiError.message ?? "Unable to delete examination.",
        variant: "error",
      });
    }
  };

  const renderCellActions = (row: Row<ExaminationRecord>) => (
    <CellActions
      data={row.original}
      onPreview={(record) => {
        const examination = examinationsQuery.data?.data.find(
          (item) => item.id === record.id,
        );
        if (examination) setPreviewExamination(examination);
      }}
      onEdit={(record) => router.push(`/portal/lms/examinations/${record.id}`)}
      onDelete={handleDelete}
      onChangeStatus={handleChangeStatus}
    />
  );

  return (
    <section className="space-y-6 p-10">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight text-blue-950 dark:text-blue-100">
            Examinations
          </h1>
          <p className="text-sm text-muted-foreground">
            Create, manage and evaluate online examinations.
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
              <BreadcrumbPage>Learning Management System</BreadcrumbPage>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Examinations</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <Card
            key={stat.title}
            className="border-border/70 bg-white py-0 shadow-sm"
          >
            <CardContent className="flex items-start gap-4 p-5">
              <div
                className={`flex size-13 items-center justify-center rounded-lg ${stat.accentClassName}`}
              >
                {stat.icon}
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-slate-500">
                  {stat.title}
                </p>
                <p className="text-4xl font-semibold tracking-tight text-slate-900">
                  {stat.value}
                </p>
                <p className="text-xs text-slate-500">{stat.description}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-border/70 shadow-sm">
        <CardContent className="space-y-5">
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            <div className="space-y-2">
              <p className="text-sm font-medium text-foreground">
                Academic Year
              </p>
              <Select
                value={academicYear}
                onValueChange={(value) =>
                  setAcademicYear(value as AcademicYearOption)
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select academic year" />
                </SelectTrigger>
                <SelectContent>
                  {academicYearOptions.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium text-foreground">Subject</p>
              <Select
                value={subjectFilter}
                onValueChange={(value) =>
                  setSubjectFilter(value as SubjectFilterOption)
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select subject" />
                </SelectTrigger>
                <SelectContent>
                  {subjectFilterOptions.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium text-foreground">Exam Type</p>
              <Select
                value={typeFilter}
                onValueChange={(value) =>
                  setTypeFilter(value as TypeFilterOption)
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select exam type" />
                </SelectTrigger>
                <SelectContent>
                  {typeFilterOptions.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium text-foreground">Status</p>
              <Select
                value={statusFilter}
                onValueChange={(value) =>
                  setStatusFilter(value as ExaminationStatus | "All Status")
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All Status">All Status</SelectItem>
                  {examinationStatusOptions.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <GlobalDataTable
            columns={columns}
            data={filteredExaminations}
            cellAction={renderCellActions}
            exportFileName="examinations"
            filterPlaceholder="Search examinations..."
            emptyMessage="No examinations found."
            pageSizeOptions={[7, 10, 20]}
            toolbarActions={
              <>
                <Button variant="outline">
                  <Filter className="size-4" />
                  Filters
                </Button>
                <Button asChild>
                  <Link href="/portal/lms/examinations/new">
                    <Plus className="size-4" />
                    Create Examination
                  </Link>
                </Button>
              </>
            }
            onDeleteSelected={async (selectedRows) => {
              await Promise.all(
                selectedRows.map((exam) => deleteMutation.mutateAsync(exam.id)),
              );
              await examinationsQuery.refetch();
            }}
          />
        </CardContent>
      </Card>

      <Card className="border-border/70 bg-blue-50/60 py-0 shadow-sm">
        <CardContent className="flex flex-col gap-4 p-5 md:flex-row md:items-center md:justify-between">
          <div className="flex items-start gap-3">
            <div className="flex size-10 items-center justify-center rounded-full bg-blue-600 text-white">
              <ClipboardCheck className="size-5" />
            </div>
            <div className="space-y-1">
              <p className="font-medium text-slate-900">Examination Workflow</p>
              <p className="text-sm text-slate-600">
                Create exam, add questions, assign to seminarians, publish,
                evaluate, and release results.
              </p>
            </div>
          </div>

          <Button variant="outline" className="border-blue-200 bg-white">
            View Workflow Guide
            <ExternalLink className="size-4" />
          </Button>
        </CardContent>
      </Card>

      <ExaminationPreviewSheet
        examination={previewExamination}
        onOpenChange={(open) => {
          if (!open) setPreviewExamination(null);
        }}
      />
    </section>
  );
};

export default Page;

const formatDateLabel = (value: Date) =>
  new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(value);

const formatTimeLabel = (value: Date) =>
  new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
  }).format(value);

const ExaminationPreviewSheet = ({
  examination,
  onOpenChange,
}: {
  examination: SeminaryExamination | null;
  onOpenChange: (open: boolean) => void;
}) => {
  if (!examination) return null;

  const details = [
    { label: "Subject", value: examination.subject },
    {
      label: "Course",
      value: examination.courseName ?? examination.courseCode ?? "General",
    },
    { label: "Instructor", value: examination.instructorName },
    { label: "Exam Type", value: examination.examType },
    { label: "Coverage", value: examination.coverage },
    {
      label: "Schedule",
      value: `${formatDateLabel(new Date(examination.scheduledAt))} ${formatTimeLabel(
        new Date(examination.scheduledAt),
      )}`,
    },
    { label: "Duration", value: `${examination.durationMinutes} min` },
    { label: "Total Points", value: examination.totalPoints },
    { label: "Passing Score", value: examination.passingScore },
    {
      label: "Randomize Questions",
      value: examination.randomizeQuestions ? "Yes" : "No",
    },
    { label: "Show Results", value: examination.showResults ? "Yes" : "No" },
  ];

  return (
    <Sheet open={Boolean(examination)} onOpenChange={onOpenChange}>
      <SheetContent className="w-full overflow-y-auto sm:max-w-xl">
        <SheetHeader className="border-b">
          <SheetTitle>{examination.title}</SheetTitle>
          <SheetDescription>
            {examination.subject} - {examination.examType}
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-5 px-4">
          <div className="flex items-center justify-between rounded-md border px-4 py-3">
            <span className="text-sm text-muted-foreground">Status</span>
            <Badge>{statusLabelMap[examination.status]}</Badge>
          </div>

          <div className="divide-y rounded-md border">
            {details.map((detail) => (
              <PreviewRow
                key={detail.label}
                label={detail.label}
                value={detail.value}
              />
            ))}
          </div>

          {examination.instructions ? (
            <div className="space-y-2">
              <p className="text-sm font-medium">Instructions</p>
              <p className="rounded-md border bg-slate-50 p-3 text-sm text-muted-foreground">
                {examination.instructions}
              </p>
            </div>
          ) : null}

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">Questions</p>
              <span className="text-sm text-muted-foreground">
                {examination.questions.length} item(s)
              </span>
            </div>

            <div className="space-y-3">
              {examination.questions.map((question, index) => (
                <div key={question.id} className="rounded-md border p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <p className="text-sm font-medium">
                        Question {index + 1}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {question.prompt}
                      </p>
                    </div>
                    <span className="text-sm font-medium">
                      {question.points} pts
                    </span>
                  </div>

                  {question.options?.length ? (
                    <div className="mt-3 grid gap-2 text-sm">
                      {question.options.map((option, optionIndex) => (
                        <p key={`${question.id}-${optionIndex}`}>
                          {optionIndex + 1}. {option}
                        </p>
                      ))}
                    </div>
                  ) : null}

                  {question.answer ? (
                    <p className="mt-3 text-sm">
                      <span className="font-medium">Answer:</span>{" "}
                      {question.answer}
                    </p>
                  ) : null}
                </div>
              ))}
            </div>
          </div>
        </div>

        <SheetFooter className="border-t">
          <SheetClose asChild>
            <Button variant="outline">Close</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

const PreviewRow = ({ label, value }: { label: string; value: string }) => (
  <div className="flex items-start justify-between gap-4 px-4 py-3 text-sm">
    <p className="text-muted-foreground">{label}</p>
    <p className="max-w-64 break-words text-right font-medium">{value}</p>
  </div>
);
