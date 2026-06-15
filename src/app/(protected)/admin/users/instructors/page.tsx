"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  BookOpenCheck,
  BriefcaseBusiness,
  Filter,
  GraduationCap,
  ShieldCheck,
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

import { StatCard } from "../../academics/classes/_components/stat-card";
import { CellActions } from "./_components/cell-actions";
import { columns } from "./_components/columns";
import { instructorRecords, instructorProgramOptions, instructorStatusOptions, type InstructorProgram, type InstructorRecord, type InstructorStatus } from "./_components/instructor-data";
import { InstructorDetailsDialog } from "./_components/instructor-details-dialog";

type StatusFilter = "ALL" | InstructorStatus;
type ProgramFilter = "ALL" | InstructorProgram;

const Page = () => {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL");
  const [programFilter, setProgramFilter] = useState<ProgramFilter>("ALL");
  const [instructors, setInstructors] =
    useState<InstructorRecord[]>(instructorRecords);
  const [selectedInstructor, setSelectedInstructor] =
    useState<InstructorRecord | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  const filteredInstructors = useMemo(() => {
    return instructors.filter((instructor) => {
      const matchesStatus =
        statusFilter === "ALL" || instructor.status === statusFilter;
      const matchesProgram =
        programFilter === "ALL" || instructor.teachingProgram === programFilter;

      return matchesStatus && matchesProgram;
    });
  }, [instructors, programFilter, statusFilter]);

  const totalInstructors = instructors.length;
  const activeInstructors = instructors.filter(
    (instructor) => instructor.status === "Active",
  ).length;
  const graduateFaculty = instructors.filter((instructor) =>
    ["Masteral", "Doctorate"].includes(instructor.teachingProgram),
  ).length;
  const totalLoadUnits = instructors.reduce(
    (sum, instructor) => sum + instructor.loadUnits,
    0,
  );

  const openInstructorDetails = (instructor: InstructorRecord) => {
    setSelectedInstructor(instructor);
    setDetailsOpen(true);
  };

  const handleToggleStatus = (record: InstructorRecord) => {
    setInstructors((current) =>
      current.map((instructor) =>
        instructor.facultyId === record.facultyId
          ? {
              ...instructor,
              status: instructor.status === "Active" ? "Inactive" : "Active",
            }
          : instructor,
      ),
    );
  };

  const renderCellActions = (row: Row<InstructorRecord>) => (
    <CellActions
      data={row.original}
      onView={openInstructorDetails}
      onToggleStatus={handleToggleStatus}
    />
  );

  return (
    <>
      <section className="space-y-6 p-10">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
          <div className="space-y-2">
            <h1 className="font-serif text-4xl text-emerald-950 dark:text-emerald-50">
              Instructors
            </h1>
            <p className="text-sm leading-6 text-muted-foreground">
              Track the seminary faculty roster, instructional assignments, and
              teaching capacity across certificate to doctoral programs.
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
                <BreadcrumbPage>Users</BreadcrumbPage>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Instructors</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="Total Instructors"
            value={totalInstructors}
            description="Faculty roster count"
            icon={<UsersRound className="size-6" />}
            accentClassName="bg-emerald-500/10 text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-300"
          />
          <StatCard
            title="Active Faculty"
            value={activeInstructors}
            description="Currently handling classes"
            icon={<BriefcaseBusiness className="size-6" />}
            accentClassName="bg-teal-500/10 text-teal-700 dark:bg-teal-400/10 dark:text-teal-300"
          />
          <StatCard
            title="Graduate Faculty"
            value={graduateFaculty}
            description="Masteral and doctorate teaching"
            icon={<GraduationCap className="size-6" />}
            accentClassName="bg-amber-500/10 text-amber-700 dark:bg-amber-400/10 dark:text-amber-300"
          />
          <StatCard
            title="Teaching Load"
            value={totalLoadUnits}
            description="Total assigned units"
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
                  Faculty Registry
                </div>
                <h2 className="text-2xl font-semibold text-white">
                  Instructional Directory
                </h2>
                <p className="max-w-2xl text-sm text-emerald-50/80">
                  Review instructor assignments, specialties, and availability
                  while staying aligned with the seminary.
                </p>
              </div>

              <div className="grid gap-3 text-sm text-emerald-50/85 sm:grid-cols-3">
                <div className="rounded-2xl border border-white/10 bg-white/8 px-4 py-3 backdrop-blur-sm">
                  <div className="text-xs uppercase text-emerald-100/65">
                    Bachelor
                  </div>
                  <div className="mt-1 text-xl font-semibold">
                    {
                      instructors.filter(
                        (instructor) => instructor.teachingProgram === "Bachelor",
                      ).length
                    }
                  </div>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/8 px-4 py-3 backdrop-blur-sm">
                  <div className="text-xs uppercase text-emerald-100/65">
                    Graduate
                  </div>
                  <div className="mt-1 text-xl font-semibold">
                    {graduateFaculty}
                  </div>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/8 px-4 py-3 backdrop-blur-sm">
                  <div className="text-xs uppercase text-emerald-100/65">
                    Units
                  </div>
                  <div className="mt-1 text-xl font-semibold">{totalLoadUnits}</div>
                </div>
              </div>
            </div>
          </div>

          <CardContent className="p-6">
            <GlobalDataTable
              columns={columns}
              data={filteredInstructors}
              cellAction={renderCellActions}
              exportFileName="instructors"
              filterPlaceholder="Search instructor, department, specialization, or ID..."
              emptyMessage="No instructor records found."
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
                      {instructorProgramOptions.map((program) => (
                        <SelectItem key={program} value={program}>
                          {program}
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
                      {instructorStatusOptions.map((status) => (
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

      <InstructorDetailsDialog
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
        instructor={selectedInstructor}
      />
    </>
  );
};

export default Page;
