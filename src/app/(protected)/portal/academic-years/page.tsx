"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  BookOpenCheck,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Filter,
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
  toApiError,
  useCreateSeminaryAcademicYearMutation,
  useDeleteSeminaryAcademicYearMutation,
  useSeminaryAcademicYearsQuery,
  useUpdateSeminaryAcademicYearMutation,
  useUpdateSeminaryAcademicYearSessionMutation,
  useUpdateSeminaryAcademicYearStatusMutation,
} from "@/features/seminary/seminary.hooks";
import type {
  SeminaryAcademicYear,
  SeminaryAcademicYearSession,
  SeminaryAcademicYearStatus,
} from "@/features/seminary/seminary.types";
import { useToast } from "@/hooks/use-toast";

import { AcademicYearDialog, type AcademicYearDialogValues } from "./_components/academic-year-dialog";
import { CellActions } from "./_components/cell-actions";
import {
  columns,
  type AcademicYearRecord,
  type AcademicYearSession,
  type AcademicYearStatus,
} from "./_components/columns";
import { StatCard } from "./_components/stat-card";

type StatusFilter = "ALL" | AcademicYearStatus;

const sessionLabelMap: Record<SeminaryAcademicYearSession, AcademicYearSession> = {
  CURRENT: "Current",
  PREVIOUS: "Previous",
  UPCOMING: "Upcoming",
};

const sessionValueMap: Record<AcademicYearSession, SeminaryAcademicYearSession> = {
  Current: "CURRENT",
  Previous: "PREVIOUS",
  Upcoming: "UPCOMING",
};

const statusLabelMap: Record<SeminaryAcademicYearStatus, AcademicYearStatus> = {
  ACTIVE: "Active",
  UPCOMING: "Upcoming",
  COMPLETED: "Completed",
};

const statusValueMap: Record<AcademicYearStatus, SeminaryAcademicYearStatus> = {
  Active: "ACTIVE",
  Upcoming: "UPCOMING",
  Completed: "COMPLETED",
};

const formatDate = (value: string | Date) =>
  new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));

const toAcademicYearRecord = (
  academicYear: SeminaryAcademicYear,
  index: number,
): AcademicYearRecord => ({
  id: academicYear.id,
  order: academicYear.sortOrder || index + 1,
  academicYear: academicYear.academicYear,
  session: sessionLabelMap[academicYear.session],
  status: statusLabelMap[academicYear.status],
  startDate: formatDate(academicYear.startDate),
  endDate: formatDate(academicYear.endDate),
});

const toAcademicYearPayload = (values: AcademicYearDialogValues) => ({
  academicYear: values.academicYear,
  session: sessionValueMap[values.session],
  status: statusValueMap[values.status],
  startDate: values.startDate.toISOString(),
  endDate: values.endDate.toISOString(),
});

