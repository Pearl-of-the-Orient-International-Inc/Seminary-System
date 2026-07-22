"use client";

import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

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
  units: z.coerce.number().min(1, "Units must be at least 1."),
  modality: z.enum(courseModalityOptions),
  status: z.enum(courseStatusOptions),
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

export const CourseDialog = ({
  open,
  onOpenChange,
  onSubmit,
  record,
  submitting = false,
}: CourseDialogProps) => {
  const form = useForm<CourseDialogInputValues, unknown, CourseDialogValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      courseName: "",
      courseCode: "",
      program: "Certificate",
      units: 3,
      modality: "Online",
      status: "Active",
    },
  });

  useEffect(() => {
    if (!open) return;

    form.reset({
      courseName: record?.courseName ?? "",
      courseCode: record?.courseCode ?? "",
      program: record?.program ?? "Certificate",
      units: record?.units ?? 3,
      modality: record?.modality ?? "Online",
      status: record?.status ?? "Active",
    });
  }, [form, open, record]);

  const isEditing = Boolean(record);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl!">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Update Course" : "Create Course"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Update the course details, units, modality, and status."
              : "Add a new course and define how it will be delivered."}
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
              name="units"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Units</FieldLabel>
                  <Input
                    min={1}
                    type="number"
                    name={field.name}
                    ref={field.ref}
                    onBlur={field.onBlur}
                    value={typeof field.value === "number" ? field.value : ""}
                    onChange={(event) => field.onChange(event.target.value)}
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Controller
              control={form.control}
              name="modality"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Modality</FieldLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
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
