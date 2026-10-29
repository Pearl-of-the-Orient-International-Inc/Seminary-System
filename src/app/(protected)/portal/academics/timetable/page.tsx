"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  CalendarDays,
  MoreHorizontal,
  Pencil,
  Plus,
  Printer,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { useToast } from "@/hooks/use-toast";
import { useCurrentUserQuery } from "@/features/auth/auth.hooks";
import {
  toApiError,
  useCreateSeminaryCourseScheduleMutation,
  useDeleteSeminaryCourseScheduleMutation,
  useSeminaryCourseSchedulesQuery,
  useSeminaryCoursesQuery,
  useSeminaryInstructorsQuery,
  useUpdateSeminaryCourseScheduleMutation,
} from "@/features/seminary/seminary.hooks";
import type {
  SeminaryCourseSchedule,
  SeminaryCourseSchedulePayload,
} from "@/features/seminary/seminary.types";
import {
  TimetableDialog,
  type EditableTimetableSlot,
  type TimetableDialogValues,
} from "./_components/timetable-dialog";

const dateText = (value: string) =>
  new Intl.DateTimeFormat("en-PH", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
const timeText = (value: string) =>
  new Intl.DateTimeFormat("en-PH", {
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(`1970-01-01T${value}:00`));

export default function Page() {
  const { toast } = useToast();
  const router = useRouter();
  const user = useCurrentUserQuery();
  const manager =
    user.data?.role === "ADMIN" &&
    (user.data.position === "REGISTRAR" || user.data.position === "IT");
  const schedulesQuery = useSeminaryCourseSchedulesQuery();
  const coursesQuery = useSeminaryCoursesQuery(
    { page: 1, limit: 100, status: "ACTIVE" },
    { enabled: manager },
  );
  const instructorsQuery = useSeminaryInstructorsQuery(
    { page: 1, limit: 100, status: "ACTIVE" },
    { enabled: manager },
  );
  const create = useCreateSeminaryCourseScheduleMutation();
  const update = useUpdateSeminaryCourseScheduleMutation();
  const remove = useDeleteSeminaryCourseScheduleMutation();
  const [period, setPeriod] = useState("");
  const [className, setClassName] = useState("");
  const [slot, setSlot] = useState<EditableTimetableSlot | null>(null);
  const [editing, setEditing] = useState<SeminaryCourseSchedule | null>(null);
  const [scheduleToDelete, setScheduleToDelete] =
    useState<SeminaryCourseSchedule | null>(null);
  const [open, setOpen] = useState(false);
  const schedules = useMemo(
    () => schedulesQuery.data?.data ?? [],
    [schedulesQuery.data],
  );
  const periods = [...new Set(schedules.map((s) => s.period))];
  const activePeriod = periods.includes(period)
    ? period
    : (periods[0] ?? "February–July 2026");
  const classes = [
    ...new Set(
      schedules
        .filter((s) => s.period === activePeriod)
        .map((s) => s.className),
    ),
  ];
  const activeClass = classes.includes(className)
    ? className
    : (classes[0] ?? "Professional Chaplaincy Course");
  const listed = useMemo(
    () =>
      schedules
        .filter(
          (s) =>
            s.period === activePeriod &&
            s.className === activeClass,
        )
        .sort((a, b) =>
          `${a.scheduledDate}${a.startTime}`.localeCompare(
            `${b.scheduledDate}${b.startTime}`,
          ),
        ),
    [schedules, activePeriod, activeClass],
  );
  const startAdd = () => {
    setEditing(null);
    setSlot({ subject: null });
    setOpen(true);
  };
  const startEdit = (schedule: SeminaryCourseSchedule) => {
    setEditing(schedule);
    setSlot({
      scheduledDate: schedule.scheduledDate?.slice(0, 10),
      startTime: schedule.startTime,
      endTime: schedule.endTime,
      subject: {
        scheduleId: schedule.id,
        courseId: schedule.courseId,
        instructorId: schedule.instructorId,
        code: schedule.course.courseCode,
        title: schedule.subjectName,
        lecturer: schedule.instructor.name,
        modality:
          schedule.deliveryMode === "ONLINE" ? "Online" : "Face to Face",
        accentClassName: "",
      },
    });
    setOpen(true);
  };
  const save = async (values: TimetableDialogValues) => {
    const payload: SeminaryCourseSchedulePayload = {
      academicYear: activePeriod,
      period: activePeriod,
      className: activeClass,
      courseId: values.courseId,
      instructorId: values.instructorId,
      subjectName: values.subjectName,
      units: values.units,
      scheduledDate: values.scheduledDate,
      startTime: values.startTime,
      endTime: values.endTime,
      deliveryMode: values.modality === "Online" ? "ONLINE" : "FACE_TO_FACE",
      status: "SCHEDULED",
    };
    try {
      if (editing) await update.mutateAsync({ id: editing.id, payload });
      else await create.mutateAsync(payload);
      toast({
        title: "Schedule saved",
        description: "The dated class schedule was saved.",
        variant: "success",
      });
    } catch (error) {
      toast({
        title: "Schedule not saved",
        description: toApiError(error).message ?? "Check for a time conflict.",
        variant: "error",
      });
      throw error;
    }
  };
  const confirmDelete = async () => {
    if (!scheduleToDelete) return;

    try {
      await remove.mutateAsync(scheduleToDelete.id);
      setScheduleToDelete(null);
      toast({ title: "Schedule deleted", variant: "success" });
    } catch (error) {
      toast({
        title: "Delete failed",
        description: toApiError(error).message,
        variant: "error",
      });
    }
  };
  const openPrintableSchedule = () => {
    const params = new URLSearchParams({
      period: activePeriod,
      className: activeClass,
    });
    router.push(`/portal/academics/timetable/print?${params.toString()}`);
  };
  return (
    <section className="space-y-6 p-10">
      <div>
        <p className="text-sm font-medium text-primary">Academics</p>
        <h1 className="text-3xl font-semibold tracking-tight">
          Class Schedule
        </h1>
        <p className="text-muted-foreground">
          Dated schedules for students and assigned instructors.
        </p>
      </div>
      <Card>
        <CardContent className="space-y-5">
          <div className="flex flex-col gap-3 xl:flex-row xl:items-end xl:justify-between">
            <div className="grid gap-3 md:grid-cols-2">
              <Select value={activePeriod} onValueChange={setPeriod}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select period" />
                </SelectTrigger>
                <SelectContent>
                  {periods.map((v) => (
                    <SelectItem key={v} value={v}>
                      {v}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={activeClass} onValueChange={setClassName}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Course" />
                </SelectTrigger>
                <SelectContent>
                  {classes.map((v) => (
                    <SelectItem key={v} value={v}>
                      {v}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2">
              {listed.length > 0 && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button size="icon" variant="outline" aria-label="More actions">
                      <MoreHorizontal className="size-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onSelect={openPrintableSchedule}>
                      <Printer className="size-4" />
                      Print schedule
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
              {manager && (
                <Button onClick={startAdd}>
                  <Plus className="size-4" />
                  Add Class Schedule
                </Button>
              )}
            </div>
          </div>
          {listed[0] && (
            <div className="rounded-lg border bg-muted/30 px-4 py-3 text-center">
              <p className="text-sm font-medium">
                {listed[0].course.program.replaceAll("_", " ")}
              </p>
              <p className="text-lg font-semibold">
                {listed[0].course.courseName}
              </p>
              <p className="text-sm text-muted-foreground">{activePeriod}</p>
            </div>
          )}
          <div className="overflow-x-auto rounded-lg border">
            <table className="w-full min-w-190 text-sm">
              <thead className="bg-muted/50 text-left">
                <tr>
                  <th className="p-3">Date</th>
                  <th className="p-3">Subject</th>
                  <th className="p-3">Unit</th>
                  <th className="p-3">Time</th>
                  <th className="p-3">Professor</th>
                  <th className="p-3">Remarks</th>
                  {manager && <th className="p-3" />}
                </tr>
              </thead>
              <tbody>
                {listed.length ? (
                  listed.map((s) => (
                    <tr key={s.id} className="border-t">
                      <td className="p-3">
                        {s.scheduledDate ? dateText(s.scheduledDate) : "—"}
                      </td>
                      <td className="p-3">
                        <span className="font-medium">{s.subjectName}</span>
                        <span className="block text-xs text-muted-foreground">
                          {s.course.courseCode}
                        </span>
                      </td>
                      <td className="p-3">{s.units}</td>
                      <td className="p-3">
                        {timeText(s.startTime)}–{timeText(s.endTime)}
                      </td>
                      <td className="p-3">{s.instructor.name}</td>
                      <td className="p-3">
                        {s.deliveryMode === "ONLINE"
                          ? "Online Class"
                          : "Onsite Class"}
                      </td>
                      {manager && (
                        <td className="p-3">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                size="icon-sm"
                                variant="ghost"
                                aria-label={`Actions for ${s.subjectName}`}
                              >
                                <MoreHorizontal className="size-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onSelect={() => startEdit(s)}>
                                <Pencil className="size-4" />
                                Edit schedule
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                variant="destructive"
                                onSelect={() => setScheduleToDelete(s)}
                              >
                                <Trash2 className="size-4" />
                                Delete schedule
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      )}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      className="p-10 text-center text-muted-foreground"
                      colSpan={manager ? 7 : 6}
                    >
                      <CalendarDays className="mx-auto mb-2 size-5" />
                      No class schedules yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
      <TimetableDialog
        open={open}
        onOpenChange={setOpen}
        onSubmit={save}
        slot={slot}
        courses={coursesQuery.data?.data ?? []}
        instructors={instructorsQuery.data?.data ?? []}
        submitting={create.isPending || update.isPending}
      />
      <AlertDialog
        open={Boolean(scheduleToDelete)}
        onOpenChange={(nextOpen) => {
          if (!nextOpen) setScheduleToDelete(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete class schedule?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently remove the {scheduleToDelete?.subjectName} class
              schedule. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={remove.isPending}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              disabled={remove.isPending}
              onClick={confirmDelete}
            >
              {remove.isPending ? "Deleting…" : "Delete schedule"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </section>
  );
}
