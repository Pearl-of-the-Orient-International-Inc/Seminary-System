"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  BookOpenCheck,
  BriefcaseBusiness,
  Filter,
  GraduationCap,
  ListChecks,
  Medal,
  Plus,
  ShieldCheck,
  Trophy,
  UsersRound,
} from "lucide-react";
import type { Row } from "@tanstack/react-table";

import { GlobalDataTable } from "@/components/DataTable";
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
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  useDeleteSeminaryInstructorMutation,
  useInviteSeminaryInstructorMutation,
  useSeminaryInstructorsQuery,
  useUpdateSeminaryInstructorStatusMutation,
  toApiError,
} from "@/features/seminary/seminary.hooks";
import { useToast } from "@/hooks/use-toast";
import type {
  SeminaryInstructor,
  SeminaryInstructorStatus,
} from "@/features/seminary/seminary.types";

import { StatCard } from "../../academics/classes/_components/stat-card";
import { CellActions } from "./_components/cell-actions";
import { columns } from "./_components/columns";
import {
  instructorProgramOptions,
  instructorStatusOptions,
  type InstructorEvaluation,
  type InstructorProgram,
  type InstructorRecord,
  type InstructorStatus,
} from "./_components/instructor-data";
import { InstructorDetailsDialog } from "./_components/instructor-details-dialog";

type StatusFilter = "ALL" | InstructorStatus;
type ProgramFilter = "ALL" | InstructorProgram;

const toInstructorRecord = (
  instructor: SeminaryInstructor,
): InstructorRecord => ({
  areasOfExpertise: instructor.areasOfExpertise,
  biography: instructor.biography,
  contactNumber: instructor.contactNumber,
  credentials: instructor.credentials,
  educationalBackground: instructor.educationalBackground,
  email: instructor.email,
  evaluation: instructor.evaluation as InstructorEvaluation,
  facultyId: instructor.facultyId,
  formalPhotoUrl: instructor.formalPhotoUrl,
  highSchoolGraduateOrEquivalent: instructor.highSchoolGraduateOrEquivalent,
  id: instructor.id,
  inviteAcceptedAt: instructor.inviteAcceptedAt,
  inviteTokenSentAt: instructor.inviteTokenSentAt,
  isFilipinoCitizen: instructor.isFilipinoCitizen,
  loadUnits: instructor.loadUnits,
  ministerialExperienceYears: instructor.ministerialExperienceYears,
  name: instructor.name,
  professionalTitle: instructor.professionalTitle,
  rank: instructor.rankLabel as InstructorRecord["rank"],
  status: instructor.statusLabel as InstructorStatus,
  submissionDeadline: instructor.submissionDeadline,
  teachingPrograms: instructor.teachingProgramLabels as InstructorProgram[],
});

const instructorStatusApiMap: Record<
  InstructorStatus,
  SeminaryInstructorStatus
> = {
  Active: "ACTIVE",
  Inactive: "INACTIVE",
  "On Leave": "ON_LEAVE",
  "Part-time": "PART_TIME",
};

