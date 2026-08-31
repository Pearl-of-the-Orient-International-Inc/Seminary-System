"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { CalendarDays, Download, Plus } from "lucide-react";

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
  academicYearOptions,
  timetableData,
  type AcademicYearOption,
  type ClassOption,
  type SectionOption,
  type TimetableEntry,
  type TimetableRecord,
  type TimetableSubject,
  type WeekDay,
} from "./_components/data";
import { TimetableDetailDialog } from "./_components/timetable-detail-dialog";
import {
  TimetableDialog,
  type EditableTimetableSlot,
  type TimetableDialogValues,
} from "./_components/timetable-dialog";
import { TimetableGrid } from "./_components/timetable-grid";

const getAccentClassName = (modality: TimetableSubject["modality"]) =>
  modality === "Online" ? "border-l-violet-500" : "border-l-emerald-500";

const Page = () => {
  const [academicYear, setAcademicYear] = useState<AcademicYearOption>("2024-2025");
  const [className, setClassName] = useState<ClassOption>("First Year Theology");
  const [section, setSection] = useState<SectionOption>("A");
  const [schedules, setSchedules] = useState<TimetableRecord[]>(timetableData);
  const [selectedEntry, setSelectedEntry] = useState<TimetableEntry | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | undefined>(undefined);
  const [detailOpen, setDetailOpen] = useState(false);
  const [editorOpen, setEditorOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editingSlot, setEditingSlot] = useState<EditableTimetableSlot | null>(null);

  const availableClasses = useMemo(
    () =>
      Array.from(
        new Set(
          schedules
            .filter((record) => record.academicYear === academicYear)
            .map((record) => record.className),
        ),
      ) as ClassOption[],
    [academicYear, schedules],
  );

  const effectiveClassName = availableClasses.includes(className)
    ? className
    : (availableClasses[0] ?? "First Year Theology");

  const availableSections = useMemo(
    () =>
      Array.from(
        new Set(
          schedules
            .filter(
              (record) =>
                record.academicYear === academicYear &&
                record.className === effectiveClassName,
            )
            .map((record) => record.section),
        ),
      ) as SectionOption[],
    [academicYear, effectiveClassName, schedules],
  );

  const effectiveSection = availableSections.includes(section)
    ? section
    : (availableSections[0] ?? "A");

  const activeTimetable = useMemo(
    () =>
      schedules.find(
        (record) =>
          record.academicYear === academicYear &&
          record.className === effectiveClassName &&
          record.section === effectiveSection,
      ) ?? schedules[0],
    [academicYear, effectiveClassName, effectiveSection, schedules],
  );

  const timeOptions = useMemo(
    () =>
      activeTimetable.rows
        .filter((row): row is Extract<(typeof activeTimetable.rows)[number], { type: "class" }> => row.type === "class")
        .map((row) => row.time),
    [activeTimetable],
  );

  const updateTimetableSlot = (
    day: WeekDay,
    time: string,
    subject: TimetableSubject | null,
  ) => {
    setSchedules((current) =>
      current.map((record) => {
        if (
          record.academicYear !== academicYear ||
          record.className !== effectiveClassName ||
          record.section !== effectiveSection
        ) {
          return record;
        }

        return {
          ...record,
          rows: record.rows.map((row) => {
            if (row.type !== "class" || row.time !== time) {
              return row;
            }

            return {
              ...row,
              entries: row.entries.map((entry) =>
                entry.day === day ? { ...entry, subject } : entry,
              ),
            };
          }),
        };
      }),
    );
  };

  const handleSelectEntry = (entry: TimetableEntry, timeLabel: string) => {
    if (!entry.subject) {
      setEditingSlot({
        day: entry.day,
        time: timeLabel,
        subject: null,
      });
      setEditorOpen(true);
      return;
    }

    setSelectedEntry(entry);
    setSelectedTime(timeLabel);
    setDetailOpen(true);
  };

  const handleCreate = () => {
    setEditingSlot({
      day: "Monday",
      time: timeOptions[0] ?? "",
      subject: null,
    });
    setEditorOpen(true);
  };

  const handleEdit = () => {
    if (!selectedEntry || !selectedTime) return;

    setDetailOpen(false);
    setEditingSlot({
      day: selectedEntry.day,
      time: selectedTime,
      subject: selectedEntry.subject,
    });
    setEditorOpen(true);
  };

  const handleDelete = () => {
    if (!selectedEntry || !selectedTime) return;

    updateTimetableSlot(selectedEntry.day, selectedTime, null);
    setDeleteOpen(false);
    setDetailOpen(false);
    setSelectedEntry(null);
    setSelectedTime(undefined);
  };

  const handleDialogSubmit = (values: TimetableDialogValues) => {
    updateTimetableSlot(values.day, values.time, {
      code: values.code,
      title: values.title,
      lecturer: values.lecturer,
      modality: values.modality,
      accentClassName: getAccentClassName(values.modality),
    });
    setEditingSlot(null);
  };

  return (
    <>
      <section className="space-y-6 p-10">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
          <div className="space-y-2">
            <h1 className="text-3xl font-semibold tracking-tight text-blue-950 dark:text-blue-100">
              Time Table
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
                <BreadcrumbPage>Academic</BreadcrumbPage>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Time Table</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        <Card className="border-border/70 shadow-sm">
          <CardContent className="space-y-5">
            <div className="flex flex-col gap-3 xl:flex-row xl:items-end xl:justify-between">
              <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-foreground">Academic Year</p>
                  <Select
                    value={academicYear}
                    onValueChange={(value) => setAcademicYear(value as AcademicYearOption)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select academic year" />
                    </SelectTrigger>
                    <SelectContent>
                      {academicYearOptions.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-medium text-foreground">Class</p>
                  <Select
                    value={effectiveClassName}
                    onValueChange={(value) => setClassName(value as ClassOption)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select class" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableClasses.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-medium text-foreground">Section</p>
                  <Select
                    value={effectiveSection}
                    onValueChange={(value) => setSection(value as SectionOption)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select section" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableSections.map((option) => (
                        <SelectItem key={option} value={option}>
                          Section {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <Button variant="outline">
                  <Download className="size-4" />
                  Export
                </Button>
                <Button onClick={handleCreate}>
                  <Plus className="size-4" />
                  Add Time Table
                </Button>
              </div>
            </div>

            <div className="flex items-center gap-2 rounded-lg border border-border/70 bg-muted/20 px-4 py-3 text-sm text-muted-foreground">
              <CalendarDays className="size-4 text-primary" />
              Viewing {activeTimetable.className} • Section {activeTimetable.section} •{" "}
              {activeTimetable.academicYear}
            </div>

            <TimetableGrid rows={activeTimetable.rows} onEntrySelect={handleSelectEntry} />
          </CardContent>
        </Card>
      </section>

      <TimetableDetailDialog
        open={detailOpen}
        onOpenChange={setDetailOpen}
        entry={selectedEntry}
        timeLabel={selectedTime}
        className={activeTimetable.className}
        section={activeTimetable.section}
        onEdit={handleEdit}
        onDelete={() => setDeleteOpen(true)}
      />

      <TimetableDialog
        open={editorOpen}
        onOpenChange={setEditorOpen}
        onSubmit={handleDialogSubmit}
        slot={editingSlot}
        timeOptions={timeOptions}
      />

      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete timetable slot?</AlertDialogTitle>
            <AlertDialogDescription>
              This will remove the scheduled class from{" "}
              <span className="font-medium text-foreground">
                {selectedEntry?.day}
                {selectedTime ? ` • ${selectedTime}` : ""}
              </span>
              . You can add a new subject to this slot later.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction variant="destructive" onClick={handleDelete}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default Page;
