"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  BookCopy,
  CheckCircle2,
  Filter,
  Laptop,
  PauseCircle,
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
  useCreateSeminaryCourseMutation,
  useDeleteSeminaryCourseMutation,
  useSeminaryCoursesQuery,
  useUpdateSeminaryCourseMutation,
  useUpdateSeminaryCourseStatusMutation,
} from "@/features/seminary/seminary.hooks";
import type {
  SeminaryCourse,
  SeminaryCourseModality,
  SeminaryCourseStatus,
  SeminaryProgramLevel,
} from "@/features/seminary/seminary.types";
import { useToast } from "@/hooks/use-toast";

import { CellActions } from "./_components/cell-actions";
import {
  columns,
  courseModalityOptions,
  type CourseModality,
  type CourseRecord,
  type CourseStatus,
} from "./_components/columns";
import { CourseDialog, type CourseDialogValues } from "./_components/course-dialog";
import { StatCard } from "./_components/stat-card";

type StatusFilter = "ALL" | CourseStatus;
type ModalityFilter = "ALL" | CourseModality;

const programLabelMap: Record<SeminaryProgramLevel, CourseRecord["program"]> = {
  CERTIFICATE: "Certificate",
  BACHELOR: "Bachelor",
  MASTER_WITH_THESIS: "Masteral",
  DOCTORATE_WITH_DISSERTATION: "Doctorate",
};

const programValueMap: Record<CourseRecord["program"], SeminaryProgramLevel> = {
  Certificate: "CERTIFICATE",
  Bachelor: "BACHELOR",
  Masteral: "MASTER_WITH_THESIS",
  Doctorate: "DOCTORATE_WITH_DISSERTATION",
};

const modalityLabelMap: Record<SeminaryCourseModality, CourseModality> = {
  FACE_TO_FACE: "Face to Face",
  ONLINE: "Online",
  BOTH: "Both",
};

const modalityValueMap: Record<CourseModality, SeminaryCourseModality> = {
  "Face to Face": "FACE_TO_FACE",
  Online: "ONLINE",
  Both: "BOTH",
};

const statusLabelMap: Record<SeminaryCourseStatus, CourseStatus> = {
  ACTIVE: "Active",
  INACTIVE: "Inactive",
};

const statusValueMap: Record<CourseStatus, SeminaryCourseStatus> = {
  Active: "ACTIVE",
  Inactive: "INACTIVE",
};

const toCourseRecord = (course: SeminaryCourse, index: number): CourseRecord => ({
  id: course.id,
  order: course.sortOrder || index + 1,
  courseName: course.courseName,
  courseCode: course.courseCode,
  program: programLabelMap[course.program],
  units: course.units,
  modality: modalityLabelMap[course.modality],
  status: statusLabelMap[course.status],
});

const toCoursePayload = (values: CourseDialogValues) => ({
  courseName: values.courseName,
  courseCode: values.courseCode,
  program: programValueMap[values.program],
  units: values.units,
  modality: modalityValueMap[values.modality],
  status: statusValueMap[values.status],
});

