"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  AssignmentDialog,
  type AssignmentDialogValues,
  formatTimeLabel,
} from "./_components/assignment-dialog";
import { CellActions } from "./_components/cell-actions";
import {
  assignmentStatusOptions,
  columns,
  type AssignmentClass,
  type AssignmentRecord,
  type AssignmentSection,
  type AssignmentStatus,
  type AssignmentType,
} from "./_components/columns";

type AcademicYearOption = "2024-2025" | "2025-2026";
type ClassFilterOption =
  | "All Classes"
  | "Theology I"
  | "Theology II"
  | "Theology III"
  | "Philosophy IV";
type SubjectFilterOption =
  | "All Subjects"
  | "Sacred Scripture"
  | "Biblical Theology"
  | "Liturgy"
  | "Church History"
  | "Pastoral Theology"
  | "Catechetics";

const academicYearOptions: AcademicYearOption[] = ["2024-2025", "2025-2026"];
const classFilterOptions: ClassFilterOption[] = [
  "All Classes",
  "Theology I",
  "Theology II",
  "Theology III",
  "Philosophy IV",
];
const subjectFilterOptions: SubjectFilterOption[] = [
  "All Subjects",
  "Sacred Scripture",
  "Biblical Theology",
  "Liturgy",
  "Church History",
  "Pastoral Theology",
  "Catechetics",
];

const initialAssignments: AssignmentRecord[] = [
  {
    id: "1",
    order: 1,
    title: "Gospel Reflection Journal",
    description: "Write a one-page reflection on the Sunday Gospel reading.",
    subject: "Sacred Scripture",
    instructor: "Fr. Miguel Santos",
    className: "Theology I - St. Augustine",
    classValue: "Theology I",
    section: "St. Augustine",
    assignmentType: "Reflection Paper",
    dueDate: "May 25, 2026",
    dueTime: "11:59 PM",
    status: "Published",
    submittedText: "28 / 32",
    submissionRate: "87.50%",
    totalMarks: "100",
    additionalInstructions: "Submit your reflection before evening prayer.",
    allowLateSubmission: true,
    lateSubmissionDeadline: "2026-05-26T23:59",
    notifyStudents: true,
    attachmentLabel: "reflection-guide.pdf",
  },
  {
    id: "2",
    order: 2,
    title: "Essay on the Life of St. Paul",
    description:
      "Prepare a short essay on the missionary journeys of St. Paul.",
    subject: "Biblical Theology",
    instructor: "Fr. Daniel Cruz",
    className: "Theology II - St. John",
    classValue: "Theology II",
    section: "St. John",
    assignmentType: "Essay",
    dueDate: "May 28, 2026",
    dueTime: "11:59 PM",
    status: "Published",
    submittedText: "25 / 32",
    submissionRate: "78.13%",
    totalMarks: "100",
    additionalInstructions:
      "Cite at least three references from the course reader.",
    allowLateSubmission: true,
    lateSubmissionDeadline: "2026-05-29T23:59",
    notifyStudents: true,
  },
  {
    id: "3",
    order: 3,
    title: "Liturgy Practicum Outline",
    description: "Create an outline for the Order of Mass with key responses.",
    subject: "Liturgy",
    instructor: "Fr. Rafael Dizon",
    className: "Theology I - St. Augustine",
    classValue: "Theology I",
    section: "St. Augustine",
    assignmentType: "Practicum",
    dueDate: "May 30, 2026",
    dueTime: "11:59 PM",
    status: "Published",
    submittedText: "26 / 30",
    submissionRate: "86.67%",
    totalMarks: "75",
    additionalInstructions: "Include introductory rites through dismissal.",
    allowLateSubmission: false,
    lateSubmissionDeadline: "",
    notifyStudents: true,
  },
  {
    id: "4",
    order: 4,
    title: "Church History Timeline",
    description:
      "Prepare a visual timeline of major periods in Church history.",
    subject: "Church History",
    instructor: "Fr. Antonio Reyes",
    className: "Philosophy IV - St. Thomas",
    classValue: "Philosophy IV",
    section: "St. Thomas",
    assignmentType: "Research Output",
    dueDate: "June 2, 2026",
    dueTime: "11:59 PM",
    status: "Draft",
    submittedText: "0 / 30",
    submissionRate: "0%",
    totalMarks: "80",
    additionalInstructions: "",
    allowLateSubmission: true,
    lateSubmissionDeadline: "",
    notifyStudents: false,
  },
  {
    id: "5",
    order: 5,
    title: "Pastoral Case Study",
    description:
      "Respond to a pastoral care case using seminary formation principles.",
    subject: "Pastoral Theology",
    instructor: "Fr. Gabriel Flores",
    className: "Theology III - St. Gregory",
    classValue: "Theology III",
    section: "St. Gregory",
    assignmentType: "Case Study",
    dueDate: "June 5, 2026",
    dueTime: "11:59 PM",
    status: "Scheduled",
    submittedText: "0 / 28",
    submissionRate: "0%",
    totalMarks: "100",
    additionalInstructions: "Use the pastoral cycle discussed in class.",
    allowLateSubmission: true,
    lateSubmissionDeadline: "2026-06-06T23:59",
    notifyStudents: true,
  },
  {
    id: "6",
    order: 6,
    title: "Catechetical Lesson Plan",
    description: "Design a catechism lesson plan for a parish youth session.",
    subject: "Catechetics",
    instructor: "Fr. Miguel Santos",
    className: "Theology II - St. John",
    classValue: "Theology II",
    section: "St. John",
    assignmentType: "Lesson Plan",
    dueDate: "June 8, 2026",
    dueTime: "11:59 PM",
    status: "Published",
    submittedText: "17 / 32",
    submissionRate: "53.13%",
    totalMarks: "100",
    additionalInstructions:
      "Focus on one sacrament for junior youth catechesis.",
    allowLateSubmission: true,
    lateSubmissionDeadline: "2026-06-09T23:59",
    notifyStudents: true,
  },
];

