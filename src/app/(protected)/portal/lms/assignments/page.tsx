"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  BookOpen,
  CheckCircle2,
  FileCheck2,
  Filter,
  Hourglass,
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
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCurrentUserQuery } from "@/features/auth/auth.hooks";
import {
  toApiError,
  useCreateSeminaryAssignmentMutation,
  useDeleteSeminaryAssignmentMutation,
  useSeminaryAssignmentsQuery,
  useSeminaryCoursesQuery,
  useUpdateSeminaryAssignmentMutation,
  useUpdateSeminaryAssignmentStatusMutation,
} from "@/features/seminary/seminary.hooks";
import type {
  SeminaryAssignment,
  SeminaryAssignmentPayload,
  SeminaryAssignmentStatus,
} from "@/features/seminary/seminary.types";
import { useToast } from "@/hooks/use-toast";

import {
  AssignmentDialog,
  type AssignmentDialogValues,
  formatTimeLabel,
} from "./_components/assignment-dialog";
import { CellActions } from "./_components/cell-actions";
import {
  assignmentStatusOptions,
  columns,
  type AssignmentRecord,
  type AssignmentStatus,
  type AssignmentType,
} from "./_components/columns";

type AcademicYearOption = "2024-2025" | "2025-2026";
type SubjectFilterOption = "All Subjects" | string;

const academicYearOptions: AcademicYearOption[] = ["2024-2025", "2025-2026"];

const assignmentStatusLabelMap: Record<
  SeminaryAssignmentStatus,
  AssignmentStatus
> = {
  PUBLISHED: "Published",
  DRAFT: "Draft",
  SCHEDULED: "Scheduled",
};

const assignmentStatusValueMap: Record<
  AssignmentStatus,
  SeminaryAssignmentStatus
> = {
  Published: "PUBLISHED",
  Draft: "DRAFT",
  Scheduled: "SCHEDULED",
};

const toAssignmentRecord = (
  assignment: SeminaryAssignment,
  index: number,
): AssignmentRecord => ({
  id: assignment.id,
  order: index + 1,
  title: assignment.title,
  description: assignment.description,
  subject: assignment.subject,
  instructor: assignment.instructorName,
  assignmentType: assignment.assignmentType as AssignmentType,
  dueDate: formatDateLabel(new Date(assignment.dueAt)),
  dueTime: formatTimeLabel(formatTimeValue(new Date(assignment.dueAt))),
  status: assignmentStatusLabelMap[assignment.status],
  submittedText: "0 / 0",
  submissionRate: "0%",
  totalMarks: assignment.totalMarks,
  additionalInstructions: assignment.additionalInstructions ?? "",
  allowLateSubmission: assignment.allowLateSubmission,
  lateSubmissionDeadline: assignment.lateSubmissionDeadline ?? "",
  notifyStudents: assignment.notifyStudents,
  attachmentLabel: assignment.attachmentLabel ?? "",
});

const toAssignmentPayload = (
  values: AssignmentDialogValues,
): SeminaryAssignmentPayload => ({
  title: values.title,
  description: values.description,
  subject: values.subject,
  assignmentType: values.assignmentType,
  dueAt: values.dueAt.toISOString(),
  totalMarks: values.totalMarks,
  additionalInstructions: values.additionalInstructions ?? undefined,
  allowLateSubmission: values.allowLateSubmission,
  lateSubmissionDeadline: values.allowLateSubmission
    ? values.lateSubmissionDeadline?.toISOString()
    : undefined,
  notifyStudents: values.notifyStudents,
  attachmentLabel: values.attachmentLabel || undefined,
});

