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
  classAcademicYearOptions,
  classStatusOptions,
  type ClassRecord,
} from "./columns";

const formSchema = z.object({
  className: z.string().trim().min(1, "Class name is required."),
  classCode: z.string().trim().min(1, "Class code is required."),
  academicYear: z.enum(classAcademicYearOptions),
  totalSections: z.coerce.number().min(1, "Sections must be at least 1."),
  status: z.enum(classStatusOptions),
});

export type ClassDialogValues = z.infer<typeof formSchema>;
type ClassDialogInputValues = z.input<typeof formSchema>;

type ClassDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: ClassDialogValues) => void;
  record?: ClassRecord | null;
};

export const ClassDialog = ({
  open,
  onOpenChange,
  onSubmit,
  record,
}: ClassDialogProps) => {
  const form = useForm<ClassDialogInputValues, unknown, ClassDialogValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      className: "",
      classCode: "",
      academicYear: "2024-2025",
      totalSections: 2,
      status: "Active",
    },
  });

  useEffect(() => {
    if (!open) return;

    form.reset({
      className: record?.className ?? "",
      classCode: record?.classCode ?? "",
      academicYear: record?.academicYear ?? "2024-2025",
      totalSections: record?.totalSections ?? 2,
      status: record?.status ?? "Active",
    });
  }, [form, open, record]);

  const isEditing = Boolean(record);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Update Class" : "Create Class"}</DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Update the class profile, assigned academic year, and section count."
              : "Add a new class and define its academic year, sections, and current status."}
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={form.handleSubmit((values) => {
            onSubmit(values);
            onOpenChange(false);
          })}
          className="space-y-4"
        >
          <div className="grid gap-4 md:grid-cols-2">
            <Controller
              control={form.control}
              name="className"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Class Name</FieldLabel>
                  <Input placeholder="Enter class name" {...field} />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
            <Controller
              control={form.control}
              name="classCode"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Class Code</FieldLabel>
                  <Input placeholder="Enter class code" {...field} />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <Controller
              control={form.control}
              name="academicYear"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Academic Year</FieldLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select academic year" />
                    </SelectTrigger>
                    <SelectContent>
                      {classAcademicYearOptions.map((option) => (
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
              name="totalSections"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Total Sections</FieldLabel>
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
                      {classStatusOptions.map((option) => (
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
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">
              {isEditing ? "Save Changes" : "Create Class"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
