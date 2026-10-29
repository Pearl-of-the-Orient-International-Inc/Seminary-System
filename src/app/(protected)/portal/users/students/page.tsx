"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  Barcode,
  BookOpenCheck,
  FileSpreadsheet,
  Filter,
  GraduationCap,
  Plus,
  QrCode,
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
  toApiError,
  useBulkDeleteSeminaryStudentsMutation,
  useChangeSeminaryStudentPasswordMutation,
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
import { BatchCredentialAssetsDialog } from "./_components/batch-credential-assets-dialog";
import { BulkImportDialog } from "./_components/bulk-import-dialog";
import { CellActions } from "./_components/cell-actions";
import { columns } from "./_components/columns";
import { StudentBarcodeDialog } from "./_components/student-barcode-dialog";
import {
  programLevelOptions,
  type ProgramLevel,
  type SchoolAffiliation,
  type StudentRecord,
  type StudentStatus,
} from "./_components/student-data";
import { StudentQrCodeDialog } from "./_components/student-qr-code-dialog";
import { ChangeStudentPasswordDialog } from "./_components/change-student-password-dialog";

type StatusFilter = "ALL" | StudentStatus;
type ProgramLevelFilter = "ALL" | ProgramLevel;
type SchoolAffiliationFilter = "ALL" | SchoolAffiliation;
type BatchAssetMode = "barcode" | "qr";

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

const schoolAffiliationLabelMap = {
  IN_HOUSE: "In-House",
  PARTNER_SCHOOL: "Partner School",
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
  name:
    [application.givenName, application.middleName, application.surname]
      .filter(Boolean)
      .join(" ") || "Unnamed Student",
  program: application.programCourse ?? "No program set",
  programLevel: application.programLevel
    ? programLevelLabelMap[application.programLevel]
    : "Certificate",
  schoolAffiliation:
    schoolAffiliationLabelMap[application.schoolAffiliation] ?? "In-House",
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
  schoolAffiliation:
    schoolAffiliationLabelMap[application.schoolAffiliation] ?? "In-House",
  studentStatus: status,
  surname: application.surname ?? "",
  yearLevel: application.yearLevel ?? "Foundation",
});