const Page = () => {
  const router = useRouter();
  const { data: currentUser } = useCurrentUserQuery();
  const { toast } = useToast();
  const [academicYear, setAcademicYear] =
    useState<AcademicYearOption>("2024-2025");
  const [subjectFilter, setSubjectFilter] =
    useState<SubjectFilterOption>("All Subjects");
  const [statusFilter, setStatusFilter] = useState<
    AssignmentStatus | "All Status"
  >("All Status");
  const [assignmentDialogOpen, setAssignmentDialogOpen] = useState(false);
  const [previewAssignment, setPreviewAssignment] =
    useState<AssignmentRecord | null>(null);
  const [selectedAssignment, setSelectedAssignment] =
    useState<AssignmentRecord | null>(null);
  const coursesQuery = useSeminaryCoursesQuery({ limit: 100, page: 1 });
  const assignmentsQuery = useSeminaryAssignmentsQuery({ limit: 100, page: 1 });
  const createAssignmentMutation = useCreateSeminaryAssignmentMutation();
  const updateAssignmentMutation = useUpdateSeminaryAssignmentMutation();
  const updateAssignmentStatusMutation =
    useUpdateSeminaryAssignmentStatusMutation();
  const deleteAssignmentMutation = useDeleteSeminaryAssignmentMutation();
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
  const assignments = useMemo(
    () => (assignmentsQuery.data?.data ?? []).map(toAssignmentRecord),
    [assignmentsQuery.data?.data],
  );

  const stats = useMemo(() => {
    const now = new Date();
    const weekEnd = new Date(now);
    weekEnd.setDate(now.getDate() + 7);
    const published = assignments.filter(
      (assignment) => assignment.status === "Published",
    ).length;
    const dueThisWeek = assignments.filter((assignment) => {
      const dueAt = new Date(`${assignment.dueDate} ${assignment.dueTime}`);
      return dueAt >= now && dueAt <= weekEnd;
    }).length;

    return [
      {
        title: "Total Assignments",
        value: String(assignments.length),
        description: "All time",
        icon: <BookOpen className="size-6" />,
        accentClassName:
          "bg-blue-500/10 text-blue-700 dark:bg-blue-400/10 dark:text-blue-300",
      },
      {
        title: "Published",
        value: String(published),
        description: "Active assignments",
        icon: <CheckCircle2 className="size-6" />,
        accentClassName:
          "bg-emerald-500/10 text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-300",
      },
      {
        title: "Due This Week",
        value: String(dueThisWeek),
        description: "Upcoming deadlines",
        icon: <Hourglass className="size-6" />,
        accentClassName:
          "bg-amber-500/10 text-amber-700 dark:bg-amber-400/10 dark:text-amber-300",
      },
      {
        title: "Submitted",
        value: "0",
        description: "Total submissions",
        icon: <FileCheck2 className="size-6" />,
        accentClassName:
          "bg-violet-500/10 text-violet-700 dark:bg-violet-400/10 dark:text-violet-300",
      },
    ];
  }, [assignments]);

  const filteredAssignments = useMemo(
    () =>
      assignments.filter((assignment) => {
        const subjectMatch =
          subjectFilter === "All Subjects" ||
          assignment.subject === subjectFilter;
        const statusMatch =
          statusFilter === "All Status" || assignment.status === statusFilter;

        return subjectMatch && statusMatch;
      }),
    [assignments, subjectFilter, statusFilter],
  );

  const handleChangeStatus = async (
    targetRecord: AssignmentRecord,
    status: AssignmentStatus,
  ) => {
    try {
      await updateAssignmentStatusMutation.mutateAsync({
        id: targetRecord.id,
        status: assignmentStatusValueMap[status],
      });
      toast({
        title: "Assignment status updated",
        description: `${targetRecord.title} is now ${status.toLowerCase()}.`,
        variant: "success",
      });
      await assignmentsQuery.refetch();
      router.refresh();
    } catch (error) {
      const apiError = toApiError(error);
      toast({
        title: "Status update failed",
        description: apiError.message ?? "Unable to update assignment status.",
        variant: "error",
      });
    }
  };

  const handleDelete = async (targetRecord: AssignmentRecord) => {
    try {
      await deleteAssignmentMutation.mutateAsync(targetRecord.id);
      toast({
        title: "Assignment deleted",
        description: `${targetRecord.title} was removed.`,
        variant: "success",
      });
      await assignmentsQuery.refetch();
      router.refresh();
    } catch (error) {
      const apiError = toApiError(error);
      toast({
        title: "Delete failed",
        description: apiError.message ?? "Unable to delete assignment.",
        variant: "error",
      });
    }
  };

  const handleOpenCreate = () => {
    setSelectedAssignment(null);
    setAssignmentDialogOpen(true);
  };

  const handleOpenEdit = (record: AssignmentRecord) => {
    setSelectedAssignment(record);
    setAssignmentDialogOpen(true);
  };

  const handleSubmitAssignment = async (values: AssignmentDialogValues) => {
    try {
      const payload = toAssignmentPayload(values);

      if (selectedAssignment) {
        await updateAssignmentMutation.mutateAsync({
          id: selectedAssignment.id,
          payload: {
            ...payload,
            status: assignmentStatusValueMap[selectedAssignment.status],
          },
        });
      } else {
        await createAssignmentMutation.mutateAsync({
          ...payload,
          status: "DRAFT",
        });
      }

      toast({
        title: selectedAssignment ? "Assignment updated" : "Assignment created",
        description: `${values.title} was saved.`,
        variant: "success",
      });
      setAssignmentDialogOpen(false);
      setSelectedAssignment(null);
      await assignmentsQuery.refetch();
      router.refresh();
    } catch (error) {
      const apiError = toApiError(error);
      toast({
        title: selectedAssignment ? "Update failed" : "Create failed",
        description: apiError.message ?? "Unable to save assignment.",
        variant: "error",
      });
    }
  };

  const renderCellActions = (row: Row<AssignmentRecord>) => (
    <CellActions
      data={row.original}
      onPreview={setPreviewAssignment}
      onEdit={handleOpenEdit}
      onDelete={handleDelete}
      onChangeStatus={handleChangeStatus}
    />
  );

  return (
    <section className="space-y-6 p-10">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight text-blue-950 dark:text-blue-100">
            Assignments
          </h1>
          <p className="text-sm text-muted-foreground">
            Create, manage and track student assignments.
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
              <BreadcrumbPage>Assignments</BreadcrumbPage>
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
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
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
              <p className="text-sm font-medium text-foreground">Status</p>
              <Select
                value={statusFilter}
                onValueChange={(value) =>
                  setStatusFilter(value as AssignmentStatus | "All Status")
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All Status">All Status</SelectItem>
                  {assignmentStatusOptions.map((option) => (
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
            data={filteredAssignments}
            cellAction={renderCellActions}
            exportFileName="assignments"
            filterPlaceholder="Search assignments..."
            emptyMessage="No assignments found."
            pageSizeOptions={[6, 10, 20]}
            toolbarActions={
              <>
                <Button variant="outline">
                  <Filter className="size-4" />
                  Filters
                </Button>
                <Button onClick={handleOpenCreate}>
                  <Plus className="size-4" />
                  Create Assignment
                </Button>
              </>
            }
            onDeleteSelected={async (selectedRows) => {
              await Promise.all(
                selectedRows.map((assignment) =>
                  deleteAssignmentMutation.mutateAsync(assignment.id),
                ),
              );
              await assignmentsQuery.refetch();
            }}
          />
        </CardContent>
      </Card>

      <AssignmentDialog
        open={assignmentDialogOpen}
        onOpenChange={(open) => {
          setAssignmentDialogOpen(open);
          if (!open) setSelectedAssignment(null);
        }}
        onSubmit={handleSubmitAssignment}
        record={selectedAssignment}
        subjectOptions={subjectOptions}
        submitting={
          createAssignmentMutation.isPending || updateAssignmentMutation.isPending
        }
      />

      <AssignmentPreviewSheet
        record={previewAssignment}
        onOpenChange={(open) => {
          if (!open) setPreviewAssignment(null);
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

const formatTimeValue = (value: Date) =>
  `${String(value.getHours()).padStart(2, "0")}:${String(
    value.getMinutes(),
  ).padStart(2, "0")}`;

const toProgressValue = (value: string) => {
  const parsed = Number(value.replace("%", ""));
  return Number.isFinite(parsed) ? parsed : 0;
};

const sanitizeAssignmentHtml = (value: string) => {
  if (typeof window === "undefined") return "";

  const allowedTags = new Set([
    "P",
    "BR",
    "STRONG",
    "B",
    "EM",
    "I",
    "U",
    "S",
    "UL",
    "OL",
    "LI",
    "BLOCKQUOTE",
    "H1",
    "H2",
    "H3",
    "H4",
    "A",
    "CODE",
    "PRE",
    "TABLE",
    "THEAD",
    "TBODY",
    "TR",
    "TH",
    "TD",
  ]);
  const template = document.createElement("template");
  template.innerHTML = value;

  template.content.querySelectorAll("*").forEach((element) => {
    if (!allowedTags.has(element.tagName)) {
      element.replaceWith(...Array.from(element.childNodes));
      return;
    }

    Array.from(element.attributes).forEach((attribute) => {
      const name = attribute.name.toLowerCase();
      const isSafeLink =
        element.tagName === "A" &&
        name === "href" &&
        /^(https?:|mailto:|\/)/i.test(attribute.value);

      if (!isSafeLink) {
        element.removeAttribute(attribute.name);
      }
    });

    if (element.tagName === "A") {
      element.setAttribute("target", "_blank");
      element.setAttribute("rel", "noreferrer");
    }
  });

  return template.innerHTML;
};

const AssignmentPreviewSheet = ({
  record,
  onOpenChange,
}: {
  record: AssignmentRecord | null;
  onOpenChange: (open: boolean) => void;
}) => {
  if (!record) return null;

  const submissionProgress = toProgressValue(record.submissionRate);
  const lateSubmissionText = record.allowLateSubmission
    ? record.lateSubmissionDeadline
      ? `Allowed until ${formatDateLabel(new Date(record.lateSubmissionDeadline))}`
      : "Allowed"
    : "Not allowed";
  const details = [
    { label: "Subject", value: record.subject },
    { label: "Instructor", value: record.instructor },
    { label: "Assignment Type", value: record.assignmentType ?? "Assignment" },
    { label: "Due Date", value: `${record.dueDate} ${record.dueTime}` },
    { label: "Status", value: record.status, badge: true },
    { label: "Total Marks", value: record.totalMarks ?? "N/A" },
    { label: "Submitted", value: record.submittedText },
    { label: "Submission Rate", value: record.submissionRate },
    { label: "Late Submission", value: lateSubmissionText },
    {
      label: "Student Notifications",
      value: record.notifyStudents ? "Enabled" : "Disabled",
    },
    { label: "Attachment", value: record.attachmentLabel || "No attachment" },
  ];

  return (
    <Sheet open={Boolean(record)} onOpenChange={onOpenChange}>
      <SheetContent className="w-full overflow-y-auto sm:max-w-xl">
        <SheetHeader className="border-b">
          <SheetTitle>{record.title}</SheetTitle>
          <SheetDescription>
            {record.subject} - {record.assignmentType ?? "Assignment"}
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-5 px-4">
          <div className="divide-y rounded-md border">
            {details.map((detail) => (
              <PreviewRow key={detail.label} {...detail} />
            ))}
            <div className="space-y-2 px-4 py-3">
              <div className="flex items-center justify-between gap-3">
                <span className="text-sm text-muted-foreground">
                  Submission Progress
                </span>
                <span className="text-sm font-medium">
                  {record.submissionRate}
                </span>
              </div>
              <Progress value={submissionProgress} />
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium">Description</p>
            <div
              className="ProseMirror max-h-80 overflow-y-auto rounded-md border bg-slate-50 p-4 text-sm"
              dangerouslySetInnerHTML={{
                __html: sanitizeAssignmentHtml(record.description),
              }}
            />
          </div>

          {record.additionalInstructions ? (
            <div className="space-y-2">
              <p className="text-sm font-medium">Additional Instructions</p>
              <p className="rounded-md border bg-slate-50 p-3 text-sm text-muted-foreground">
                {record.additionalInstructions}
              </p>
            </div>
          ) : null}
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

const PreviewRow = ({
  label,
  value,
  badge,
}: {
  label: string;
  value: string;
  badge?: boolean;
}) => (
  <div className="flex items-start justify-between gap-4 px-4 py-3 text-sm">
    <p className="text-muted-foreground">{label}</p>
    <div className="max-w-64 text-right font-medium">
      {badge ? <Badge>{value}</Badge> : <span className="break-words">{value}</span>}
    </div>
  </div>
);
