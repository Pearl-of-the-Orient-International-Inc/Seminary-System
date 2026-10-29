"use client";

import { useEffect } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import type {
  SeminaryCourse,
  SeminaryInstructor,
  SeminaryProgramLevel,
} from "@/features/seminary/seminary.types";

import { type TimetableSubject } from "./data";

const programOptions = ["Certificate", "Bachelor", "Master", "Doctor"] as const;
type ProgramOption = (typeof programOptions)[number];

const programValueMap: Record<ProgramOption, SeminaryProgramLevel> = {
  Certificate: "CERTIFICATE",
  Bachelor: "BACHELOR",
  Master: "MASTER_WITH_THESIS",
  Doctor: "DOCTORATE_WITH_DISSERTATION",
};

const programLabelMap: Record<SeminaryProgramLevel, ProgramOption> = {
  CERTIFICATE: "Certificate",
  BACHELOR: "Bachelor",
  MASTER_WITH_THESIS: "Master",
  DOCTORATE_WITH_DISSERTATION: "Doctor",
};

const formSchema = z
  .object({
    scheduledDate: z.string().min(1, "Date is required."),
    program: z.enum(programOptions, { message: "Select a program." }),
    courseId: z.string().uuid("Select a course."),
    subjectName: z.string().min(1, "Select a subject."),
    units: z.number().int().min(1),
    instructorId: z.string().uuid("Select an instructor."),
    startTime: z.string().min(1, "Start time is required."),
    endTime: z.string().min(1, "End time is required."),
    modality: z.enum(["Online", "Onsite"]),
  })
  .refine((value) => value.startTime < value.endTime, {
    path: ["endTime"],
    message: "End time must be after start time.",
  });

export type TimetableDialogValues = z.infer<typeof formSchema>;

export type EditableTimetableSlot = {
  subject: TimetableSubject | null;
  scheduledDate?: string;
  startTime?: string;
  endTime?: string;
};

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: TimetableDialogValues) => Promise<void> | void;
  slot: EditableTimetableSlot | null;
  courses: SeminaryCourse[];
  instructors: SeminaryInstructor[];
  submitting?: boolean;
};

export const TimetableDialog = ({
  open,
  onOpenChange,
  onSubmit,
  slot,
  courses,
  instructors,
  submitting,
}: Props) => {
  const form = useForm<TimetableDialogValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      scheduledDate: "",
      program: "Certificate",
      courseId: "",
      subjectName: "",
      units: 0,
      instructorId: "",
      startTime: "19:00",
      endTime: "21:00",
      modality: "Online",
    },
  });

  const program = useWatch({ control: form.control, name: "program" });
  const courseId = useWatch({ control: form.control, name: "courseId" });
  const subjectName = useWatch({ control: form.control, name: "subjectName" });
  const selectedCourse = courses.find((course) => course.id === courseId);
  const selectedSubject = selectedCourse?.subjects.find(
    (subject) => subject.subjectName === subjectName,
  );
  const filteredCourses = courses.filter(
    (course) => course.program === programValueMap[program],
  );

  useEffect(() => {
    if (!open) return;

    const selectedSlotCourse = courses.find(
      (course) => course.id === slot?.subject?.courseId,
    );

    form.reset({
      scheduledDate: slot?.scheduledDate ?? "",
      program: selectedSlotCourse
        ? programLabelMap[selectedSlotCourse.program]
        : "Certificate",
      courseId: slot?.subject?.courseId ?? "",
      subjectName: slot?.subject?.title ?? "",
      units: 0,
      instructorId: slot?.subject?.instructorId ?? "",
      startTime: slot?.startTime ?? "19:00",
      endTime: slot?.endTime ?? "21:00",
      modality: slot?.subject?.modality === "Face to Face" ? "Onsite" : "Online",
    });
  }, [courses, form, open, slot]);

  useEffect(() => {
    form.setValue("units", selectedSubject?.units ?? 0);
  }, [form, selectedSubject]);

  const edit = Boolean(slot?.subject);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full gap-0 overflow-y-auto sm:max-w-xl">
        <SheetHeader className="border-b px-6 py-5">
          <SheetTitle>
            {edit ? "Update Class Schedule" : "Add Class Schedule"}
          </SheetTitle>
          <SheetDescription>
            Create one dated class schedule. It does not repeat weekly.
          </SheetDescription>
        </SheetHeader>

        <form
          className="flex min-h-full flex-col"
          onSubmit={form.handleSubmit(async (values) => {
            await onSubmit(values);
            onOpenChange(false);
          })}
        >
          <div className="space-y-4 px-6 py-5">
            <Controller
              control={form.control}
              name="scheduledDate"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Date</FieldLabel>
                  <Input type="date" {...field} />
                  {fieldState.error && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            <Controller
              control={form.control}
              name="program"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Program</FieldLabel>
                  <Select
                    value={field.value}
                    onValueChange={(value: ProgramOption) => {
                      field.onChange(value);
                      form.setValue("courseId", "");
                      form.setValue("subjectName", "");
                      form.setValue("units", 0);
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select program" />
                    </SelectTrigger>
                    <SelectContent>
                      {programOptions.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {fieldState.error && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            <Controller
              control={form.control}
              name="courseId"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Course</FieldLabel>
                  <Select
                    value={field.value}
                    onValueChange={(value) => {
                      field.onChange(value);
                      form.setValue("subjectName", "");
                      form.setValue("units", 0);
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select active course" />
                    </SelectTrigger>
                    <SelectContent>
                      {filteredCourses.map((course) => (
                        <SelectItem key={course.id} value={course.id}>
                          {course.courseCode} — {course.courseName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {fieldState.error && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            <div className="grid gap-4 sm:grid-cols-[1fr_120px]">
              <Controller
                control={form.control}
                name="subjectName"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>Subject</FieldLabel>
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                      disabled={!selectedCourse}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select subject" />
                      </SelectTrigger>
                      <SelectContent>
                        {selectedCourse?.subjects.map((subject) => (
                          <SelectItem
                            key={subject.subjectName}
                            value={subject.subjectName}
                          >
                            {subject.subjectName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {fieldState.error && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
              <Field>
                <FieldLabel>Unit</FieldLabel>
                <Input
                  readOnly
                  value={selectedSubject ? String(selectedSubject.units) : "—"}
                />
              </Field>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Controller
                control={form.control}
                name="startTime"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>Start time</FieldLabel>
                    <Input type="time" {...field} />
                    {fieldState.error && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
              <Controller
                control={form.control}
                name="endTime"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>End time</FieldLabel>
                    <Input type="time" {...field} />
                    {fieldState.error && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
            </div>

            <Controller
              control={form.control}
              name="instructorId"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Professor / instructor</FieldLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select instructor" />
                    </SelectTrigger>
                    <SelectContent>
                      {instructors.map((instructor) => (
                        <SelectItem key={instructor.id} value={instructor.id}>
                          {instructor.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {fieldState.error && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            <Controller
              control={form.control}
              name="modality"
              render={({ field }) => (
                <Field>
                  <FieldLabel>Remarks / modality</FieldLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Online">Online Class</SelectItem>
                      <SelectItem value="Onsite">Onsite Class</SelectItem>
                    </SelectContent>
                  </Select>
                </Field>
              )}
            />
          </div>

          <SheetFooter className="mt-auto flex-row justify-end border-t px-6 py-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? "Saving…" : edit ? "Save Changes" : "Add Schedule"}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
};
