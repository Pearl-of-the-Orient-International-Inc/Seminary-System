
"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  BookOpenCheck,
  FileSpreadsheet,
  Filter,
  GraduationCap,
  Plus,
  ShieldCheck,
  Trash2,
  UserRoundCheck,
  UsersRound,
} from "lucide-react";
import type { Row } from "@tanstack/react-table";

import { GlobalDataTable } from "@/components/DataTable";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useBulkDeleteSeminaryStudentsMutation,
  useDeleteSeminaryStudentMutation,
  useSeminaryStudentsQuery,
  useUpdateSeminaryStudentMutation,
} from "@/features/seminary/seminary.hooks";
import { useToast } from "@/hooks/use-toast";
import type {
  SeminaryApplicationDetails,
  SeminaryStudentPayload,
} from "@/features/seminary/seminary.types";

import { StatCard } from "../../academics/classes/_components/stat-card";
import { BulkImportDialog } from "./_components/bulk-import-dialog";
import { CellActions } from "./_components/cell-actions";
import { columns } from "./_components/columns";
import { StudentBarcodeDialog } from "./_components/student-barcode-dialog";
import {
  academicYearOptions,
  programLevelOptions,
  type ProgramLevel,
  type StudentRecord,
  type StudentStatus,
} from "./_components/student-data";
import { StudentQrCodeDialog } from "./_components/student-qr-code-dialog";

type StatusFilter = "ALL" | StudentStatus;
type AcademicYearFilter = "ALL" | (typeof academicYearOptions)[number];
type ProgramLevelFilter = "ALL" | ProgramLevel;

const programLevelLabelMap: Record<string, ProgramLevel> = {
  CERTIFICATE: "Certificate",
  BACHELOR: "Bachelor",
  MASTER_WITH_THESIS: "Masteral",
  DOCTORATE_WITH_DISSERTATION: "Doctorate",
};

const enrollmentTypeLabelMap = {
  REGULAR: "Regular",
  TRANSFEREE: "Transferee",
  CROSS_ENROLLEE: "Cross Enrollee",
} as const;

const studentStatusLabelMap = {
  ACTIVE: "Active",
  GRADUATING: "Graduating",
  LEAVE_OF_ABSENCE: "Leave of Absence",
  INACTIVE: "Inactive",
} as const;

const toStudentRecord = (
  application: SeminaryApplicationDetails,
): StudentRecord => ({
  academicYear: application.academicYear ?? "2025-2026",
  application,
  contactNumber: application.mobilePhone ?? "",
  email: application.emailAddress ?? "",
  enrollmentType: enrollmentTypeLabelMap[application.enrollmentType],
  id: application.studentId ?? application.id,
  name: [application.givenName, application.middleName, application.surname]
    .filter(Boolean)
    .join(" ") || "Unnamed Student",
  program: application.programCourse ?? "No program set",
  programLevel: application.programLevel
    ? programLevelLabelMap[application.programLevel]
    : "Certificate",
  status: studentStatusLabelMap[application.studentStatus],
  townCity: application.homeAddress ?? "",
  yearLevel: application.yearLevel ?? "Foundation",
});

const toStudentPayload = (
  application: SeminaryApplicationDetails,
  status: StudentStatus,
): SeminaryStudentPayload => ({
  academicYear: application.academicYear ?? "",
  birthPlace: application.birthPlace ?? "",
  churchAddress: application.churchAddress ?? "",
  churchAttended: application.churchAttended ?? "",
  civilStatus: application.civilStatus ?? "",
  contactNumber: application.contactNumber ?? "",
  emailAddress: application.emailAddress ?? "",
  enrollmentType: enrollmentTypeLabelMap[application.enrollmentType],
  givenName: application.givenName ?? "",
  homeAddress: application.homeAddress ?? "",
  middleName: application.middleName ?? "",
  ministryInvolved: application.ministryInvolved ?? "",
  mobilePhone: application.mobilePhone ?? "",
  pastorName: application.pastorName ?? "",
  programCourse: application.programCourse ?? "",
  programLevel: application.programLevel
    ? programLevelLabelMap[application.programLevel]
    : "Certificate",
  studentStatus: status,
  surname: application.surname ?? "",
  yearLevel: application.yearLevel ?? "Foundation",
});

