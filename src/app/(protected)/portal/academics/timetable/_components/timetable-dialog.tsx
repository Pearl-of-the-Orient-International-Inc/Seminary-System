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

import { type TimetableSubject, type WeekDay, weekDays } from "./data";

const modalityOptions = ["Online", "Face to Face"] as const;

const formSchema = z.object({
  day: z.enum(weekDays),
  time: z.string().trim().min(1, "Time is required."),
  code: z.string().trim().min(1, "Subject code is required."),
  title: z.string().trim().min(1, "Subject title is required."),
  lecturer: z.string().trim().min(1, "Lecturer is required."),
  modality: z.enum(modalityOptions),
});

export type TimetableDialogValues = z.infer<typeof formSchema>;

export type EditableTimetableSlot = {
  day: WeekDay;
  time: string;
  subject: TimetableSubject | null;
};

type TimetableDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: TimetableDialogValues) => void;
  slot: EditableTimetableSlot | null;
  timeOptions: string[];
};

export const TimetableDialog = ({
  open,
  onOpenChange,
  onSubmit,
  slot,
  timeOptions,
}: TimetableDialogProps) => {
  const form = useForm<TimetableDialogValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      day: "Monday",
      time: timeOptions[0] ?? "",
      code: "",
      title: "",
      lecturer: "",
      modality: "Face to Face",
    },
  });

  useEffect(() => {
    if (!open) return;

    form.reset({
      day: slot?.day ?? "Monday",
      time: slot?.time ?? timeOptions[0] ?? "",
      code: slot?.subject?.code ?? "",
      title: slot?.subject?.title ?? "",
      lecturer: slot?.subject?.lecturer ?? "",
      modality: slot?.subject?.modality ?? "Face to Face",
    });
  }, [form, open, slot, timeOptions]);

  const isEditing = Boolean(slot?.subject);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Update Timetable Slot" : "Add Timetable Slot"}</DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Update the scheduled subject, assigned lecturer, and delivery modality."
              : "Assign a subject to a class day and time within the current timetable."}
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
              name="day"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Day</FieldLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select day" />
                    </SelectTrigger>
                    <SelectContent>
                      {weekDays.map((day) => (
                        <SelectItem key={day} value={day}>
                          {day}
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
              name="time"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Time Slot</FieldLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select time slot" />
                    </SelectTrigger>
                    <SelectContent>
                      {timeOptions.map((time) => (
                        <SelectItem key={time} value={time}>
                          {time}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Controller
              control={form.control}
              name="title"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Subject Title</FieldLabel>
                  <Input placeholder="Enter subject title" {...field} />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
            <Controller
              control={form.control}
              name="code"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Subject Code</FieldLabel>
                  <Input placeholder="Enter subject code" {...field} />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Controller
              control={form.control}
              name="lecturer"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Lecturer</FieldLabel>
                  <Input placeholder="Enter lecturer name" {...field} />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
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
                      {modalityOptions.map((option) => (
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
            <Button type="submit">{isEditing ? "Save Changes" : "Add Slot"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
