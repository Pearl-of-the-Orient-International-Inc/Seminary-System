"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
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
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { CellActions } from "./_components/cell-actions";
import {
  columns,
  examinationClassOptions,
  examinationStatusOptions,
  examinationSubjectOptions,
  examinationTypeOptions,
  type ExaminationClass,
  type ExaminationRecord,
  type ExaminationStatus,
  type ExaminationSubject,
  type ExaminationType,
} from "./_components/columns";

type AcademicYearOption = "2024-2025" | "2025-2026";
type ClassFilterOption = "All Classes" | ExaminationClass;
type SubjectFilterOption = "All Subjects" | ExaminationSubject;
type TypeFilterOption = "All Types" | ExaminationType;

const academicYearOptions: AcademicYearOption[] = ["2024-2025", "2025-2026"];
const classFilterOptions: ClassFilterOption[] = [
  "All Classes",
  ...examinationClassOptions,
];
const subjectFilterOptions: SubjectFilterOption[] = [
  "All Subjects",
  ...examinationSubjectOptions,
];
const typeFilterOptions: TypeFilterOption[] = [
  "All Types",
  ...examinationTypeOptions,
];

const initialExaminations: ExaminationRecord[] = [
  {
    id: "1",
    order: 1,
    examTitle: "Unit Test - Pentateuch",
    coverage: "Genesis to Deuteronomy",
    subject: "Sacred Scripture",
    className: "Theology I - St. Augustine",
    examType: "Unit Test",
    dateLabel: "May 25, 2026",
    timeLabel: "10:00 AM",
    duration: "60 min",
    status: "Ongoing",
  },
  {
    id: "2",
    order: 2,
    examTitle: "Quarterly Exam in Christology",
    coverage: "All chapters from Term 1",
    subject: "Biblical Theology",
    className: "Theology II - St. John",
    examType: "Quarterly",
    dateLabel: "June 2, 2026",
    timeLabel: "10:00 AM",
    duration: "90 min",
    status: "Scheduled",
  },
  {
    id: "3",
    order: 3,
    examTitle: "Midterm Rubrics in Sacred Liturgy",
    coverage: "Half-yearly coverage",
    subject: "Liturgy",
    className: "Theology I - St. Augustine",
    examType: "Midterm",
    dateLabel: "June 10, 2026",
    timeLabel: "10:00 AM",
    duration: "90 min",
    status: "Scheduled",
  },
  {
    id: "4",
    order: 4,
    examTitle: "Church Councils Assessment",
    coverage: "Chapters 4 to 6",
    subject: "Church History",
    className: "Philosophy IV - St. Thomas",
    examType: "Unit Test",
    dateLabel: "June 15, 2026",
    timeLabel: "10:00 AM",
    duration: "60 min",
    status: "Scheduled",
  },
  {
    id: "5",
    order: 5,
    examTitle: "Pastoral Ministry Practical",
    coverage: "Practical assessment",
    subject: "Pastoral Theology",
    className: "Theology III - St. Gregory",
    examType: "Practical",
    dateLabel: "June 18, 2026",
    timeLabel: "10:00 AM",
    duration: "45 min",
    status: "Scheduled",
  },
  {
    id: "6",
    order: 6,
    examTitle: "Annual Catechetics Examination",
    coverage: "Full year syllabus",
    subject: "Catechetics",
    className: "Theology II - St. John",
    examType: "Annual",
    dateLabel: "June 20, 2026",
    timeLabel: "10:00 AM",
    duration: "120 min",
    status: "Draft",
  },
  {
    id: "7",
    order: 7,
    examTitle: "Unit Test - Synoptic Gospels",
    coverage: "Chapters 7 to 9",
    subject: "Sacred Scripture",
    className: "Theology I - St. Augustine",
    examType: "Unit Test",
    dateLabel: "June 28, 2026",
    timeLabel: "10:00 AM",
    duration: "60 min",
    status: "Completed",
  },
];

const stats = [
  {
    title: "Total Examinations",
    value: "24",
    description: "All time",
    icon: <BookCheck className="size-6" />,
    accentClassName:
      "bg-blue-500/10 text-blue-700 dark:bg-blue-400/10 dark:text-blue-300",
  },
  {
    title: "Scheduled Exams",
    value: "8",
    description: "Upcoming exams",
    icon: <CalendarCheck2 className="size-6" />,
    accentClassName:
      "bg-emerald-500/10 text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-300",
  },
  {
    title: "Ongoing Exams",
    value: "3",
    description: "Currently active",
    icon: <PlayCircle className="size-6" />,
    accentClassName:
      "bg-amber-500/10 text-amber-700 dark:bg-amber-400/10 dark:text-amber-300",
  },
  {
    title: "Completed Exams",
    value: "13",
    description: "Finished exams",
    icon: <CheckSquare className="size-6" />,
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
  const [typeFilter, setTypeFilter] = useState<TypeFilterOption>("All Types");
  const [statusFilter, setStatusFilter] = useState<
    ExaminationStatus | "All Status"
  >("All Status");
  const [examinations, setExaminations] =
    useState<ExaminationRecord[]>(initialExaminations);

  const filteredExaminations = useMemo(
    () =>
      examinations.filter((exam) => {
        const classMatch =
          classFilter === "All Classes" ||
          exam.className.startsWith(classFilter);
        const subjectMatch =
          subjectFilter === "All Subjects" || exam.subject === subjectFilter;
        const typeMatch =
          typeFilter === "All Types" || exam.examType === typeFilter;
        const statusMatch =
          statusFilter === "All Status" || exam.status === statusFilter;

        return classMatch && subjectMatch && typeMatch && statusMatch;
      }),
    [classFilter, examinations, statusFilter, subjectFilter, typeFilter],
  );

  const handleChangeStatus = (
    targetRecord: ExaminationRecord,
    status: ExaminationStatus,
  ) => {
    setExaminations((current) =>
      current.map((exam) =>
        exam.id === targetRecord.id ? { ...exam, status } : exam,
      ),
    );
  };

  const handleDelete = (targetRecord: ExaminationRecord) => {
    setExaminations((current) =>
      current
        .filter((exam) => exam.id !== targetRecord.id)
        .map((exam, index) => ({ ...exam, order: index + 1 })),
    );
  };

  const renderCellActions = (row: Row<ExaminationRecord>) => (
    <CellActions
      data={row.original}
      onPreview={() => {}}
      onEdit={() => {}}
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
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
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
                <Button>
                  <Plus className="size-4" />
                  Create Examination
                </Button>
              </>
            }
            onDeleteSelected={(selectedRows) => {
              const selectedIds = new Set(selectedRows.map((row) => row.id));
              setExaminations((current) =>
                current
                  .filter((exam) => !selectedIds.has(exam.id))
                  .map((exam, index) => ({ ...exam, order: index + 1 })),
              );
            }}
            renderSelectedActions={(selectedRows, helpers) => (
              <>
                {examinationStatusOptions.map((status) => (
                  <Button
                    key={status}
                    variant="outline"
                    size="xs"
                    onClick={() => {
                      const selectedIds = new Set(
                        selectedRows.map((exam) => exam.id),
                      );
                      setExaminations((current) =>
                        current.map((exam) =>
                          selectedIds.has(exam.id) ? { ...exam, status } : exam,
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
    </section>
  );
};

export default Page;
