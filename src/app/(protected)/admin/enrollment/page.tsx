"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  BadgeCheck,
  CreditCard,
  FileCheck2,
  Filter,
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
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

import { StatCard } from "../academics/classes/_components/stat-card";
import { CellActions } from "./_components/cell-actions";
import { columns } from "./_components/columns";
import {
  enrollmentProgramOptions,
  enrollmentStatusOptions,
  enrollmentTypeOptions,
  mapSeminaryApplicationToEnrollmentRecord,
  type EnrollmentProgram,
  type EnrollmentRecord,
  type EnrollmentStatus,
  type EnrollmentType,
} from "./_components/enrollment-data";
import { EnrollmentDetailsDialog } from "./_components/enrollment-details-dialog";
import { EnrollmentOverview } from "./_components/enrollment-overview";
import {
  toApiError,
  useSeminaryApplicationsQuery,
  useUpdateSeminaryApplicationStatusMutation,
} from "@/features/seminary/seminary.hooks";
import type { SeminaryApplicationStatus } from "@/features/seminary/seminary.types";
import { useToast } from "@/hooks/use-toast";

type StatusFilter = "ALL" | EnrollmentStatus;
type ProgramFilter = "ALL" | EnrollmentProgram;
type TypeFilter = "ALL" | EnrollmentType;