export const Page = () => {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<AcademicYearRecord | null>(null);
  const { toast } = useToast();

  const academicYearsQuery = useSeminaryAcademicYearsQuery({
    limit: 100,
    page: 1,
  });
  const createAcademicYearMutation = useCreateSeminaryAcademicYearMutation();
  const updateAcademicYearMutation = useUpdateSeminaryAcademicYearMutation();
  const updateAcademicYearSessionMutation =
    useUpdateSeminaryAcademicYearSessionMutation();
  const updateAcademicYearStatusMutation =
    useUpdateSeminaryAcademicYearStatusMutation();
  const deleteAcademicYearMutation = useDeleteSeminaryAcademicYearMutation();

  const academicYears = useMemo(
    () => (academicYearsQuery.data?.data ?? []).map(toAcademicYearRecord),
    [academicYearsQuery.data?.data],
  );

  const filteredData = useMemo(() => {
    if (statusFilter === "ALL") {
      return academicYears;
    }

    return academicYears.filter((record) => record.status === statusFilter);
  }, [academicYears, statusFilter]);

  const totalAcademicYears = academicYears.length;
  const activeAcademicYears = academicYears.filter(
    (record) => record.status === "Active",
  ).length;
  const upcomingAcademicYears = academicYears.filter(
    (record) => record.status === "Upcoming",
  ).length;
  const completedAcademicYears = academicYears.filter(
    (record) => record.status === "Completed",
  ).length;

  const handleCreate = () => {
    setSelectedRecord(null);
    setDialogOpen(true);
  };

  const handleEdit = (record: AcademicYearRecord) => {
    setSelectedRecord(record);
    setDialogOpen(true);
  };

  const handleDelete = async (record: AcademicYearRecord) => {
    try {
      await deleteAcademicYearMutation.mutateAsync(record.id);
      toast({
        title: "Academic year deleted",
        description: `${record.academicYear} was removed.`,
        variant: "success",
      });
    } catch (error) {
      const apiError = toApiError(error);
      toast({
        title: "Delete failed",
        description: apiError.message ?? "Unable to delete academic year.",
        variant: "error",
      });
    }
  };

  const handleChangeSession = async (
    record: AcademicYearRecord,
    session: AcademicYearSession,
  ) => {
    try {
      await updateAcademicYearSessionMutation.mutateAsync({
        id: record.id,
        session: sessionValueMap[session],
      });
      toast({
        title: "Session updated",
        description: `${record.academicYear} was marked as ${session.toLowerCase()}.`,
        variant: "success",
      });
    } catch (error) {
      const apiError = toApiError(error);
      toast({
        title: "Session update failed",
        description: apiError.message ?? "Unable to update session.",
        variant: "error",
      });
    }
  };

  const handleChangeStatus = async (
    record: AcademicYearRecord,
    status: AcademicYearStatus,
  ) => {
    try {
      await updateAcademicYearStatusMutation.mutateAsync({
        id: record.id,
        status: statusValueMap[status],
      });
      toast({
        title: "Status updated",
        description: `${record.academicYear} was marked as ${status.toLowerCase()}.`,
        variant: "success",
      });
    } catch (error) {
      const apiError = toApiError(error);
      toast({
        title: "Status update failed",
        description: apiError.message ?? "Unable to update status.",
        variant: "error",
      });
    }
  };

  const handleDialogSubmit = async (values: AcademicYearDialogValues) => {
    try {
      if (selectedRecord) {
        await updateAcademicYearMutation.mutateAsync({
          id: selectedRecord.id,
          payload: toAcademicYearPayload(values),
        });
        toast({
          title: "Academic year updated",
          description: `${values.academicYear} was updated successfully.`,
          variant: "success",
        });
      } else {
        await createAcademicYearMutation.mutateAsync(toAcademicYearPayload(values));
        toast({
          title: "Academic year created",
          description: `${values.academicYear} was added.`,
          variant: "success",
        });
      }

      setDialogOpen(false);
      setSelectedRecord(null);
    } catch (error) {
      const apiError = toApiError(error);
      toast({
        title: selectedRecord ? "Update failed" : "Create failed",
        description: apiError.message ?? "Unable to save academic year.",
        variant: "error",
      });
    }
  };

  const renderCellActions = (row: Row<AcademicYearRecord>) => (
    <CellActions
      data={row.original}
      onChangeSession={handleChangeSession}
      onChangeStatus={handleChangeStatus}
      onDelete={handleDelete}
      onEdit={handleEdit}
    />
  );

  const isSaving =
    createAcademicYearMutation.isPending || updateAcademicYearMutation.isPending;

  return (
    <>
      <section className="space-y-6 p-10">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
          <div className="space-y-2">
            <h1 className="text-3xl font-semibold tracking-tight text-blue-950 dark:text-blue-100">
              Academic Years
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
                <BreadcrumbPage>Academic Years</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="Total Academic Years"
            value={totalAcademicYears}
            description="All time"
            icon={<CalendarDays className="size-6" />}
            accentClassName="bg-blue-500/10 text-blue-700 dark:bg-blue-400/10 dark:text-blue-300"
          />
          <StatCard
            title="Active Academic Years"
            value={activeAcademicYears}
            description="Currently active"
            icon={<CheckCircle2 className="size-6" />}
            accentClassName="bg-emerald-500/10 text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-300"
          />
          <StatCard
            title="Upcoming Years"
            value={upcomingAcademicYears}
            description="Starting in future"
            icon={<Clock3 className="size-6" />}
            accentClassName="bg-amber-500/10 text-amber-700 dark:bg-amber-400/10 dark:text-amber-300"
          />
          <StatCard
            title="Completed Years"
            value={completedAcademicYears}
            description="Completed"
            icon={<BookOpenCheck className="size-6" />}
            accentClassName="bg-violet-500/10 text-violet-700 dark:bg-violet-400/10 dark:text-violet-300"
          />
        </div>

        <Card className="border-border/70 shadow-sm">
          <CardContent>
            <GlobalDataTable
              columns={columns}
              data={filteredData}
              cellAction={renderCellActions}
              exportFileName="academic-years"
              filterPlaceholder="Search academic years..."
              emptyMessage={
                academicYearsQuery.isLoading
                  ? "Loading academic years..."
                  : "No academic years found."
              }
              pageSizeOptions={[6, 10, 20]}
              toolbarActions={
                <>
                  <Select
                    value={statusFilter}
                    onValueChange={(value) =>
                      setStatusFilter(value as StatusFilter)
                    }
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
                      <SelectItem value="Upcoming">Upcoming</SelectItem>
                      <SelectItem value="Completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>

                  <Button onClick={handleCreate}>
                    <Plus className="size-4" />
                    Add Academic Year
                  </Button>
                </>
              }
            />
          </CardContent>
        </Card>
      </section>

      <AcademicYearDialog
        open={dialogOpen}
        onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) setSelectedRecord(null);
        }}
        onSubmit={handleDialogSubmit}
        record={selectedRecord}
        submitting={isSaving}
      />
    </>
  );
};

export default Page;
