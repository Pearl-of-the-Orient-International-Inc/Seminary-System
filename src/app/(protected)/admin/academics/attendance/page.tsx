"use client";

import { useState } from "react";
import Link from "next/link";
import {
  CalendarDays,
  CheckCircle2,
  CircleMinus,
  Clock3,
  Filter,
  Save,
  UsersRound,
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
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { CellActions } from "./_components/cell-actions";
import { MonthlyRecordDialog } from "./_components/monthly-record-dialog";
import {
  attendanceStatusOptions,
  getColumns,
  type AttendanceRecord,
  type AttendanceStatus,
} from "./_components/columns";
import { StatCard } from "./_components/stat-card";

type AcademicYearOption = "2024-2025" | "2025-2026";
type ClassOption = "First Year Theology" | "Second Year Theology" | "Master of Divinity Year I";
type SectionOption = "A" | "B";

const academicYearOptions: AcademicYearOption[] = ["2024-2025", "2025-2026"];
const classOptions: ClassOption[] = [
  "First Year Theology",
  "Second Year Theology",
  "Master of Divinity Year I",
];
const sectionOptions: SectionOption[] = ["A", "B"];

const initialAttendanceData: AttendanceRecord[] = [
  {
    id: "1",
    order: 1,
    rollNo: "SEM-2401",
    studentName: "John Mark Dela Cruz",
    status: "Present",
    remarks: "",
  },
  {
    id: "2",
    order: 2,
    rollNo: "SEM-2402",
    studentName: "Paolo Miguel Santos",
    status: "Present",
    remarks: "",
  },
  {
    id: "3",
    order: 3,
    rollNo: "SEM-2403",
    studentName: "Christian Gabriel Reyes",
    status: "Absent",
    remarks: "Medical consultation",
  },
  {
    id: "4",
    order: 4,
    rollNo: "SEM-2404",
    studentName: "Noel Francis Bautista",
    status: "Late",
    remarks: "Arrived after morning prayer",
  },
  {
    id: "5",
    order: 5,
    rollNo: "SEM-2405",
    studentName: "Jose Antonio Mendoza",
    status: "Present",
    remarks: "",
  },
  {
    id: "6",
    order: 6,
    rollNo: "SEM-2406",
    studentName: "Miguel Lorenzo Navarro",
    status: "Present",
    remarks: "",
  },
  {
    id: "7",
    order: 7,
    rollNo: "SEM-2407",
    studentName: "Raphael Benedict Cruz",
    status: "Absent",
    remarks: "Pastoral assignment",
  },
  {
    id: "8",
    order: 8,
    rollNo: "SEM-2408",
    studentName: "Adrian Paul Villanueva",
    status: "Present",
    remarks: "",
  },
];

const Page = () => {
  const [academicYear, setAcademicYear] = useState<AcademicYearOption>("2024-2025");
  const [className, setClassName] = useState<ClassOption>("First Year Theology");
  const [section, setSection] = useState<SectionOption>("A");
  const [attendanceDate, setAttendanceDate] = useState("2026-05-02");
  const [records, setRecords] = useState<AttendanceRecord[]>(initialAttendanceData);
  const [monthlyDialogOpen, setMonthlyDialogOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<AttendanceRecord | null>(null);

  const presentCount = records.filter((record) => record.status === "Present").length;
  const absentCount = records.filter((record) => record.status === "Absent").length;
  const lateCount = records.filter((record) => record.status === "Late").length;
  const totalStudents = records.length;

  const handleChangeStatus = (
    targetRecord: AttendanceRecord,
    status: AttendanceStatus,
  ) => {
    setRecords((current) =>
      current.map((record) =>
        record.id === targetRecord.id ? { ...record, status } : record,
      ),
    );
  };

  const handleChangeRemarks = (
    targetRecord: AttendanceRecord,
    remarks: string,
  ) => {
    setRecords((current) =>
      current.map((record) =>
        record.id === targetRecord.id ? { ...record, remarks } : record,
      ),
    );
  };

  const handleResetRow = (targetRecord: AttendanceRecord) => {
    setRecords((current) =>
      current.map((record) =>
        record.id === targetRecord.id
          ? { ...record, status: "Present", remarks: "" }
          : record,
      ),
    );
  };

  const handleMarkAll = (status: AttendanceStatus) => {
    setRecords((current) =>
      current.map((record) => ({
        ...record,
        status,
      })),
    );
  };

  const renderCellActions = (row: Row<AttendanceRecord>) => (
    <CellActions
      data={row.original}
      onChangeStatus={handleChangeStatus}
      onReset={handleResetRow}
      onViewMonthlyRecord={(record) => {
        setSelectedStudent(record);
        setMonthlyDialogOpen(true);
      }}
    />
  );

  const columns = getColumns({
    onChangeStatus: handleChangeStatus,
    onChangeRemarks: handleChangeRemarks,
  });

  return (
    <section className="space-y-6 p-10">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight text-blue-950 dark:text-blue-100">
            Attendance
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
              <BreadcrumbPage>Attendance</BreadcrumbPage>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Student Attendance</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Students"
          value={totalStudents}
          description="All students"
          icon={<UsersRound className="size-6" />}
          accentClassName="bg-blue-500/10 text-blue-700 dark:bg-blue-400/10 dark:text-blue-300"
        />
        <StatCard
          title="Present Today"
          value={presentCount}
          description={`${totalStudents === 0 ? "0.00" : ((presentCount / totalStudents) * 100).toFixed(2)}%`}
          icon={<CheckCircle2 className="size-6" />}
          accentClassName="bg-emerald-500/10 text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-300"
        />
        <StatCard
          title="Absent Today"
          value={absentCount}
          description={`${totalStudents === 0 ? "0.00" : ((absentCount / totalStudents) * 100).toFixed(2)}%`}
          icon={<CircleMinus className="size-6" />}
          accentClassName="bg-amber-500/10 text-amber-700 dark:bg-amber-400/10 dark:text-amber-300"
        />
        <StatCard
          title="Late Today"
          value={lateCount}
          description={`${totalStudents === 0 ? "0.00" : ((lateCount / totalStudents) * 100).toFixed(2)}%`}
          icon={<Clock3 className="size-6" />}
          accentClassName="bg-violet-500/10 text-violet-700 dark:bg-violet-400/10 dark:text-violet-300"
        />
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
                value={className}
                onValueChange={(value) => setClassName(value as ClassOption)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select class" />
                </SelectTrigger>
                <SelectContent>
                  {classOptions.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium text-foreground">Section</p>
              <Select
                value={section}
                onValueChange={(value) => setSection(value as SectionOption)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select section" />
                </SelectTrigger>
                <SelectContent>
                  {sectionOptions.map((option) => (
                    <SelectItem key={option} value={option}>
                      Section {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium text-foreground">Date</p>
              <div className="relative">
                <CalendarDays className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="date"
                  value={attendanceDate}
                  onChange={(event) => setAttendanceDate(event.target.value)}
                />
              </div>
            </div>

            <div className="flex items-end">
              <Button className="w-full">
                <Save className="size-4" />
                Save Attendance
              </Button>
            </div>
          </div>

          <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button
                variant="outline"
                className="border-emerald-200 text-emerald-700 hover:bg-emerald-50"
                onClick={() => handleMarkAll("Present")}
              >
                <CheckCircle2 className="size-4" />
                Mark All Present
              </Button>
              <Button
                variant="outline"
                className="border-red-200 text-red-700 hover:bg-red-50"
                onClick={() => handleMarkAll("Absent")}
              >
                <CircleMinus className="size-4" />
                Mark All Absent
              </Button>
              <Button
                variant="outline"
                className="border-amber-200 text-amber-700 hover:bg-amber-50"
                onClick={() => handleMarkAll("Late")}
              >
                <Clock3 className="size-4" />
                Mark All Late
              </Button>
            </div>
          </div>

          <GlobalDataTable
            columns={columns}
            data={records}
            cellAction={renderCellActions}
            exportFileName="attendance"
            filterPlaceholder="Search student..."
            emptyMessage="No attendance records found."
            pageSizeOptions={[8, 10, 20]}
            toolbarActions={
              <Button variant="outline">
                <Filter className="size-4" />
                Filters
              </Button>
            }
            renderSelectedActions={(selectedRows, helpers) => (
              <>
                {attendanceStatusOptions.map((status) => (
                  <Button
                    key={status}
                    variant="outline"
                    size="xs"
                    onClick={() => {
                      setRecords((current) =>
                        current.map((record) =>
                          selectedRows.some((selected) => selected.id === record.id)
                            ? { ...record, status }
                            : record,
                        ),
                      );
                      helpers.clearSelection();
                    }}
                  >
                    {status === "Present" ? (
                      <CheckCircle2 className="size-3.5 text-green-600" />
                    ) : status === "Absent" ? (
                      <CircleMinus className="size-3.5 text-red-600" />
                    ) : (
                      <Clock3 className="size-3.5 text-amber-600" />
                    )}
                    Mark {status}
                  </Button>
                ))}
              </>
            )}
          />
        </CardContent>
      </Card>

      <MonthlyRecordDialog
        open={monthlyDialogOpen}
        onOpenChange={setMonthlyDialogOpen}
        student={selectedStudent}
      />
    </section>
  );
};

export default Page;
