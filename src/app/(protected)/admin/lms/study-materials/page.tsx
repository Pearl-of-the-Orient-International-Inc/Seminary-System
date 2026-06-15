"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  BookOpenText,
  Download,
  FileClock,
  Filter,
  Plus,
  ScrollText,
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
  studyMaterialClassOptions,
  studyMaterialStatusOptions,
  studyMaterialSubjectOptions,
  studyMaterialTopicOptions,
  studyMaterialTypeOptions,
  type StudyMaterialClass,
  type StudyMaterialRecord,
  type StudyMaterialSubject,
  type StudyMaterialTopic,
  type StudyMaterialType,
} from "./_components/columns";

type AcademicYearOption = "2024-2025" | "2025-2026";
type ClassFilterOption = "All Classes" | StudyMaterialClass;
type SubjectFilterOption = "All Subjects" | StudyMaterialSubject;
type TopicFilterOption = "All Topics" | StudyMaterialTopic;
type TypeFilterOption = "All Types" | StudyMaterialType;

const academicYearOptions: AcademicYearOption[] = ["2024-2025", "2025-2026"];
const classFilterOptions: ClassFilterOption[] = [
  "All Classes",
  ...studyMaterialClassOptions,
];
const subjectFilterOptions: SubjectFilterOption[] = [
  "All Subjects",
  ...studyMaterialSubjectOptions,
];
const topicFilterOptions: TopicFilterOption[] = [
  "All Topics",
  ...studyMaterialTopicOptions,
];
const typeFilterOptions: TypeFilterOption[] = [
  "All Types",
  ...studyMaterialTypeOptions,
];

const initialStudyMaterials: StudyMaterialRecord[] = [
  {
    id: "1",
    order: 1,
    title: "Pentateuch Lecture Notes",
    subtitle: "Module 2 - Sacred Scripture",
    subject: "Sacred Scripture",
    className: "Theology I - St. Augustine",
    topic: "Pentateuch",
    type: "Notes",
    uploadedBy: "Fr. Miguel Santos",
    uploadedRole: "Professor",
    uploadedOnDate: "May 20, 2026",
    uploadedOnTime: "10:30 AM",
    downloads: 126,
    status: "Published",
  },
  {
    id: "2",
    order: 2,
    title: "Christology Presentation Slides",
    subtitle: "Term 1 discussion deck",
    subject: "Biblical Theology",
    className: "Theology II - St. John",
    topic: "Christology",
    type: "Presentation",
    uploadedBy: "Fr. Daniel Cruz",
    uploadedRole: "Professor",
    uploadedOnDate: "May 18, 2026",
    uploadedOnTime: "02:15 PM",
    downloads: 95,
    status: "Published",
  },
  {
    id: "3",
    order: 3,
    title: "Sacramental Theology Study Guide",
    subtitle: "Review outline for liturgy course",
    subject: "Liturgy",
    className: "Theology I - St. Augustine",
    topic: "Sacramental Theology",
    type: "Document",
    uploadedBy: "Fr. Rafael Dizon",
    uploadedRole: "Professor",
    uploadedOnDate: "May 15, 2026",
    uploadedOnTime: "11:20 AM",
    downloads: 78,
    status: "Published",
  },
  {
    id: "4",
    order: 4,
    title: "Patristics Timeline Chart",
    subtitle: "Early Church Fathers reference sheet",
    subject: "Church History",
    className: "Philosophy IV - St. Thomas",
    topic: "Patristics",
    type: "Chart",
    uploadedBy: "Fr. Antonio Reyes",
    uploadedRole: "Professor",
    uploadedOnDate: "May 10, 2026",
    uploadedOnTime: "09:45 AM",
    downloads: 63,
    status: "Published",
  },
  {
    id: "5",
    order: 5,
    title: "Pastoral Care Field Notes",
    subtitle: "Formation practicum materials",
    subject: "Pastoral Theology",
    className: "Theology III - St. Gregory",
    topic: "Pastoral Care",
    type: "Notes",
    uploadedBy: "Fr. Gabriel Flores",
    uploadedRole: "Professor",
    uploadedOnDate: "May 5, 2026",
    uploadedOnTime: "03:30 PM",
    downloads: 54,
    status: "Draft",
  },
  {
    id: "6",
    order: 6,
    title: "Youth Catechesis Resource Pack",
    subtitle: "Parish ministry activities",
    subject: "Catechetics",
    className: "Theology II - St. John",
    topic: "Youth Catechesis",
    type: "Archive",
    uploadedBy: "Fr. Miguel Santos",
    uploadedRole: "Professor",
    uploadedOnDate: "May 2, 2026",
    uploadedOnTime: "01:10 PM",
    downloads: 41,
    status: "Published",
  },
  {
    id: "7",
    order: 7,
    title: "Synoptic Gospels Summary Sheet",
    subtitle: "Reviewer for chapters 6 to 9",
    subject: "Sacred Scripture",
    className: "Theology I - St. Augustine",
    topic: "Pentateuch",
    type: "Notes",
    uploadedBy: "Fr. Miguel Santos",
    uploadedRole: "Professor",
    uploadedOnDate: "April 28, 2026",
    uploadedOnTime: "10:00 AM",
    downloads: 32,
    status: "Draft",
  },
];