const stats = [
  {
    title: "Total Assignments",
    value: "28",
    description: "All time",
    icon: <BookOpen className="size-6" />,
    accentClassName:
      "bg-blue-500/10 text-blue-700 dark:bg-blue-400/10 dark:text-blue-300",
  },
  {
    title: "Published",
    value: "20",
    description: "Active assignments",
    icon: <CheckCircle2 className="size-6" />,
    accentClassName:
      "bg-emerald-500/10 text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-300",
  },
  {
    title: "Due This Week",
    value: "5",
    description: "Upcoming deadlines",
    icon: <Hourglass className="size-6" />,
    accentClassName:
      "bg-amber-500/10 text-amber-700 dark:bg-amber-400/10 dark:text-amber-300",
  },
  {
    title: "Submitted",
    value: "156",
    description: "Total submissions",
    icon: <FileCheck2 className="size-6" />,
    accentClassName:
      "bg-violet-500/10 text-violet-700 dark:bg-violet-400/10 dark:text-violet-300",
  },
];

const Page = () => {
  const [academicYear, setAcademicYear] =
    useState<AcademicYearOption>("2024-2025");
  const [classFilter, setClassFilter] =
    useState<ClassFilterOption>("All Classes");
  const [subjectFilter, setSubjectFilter] =
    useState<SubjectFilterOption>("All Subjects");
  const [statusFilter, setStatusFilter] = useState<
    AssignmentStatus | "All Status"
  >("All Status");
  const [assignments, setAssignments] =
    useState<AssignmentRecord[]>(initialAssignments);
  const [assignmentDialogOpen, setAssignmentDialogOpen] = useState(false);
  const [selectedAssignment, setSelectedAssignment] =
    useState<AssignmentRecord | null>(null);

  const filteredAssignments = useMemo(
    () =>
      assignments.filter((assignment) => {
        const classMatch =
          classFilter === "All Classes" ||
          assignment.className.startsWith(classFilter);
        const subjectMatch =
          subjectFilter === "All Subjects" ||
          assignment.subject === subjectFilter;
        const statusMatch =
          statusFilter === "All Status" || assignment.status === statusFilter;

        return classMatch && subjectMatch && statusMatch;
      }),
    [assignments, classFilter, subjectFilter, statusFilter],
  );

  const handleChangeStatus = (
    targetRecord: AssignmentRecord,
    status: AssignmentStatus,
  ) => {
    setAssignments((current) =>
      current.map((assignment) =>
        assignment.id === targetRecord.id
          ? { ...assignment, status }
          : assignment,
      ),
    );
  };

  const handleDelete = (targetRecord: AssignmentRecord) => {
    setAssignments((current) =>
      current.filter((assignment) => assignment.id !== targetRecord.id),
    );
  };

  const handleOpenCreate = () => {
    setSelectedAssignment(null);
    setAssignmentDialogOpen(true);
  };

  const handleOpenEdit = (record: AssignmentRecord) => {
    setSelectedAssignment(record);
    setAssignmentDialogOpen(true);
  };

  const handleSubmitAssignment = (values: AssignmentDialogValues) => {
    const className = values.section
      ? `${values.classValue} - ${values.section}`
      : values.classValue;

    const nextRecord = {
      title: values.title,
      description: values.description,
      subject: values.subject,
      className,
      classValue: values.classValue as AssignmentClass,
      section: values.section as AssignmentSection | undefined,
      assignmentType: values.assignmentType as AssignmentType,
      dueDate: formatDateLabel(values.dueAt),
      dueTime: formatTimeLabel(formatTimeValue(values.dueAt)),
      totalMarks: values.totalMarks,
      additionalInstructions: values.additionalInstructions ?? "",
      allowLateSubmission: values.allowLateSubmission,
      lateSubmissionDeadline: values.lateSubmissionDeadline
        ? formatDateLabel(values.lateSubmissionDeadline)
        : "",
      notifyStudents: values.notifyStudents,
      attachmentLabel: values.attachmentLabel ?? "",
    };

    if (selectedAssignment) {
      setAssignments((current) =>
        current.map((assignment) =>
          assignment.id === selectedAssignment.id
            ? {
                ...assignment,
                ...nextRecord,
              }
            : assignment,
        ),
      );
      return;
    }

    setAssignments((current) => [
      {
        id: `${Date.now()}`,
        order: current.length + 1,
        instructor: "Fr. Miguel Santos",
        status: "Draft",
        submittedText: "0 / 0",
        submissionRate: "0%",
        ...nextRecord,
      },
      ...current.map((assignment, index) => ({
        ...assignment,
        order: index + 2,
      })),
    ]);
  };

  const renderCellActions = (row: Row<AssignmentRecord>) => (
    <CellActions
      data={row.original}
      onPreview={() => {}}
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
              <p className="text-sm font-medium text-foreground">Class</p>
              <Select
                value={classFilter}
                onValueChange={(value) =>
                  setClassFilter(value as ClassFilterOption)
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select class" />
                </SelectTrigger>
                <SelectContent>
                  {classFilterOptions.map((option) => (
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
            onDeleteSelected={(selectedRows) => {
              const selectedIds = new Set(selectedRows.map((row) => row.id));
              setAssignments((current) =>
                current.filter((assignment) => !selectedIds.has(assignment.id)),
              );
            }}
            renderSelectedActions={(selectedRows, helpers) => (
              <>
                {assignmentStatusOptions.map((status) => (
                  <Button
                    key={status}
                    variant="outline"
                    size="xs"
                    onClick={() => {
                      const selectedIds = new Set(
                        selectedRows.map((assignment) => assignment.id),
                      );
                      setAssignments((current) =>
                        current.map((assignment) =>
                          selectedIds.has(assignment.id)
                            ? { ...assignment, status }
                            : assignment,
                        ),
                      );
                      helpers.clearSelection();
                    }}
                  >
                    Mark {status}
                  </Button>
                ))}
              </>
            )}
          />
        </CardContent>
      </Card>

      <AssignmentDialog
        open={assignmentDialogOpen}
        onOpenChange={setAssignmentDialogOpen}
        onSubmit={handleSubmitAssignment}
        record={selectedAssignment}
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
