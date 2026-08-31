"use client";

import { useEffect, useMemo } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSeminaryInstructorsQuery } from "@/features/seminary/seminary.hooks";

import {
  courseModalityOptions,
  courseProgramOptions,
  courseStatusOptions,
  type CourseRecord,
} from "./columns";

const formSchema = z.object({
  courseName: z.string().trim().min(1, "Course name is required."),
  courseCode: z.string().trim().min(1, "Course code is required."),
  program: z.enum(courseProgramOptions),
  status: z.enum(courseStatusOptions),
  subjects: z
    .array(
      z.object({
        date: z.string().trim().min(1, "Date is required."),
        subjectName: z.string().trim().min(1, "Subject name is required."),
        units: z.coerce.number().min(1, "Units must be at least 1."),
        startTime: z.string().trim().min(1, "Start time is required."),
        endTime: z.string().trim().min(1, "End time is required."),
        professor: z.string().trim().min(1, "Professor is required."),
        modality: z.enum(courseModalityOptions),
      }),
    )
    .min(1, "Add at least one subject."),
});

export type CourseDialogValues = z.infer<typeof formSchema>;
type CourseDialogInputValues = z.input<typeof formSchema>;

type CourseDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: CourseDialogValues) => Promise<void> | void;
  record?: CourseRecord | null;
  submitting?: boolean;
};

const defaultSubject: CourseDialogInputValues["subjects"][number] = {
  date: "",
  subjectName: "",
  units: 3,
  startTime: "",
  endTime: "",
  professor: "",
  modality: "Online",
};

