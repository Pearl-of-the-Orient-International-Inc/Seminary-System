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
    courseName: "Certificate in Christian Evangelism",
    courseCode: "CERT-CE",
    program: "Certificate",
    units: 2,
    modality: "Online",
    status: "Active",
  },
  {
    id: "2",
    order: 2,
    courseName: "Certificate in Christian Ministry",
    courseCode: "CERT-CM",
    program: "Certificate",
    units: 2,
    modality: "Online",
    status: "Active",
  },
  {
    id: "3",
    order: 3,
    courseName: "Certificate in ECE & SPED Management",
    courseCode: "CERT-ESM",
    program: "Certificate",
    units: 2,
    modality: "Online",
    status: "Active",
  },
  {
    id: "4",
    order: 4,
    courseName: "Certificate in Advanced Ministerial",
    courseCode: "CERT-AM",
    program: "Certificate",
    units: 2,
    modality: "Online",
    status: "Active",
  },
  {
    id: "5",
    order: 5,
    courseName: "Certificate in Advanced Theology",
    courseCode: "CERT-AT",
    program: "Certificate",
    units: 2,
    modality: "Online",
    status: "Active",
  },
  {
    id: "6",
    order: 6,
    courseName: "Bachelor of Theology",
    courseCode: "BTH",
    program: "Bachelor",
    units: 3,
    modality: "Face to Face",
    status: "Active",
  },
  {
    id: "7",
    order: 7,
    courseName: "Bachelor of Theology (Major in Pastoral Ministry)",
    courseCode: "BTH-PM",
    program: "Bachelor",
    units: 3,
    modality: "Face to Face",
    status: "Active",
  },
  {
    id: "8",
    order: 8,
    courseName: "Bachelor of Theology (Major in Chaplaincy)",
    courseCode: "BTH-CH",
    program: "Bachelor",
    units: 3,
    modality: "Face to Face",
    status: "Active",
  },
  {
    id: "9",
    order: 9,
    courseName: "Bachelor of Religious Education",
    courseCode: "BRE",
    program: "Bachelor",
    units: 3,
    modality: "Face to Face",
    status: "Active",
  },
  {
    id: "10",
    order: 10,
    courseName:
      "Bachelor of Christian Ministry (Major in Human Resources & Community Development)",
    courseCode: "BCM-HRCD",
    program: "Bachelor",
    units: 3,
    modality: "Face to Face",
    status: "Active",
  },
  {
    id: "11",
    order: 11,
    courseName:
      "Bachelor of Christian Ministry (Major in Christian Leadership)",
    courseCode: "BCM-CL",
    program: "Bachelor",
    units: 3,
    modality: "Face to Face",
    status: "Active",
  },
  {
    id: "12",
    order: 12,
    courseName: "Bachelor in Mission (Major in Cross-Culture)",
    courseCode: "BM-CC",
    program: "Bachelor",
    units: 3,
    modality: "Face to Face",
    status: "Active",
  },
  {
    id: "13",
    order: 13,
    courseName: "Bachelor in Christian Counseling",
    courseCode: "BCC",
    program: "Bachelor",
    units: 3,
    modality: "Face to Face",
    status: "Active",
  },
  {
    id: "14",
    order: 14,
    courseName: "Bachelor of Christian Ministry in Naturopathic Medicine",
    courseCode: "BCM-NM",
    program: "Bachelor",
    units: 3,
    modality: "Face to Face",
    status: "Active",
  },
  {
    id: "15",
    order: 15,
    courseName: "Master in Theology",
    courseCode: "MTH",
    program: "Masteral",
    units: 3,
    modality: "Online",
    status: "Active",
  },
  {
    id: "16",
    order: 16,
    courseName: "Master in Divinity",
    courseCode: "MDIV",
    program: "Masteral",
    units: 3,
    modality: "Online",
    status: "Active",
  },
  {
    id: "17",
    order: 17,
    courseName: "Master of Religious Education",
    courseCode: "MRE",
    program: "Masteral",
    units: 3,
    modality: "Online",
    status: "Active",
  },
  {
    id: "18",
    order: 18,
    courseName:
      "Master of Christian Ministry in Complementary and Alternative Medicine (Major in Naturopathy)",
    courseCode: "MCM-CAMN",
    program: "Masteral",
    units: 3,
    modality: "Online",
    status: "Active",
  },
  {
    id: "19",
    order: 19,
    courseName: "Master of Christian Ministry (Major in Christian Leadership)",
    courseCode: "MCM-CL",
    program: "Masteral",
    units: 3,
    modality: "Online",
    status: "Active",
  },
  {
    id: "20",
    order: 20,
    courseName: "Master of Arts & Mission",
    courseCode: "MAM",
    program: "Masteral",
    units: 3,
    modality: "Online",
    status: "Active",
  },
  {
    id: "21",
    order: 21,
    courseName: "Master in Christian Counseling",
    courseCode: "MCC",
    program: "Masteral",
    units: 3,
    modality: "Online",
    status: "Active",
  },
  {
    id: "22",
    order: 22,
    courseName: "Doctor of Christian Ministry",
    courseCode: "DCM",
    program: "Doctorate",
    units: 4,
    modality: "Online",
    status: "Active",
  },
  {
    id: "23",
    order: 23,
    courseName: "Doctor of Ministry Alternative Medicine",
    courseCode: "DM-AM",
    program: "Doctorate",
    units: 4,
    modality: "Online",
    status: "Active",
  },
  {
    id: "24",
    order: 24,
    courseName: "Doctor of Theology",
    courseCode: "DTH",
    program: "Doctorate",
    units: 4,
    modality: "Online",
    status: "Active",
  },
  {
    id: "25",
    order: 25,
    courseName: "Doctor of Religious Education",
    courseCode: "DRE",
    program: "Doctorate",
    units: 4,
    modality: "Online",
    status: "Active",
  },
  {
    id: "26",
    order: 26,
    courseName:
      "Doctor of Philosophy (Major in Christian Leadership & Management)",
    courseCode: "PHD-CLM",
    program: "Doctorate",
    units: 4,
    modality: "Online",
    status: "Active",
  },
  {
    id: "27",
    order: 27,
    courseName: "Doctor of Philosophy (Major in Biblical Studies)",
    courseCode: "PHD-BS",
    program: "Doctorate",
    units: 4,
    modality: "Online",
    status: "Active",
  },
  {
    id: "28",
    order: 28,
    courseName: "Doctor of Philosophy in Theology",
    courseCode: "PHD-TH",
    program: "Doctorate",
    units: 4,
    modality: "Online",
    status: "Active",
  },
  {
    id: "29",
    order: 29,
    courseName: "Doctor of Philosophy in Christian Apologetics",
    courseCode: "PHD-CA",
    program: "Doctorate",
    units: 4,
    modality: "Online",
    status: "Active",
  },
  {
    id: "30",
    order: 30,
    courseName: "Doctor of Philosophy in Religion",
    courseCode: "PHD-R",
    program: "Doctorate",
    units: 4,
    modality: "Online",
    status: "Active",
  },
  {
    id: "31",
    order: 31,
    courseName: "Doctor of Philosophy (Major in Pastoral Ministry)",
    courseCode: "PHD-PM",
    program: "Doctorate",
    units: 4,
    modality: "Online",
    status: "Active",
  },
  {
    id: "32",
    order: 32,
    courseName:
      "Doctor of Philosophy (Major in Pastoral Guidance & Counseling)",
    courseCode: "PHD-PGC",
    program: "Doctorate",
    units: 4,
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