const Page = () => {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL");
  const [academicYearFilter, setAcademicYearFilter] =
    useState<AcademicYearFilter>("ALL");
  const [programLevelFilter, setProgramLevelFilter] =
    useState<ProgramLevelFilter>("ALL");
  const [selectedStudent, setSelectedStudent] = useState<StudentRecord | null>(null);
  const [barcodeOpen, setBarcodeOpen] = useState(false);
  const [bulkImportOpen, setBulkImportOpen] = useState(false);
  const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false);
  const [studentsPendingDelete, setStudentsPendingDelete] = useState<
    StudentRecord[]
  >([]);
  const [clearSelectionAfterDelete, setClearSelectionAfterDelete] = useState<
    (() => void) | null
  >(null);
  const [studentPendingDelete, setStudentPendingDelete] =
    useState<StudentRecord | null>(null);
  const [qrCodeOpen, setQrCodeOpen] = useState(false);
  const { toast } = useToast();
  const studentsQuery = useSeminaryStudentsQuery({ limit: 100 });
  const updateStudentMutation = useUpdateSeminaryStudentMutation();
  const deleteStudentMutation = useDeleteSeminaryStudentMutation();
  const bulkDeleteStudentsMutation = useBulkDeleteSeminaryStudentsMutation();

  const students = useMemo(
    () =>
      studentsQuery.data?.data?.map(toStudentRecord) ?? [],
    [studentsQuery.data],
  );

  const filteredStudents = useMemo(() => {
    return students.filter((student) => {
      const matchesStatus =
        statusFilter === "ALL" || student.status === statusFilter;
      const matchesAcademicYear =
        academicYearFilter === "ALL" ||
        student.academicYear === academicYearFilter;
      const matchesProgramLevel =
        programLevelFilter === "ALL" ||
        student.programLevel === programLevelFilter;

      return matchesStatus && matchesAcademicYear && matchesProgramLevel;
    });
  }, [academicYearFilter, programLevelFilter, statusFilter, students]);

  const totalStudents = students.length;
  const activeStudents = students.filter(
    (student) => student.status === "Active",
  ).length;
  const graduatingStudents = students.filter(
    (student) => student.status === "Graduating",
  ).length;
  const higherFormationStudents = students.filter((student) =>
    ["Masteral", "Doctorate"].includes(student.programLevel),
  ).length;

  const handleToggleStatus = (record: StudentRecord) => {
    const application = record.application;

    if (!application?.studentId) {
      return;
    }

    const nextStatus = record.status === "Active" ? "Inactive" : "Active";
    updateStudentMutation.mutate({
      payload: toStudentPayload(application, nextStatus),
      studentId: application.studentId,
    });
  };

  const openDeleteDialog = (student: StudentRecord) => {
    setStudentPendingDelete(student);
  };

  const handleDeleteStudent = async () => {
    if (!studentPendingDelete?.application?.studentId) {
      return;
    }

    try {
      await deleteStudentMutation.mutateAsync(
        studentPendingDelete.application.studentId,
      );
      toast({
        title: "Student deleted",
        description: `${studentPendingDelete.name} was removed from the registry.`,
      });
      setStudentPendingDelete(null);
    } catch (error) {
      toast({
        title: "Delete failed",
        description:
          error instanceof Error ? error.message : "Unable to delete student.",
        variant: "error",
      });
    }
  };

  const openBulkDeleteDialog = (
    selectedStudents: StudentRecord[],
    clearSelection: () => void,
  ) => {
    setStudentsPendingDelete(selectedStudents);
    setClearSelectionAfterDelete(() => clearSelection);
    setBulkDeleteOpen(true);
  };

  const handleBulkDeleteStudents = async () => {
    const studentIds = studentsPendingDelete
      .map((student) => student.application?.studentId)
      .filter((studentId): studentId is string => Boolean(studentId));

    if (!studentIds.length) {
      return;
    }

    try {
      await bulkDeleteStudentsMutation.mutateAsync({ studentIds });
      toast({
        title: "Students deleted",
        description: `${studentIds.length} selected student${
          studentIds.length === 1 ? "" : "s"
        } removed from the registry.`,
      });
      clearSelectionAfterDelete?.();
      setStudentsPendingDelete([]);
      setClearSelectionAfterDelete(null);
      setBulkDeleteOpen(false);
    } catch (error) {
      toast({
        title: "Bulk delete failed",
        description:
          error instanceof Error ? error.message : "Unable to delete students.",
        variant: "error",
      });
    }
  };

  const openBarcodeDialog = (student: StudentRecord) => {
    setSelectedStudent(student);
    setBarcodeOpen(true);
  };

  const openQrCodeDialog = (student: StudentRecord) => {
    setSelectedStudent(student);
    setQrCodeOpen(true);
  };

  const renderCellActions = (row: Row<StudentRecord>) => (
    <CellActions
      data={row.original}
      onDelete={openDeleteDialog}
      onGenerateBarcode={openBarcodeDialog}
      onGenerateQrCode={openQrCodeDialog}
      onToggleStatus={handleToggleStatus}
    />
  );

  return (
    <>
      <section className="space-y-6 p-10">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
          <div className="space-y-2">
            <h1 className="font-serif text-4xl text-emerald-950 dark:text-emerald-50">
              Students
            </h1>
            <p className="text-sm max-w-2xl text-muted-foreground">
              Monitor enrolled seminarians and chaplaincy students across
              certificate, bachelor, masteral, and doctoral programs in one
              consistent registry.
            </p>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row xl:justify-end">
            <Button asChild>
              <Link href="/admin/users/students/new">
                <Plus className="size-4" />
                Add Student
              </Link>
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setBulkImportOpen(true)}
            >
              <FileSpreadsheet className="size-4" />
              Bulk Import Excel
            </Button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="Total Students"
            value={totalStudents}
            description="Across academic years"
            icon={<UsersRound className="size-6" />}
            accentClassName="bg-emerald-500/10 text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-300"
          />
          <StatCard
            title="Active Students"
            value={activeStudents}
            description="Currently in good standing"
            icon={<UserRoundCheck className="size-6" />}
            accentClassName="bg-teal-500/10 text-teal-700 dark:bg-teal-400/10 dark:text-teal-300"
          />
          <StatCard
            title="Graduating"
            value={graduatingStudents}
            description="For completion this cycle"
            icon={<GraduationCap className="size-6" />}
            accentClassName="bg-amber-500/10 text-amber-700 dark:bg-amber-400/10 dark:text-amber-300"
          />
          <StatCard
            title="Masteral & Doctorate"
            value={higherFormationStudents}
            description="Advanced theological"
            icon={<BookOpenCheck className="size-6" />}
            accentClassName="bg-violet-500/10 text-violet-700 dark:bg-violet-400/10 dark:text-violet-300"
          />
        </div>

        <Card className="overflow-hidden pt-0! border-emerald-950/10 shadow-sm dark:border-emerald-100/10">
          <div className="border-b border-emerald-950/10 bg-linear-to-r from-emerald-950 to-emerald-900 px-6 py-5 dark:border-emerald-100/10">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 text-xs uppercase text-emerald-100/70">
                  <ShieldCheck className="size-3.5" />
                  Student Registry
                </div>
                <h2 className="text-2xl font-semibold text-white">
                  Enrollment Directory
                </h2>
                <p className="max-w-2xl text-sm text-emerald-50/80">
                  Search, filter, and review student records while keeping the
                  layout aligned with the rest of the seminary.
                </p>
              </div>

              <div className="grid gap-3 text-sm text-emerald-50/85 sm:grid-cols-3">
                <div className="rounded-2xl border border-white/10 bg-white/8 px-4 py-3 backdrop-blur-sm">
                  <div className="text-xs uppercase text-emerald-100/65">
                    Certificate
                  </div>
                  <div className="mt-1 text-xl font-semibold">
                    {
                      students.filter((student) => student.programLevel === "Certificate")
                        .length
                    }
                  </div>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/8 px-4 py-3 backdrop-blur-sm">
                  <div className="text-xs uppercase text-emerald-100/65">
                    Bachelor
                  </div>
                  <div className="mt-1 text-xl font-semibold">
                    {students.filter((student) => student.programLevel === "Bachelor").length}
                  </div>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/8 px-4 py-3 backdrop-blur-sm">
                  <div className="text-xs uppercase text-emerald-100/65">
                    Higher
                  </div>
                  <div className="mt-1 text-xl font-semibold">
                    {higherFormationStudents}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <CardContent className="p-6">
            <GlobalDataTable
              columns={columns}
              data={filteredStudents}
              cellAction={renderCellActions}
              exportFileName="students"
              filterPlaceholder="Search student, program, contact, or ID..."
              emptyMessage="No student records found."
              pageSizeOptions={[8, 10, 20]}
              renderSelectedActions={(selectedRows, { clearSelection }) => (
                <Button
                  type="button"
                  variant="destructive"
                  size="xs"
                  onClick={() =>
                    openBulkDeleteDialog(selectedRows, clearSelection)
                  }
                >
                  <Trash2 className="size-3.5" />
                  Delete selected
                </Button>
              )}
              toolbarActions={
                <>
                  <Select
                    value={academicYearFilter}
                    onValueChange={(value) =>
                      setAcademicYearFilter(value as AcademicYearFilter)
                    }
                  >
                    <SelectTrigger className="min-w-48">
                      <div className="flex items-center gap-2">
                        <Filter className="size-4 text-muted-foreground" />
                        <SelectValue placeholder="All Academic Years" />
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ALL">All Academic Years</SelectItem>
                      {academicYearOptions.map((academicYear) => (
                        <SelectItem key={academicYear} value={academicYear}>
                          {academicYear}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select
                    value={programLevelFilter}
                    onValueChange={(value) =>
                      setProgramLevelFilter(value as ProgramLevelFilter)
                    }
                  >
                    <SelectTrigger className="min-w-40">
                      <div className="flex items-center gap-2">
                        <Filter className="size-4 text-muted-foreground" />
                        <SelectValue placeholder="All Levels" />
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ALL">All Levels</SelectItem>
                      {programLevelOptions.map((level) => (
                        <SelectItem key={level} value={level}>
                          {level}
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
                      <SelectItem value="Graduating">Graduating</SelectItem>
                      <SelectItem value="Leave of Absence">
                        Leave of Absence
                      </SelectItem>
                      <SelectItem value="Inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </>
              }
            />
          </CardContent>
        </Card>
      </section>

      <BulkImportDialog
        open={bulkImportOpen}
        onOpenChange={setBulkImportOpen}
      />
      <StudentBarcodeDialog
        open={barcodeOpen}
        onOpenChange={setBarcodeOpen}
        student={selectedStudent}
      />
      <StudentQrCodeDialog
        open={qrCodeOpen}
        onOpenChange={setQrCodeOpen}
        student={selectedStudent}
      />
      <AlertDialog
        open={Boolean(studentPendingDelete)}
        onOpenChange={(open) => {
          if (!open) {
            setStudentPendingDelete(null);
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete student?</AlertDialogTitle>
            <AlertDialogDescription>
              This permanently removes{" "}
              {studentPendingDelete?.name ?? "this student"} and related
              seminary records. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteStudentMutation.isPending}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              disabled={deleteStudentMutation.isPending}
              onClick={(event) => {
                event.preventDefault();
                void handleDeleteStudent();
              }}
            >
              {deleteStudentMutation.isPending ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <AlertDialog
        open={bulkDeleteOpen}
        onOpenChange={(open) => {
          setBulkDeleteOpen(open);
          if (!open) {
            setStudentsPendingDelete([]);
            setClearSelectionAfterDelete(null);
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete selected students?</AlertDialogTitle>
            <AlertDialogDescription>
              This permanently removes {studentsPendingDelete.length} selected
              student{studentsPendingDelete.length === 1 ? "" : "s"} and related
              seminary records. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={bulkDeleteStudentsMutation.isPending}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              disabled={bulkDeleteStudentsMutation.isPending}
              onClick={(event) => {
                event.preventDefault();
                void handleBulkDeleteStudents();
              }}
            >
              {bulkDeleteStudentsMutation.isPending
                ? "Deleting..."
                : "Delete selected"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default Page;