export const CourseDialog = ({
  open,
  onOpenChange,
  onSubmit,
  record,
  submitting = false,
}: CourseDialogProps) => {
  const instructorsQuery = useSeminaryInstructorsQuery({
    limit: 100,
    page: 1,
    status: "ACTIVE",
  });
  const form = useForm<CourseDialogInputValues, unknown, CourseDialogValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      courseName: "",
      courseCode: "",
      program: "Certificate",
      status: "Active",
      subjects: [defaultSubject],
    },
  });

  const subjects = useFieldArray({
    control: form.control,
    name: "subjects",
  });
  const instructors = useMemo(
    () => instructorsQuery.data?.data ?? [],
    [instructorsQuery.data?.data],
  );

  useEffect(() => {
    if (!open) return;

    form.reset({
      courseName: record?.courseName ?? "",
      courseCode: record?.courseCode ?? "",
      program: record?.program ?? "Certificate",
      status: record?.status ?? "Active",
      subjects: record?.subjects.length ? record.subjects : [defaultSubject],
    });
  }, [form, open, record]);

  const isEditing = Boolean(record);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-4xl! overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Update Course" : "Create Course"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Update the course and its subject list."
              : "Add a course parent and define its subjects."}
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={form.handleSubmit(async (values) => {
            await onSubmit(values);
          })}
          className="space-y-4"
        >
          <div className="grid gap-4 md:grid-cols-2">
            <Controller
              control={form.control}
              name="courseName"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Course Name</FieldLabel>
                  <Input placeholder="Enter course name" {...field} />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
            <Controller
              control={form.control}
              name="courseCode"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Course Code</FieldLabel>
                  <Input placeholder="Enter course code" {...field} />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Controller
              control={form.control}
              name="program"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Program</FieldLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select program" />
                    </SelectTrigger>
                    <SelectContent>
                      {courseProgramOptions.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
            <Controller
              control={form.control}
              name="status"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Status</FieldLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      {courseStatusOptions.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
          </div>

          <div className="space-y-3 rounded-lg border p-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h3 className="font-semibold">Subjects</h3>
                <p className="text-sm text-muted-foreground">
                  Add each child subject under this course.
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => subjects.append(defaultSubject)}
              >
                <Plus className="size-4" />
                Add Subject
              </Button>
            </div>

            <div className="space-y-4">
              {subjects.fields.map((subject, index) => (
                <div key={subject.id} className="rounded-md border p-4">
                  <div className="mb-4 flex items-center justify-between gap-3">
                    <span className="text-sm font-semibold">
                      Subject {index + 1}
                    </span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      disabled={subjects.fields.length === 1}
                      onClick={() => subjects.remove(index)}
                    >
                      <Trash2 className="size-4" />
                      <span className="sr-only">Remove subject</span>
                    </Button>
                  </div>

                  <div className="grid gap-4 md:grid-cols-3">
                    <Controller
                      control={form.control}
                      name={`subjects.${index}.date`}
                      render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                          <FieldLabel>Date</FieldLabel>
                          <Input
                            type="date"
                            name={field.name}
                            ref={field.ref}
                            onBlur={field.onBlur}
                            value={field.value}
                            onChange={field.onChange}
                          />
                          {fieldState.invalid && (
                            <FieldError errors={[fieldState.error]} />
                          )}
                        </Field>
                      )}
                    />
                    <Controller
                      control={form.control}
                      name={`subjects.${index}.subjectName`}
                      render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                          <FieldLabel>Subject Name</FieldLabel>
                          <Input placeholder="Enter subject name" {...field} />
                          {fieldState.invalid && (
                            <FieldError errors={[fieldState.error]} />
                          )}
                        </Field>
                      )}
                    />
                    <Controller
                      control={form.control}
                      name={`subjects.${index}.professor`}
                      render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                          <FieldLabel>Professor</FieldLabel>
                          <Select
                            value={field.value}
                            onValueChange={field.onChange}
                            disabled={instructorsQuery.isLoading}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue
                                placeholder={
                                  instructorsQuery.isLoading
                                    ? "Loading instructors..."
                                    : "Select professor"
                                }
                              />
                            </SelectTrigger>
                            <SelectContent>
                              {field.value &&
                                !instructors.some(
                                  (instructor) => instructor.name === field.value,
                                ) && (
                                  <SelectItem value={field.value}>
                                    {field.value}
                                  </SelectItem>
                                )}
                              {instructors.map((instructor) => (
                                <SelectItem
                                  key={instructor.id}
                                  value={instructor.name}
                                >
                                  {instructor.name} - {instructor.facultyId}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          {fieldState.invalid && (
                            <FieldError errors={[fieldState.error]} />
                          )}
                        </Field>
                      )}
                    />
                  </div>

                  <div className="mt-4 grid gap-4 md:grid-cols-4">
                    <Controller
                      control={form.control}
                      name={`subjects.${index}.units`}
                      render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                          <FieldLabel>Units</FieldLabel>
                          <Input
                            min={1}
                            type="number"
                            name={field.name}
                            ref={field.ref}
                            onBlur={field.onBlur}
                            value={
                              typeof field.value === "number" ? field.value : ""
                            }
                            onChange={(event) =>
                              field.onChange(event.target.value)
                            }
                          />
                          {fieldState.invalid && (
                            <FieldError errors={[fieldState.error]} />
                          )}
                        </Field>
                      )}
                    />
                    <Controller
                      control={form.control}
                      name={`subjects.${index}.startTime`}
                      render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                          <FieldLabel>Start Time</FieldLabel>
                          <Input
                            type="time"
                            step={300}
                            name={field.name}
                            ref={field.ref}
                            onBlur={field.onBlur}
                            value={field.value}
                            onChange={field.onChange}
                          />
                          {fieldState.invalid && (
                            <FieldError errors={[fieldState.error]} />
                          )}
                        </Field>
                      )}
                    />
                    <Controller
                      control={form.control}
                      name={`subjects.${index}.endTime`}
                      render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                          <FieldLabel>End Time</FieldLabel>
                          <Input
                            type="time"
                            step={300}
                            name={field.name}
                            ref={field.ref}
                            onBlur={field.onBlur}
                            value={field.value}
                            onChange={field.onChange}
                          />
                          {fieldState.invalid && (
                            <FieldError errors={[fieldState.error]} />
                          )}
                        </Field>
                      )}
                    />
                    <Controller
                      control={form.control}
                      name={`subjects.${index}.modality`}
                      render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                          <FieldLabel>Modality</FieldLabel>
                          <Select
                            value={field.value}
                            onValueChange={field.onChange}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select modality" />
                            </SelectTrigger>
                            <SelectContent>
                              {courseModalityOptions.map((option) => (
                                <SelectItem key={option} value={option}>
                                  {option}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          {fieldState.invalid && (
                            <FieldError errors={[fieldState.error]} />
                          )}
                        </Field>
                      )}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              disabled={submitting}
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting
                ? "Saving..."
                : isEditing
                  ? "Save Changes"
                  : "Create Course"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