const Page = () => {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL");
  const [modalityFilter, setModalityFilter] = useState<ModalityFilter>("ALL");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<CourseRecord | null>(null);
  const { toast } = useToast();

  const coursesQuery = useSeminaryCoursesQuery({ limit: 100, page: 1 });
  const createCourseMutation = useCreateSeminaryCourseMutation();
  const updateCourseMutation = useUpdateSeminaryCourseMutation();
  const updateCourseStatusMutation = useUpdateSeminaryCourseStatusMutation();
  const deleteCourseMutation = useDeleteSeminaryCourseMutation();

  const courses = useMemo(
    () => (coursesQuery.data?.data ?? []).map(toCourseRecord),
    [coursesQuery.data?.data],
  );

  const filteredData = useMemo(() => {
    return courses.filter((course) => {
      const matchesStatus =
        statusFilter === "ALL" || course.status === statusFilter;
      const matchesModality =
        modalityFilter === "ALL" || course.modality === modalityFilter;

      return matchesStatus && matchesModality;
    });
  }, [courses, modalityFilter, statusFilter]);

  const totalCourses = courses.length;
  const activeCourses = courses.filter((course) => course.status === "Active").length;
  const inactiveCourses = courses.filter(
    (course) => course.status === "Inactive",
  ).length;
  const onlineCourses = courses.filter(
    (course) => course.modality === "Online",
  ).length;

  const handleCreate = () => {
    setSelectedRecord(null);
    setDialogOpen(true);
  };

  const handleEdit = (record: CourseRecord) => {
    setSelectedRecord(record);
    setDialogOpen(true);
  };

  const handleDelete = async (record: CourseRecord) => {
    try {
      await deleteCourseMutation.mutateAsync(record.id);
      toast({
        title: "Course deleted",
        description: `${record.courseName} was removed from the course catalog.`,
        variant: "success",
      });
    } catch (error) {
      const apiError = toApiError(error);
      toast({
        title: "Delete failed",
        description: apiError.message ?? "Unable to delete course.",
        variant: "error",
      });
    }
  };

  const handleToggleStatus = async (record: CourseRecord) => {
    const nextStatus: SeminaryCourseStatus =
      record.status === "Active" ? "INACTIVE" : "ACTIVE";

    try {
      await updateCourseStatusMutation.mutateAsync({
        id: record.id,
        status: nextStatus,
      });
      toast({
        title: nextStatus === "ACTIVE" ? "Course retrieved" : "Course archived",
        description: `${record.courseName} is now ${statusLabelMap[nextStatus].toLowerCase()}.`,
        variant: "success",
      });
    } catch (error) {
      const apiError = toApiError(error);
      toast({
        title: "Status update failed",
        description: apiError.message ?? "Unable to update course status.",
        variant: "error",
      });
    }
  };

  const handleDialogSubmit = async (values: CourseDialogValues) => {
    try {
      if (selectedRecord) {
        await updateCourseMutation.mutateAsync({
          id: selectedRecord.id,
          payload: toCoursePayload(values),
        });
        toast({
          title: "Course updated",
          description: `${values.courseName} was updated successfully.`,
          variant: "success",
        });
      } else {
        await createCourseMutation.mutateAsync(toCoursePayload(values));
        toast({
          title: "Course created",
          description: `${values.courseName} was added to the course catalog.`,
          variant: "success",
        });
      }

      setDialogOpen(false);
      setSelectedRecord(null);
    } catch (error) {
      const apiError = toApiError(error);
      toast({
        title: selectedRecord ? "Update failed" : "Create failed",
        description: apiError.message ?? "Unable to save course.",
        variant: "error",
      });
    }
  };

  const renderCellActions = (row: Row<CourseRecord>) => (
    <CellActions
      data={row.original}
      onDelete={handleDelete}
      onEdit={handleEdit}
      onToggleStatus={handleToggleStatus}
    />
  );

  const isSaving =
    createCourseMutation.isPending || updateCourseMutation.isPending;

  return (
    <>
      <section className="space-y-6 p-10">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
          <div className="space-y-2">
            <h1 className="text-3xl font-semibold tracking-tight text-blue-950 dark:text-blue-100">
              Courses
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
                <BreadcrumbPage>Academics</BreadcrumbPage>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Courses</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="Total Courses"
            value={totalCourses}
            description="All time"
            icon={<BookCopy className="size-6" />}
            accentClassName="bg-blue-500/10 text-blue-700 dark:bg-blue-400/10 dark:text-blue-300"
          />
          <StatCard
            title="Active Courses"
            value={activeCourses}
            description="Currently active"
            icon={<CheckCircle2 className="size-6" />}
            accentClassName="bg-emerald-500/10 text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-300"
          />
          <StatCard
            title="Inactive Courses"
            value={inactiveCourses}
            description="Currently inactive"
            icon={<PauseCircle className="size-6" />}
            accentClassName="bg-amber-500/10 text-amber-700 dark:bg-amber-400/10 dark:text-amber-300"
          />
          <StatCard
            title="Online Courses"
            value={onlineCourses}
            description="Digital modality"
            icon={<Laptop className="size-6" />}
            accentClassName="bg-violet-500/10 text-violet-700 dark:bg-violet-400/10 dark:text-violet-300"
          />
        </div>

        <Card className="border-border/70 shadow-sm">
          <CardContent>
            <GlobalDataTable
              columns={columns}
              data={filteredData}
              cellAction={renderCellActions}
              exportFileName="courses"
              filterPlaceholder="Search courses..."
              emptyMessage={
                coursesQuery.isLoading ? "Loading courses..." : "No courses found."
              }
              pageSizeOptions={[8, 10, 20]}
              toolbarActions={
                <>
                  <Select
                    value={modalityFilter}
                    onValueChange={(value) =>
                      setModalityFilter(value as ModalityFilter)
                    }
                  >
                    <SelectTrigger className="min-w-44">
                      <div className="flex items-center gap-2">
                        <Filter className="size-4 text-muted-foreground" />
                        <SelectValue placeholder="All Modality" />
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ALL">All Modality</SelectItem>
                      {courseModalityOptions.map((modality) => (
                        <SelectItem key={modality} value={modality}>
                          {modality}
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
                      <SelectItem value="Active">Active</SelectItem>
                      <SelectItem value="Inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>

                  <Button onClick={handleCreate}>
                    <Plus className="size-4" />
                    Add Course
                  </Button>
                </>
              }
            />
          </CardContent>
        </Card>
      </section>

      <CourseDialog
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
