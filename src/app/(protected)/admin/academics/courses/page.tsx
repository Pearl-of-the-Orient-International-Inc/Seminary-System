"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  BookCopy,
  CheckCircle2,
  Filter,
  Laptop,
  PauseCircle,
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

import { CourseDialog, type CourseDialogValues } from "./_components/course-dialog";
import { CellActions } from "./_components/cell-actions";
import {
  columns,
  courseModalityOptions,
  type CourseModality,
  type CourseRecord,
  type CourseStatus,
} from "./_components/columns";
import { StatCard } from "./_components/stat-card";

type StatusFilter = "ALL" | CourseStatus;
type ModalityFilter = "ALL" | CourseModality;

const initialCourseData: CourseRecord[] = [
  {
    id: "1",
    order: 1,
    courseName: "Biblical Hermeneutics",
    courseCode: "TH101",
    program: "Bachelor",
    units: 3,
    modality: "Face to Face",
    status: "Active",
  },
  {
    id: "2",
    order: 2,
    courseName: "Systematic Theology",
    courseCode: "TH201",
    program: "Bachelor",
    units: 4,
    modality: "Face to Face",
    status: "Active",
  },
  {
    id: "3",
    order: 3,
    courseName: "Pastoral Counseling",
    courseCode: "PC301",
    program: "Masteral",
    units: 3,
    modality: "Online",
    status: "Active",
  },
  {
    id: "4",
    order: 4,
    courseName: "Church History",
    courseCode: "CH110",
    program: "Certificate",
    units: 2,
    modality: "Online",
    status: "Inactive",
  },
  {
    id: "5",
    order: 5,
    courseName: "Missiology",
    courseCode: "MS210",
    program: "Bachelor",
    units: 3,
    modality: "Face to Face",
    status: "Active",
  },
  {
    id: "6",
    order: 6,
    courseName: "Homiletics",
    courseCode: "HM220",
    program: "Bachelor",
    units: 3,
    modality: "Online",
    status: "Active",
  },
  {
    id: "7",
    order: 7,
    courseName: "Greek Exegesis",
    courseCode: "GR320",
    program: "Doctorate",
    units: 4,
    modality: "Face to Face",
    status: "Inactive",
  },
  {
    id: "8",
    order: 8,
    courseName: "Christian Ethics",
    courseCode: "CE205",
    program: "Certificate",
    units: 2,
    modality: "Online",
    status: "Active",
  },
];

const normalizeRecords = (records: CourseRecord[]) =>
  records.map((record, index) => ({
    ...record,
    order: index + 1,
  }));

