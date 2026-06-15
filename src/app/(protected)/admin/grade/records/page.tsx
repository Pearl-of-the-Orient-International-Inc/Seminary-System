"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  BookMarked,
  ClipboardCheck,
  Filter,
  GraduationCap,
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
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { StatCard } from "../../academics/classes/_components/stat-card";
import { CellActions } from "./_components/cell-actions";
import { columns } from "./_components/columns";
import {
  gradeProgramOptions,
  gradeRecords,
  gradeStatusOptions,
  gradeTermOptions,
  type GradeProgram,
  type GradeRecord,
  type GradeRecordStatus,
  type GradeTerm,
} from "./_components/grade-record-data";
import { GradeRecordDetailsDialog } from "./_components/grade-record-details-dialog";

type StatusFilter = "ALL" | GradeRecordStatus;
type ProgramFilter = "ALL" | GradeProgram;
type TermFilter = "ALL" | GradeTerm;

const Page = () => {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL");
  const [programFilter, setProgramFilter] = useState<ProgramFilter>("ALL");
  const [termFilter, setTermFilter] = useState<TermFilter>("ALL");
  const [records, setRecords] = useState<GradeRecord[]>(gradeRecords);
  const [selectedRecord, setSelectedRecord] = useState<GradeRecord | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  const filteredRecords = useMemo(() => {
    return records.filter((record) => {
      const matchesStatus =
        statusFilter === "ALL" || record.status === statusFilter;
      const matchesProgram =
        programFilter === "ALL" || record.program === programFilter;
      const matchesTerm = termFilter === "ALL" || record.term === termFilter;

      return matchesStatus && matchesProgram && matchesTerm;
    });
  }, [programFilter, records, statusFilter, termFilter]);

  const totalRecords = records.length;
  const completedRecords = records.filter(
    (record) => record.status === "Complete",
  ).length;
  const pendingReview = records.filter(
    (record) => record.status === "Pending Review",
  ).length;
  const passedRecords = records.filter((record) => record.remarks === "Passed").length;

  const openRecordDetails = (record: GradeRecord) => {
    setSelectedRecord(record);
    setDetailsOpen(true);
  };

  const handleToggleReview = (target: GradeRecord) => {
    setRecords((current) =>
      current.map((record) =>
        record.recordId === target.recordId
          ? {
              ...record,
              status:
                record.status === "Pending Review" ? "Complete" : "Pending Review",
            }
          : record,
      ),
    );
  };

  const renderCellActions = (row: Row<GradeRecord>) => (
    <CellActions
      data={row.original}
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
              Review posted grades, academic standing, and registrar-level record
              status across seminary programs in one consistent view.
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

        <Card className="overflow-hidden pt-0! border-emerald-950/10 shadow-sm dark:border-emerald-100/10">
          <div className="border-b border-emerald-950/10 bg-linear-to-r from-emerald-950 to-emerald-900 px-6 py-5 dark:border-emerald-100/10">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div className="space-y-2">
                <h2 className="text-2xl font-semibold text-white">
                  Academic Record Directory
                </h2>
                <p className="text-sm text-emerald-50/80">
                  Search and filter the academic ledger while keeping the visual
                  language aligned with the seminary.
                </p>
              </div>

              <div className="grid gap-3 text-sm text-emerald-50/85 sm:grid-cols-3">
                <div className="rounded-2xl border border-white/10 bg-white/8 px-4 py-3 backdrop-blur-sm">
                  <div className="text-xs uppercase text-emerald-100/65">
                    Bachelor
                  </div>
                  <div className="mt-1 text-xl font-semibold">
                    {records.filter((record) => record.program === "Bachelor").length}
                  </div>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/8 px-4 py-3 backdrop-blur-sm">
                  <div className="text-xs uppercase text-emerald-100/65">
                    Graduate
                  </div>
                  <div className="mt-1 text-xl font-semibold">
                    {
                      records.filter((record) =>
                        ["Masteral", "Doctorate"].includes(record.program),
                      ).length
                    }
                  </div>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/8 px-4 py-3 backdrop-blur-sm">
                  <div className="text-xs uppercase text-emerald-100/65">
                    Review Queue
                  </div>
                  <div className="mt-1 text-xl font-semibold">{pendingReview}</div>
                </div>
              </div>
            </div>
          </div>

          <CardContent className="p-6">
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
                      {gradeProgramOptions.map((program) => (
                        <SelectItem key={program} value={program}>
                          {program}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select
                    value={termFilter}
                    onValueChange={(value) => setTermFilter(value as TermFilter)}
                  >
                    <SelectTrigger className="min-w-44">
                      <div className="flex items-center gap-2">
                        <Filter className="size-4 text-muted-foreground" />
                        <SelectValue placeholder="All Terms" />
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ALL">All Terms</SelectItem>
                      {gradeTermOptions.map((term) => (
                        <SelectItem key={term} value={term}>
                          {term}
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
                      {gradeStatusOptions.map((status) => (
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

      <GradeRecordDetailsDialog
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
        record={selectedRecord}
      />
    </>
  );
};

export default Page;
