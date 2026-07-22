"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Controller } from "react-hook-form";

import {
  academicYearSessionOptions,
  academicYearStatusOptions,
  type AcademicYearRecord,
} from "./columns";

const formSchema = z.object({
  academicYear: z.string().trim().min(1, "Academic year is required."),
  session: z.enum(academicYearSessionOptions),
  status: z.enum(academicYearStatusOptions),
  startDate: z.date({
    message: "Start date is required.",
  }),
  endDate: z.date({
    message: "End date is required.",
  }),
});

type AcademicYearDialogValues = z.infer<typeof formSchema>;

type AcademicYearDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: AcademicYearDialogValues) => Promise<void> | void;
  record?: AcademicYearRecord | null;
  submitting?: boolean;
};

const toDateValue = (value: string) => {
  const [day, monthText, year] = value.split(" ");
  const monthMap: Record<string, string> = {
    Jan: "01",
    Feb: "02",
    Mar: "03",
    Apr: "04",
    May: "05",
    Jun: "06",
    Jul: "07",
    Aug: "08",
    Sep: "09",
    Oct: "10",
    Nov: "11",
    Dec: "12",
  };

  const month = monthMap[monthText];
  if (!day || !month || !year) {
    return undefined;
  }

  return new Date(`${year}-${month}-${day}T00:00:00`);
};

export const AcademicYearDialog = ({
  open,
  onOpenChange,
  onSubmit,
  record,
  submitting = false,
}: AcademicYearDialogProps) => {
  const form = useForm<AcademicYearDialogValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      academicYear: "",
      session: "Current",
      status: "Active",
      startDate: undefined,
      endDate: undefined,
    },
  });

  useEffect(() => {
    if (!open) {
      return;
    }

    form.reset({
      academicYear: record?.academicYear ?? "",
      session: record?.session ?? "Current",
      status: record?.status ?? "Active",
      startDate: record?.startDate ? toDateValue(record.startDate) : undefined,
      endDate: record?.endDate ? toDateValue(record.endDate) : undefined,
    });
  }, [form, open, record]);

  const isEditing = Boolean(record);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl!">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Update Academic Year" : "Create Academic Year"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Update the session, schedule, and status for this academic year."
              : "Add a new academic year record and define its schedule and current state."}
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={form.handleSubmit(async (values) => {
            await onSubmit(values);
          })}
          className="space-y-4"
        >
          <Controller
            control={form.control}
            name="academicYear"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>Academic Year</FieldLabel>
                <Input placeholder="e.g. 2026-2027" {...field} />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />

          <div className="grid gap-4 md:grid-cols-2">
            <Controller
              control={form.control}
              name="session"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Session</FieldLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select session" />
                    </SelectTrigger>
                    <SelectContent>
                      {academicYearSessionOptions.map((option) => (
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
                      {academicYearStatusOptions.map((option) => (
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

          <div className="grid gap-4 md:grid-cols-2">
            <Controller
              control={form.control}
              name="startDate"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Start Date</FieldLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal"
                        type="button"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span className="text-muted-foreground">dd/mm/yyyy</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        initialFocus
                        selected={field.value}
                        onSelect={field.onChange}
                      />
                    </PopoverContent>
                  </Popover>
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            <Controller
              control={form.control}
              name="endDate"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>End Date</FieldLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal"
                        type="button"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span className="text-muted-foreground">dd/mm/yyyy</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        initialFocus
                        selected={field.value}
                        onSelect={field.onChange}
                      />
                    </PopoverContent>
                  </Popover>
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
                  : "Create Academic Year"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export type { AcademicYearDialogValues };