const Page = () => {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL");
  const [programFilter, setProgramFilter] = useState<ProgramFilter>("ALL");
  const [typeFilter, setTypeFilter] = useState<TypeFilter>("ALL");
  const [selectedRecord, setSelectedRecord] = useState<EnrollmentRecord | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [rejectingRecord, setRejectingRecord] =
    useState<EnrollmentRecord | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const { toast } = useToast();
  const applicationsQuery = useSeminaryApplicationsQuery({ limit: 100, page: 1 });
  const updateStatusMutation = useUpdateSeminaryApplicationStatusMutation();

  const records = useMemo(
    () =>
      (applicationsQuery.data?.data ?? []).map(
        mapSeminaryApplicationToEnrollmentRecord,
      ),
    [applicationsQuery.data?.data],
  );

  const filteredRecords = useMemo(() => {
    return records.filter((record) => {
      const matchesStatus =
        statusFilter === "ALL" || record.status === statusFilter;
      const matchesProgram =
        programFilter === "ALL" || record.programLevel === programFilter;
      const matchesType = typeFilter === "ALL" || record.enrollmentType === typeFilter;

      return matchesStatus && matchesProgram && matchesType;
    });
  }, [programFilter, records, statusFilter, typeFilter]);

  const totalApplications = records.length;
  const enrolledCount = records.filter((record) => record.status === "Enrolled").length;
  const paymentReviewCount = records.filter(
    (record) => record.status === "For Payment Review",
  ).length;
  const verifiedDocuments = records.filter(
    (record) => record.documentsStatus === "Complete",
  ).length;

  const openEnrollmentDetails = (record: EnrollmentRecord) => {
    setSelectedRecord(record);
    setDetailsOpen(true);
  };

  const handleChangeStatus = (
    target: EnrollmentRecord,
    status: Exclude<SeminaryApplicationStatus, "SUBMITTED" | "CANCELLED">,
  ) => {
    const applicationId = target.application?.id;

    if (!applicationId) {
      toast({
        title: "Application record missing",
        description: "This enrollment row is not linked to a seminary application.",
        variant: "warning",
      });
      return;
    }

    if (status === "REJECTED") {
      setRejectingRecord(target);
      setRejectionReason(target.application?.reviewRemarks ?? "");
      return;
    }

    updateStatusMutation.mutate(
      {
        id: applicationId,
        status,
      },
      {
        onSuccess: () => {
          toast({
            title: "Enrollment status updated",
            description: `${target.studentName} was marked as ${status.toLowerCase().replace(/_/g, " ")}. An email notice was sent if an address is on file.`,
            variant: "success",
          });
        },
        onError: (error) => {
          const apiError = toApiError(error);

          toast({
            title: "Unable to update status",
            description: apiError.message ?? "Please try again.",
            variant: "error",
          });
        },
      },
    );
  };

  const handleConfirmRejection = () => {
    const applicationId = rejectingRecord?.application?.id;
    const reason = rejectionReason.trim();

    if (!applicationId || !rejectingRecord) return;

    if (!reason) {
      toast({
        title: "Rejection reason required",
        description: "Please add a short reason before rejecting this application.",
        variant: "warning",
      });
      return;
    }

    updateStatusMutation.mutate(
      {
        id: applicationId,
        reviewRemarks: reason,
        status: "REJECTED",
      },
      {
        onSuccess: () => {
          toast({
            title: "Application rejected",
            description: `${rejectingRecord.studentName} was notified by email if an address is on file.`,
            variant: "success",
          });
          setRejectingRecord(null);
          setRejectionReason("");
        },
        onError: (error) => {
          const apiError = toApiError(error);

          toast({
            title: "Unable to reject application",
            description: apiError.message ?? "Please try again.",
            variant: "error",
          });
        },
      },
    );
  };

  const renderCellActions = (row: Row<EnrollmentRecord>) => (
    <CellActions
      data={row.original}
      onView={openEnrollmentDetails}
      onChangeStatus={handleChangeStatus}
    />
  );

  return (
    <>
      <section className="space-y-6 p-10">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
          <div className="space-y-2">
            <h1 className="font-serif text-4xl text-emerald-950 dark:text-emerald-50">
              Enrollment
            </h1>
            <p className="text-sm leading-6 text-muted-foreground">
              Manage application progress, payment verification, and document completion
              across the seminary enrollment pipeline.
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
                <BreadcrumbPage>Admissions</BreadcrumbPage>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Enrollment</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="Applications"
            value={totalApplications}
            description="Active cycle entries"
            icon={<UsersRound className="size-6" />}
            accentClassName="bg-emerald-500/10 text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-300"
          />
          <StatCard
            title="Enrolled"
            value={enrolledCount}
            description="Successfully activated"
            icon={<BadgeCheck className="size-6" />}
            accentClassName="bg-teal-500/10 text-teal-700 dark:bg-teal-400/10 dark:text-teal-300"
          />
          <StatCard
            title="For Payment Review"
            value={paymentReviewCount}
            description="Awaiting finance validation"
            icon={<CreditCard className="size-6" />}
            accentClassName="bg-amber-500/10 text-amber-700 dark:bg-amber-400/10 dark:text-amber-300"
          />
          <StatCard
            title="Verified Documents"
            value={verifiedDocuments}
            description="Requirements complete"
            icon={<FileCheck2 className="size-6" />}
            accentClassName="bg-violet-500/10 text-violet-700 dark:bg-violet-400/10 dark:text-violet-300"
          />
        </div>

        <EnrollmentOverview records={records} />

        <Card className="overflow-hidden pt-0! border-emerald-950/10 shadow-sm dark:border-emerald-100/10">
          <div className="border-b border-emerald-950/10 bg-linear-to-r from-emerald-950 to-emerald-900 px-6 py-5 dark:border-emerald-100/10">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div className="space-y-2">
                <h2 className="text-2xl font-semibold text-white">
                  Application Directory
                </h2>
                <p className="text-sm text-emerald-50/80">
                  Review applicant progress, payment proof, and onboarding readiness
                  in the same visual language as the rest of the seminary.
                </p>
              </div>

              <div className="grid gap-3 text-sm text-emerald-50/85 sm:grid-cols-3">
                <div className="rounded-2xl border border-white/10 bg-white/8 px-4 py-3 backdrop-blur-sm">
                  <div className="text-xs uppercase text-emerald-100/65">
                    Bachelor
                  </div>
                  <div className="mt-1 text-xl font-semibold">
                    {records.filter((record) => record.programLevel === "Bachelor").length}
                  </div>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/8 px-4 py-3 backdrop-blur-sm">
                  <div className="text-xs uppercase text-emerald-100/65">
                    Graduate
                  </div>
                  <div className="mt-1 text-xl font-semibold">
                    {
                      records.filter((record) =>
                        ["Masteral", "Doctorate"].includes(record.programLevel),
                      ).length
                    }
                  </div>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/8 px-4 py-3 backdrop-blur-sm">
                  <div className="text-xs uppercase text-emerald-100/65">
                    Pending
                  </div>
                  <div className="mt-1 text-xl font-semibold">
                    {
                      records.filter((record) => record.status === "Pending").length
                    }
                  </div>
                </div>
              </div>
            </div>
          </div>

          <CardContent className="p-6">
            <GlobalDataTable
              columns={columns}
              data={filteredRecords}
              cellAction={renderCellActions}
              exportFileName="enrollment-records"
              filterPlaceholder="Search applicant, program, email, or enrollment ID..."
              emptyMessage={
                applicationsQuery.isLoading
                  ? "Loading enrollment records..."
                  : "No enrollment records found."
              }
              pageSizeOptions={[8, 10, 20]}
              toolbarActions={
                <>
                  <Select
                    value={programFilter}
                    onValueChange={(value) => setProgramFilter(value as ProgramFilter)}
                  >
                    <SelectTrigger className="min-w-40">
                      <div className="flex items-center gap-2">
                        <Filter className="size-4 text-muted-foreground" />
                        <SelectValue placeholder="All Programs" />
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ALL">All Programs</SelectItem>
                      {enrollmentProgramOptions.map((program) => (
                        <SelectItem key={program} value={program}>
                          {program}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select
                    value={typeFilter}
                    onValueChange={(value) => setTypeFilter(value as TypeFilter)}
                  >
                    <SelectTrigger className="min-w-40">
                      <div className="flex items-center gap-2">
                        <Filter className="size-4 text-muted-foreground" />
                        <SelectValue placeholder="All Types" />
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ALL">All Types</SelectItem>
                      {enrollmentTypeOptions.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select
                    value={statusFilter}
                    onValueChange={(value) => setStatusFilter(value as StatusFilter)}
                  >
                    <SelectTrigger className="min-w-44">
                      <div className="flex items-center gap-2">
                        <Filter className="size-4 text-muted-foreground" />
                        <SelectValue placeholder="All Status" />
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ALL">All Status</SelectItem>
                      {enrollmentStatusOptions.map((status) => (
                        <SelectItem key={status} value={status}>
                          {status}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </>
              }
            />
          </CardContent>
        </Card>
      </section>

      <EnrollmentDetailsDialog
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
        record={selectedRecord}
      />

      <Dialog
        open={Boolean(rejectingRecord)}
        onOpenChange={(open) => {
          if (!open) {
            setRejectingRecord(null);
            setRejectionReason("");
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Application</DialogTitle>
            <DialogDescription>
              Add the reason for rejecting {rejectingRecord?.studentName}. This
              message will be included in the status email.
            </DialogDescription>
          </DialogHeader>

          <Textarea
            value={rejectionReason}
            onChange={(event) => setRejectionReason(event.target.value)}
            placeholder="Explain what the applicant needs to correct or clarify."
            className="min-h-32"
          />

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setRejectingRecord(null);
                setRejectionReason("");
              }}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              disabled={updateStatusMutation.isPending}
              onClick={handleConfirmRejection}
            >
              Reject Application
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Page;
