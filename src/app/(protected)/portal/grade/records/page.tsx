"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  BookMarked,
  ClipboardCheck,
  Filter,
  GraduationCap,
  Plus,
  ShieldCheck,
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
  toApiError,
  useDeleteSeminaryGradeRecordMutation,
  useSeminaryGradeRecordsQuery,
  useUpdateSeminaryGradeRecordStatusMutation,
} from "@/features/seminary/seminary.hooks";
import type {
  SeminaryGradeRecord,
  SeminaryGradeRecordRemark,
  SeminaryGradeRecordStatus,
} from "@/features/seminary/seminary.types";
import { useToast } from "@/hooks/use-toast";

import { StatCard } from "../../academics/classes/_components/stat-card";
import { CellActions } from "./_components/cell-actions";
import { columns } from "./_components/columns";
import { GradeRecordDetailsDialog } from "./_components/grade-record-details-dialog";
import { GradeEncodingWorkspace } from "./_components/grade-encoding-workspace";
import {
  gradeProgramOptions,
  gradeStatusOptions,
  type GradeProgram,
  type GradeRecord,
  type GradeRecordStatus,
  type GradeTerm,
} from "./_components/grade-record-data";

type StatusFilter = "ALL" | GradeRecordStatus;
type ProgramFilter = "ALL" | GradeProgram;

const statusLabelMap: Record<SeminaryGradeRecordStatus, GradeRecordStatus> = {
  COMPLETE: "Complete",
  PENDING_REVIEW: "Pending Review",
  IN_PROGRESS: "In Progress",
  INCOMPLETE: "Incomplete",
};

const remarkLabelMap: Record<
  SeminaryGradeRecordRemark,
  GradeRecord["remarks"]
> = {
  CONDITIONAL: "Conditional",
  FAILED: "Failed",
  ONGOING: "Ongoing",
  PASSED: "Passed",
};

const toGradeRecord = (record: SeminaryGradeRecord): GradeRecord => ({
  courseCode: record.courseCode,
  courseTitle: record.courseTitle,
  finalGrade: record.finalGrade,
  id: record.id,
  instructor: record.instructorName,
  notes: record.notes ?? "",
  program: normalizeProgram(record.program),
  recordId: record.recordNumber,
  remarks: remarkLabelMap[record.remarks],
  status: statusLabelMap[record.status],
  studentApplicationId: record.studentApplicationId ?? undefined,
  studentId: record.studentId,
  studentName: record.studentName,
  subject: record.subject,
  term: normalizeTerm(record.term),
});

