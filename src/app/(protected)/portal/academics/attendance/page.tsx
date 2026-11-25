/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useState } from "react";
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
import {
  useSaveSeminaryAttendanceMutation,
  useSeminaryAttendanceQuery,
  useSeminaryCoursesQuery,
  useSeminaryStudentsQuery,
} from "@/features/seminary/seminary.hooks";
import { useToast } from "@/hooks/use-toast";
import { useCurrentUserQuery } from "@/features/auth/auth.hooks";

type AcademicYearOption = "2024-2025" | "2025-2026";

const academicYearOptions: AcademicYearOption[] = ["2024-2025", "2025-2026"];
const programLabel = (program: string) =>
  program
    .replace(/_/g, " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());


const Page = () => {
  const { toast } = useToast();
  const [academicYear, setAcademicYear] =
    useState<AcademicYearOption>("2024-2025");
  const [program, setProgram] = useState("");
  const [courseId, setCourseId] = useState("");
  const [attendanceDate, setAttendanceDate] = useState("2026-05-02");
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [monthlyDialogOpen, setMonthlyDialogOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] =
    useState<AttendanceRecord | null>(null);
  const coursesQuery = useSeminaryCoursesQuery({
    limit: 100,
    status: "ACTIVE",
  });
  const studentsQuery = useSeminaryStudentsQuery({ limit: 200 });
  const availableCourses = coursesQuery.data?.data ?? [];
  const programs = Array.from(
    new Set([
      ...availableCourses.map((course) => course.program),
      ...(studentsQuery.data?.data ?? [])
        .map((student) => student.programLevel)
        .filter((program): program is NonNullable<typeof program> =>
          Boolean(program),
        ),
    ]),
  );
  const programCourses = availableCourses.filter(
    (course) => course.program === program,
  );
  const attendanceQuery = useSeminaryAttendanceQuery(
    { academicYear, program, courseId, date: attendanceDate },
    { enabled: Boolean(program && courseId) },
  );
  const saveAttendance = useSaveSeminaryAttendanceMutation();
  const { data: currentUser } = useCurrentUserQuery();
  const canManageAttendance =
    currentUser?.role === "INSTRUCTOR" ||
    (currentUser?.role === "ADMIN" && currentUser.position === "REGISTRAR");

  useEffect(() => {
    if (!program && programs[0]) setProgram(programs[0]);
  }, [program, programs]);

  useEffect(() => {
    if (!programCourses.some((course) => course.id === courseId)) {
      setCourseId(programCourses[0]?.id ?? "");
    }
  }, [courseId, programCourses]);

  useEffect(() => {
    if (!attendanceQuery.data) return;
    setRecords(
      attendanceQuery.data.data.map((record, index) => ({
        id: record.applicationId,
        applicationId: record.applicationId,
        order: index + 1,
        rollNo: record.rollNo,
        studentName: record.studentName,
        status: (record.status[0] +
          record.status.slice(1).toLowerCase()) as AttendanceStatus,
        remarks: record.remarks,
      })),
    );
  }, [attendanceQuery.data]);

  const presentCount = records.filter(
    (record) => record.status === "Present",
  ).length;
  const absentCount = records.filter(
    (record) => record.status === "Absent",
  ).length;
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
      readOnly={!canManageAttendance}
    />
  );

  const columns = getColumns({
    onChangeStatus: handleChangeStatus,
    onChangeRemarks: handleChangeRemarks,
    readOnly: !canManageAttendance,
  });

  return (
    <section className="space-y-6 p-10">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight text-blue-950 dark:text-blue-100">
            Attendance
          </h1>
        </div>
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
              <p className="text-sm font-medium text-foreground">Program</p>
              <Select value={program} onValueChange={setProgram}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select program" />
                </SelectTrigger>
                <SelectContent>
                  {programs.map((option) => (
                    <SelectItem key={option} value={option}>
                      {programLabel(option)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium text-foreground">Course</p>
              <Select
                value={courseId}
                onValueChange={setCourseId}
                disabled={!programCourses.length}
              >
                <SelectTrigger className="w-full">
                  <SelectValue
                    placeholder={
                      coursesQuery.isLoading
                        ? "Loading courses…"
                        : "Select course"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {programCourses.map((course) => (
                    <SelectItem key={course.id} value={course.id}>
                      {course.courseCode} — {course.courseName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {!coursesQuery.isLoading && program && !programCourses.length && (
                <p className="text-xs text-muted-foreground">
                  No active courses are configured for this program yet.
                </p>
              )}
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
              <Button
                className="w-full"
                disabled={
                  !canManageAttendance ||
                  !program ||
                  !courseId ||
                  saveAttendance.isPending ||
                  records.length === 0 ||
                  records.some((record) => !record.applicationId)
                }
                onClick={() =>
                  saveAttendance.mutate(
                    {
                      academicYear,
                      program,
                      courseId,
                      date: attendanceDate,
                      entries: records.map((record) => ({
                        applicationId: record.applicationId,
                        status: record.status.toUpperCase() as
                          | "PRESENT"
                          | "ABSENT"
                          | "LATE",
                        remarks: record.remarks,
                      })),
                    },
                    {
                      onSuccess: () =>
                        toast({
                          title: "Attendance saved",
                          variant: "success",
                        }),
                      onError: () =>
                        toast({
                          title: "Unable to save attendance",
                          variant: "error",
                        }),
                    },
                  )
                }
              >
                <Save className="size-4" />
                Save Attendance
              </Button>
            </div>
          </div>

          {!canManageAttendance && (
            <p className="text-sm text-muted-foreground">
              Only instructors and the Registrar can change or save attendance.
            </p>
          )}

          <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button
                variant="outline"
                className="border-emerald-200 text-emerald-700 hover:bg-emerald-50"
                disabled={!canManageAttendance}
                onClick={() => handleMarkAll("Present")}
              >
                <CheckCircle2 className="size-4" />
                Mark All Present
              </Button>
              <Button
                variant="outline"
                className="border-red-200 text-red-700 hover:bg-red-50"
                disabled={!canManageAttendance}
                onClick={() => handleMarkAll("Absent")}
              >
                <CircleMinus className="size-4" />
                Mark All Absent
              </Button>
              <Button
                variant="outline"
                className="border-amber-200 text-amber-700 hover:bg-amber-50"
                disabled={!canManageAttendance}
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
                    disabled={!canManageAttendance}
                    onClick={() => {
                      setRecords((current) =>
                        current.map((record) =>
                          selectedRows.some(
                            (selected) => selected.id === record.id,
                          )
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
        month={attendanceDate.slice(0, 7)}
      />
    </section>
  );
};

export default Page;