const Page = () => {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL");
  const [programFilter, setProgramFilter] = useState<ProgramFilter>("ALL");
  const [selectedInstructor, setSelectedInstructor] =
    useState<InstructorRecord | null>(null);
  const [instructorPendingStatusChange, setInstructorPendingStatusChange] =
    useState<InstructorRecord | null>(null);
  const [instructorPendingDelete, setInstructorPendingDelete] =
    useState<InstructorRecord | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const { toast } = useToast();
  const instructorsQuery = useSeminaryInstructorsQuery();
  const updateStatusMutation = useUpdateSeminaryInstructorStatusMutation();
  const deleteInstructorMutation = useDeleteSeminaryInstructorMutation();
  const inviteInstructorMutation = useInviteSeminaryInstructorMutation();

  const instructors = useMemo(
    () => instructorsQuery.data?.data?.map(toInstructorRecord) ?? [],
    [instructorsQuery.data],
  );

  const filteredInstructors = useMemo(() => {
    return instructors.filter((instructor) => {
      const matchesStatus =
        statusFilter === "ALL" || instructor.status === statusFilter;
      const matchesProgram =
        programFilter === "ALL" ||
        instructor.teachingPrograms.includes(programFilter);

      return matchesStatus && matchesProgram;
    });
  }, [instructors, programFilter, statusFilter]);

  const rankedInstructors = useMemo(
    () =>
      [...instructors].sort((first, second) => {
        const scoreDiff =
          second.evaluation.totalScore - first.evaluation.totalScore;

        if (scoreDiff !== 0) {
          return scoreDiff;
        }

        return first.name.localeCompare(second.name);
      }),
    [instructors],
  );

  const topInstructors = rankedInstructors.slice(0, 3);

  const totalInstructors = instructors.length;
  const activeInstructors = instructors.filter(
    (instructor) => instructor.status === "Active",
  ).length;
  const graduateFaculty = instructors.filter((instructor) =>
    instructor.teachingPrograms.some((program) =>
      ["Masteral", "Doctorate"].includes(program),
    ),
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
    if (!record.id) {
      toast({
        title: "Status update unavailable",
        description: "This row has no instructor ID to update.",
        variant: "error",
      });
      return;
    }

    setInstructorPendingStatusChange(record);
  };

  const handleConfirmStatusChange = async () => {
    const record = instructorPendingStatusChange;

    if (!record?.id) {
      return;
    }

    const nextStatus: InstructorStatus =
      record.status === "Active" ? "Inactive" : "Active";

    try {
      await updateStatusMutation.mutateAsync({
        id: record.id,
        status: instructorStatusApiMap[nextStatus],
      });
      toast({
        title: "Instructor status updated",
        description: `${record.name} was set to ${nextStatus.toLowerCase()}.`,
      });
      setInstructorPendingStatusChange(null);
    } catch (error) {
      toast({
        title: "Status update failed",
        description:
          error instanceof Error
            ? error.message
            : "Unable to update instructor status.",
        variant: "error",
      });
    }
  };

  const handleDeleteInstructor = async () => {
    if (!instructorPendingDelete?.id) {
      return;
    }

    try {
      await deleteInstructorMutation.mutateAsync(instructorPendingDelete.id);
      toast({
        title: "Instructor deleted",
        description: `${instructorPendingDelete.name} was removed from the registry.`,
      });
      setInstructorPendingDelete(null);
    } catch (error) {
      toast({
        title: "Delete failed",
        description:
          error instanceof Error
            ? error.message
            : "Unable to delete instructor.",
        variant: "error",
      });
    }
  };

  const handleInviteInstructor = async (record: InstructorRecord) => {
    if (!record.id) {
      toast({
        title: "Invite unavailable",
        description: "This row has no instructor ID to invite.",
        variant: "error",
      });
      return;
    }

    try {
      await inviteInstructorMutation.mutateAsync(record.id);
      toast({
        title: "Instructor invite sent",
        description: `${record.name} will receive a 30-day activation link at ${record.email}.`,
        variant: "success",
      });
    } catch (error) {
      const apiError = toApiError(error);

      toast({
        title: "Invite failed",
        description:
          apiError.message ?? "Unable to send instructor invitation.",
        variant: "error",
      });
    }
  };

  const renderCellActions = (row: Row<InstructorRecord>) => (
    <CellActions
      data={row.original}
      onDelete={setInstructorPendingDelete}
      onInvite={handleInviteInstructor}
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
            <p className="text-sm text-muted-foreground">
              Track the seminary faculty roster, instructional assignments, and
              teaching capacity across certificate to doctoral programs.
            </p>
          </div>
          <Button type="button" asChild>
            <Link className="ml-auto" href="/portal/users/instructors/new">
              <Plus className="size-4" />
              Create Instructor
            </Link>
          </Button>
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
            description="Masteral and doctorate"
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
                      instructors.filter((instructor) =>
                        instructor.teachingPrograms.includes("Bachelor"),
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
                  <div className="mt-1 text-xl font-semibold">
                    {totalLoadUnits}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <CardContent className="p-6 pt-0!">
            <Tabs defaultValue="directory" className="gap-6">
              <TabsList variant="line" className="w-full">
                <TabsTrigger value="directory">
                  <ListChecks className="size-4" />
                  Directory
                </TabsTrigger>
                <TabsTrigger value="leaderboard">
                  <Trophy className="size-4" />
                  Leaderboard
                </TabsTrigger>
              </TabsList>

              <TabsContent value="directory">
                <GlobalDataTable
                  columns={columns}
                  data={filteredInstructors}
                  cellAction={renderCellActions}
                  exportFileName="instructors"
                  filterPlaceholder="Search instructor, credentials, email, or ID..."
                  emptyMessage="No instructor records found."
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
                          {instructorProgramOptions.map((program) => (
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
              </TabsContent>

              <TabsContent value="leaderboard" className="space-y-6">
                {rankedInstructors.length === 0 ? (
                  <div className="rounded-lg border border-dashed p-10 text-center text-sm text-muted-foreground">
                    No instructor ranking records found.
                  </div>
                ) : (
                  <>
                    <div className="grid gap-4 lg:grid-cols-3">
                      {topInstructors.map((instructor, index) => (
                        <div
                          key={instructor.id ?? instructor.facultyId}
                          className="rounded-lg border border-emerald-950/10 bg-background p-5 shadow-sm dark:border-emerald-100/10"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="space-y-1">
                              <div className="text-xs font-medium uppercase text-muted-foreground">
                                Top {index + 1}
                              </div>
                              <h3 className="text-lg font-semibold leading-6">
                                {instructor.name}
                              </h3>
                              <p className="text-xs text-muted-foreground">
                                {instructor.facultyId}
                              </p>
                            </div>
                            <div className="rounded-full bg-amber-500/10 p-2 text-amber-600">
                              <Medal className="size-5" />
                            </div>
                          </div>

                          <div className="mt-5 flex items-end justify-between gap-4">
                            <div>
                              <div className="text-3xl font-semibold tracking-normal">
                                {instructor.evaluation.totalScore.toFixed(2)}%
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {instructor.evaluation.rating}
                              </div>
                            </div>
                            <div className="text-right text-sm">
                              <div className="font-medium">
                                {instructor.evaluation.award}
                              </div>
                              <div className="text-muted-foreground">
                                {instructor.evaluation.rankingClassification}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="overflow-x-auto rounded-lg border border-emerald-950/10 dark:border-emerald-100/10">
                      <div className="min-w-215">
                        <div className="grid grid-cols-[72px_minmax(220px,1.4fr)_120px_minmax(180px,1fr)_minmax(160px,1fr)] gap-4 border-b bg-muted/50 px-4 py-3 text-xs font-medium uppercase text-muted-foreground">
                          <div>Rank</div>
                          <div>Instructor</div>
                          <div>Score</div>
                          <div>Classification</div>
                          <div>Award</div>
                        </div>
                        <div className="divide-y">
                          {rankedInstructors.map((instructor, index) => (
                            <button
                              key={instructor.id ?? instructor.facultyId}
                              type="button"
                              className="grid w-full grid-cols-[72px_minmax(220px,1.4fr)_120px_minmax(180px,1fr)_minmax(160px,1fr)] gap-4 px-4 py-4 text-left text-sm transition-colors hover:bg-muted/50"
                              onClick={() => openInstructorDetails(instructor)}
                            >
                              <div className="font-semibold">
                                Top {index + 1}
                              </div>
                              <div>
                                <div className="font-medium">
                                  {instructor.name}
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  {instructor.professionalTitle}
                                </div>
                              </div>
                              <div className="font-semibold">
                                {instructor.evaluation.totalScore.toFixed(2)}%
                              </div>
                              <div>
                                {instructor.evaluation.rankingClassification}
                              </div>
                              <div>{instructor.evaluation.award}</div>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </section>

      <InstructorDetailsDialog
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
        instructor={selectedInstructor}
      />
      <AlertDialog
        open={Boolean(instructorPendingStatusChange)}
        onOpenChange={(open) => {
          if (!open) {
            setInstructorPendingStatusChange(null);
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {instructorPendingStatusChange?.status === "Active"
                ? "Set instructor inactive?"
                : "Set instructor active?"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              This updates{" "}
              {instructorPendingStatusChange?.name ?? "this instructor"} in the
              faculty registry.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={updateStatusMutation.isPending}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              variant={
                instructorPendingStatusChange?.status === "Active"
                  ? "destructive"
                  : "default"
              }
              disabled={updateStatusMutation.isPending}
              onClick={(event) => {
                event.preventDefault();
                void handleConfirmStatusChange();
              }}
            >
              {updateStatusMutation.isPending
                ? "Updating..."
                : instructorPendingStatusChange?.status === "Active"
                  ? "Set inactive"
                  : "Set active"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <AlertDialog
        open={Boolean(instructorPendingDelete)}
        onOpenChange={(open) => {
          if (!open) {
            setInstructorPendingDelete(null);
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete instructor?</AlertDialogTitle>
            <AlertDialogDescription>
              This permanently removes{" "}
              {instructorPendingDelete?.name ?? "this instructor"} from the
              faculty registry. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteInstructorMutation.isPending}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              disabled={deleteInstructorMutation.isPending}
              onClick={(event) => {
                event.preventDefault();
                void handleDeleteInstructor();
              }}
            >
              {deleteInstructorMutation.isPending ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default Page;