const stats = [
  {
    title: "Total Materials",
    value: "132",
    description: "All time",
    icon: <BookOpenText className="size-6" />,
    accentClassName:
      "bg-blue-500/10 text-blue-700 dark:bg-blue-400/10 dark:text-blue-300",
  },
  {
    title: "Published",
    value: "98",
    description: "74.24% of total",
    icon: <ScrollText className="size-6" />,
    accentClassName:
      "bg-emerald-500/10 text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-300",
  },
  {
    title: "Drafts",
    value: "18",
    description: "13.64% of total",
    icon: <FileClock className="size-6" />,
    accentClassName:
      "bg-amber-500/10 text-amber-700 dark:bg-amber-400/10 dark:text-amber-300",
  },
  {
    title: "Total Downloads",
    value: "1,256",
    description: "Across all materials",
    icon: <Download className="size-6" />,
    accentClassName:
      "bg-violet-500/10 text-violet-700 dark:bg-violet-400/10 dark:text-violet-300",
  },
];

const Page = () => {
  const [academicYear, setAcademicYear] = useState<AcademicYearOption>("2024-2025");
  const [classFilter, setClassFilter] = useState<ClassFilterOption>("All Classes");
  const [subjectFilter, setSubjectFilter] =
    useState<SubjectFilterOption>("All Subjects");
  const [topicFilter, setTopicFilter] = useState<TopicFilterOption>("All Topics");
  const [typeFilter, setTypeFilter] = useState<TypeFilterOption>("All Types");
  const [materials, setMaterials] =
    useState<StudyMaterialRecord[]>(initialStudyMaterials);

  const filteredMaterials = useMemo(
    () =>
      materials.filter((material) => {
        const classMatch =
          classFilter === "All Classes" ||
          material.className.startsWith(classFilter);
        const subjectMatch =
          subjectFilter === "All Subjects" || material.subject === subjectFilter;
        const topicMatch =
          topicFilter === "All Topics" || material.topic === topicFilter;
        const typeMatch = typeFilter === "All Types" || material.type === typeFilter;

        return classMatch && subjectMatch && topicMatch && typeMatch;
      }),
    [classFilter, materials, subjectFilter, topicFilter, typeFilter],
  );

  const handleDelete = (targetRecord: StudyMaterialRecord) => {
    setMaterials((current) =>
      current
        .filter((material) => material.id !== targetRecord.id)
        .map((material, index) => ({ ...material, order: index + 1 })),
    );
  };

  const renderCellActions = (row: Row<StudyMaterialRecord>) => (
    <CellActions
      data={row.original}
      onPreview={() => {}}
      onEdit={() => {}}
      onDownload={() => {}}
      onDelete={handleDelete}
    />
  );

  return (
    <section className="space-y-6 p-10">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight text-blue-950 dark:text-blue-100">
            Study Materials
          </h1>
          <p className="text-sm text-muted-foreground">
            Organize and share learning materials with students.
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
              <BreadcrumbPage>Study Materials</BreadcrumbPage>
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
                <p className="text-sm font-medium text-slate-500">{stat.title}</p>
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
              <p className="text-sm font-medium text-foreground">Academic Year</p>
              <Select
                value={academicYear}
                onValueChange={(value) => setAcademicYear(value as AcademicYearOption)}
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
                onValueChange={(value) => setClassFilter(value as ClassFilterOption)}
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
              <p className="text-sm font-medium text-foreground">Topic</p>
              <Select
                value={topicFilter}
                onValueChange={(value) => setTopicFilter(value as TopicFilterOption)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select topic" />
                </SelectTrigger>
                <SelectContent>
                  {topicFilterOptions.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium text-foreground">Type</p>
              <Select
                value={typeFilter}
                onValueChange={(value) => setTypeFilter(value as TypeFilterOption)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select type" />
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
          </div>

          <GlobalDataTable
            columns={columns}
            data={filteredMaterials}
            cellAction={renderCellActions}
            exportFileName="study-materials"
            filterPlaceholder="Search materials..."
            emptyMessage="No study materials found."
            pageSizeOptions={[7, 10, 20]}
            toolbarActions={
              <>
                <Button variant="outline">
                  <Filter className="size-4" />
                  Filters
                </Button>
                <Button>
                  <Plus className="size-4" />
                  Upload Material
                </Button>
              </>
            }
            onDeleteSelected={(selectedRows) => {
              const selectedIds = new Set(selectedRows.map((row) => row.id));
              setMaterials((current) =>
                current
                  .filter((material) => !selectedIds.has(material.id))
                  .map((material, index) => ({ ...material, order: index + 1 })),
              );
            }}
            renderSelectedActions={(selectedRows, helpers) => (
              <>
                {studyMaterialStatusOptions.map((status) => (
                  <Button
                    key={status}
                    variant="outline"
                    size="xs"
                    onClick={() => {
                      const selectedIds = new Set(
                        selectedRows.map((material) => material.id),
                      );
                      setMaterials((current) =>
                        current.map((material) =>
                          selectedIds.has(material.id)
                            ? { ...material, status }
                            : material,
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
    </section>
  );
};

export default Page;