const Page = () => {
  const router = useRouter();
  const { toast } = useToast();
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL");
  const [programFilter, setProgramFilter] = useState<ProgramFilter>("ALL");
  const [selectedRecord, setSelectedRecord] = useState<GradeRecord | null>(
    null,
  );
  const [detailsOpen, setDetailsOpen] = useState(false);
  const gradeRecordsQuery = useSeminaryGradeRecordsQuery({
    limit: 100,
    page: 1,
  });
  const updateStatusMutation = useUpdateSeminaryGradeRecordStatusMutation();
  const deleteMutation = useDeleteSeminaryGradeRecordMutation();

  const records = useMemo(
    () => (gradeRecordsQuery.data?.data ?? []).map(toGradeRecord),
    [gradeRecordsQuery.data?.data],
  );

  const filteredRecords = useMemo(() => {
    return records.filter((record) => {
      const matchesStatus =
        statusFilter === "ALL" || record.status === statusFilter;
      const matchesProgram =
        programFilter === "ALL" || record.program === programFilter;

      return matchesStatus && matchesProgram;
    });
  }, [programFilter, records, statusFilter]);

  const totalRecords = records.length;
  const completedRecords = records.filter(
    (record) => record.status === "Complete",
  ).length;
  const pendingReview = records.filter(
    (record) => record.status === "Pending Review",
  ).length;
  const passedRecords = records.filter(
    (record) => record.remarks === "Passed",
  ).length;

  const openRecordDetails = (record: GradeRecord) => {
    setSelectedRecord(record);
    setDetailsOpen(true);
  };

  const openCreate = () => {
    router.push("/portal/grade/records/new");
  };

  const openEdit = (record: GradeRecord) => {
    router.push(`/portal/grade/records/${record.id}`);
  };

  const handleToggleReview = async (target: GradeRecord) => {
    const status =
      target.status === "Pending Review" ? "COMPLETE" : "PENDING_REVIEW";

    try {
      await updateStatusMutation.mutateAsync({ id: target.id, status });
      await gradeRecordsQuery.refetch();
      router.refresh();
    } catch (error) {
      const apiError = toApiError(error);
      toast({
        title: "Status update failed",
        description: apiError.message ?? "Unable to update grade status.",
        variant: "error",
      });
    }
  };

  const handleDelete = async (target: GradeRecord) => {
    try {
      await deleteMutation.mutateAsync(target.id);
      toast({
        title: "Grade deleted",
        description: `${target.recordId} was removed.`,
        variant: "success",
      });
      await gradeRecordsQuery.refetch();
      router.refresh();
    } catch (error) {
      const apiError = toApiError(error);
      toast({
        title: "Delete failed",
        description: apiError.message ?? "Unable to delete grade record.",
        variant: "error",
      });
    }
  };

  const handleOpenStudent = (target: GradeRecord) => {
    router.push(
      `/portal/users/students/${encodeURIComponent(target.studentId)}?mode=view`,
    );
  };

  const renderCellActions = (row: Row<GradeRecord>) => (
    <CellActions
      data={row.original}
      onDelete={handleDelete}
      onEdit={openEdit}
      onOpenStudent={handleOpenStudent}
      onView={openRecordDetails}
      onToggleReview={handleToggleReview}
    />
  );

  return (
    <>
      <section className="space-y-6 p-10">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
          <div className="space-y-2">
            <h1 className="font-serif text-4xl text-emerald-950 dark:text-emerald-50">
              Grade Records
            </h1>
            <p className="text-sm leading-6 text-muted-foreground">
              Encode raw points, review computed equivalents, and manage
              student grade records from one workspace.
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
                <BreadcrumbPage>Grades</BreadcrumbPage>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Records</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="Total Records"
            value={totalRecords}
            description="Encoded grade entries"
            icon={<BookMarked className="size-6" />}
            accentClassName="bg-emerald-500/10 text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-300"
          />
          <StatCard
            title="Completed"
            value={completedRecords}
            description="Fully posted records"
            icon={<ClipboardCheck className="size-6" />}
            accentClassName="bg-teal-500/10 text-teal-700 dark:bg-teal-400/10 dark:text-teal-300"
          />
          <StatCard
            title="Pending Review"
            value={pendingReview}
            description="Awaiting final validation"
            icon={<ShieldCheck className="size-6" />}
            accentClassName="bg-amber-500/10 text-amber-700 dark:bg-amber-400/10 dark:text-amber-300"
          />
          <StatCard
            title="Passed Records"
            value={passedRecords}
            description="With passing remarks"
            icon={<GraduationCap className="size-6" />}
            accentClassName="bg-violet-500/10 text-violet-700 dark:bg-violet-400/10 dark:text-violet-300"
          />
        </div>

        <GradeEncodingWorkspace />

        <Card className="overflow-hidden pt-0! border-emerald-950/10 shadow-sm dark:border-emerald-100/10">
          <div className="border-b border-emerald-950/10 bg-linear-to-r from-emerald-950 to-emerald-900 px-6 py-5 dark:border-emerald-100/10">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div className="space-y-2">
                <h2 className="text-2xl font-semibold text-white">
                  Academic Record Directory
                </h2>
                <p className="text-sm text-emerald-50/80">
                  Search and filter posted records from instructor grade
                  entries.
                </p>
              </div>
            </div>
          </div>

          <CardContent className="p-6 pt-0!">
            <GlobalDataTable
              columns={columns}
              data={filteredRecords}
              cellAction={renderCellActions}
              exportFileName="grade-records"
              filterPlaceholder="Search student, course, instructor, or record ID..."
              emptyMessage="No grade records found."
              pageSizeOptions={[8, 10, 20]}
              toolbarActions={
                <>
                  <Select
                    value={programFilter}
                    onValueChange={(value) =>
                      setProgramFilter(value as ProgramFilter)
                    }
                  >
                    <SelectTrigger className="min-w-40">
                      <div className="flex items-center gap-2">
                        <Filter className="size-4 text-muted-foreground" />
                        <SelectValue placeholder="All Programs" />
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ALL">All Programs</SelectItem>
                      {gradeProgramOptions.map((program) => (
                        <SelectItem key={program} value={program}>
                          {program}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select
                    value={statusFilter}
                    onValueChange={(value) =>
                      setStatusFilter(value as StatusFilter)
                    }
                  >
                    <SelectTrigger className="min-w-44">
                      <div className="flex items-center gap-2">
                        <Filter className="size-4 text-muted-foreground" />
                        <SelectValue placeholder="All Status" />
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ALL">All Status</SelectItem>
                      {gradeStatusOptions.map((status) => (
                        <SelectItem key={status} value={status}>
                          {status}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Button onClick={openCreate}>
                    <Plus className="size-4" />
                    Create Grade
                  </Button>
                </>
              }
            />
          </CardContent>
        </Card>
      </section>

      <GradeRecordDetailsDialog
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
        record={selectedRecord}
      />
    </>
  );
};

export default Page;

const normalizeProgram = (program: string): GradeProgram => {
  if (program === "Bachelor") return "Bachelor";
  if (program === "Masteral") return "Masteral";
  if (program === "Doctorate") return "Doctorate";
  return "Certificate";
};

const normalizeTerm = (term: string): GradeTerm => {
  if (term === "2nd Semester") return "2nd Semester";
  if (term === "Summer") return "Summer";
  return "1st Semester";
};