const Page = () => {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL");
  const [programLevelFilter, setProgramLevelFilter] =
    useState<ProgramLevelFilter>("ALL");
  const [schoolAffiliationFilter, setSchoolAffiliationFilter] =
    useState<SchoolAffiliationFilter>("ALL");
  const [selectedStudent, setSelectedStudent] = useState<StudentRecord | null>(
    null,
  );
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
  const [studentPendingStatusChange, setStudentPendingStatusChange] =
    useState<StudentRecord | null>(null);
  const [studentPendingPasswordChange, setStudentPendingPasswordChange] =
    useState<StudentRecord | null>(null);
  const [qrCodeOpen, setQrCodeOpen] = useState(false);
  const [batchAssetMode, setBatchAssetMode] = useState<BatchAssetMode | null>(
    null,
  );
  const [batchAssetStudents, setBatchAssetStudents] = useState<StudentRecord[]>(
    [],
  );
  const { toast } = useToast();
  const studentsQuery = useSeminaryStudentsQuery();
  const updateStudentMutation = useUpdateSeminaryStudentMutation();
  const deleteStudentMutation = useDeleteSeminaryStudentMutation();
  const bulkDeleteStudentsMutation = useBulkDeleteSeminaryStudentsMutation();
  const changePasswordMutation = useChangeSeminaryStudentPasswordMutation();

  const students = useMemo(
    () => studentsQuery.data?.data?.map(toStudentRecord) ?? [],
    [studentsQuery.data],
  );

  const filteredStudents = useMemo(() => {
    return students.filter((student) => {
      const matchesStatus =
        statusFilter === "ALL" || student.status === statusFilter;
      const matchesProgramLevel =
        programLevelFilter === "ALL" ||
        student.programLevel === programLevelFilter;
      const matchesSchoolAffiliation =
        schoolAffiliationFilter === "ALL" ||
        student.schoolAffiliation === schoolAffiliationFilter;

      return (
        matchesStatus &&
        matchesProgramLevel &&
        matchesSchoolAffiliation
      );
    });
  }, [
    programLevelFilter,
    schoolAffiliationFilter,
    statusFilter,
    students,
  ]);

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
  const partnerSchoolStudents = students.filter(
    (student) => student.schoolAffiliation === "Partner School",
  ).length;

  const openStatusDialog = (record: StudentRecord) => {
    setStudentPendingStatusChange(record);
  };

  const handleConfirmStatusChange = async () => {
    const record = studentPendingStatusChange;
    const application = record?.application;

    if (!record || !application?.studentId) {
      return;
    }

    const nextStatus = record.status === "Active" ? "Inactive" : "Active";

    try {
      await updateStudentMutation.mutateAsync({
        payload: toStudentPayload(application, nextStatus),
        studentId: application.studentId,
      });
      toast({
        title: "Student status updated",
        description: `${record.name} was set to ${nextStatus.toLowerCase()}.`,
      });
      setStudentPendingStatusChange(null);
    } catch (error) {
      toast({
        title: "Status update failed",
        description:
          error instanceof Error
            ? error.message
            : "Unable to update student status.",
        variant: "error",
      });
    }
  };

  const handleToggleStatus = (record: StudentRecord) => {
    const application = record.application;

    if (!application?.studentId) {
      toast({
        title: "Status update unavailable",
        description: "This row has no student ID to update.",
        variant: "error",
      });
      return;
    }

    openStatusDialog(record);
  };

  const openDeleteDialog = (student: StudentRecord) => {
    setStudentPendingDelete(student);
  };

  const handleChangePassword = async (
    password: string,
    confirmPassword: string,
  ) => {
    const student = studentPendingPasswordChange;
    const studentId = student?.application?.studentId;
    if (!studentId) return;

    if (password !== confirmPassword) {
      toast({ title: "Passwords do not match", description: "Enter the same new password in both fields.", variant: "error" });
      return;
    }

    try {
      await changePasswordMutation.mutateAsync({ studentId, password, confirmPassword });
      toast({ title: "Password changed", description: `A new password was saved for ${student.name}.`, variant: "success" });
      setStudentPendingPasswordChange(null);
    } catch (error) {
      toast({
        title: "Password change failed",
        description: toApiError(error).message,
        variant: "error",
      });
    }
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

  const openBatchAssetDialog = (
    mode: BatchAssetMode,
    selectedStudents: StudentRecord[],
  ) => {
    setBatchAssetMode(mode);
    setBatchAssetStudents(selectedStudents);
  };

  const renderCellActions = (row: Row<StudentRecord>) => (
    <CellActions
      data={row.original}
      onDelete={openDeleteDialog}
      onGenerateBarcode={openBarcodeDialog}
      onGenerateQrCode={openQrCodeDialog}
      onToggleStatus={handleToggleStatus}
      onChangePassword={setStudentPendingPasswordChange}
    />
  );

  return (
    <>
      <section className="min-w-0 max-w-full space-y-6 overflow-x-hidden p-10">
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

        <div className="grid min-w-0 gap-4 md:grid-cols-2 xl:grid-cols-4">
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
            title="Partner School"
            value={partnerSchoolStudents}
            description="External school affiliation"
            icon={<BookOpenCheck className="size-6" />}
            accentClassName="bg-violet-500/10 text-violet-700 dark:bg-violet-400/10 dark:text-violet-300"
          />
        </div>

        <Card className="min-w-0 overflow-hidden pt-0! border-emerald-950/10 shadow-sm dark:border-emerald-100/10">
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
                      students.filter(
                        (student) => student.programLevel === "Certificate",
                      ).length
                    }
                  </div>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/8 px-4 py-3 backdrop-blur-sm">
                  <div className="text-xs uppercase text-emerald-100/65">
                    Bachelor
                  </div>
                  <div className="mt-1 text-xl font-semibold">
                    {
                      students.filter(
                        (student) => student.programLevel === "Bachelor",
                      ).length
                    }
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

          <CardContent className="min-w-0 p-6 pt-0!">
            <GlobalDataTable
              columns={columns}
              data={filteredStudents}
              cellAction={renderCellActions}
              exportFileName="students"
              filterPlaceholder="Search student, program, contact, or ID..."
              emptyMessage="No student records found."
              pageSizeOptions={[8, 10, 20, 50, 100, 500]}
              selectedActionsPosition="floating"
              renderSelectedActions={(selectedRows, { clearSelection }) => (
                <>
                  <Button
                    type="button"
                    variant="outline"
                    size="xs"
                    onClick={() =>
                      openBatchAssetDialog("barcode", selectedRows)
                    }
                  >
                    <Barcode className="size-3.5" />
                    Download barcodes
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="xs"
                    onClick={() => openBatchAssetDialog("qr", selectedRows)}
                  >
                    <QrCode className="size-3.5" />
                    Download QR codes
                  </Button>
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
                </>
              )}
              toolbarActions={
                <>
                  <Select
                    value={programLevelFilter}
                    onValueChange={(value) =>
                      setProgramLevelFilter(value as ProgramLevelFilter)
                    }
                  >
                    <SelectTrigger className="w-full sm:w-40">
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
                    value={schoolAffiliationFilter}
                    onValueChange={(value) =>
                      setSchoolAffiliationFilter(
                        value as SchoolAffiliationFilter,
                      )
                    }
                  >
                    <SelectTrigger className="w-full sm:w-44">
                      <div className="flex items-center gap-2">
                        <Filter className="size-4 text-muted-foreground" />
                        <SelectValue placeholder="All Schools" />
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ALL">All Schools</SelectItem>
                      <SelectItem value="In-House">In-House</SelectItem>
                      <SelectItem value="Partner School">
                        Partner School
                      </SelectItem>
                    </SelectContent>
                  </Select>

                  <Select
                    value={statusFilter}
                    onValueChange={(value) =>
                      setStatusFilter(value as StatusFilter)
                    }
                  >
                    <SelectTrigger className="w-full sm:w-40">
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
      <ChangeStudentPasswordDialog
        key={studentPendingPasswordChange?.id ?? "closed"}
        open={Boolean(studentPendingPasswordChange)}
        student={studentPendingPasswordChange}
        isPending={changePasswordMutation.isPending}
        onOpenChange={(open) => !open && setStudentPendingPasswordChange(null)}
        onSubmit={handleChangePassword}
      />

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
      <BatchCredentialAssetsDialog
        mode={batchAssetMode ?? "barcode"}
        open={Boolean(batchAssetMode)}
        onOpenChange={(open) => {
          if (!open) {
            setBatchAssetMode(null);
            setBatchAssetStudents([]);
          }
        }}
        students={batchAssetStudents}
      />
      <AlertDialog
        open={Boolean(studentPendingStatusChange)}
        onOpenChange={(open) => {
          if (!open) {
            setStudentPendingStatusChange(null);
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {studentPendingStatusChange?.status === "Active"
                ? "Set student inactive?"
                : "Set student active?"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              This updates{" "}
              {studentPendingStatusChange?.name ?? "this student"} in the
              registry to{" "}
              {studentPendingStatusChange?.status === "Active"
                ? "inactive"
                : "active"}
              .
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={updateStudentMutation.isPending}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              variant={
                studentPendingStatusChange?.status === "Active"
                  ? "destructive"
                  : "default"
              }
              disabled={updateStudentMutation.isPending}
              onClick={(event) => {
                event.preventDefault();
                void handleConfirmStatusChange();
              }}
            >
              {updateStudentMutation.isPending
                ? "Updating..."
                : studentPendingStatusChange?.status === "Active"
                  ? "Set inactive"
                  : "Set active"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
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