const Page = () => {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL");
  const [modalityFilter, setModalityFilter] = useState<ModalityFilter>("ALL");
  const [courses, setCourses] = useState<CourseRecord[]>(initialCourseData);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<CourseRecord | null>(null);

  const filteredData = useMemo(() => {
    return courses.filter((course) => {
      const matchesStatus =
        statusFilter === "ALL" || course.status === statusFilter;
      const matchesModality =
        modalityFilter === "ALL" || course.modality === modalityFilter;

      return matchesStatus && matchesModality;
    });
  }, [courses, modalityFilter, statusFilter]);

  const totalCourses = courses.length;
  const activeCourses = courses.filter((course) => course.status === "Active").length;
  const inactiveCourses = courses.filter(
    (course) => course.status === "Inactive",
  ).length;
  const onlineCourses = courses.filter(
    (course) => course.modality === "Online",
  ).length;

  const handleCreate = () => {
    setSelectedRecord(null);
    setDialogOpen(true);
  };

  const handleEdit = (record: CourseRecord) => {
    setSelectedRecord(record);
    setDialogOpen(true);
  };

  const handleDelete = (record: CourseRecord) => {
    setCourses((current) =>
      normalizeRecords(current.filter((item) => item.id !== record.id)),
    );
  };

  const handleDialogSubmit = (values: CourseDialogValues) => {
    const payload: Pick<
      CourseRecord,
      "courseName" | "courseCode" | "program" | "units" | "modality" | "status"
    > = {
      courseName: values.courseName,
      courseCode: values.courseCode,
      program: values.program,
      units: values.units,
      modality: values.modality,
      status: values.status,
    };

    if (selectedRecord) {
      setCourses((current) =>
        current.map((item) =>
          item.id === selectedRecord.id ? { ...item, ...payload } : item,
        ),
      );
      return;
    }

    setCourses((current) =>
      normalizeRecords([
        ...current,
        {
          id: crypto.randomUUID(),
          order: current.length + 1,
          ...payload,
        },
      ]),
    );
  };

  const renderCellActions = (row: Row<CourseRecord>) => (
    <CellActions
      data={row.original}
      onDelete={handleDelete}
      onEdit={handleEdit}
    />
  );

  return (
    <>
      <section className="space-y-6 p-10">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
          <div className="space-y-2">
            <h1 className="text-3xl font-semibold tracking-tight text-blue-950 dark:text-blue-100">
              Courses
            </h1>
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
                <BreadcrumbPage>Academics</BreadcrumbPage>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Courses</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="Total Courses"
            value={totalCourses}
            description="All time"
            icon={<BookCopy className="size-6" />}
            accentClassName="bg-blue-500/10 text-blue-700 dark:bg-blue-400/10 dark:text-blue-300"
          />
          <StatCard
            title="Active Courses"
            value={activeCourses}
            description="Currently active"
            icon={<CheckCircle2 className="size-6" />}
            accentClassName="bg-emerald-500/10 text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-300"
          />
          <StatCard
            title="Inactive Courses"
            value={inactiveCourses}
            description="Currently inactive"
            icon={<PauseCircle className="size-6" />}
            accentClassName="bg-amber-500/10 text-amber-700 dark:bg-amber-400/10 dark:text-amber-300"
          />
          <StatCard
            title="Online Courses"
            value={onlineCourses}
            description="Digital modality"
            icon={<Laptop className="size-6" />}
            accentClassName="bg-violet-500/10 text-violet-700 dark:bg-violet-400/10 dark:text-violet-300"
          />
        </div>

        <Card className="border-border/70 shadow-sm">
          <CardContent>
            <GlobalDataTable
              columns={columns}
              data={filteredData}
              cellAction={renderCellActions}
              exportFileName="courses"
              filterPlaceholder="Search courses..."
              emptyMessage="No courses found."
              pageSizeOptions={[8, 10, 20]}
              toolbarActions={
                <>
                  <Select
                    value={modalityFilter}
                    onValueChange={(value) => setModalityFilter(value as ModalityFilter)}
                  >
                    <SelectTrigger className="min-w-44">
                      <div className="flex items-center gap-2">
                        <Filter className="size-4 text-muted-foreground" />
                        <SelectValue placeholder="All Modality" />
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ALL">All Modality</SelectItem>
                      {courseModalityOptions.map((modality) => (
                        <SelectItem key={modality} value={modality}>
                          {modality}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select
                    value={statusFilter}
                    onValueChange={(value) => setStatusFilter(value as StatusFilter)}
                  >
                    <SelectTrigger className="min-w-40">
                      <div className="flex items-center gap-2">
                        <Filter className="size-4 text-muted-foreground" />
                        <SelectValue placeholder="All Status" />
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ALL">All Status</SelectItem>
                      <SelectItem value="Active">Active</SelectItem>
                      <SelectItem value="Inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>

                  <Button onClick={handleCreate}>
                    <Plus className="size-4" />
                    Add Course
                  </Button>
                </>
              }
            />
          </CardContent>
        </Card>
      </section>

      <CourseDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSubmit={handleDialogSubmit}
        record={selectedRecord}
      />
    </>
  );
};

export default Page;
