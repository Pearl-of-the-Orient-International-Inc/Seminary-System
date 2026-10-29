"use client";

import { useEffect, useId } from "react";
import { useForm, Controller, useWatch } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarIcon, CloudUpload } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { DateTimePicker } from "@/components/ui/date-time-picker";
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
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

import { assignmentTypeOptions, type AssignmentRecord } from "./columns";
import { ScrollArea } from "@/components/ui/scroll-area";
import { RichTextEditor } from "@/components/rich-text-editor/Editor";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";

const formSchema = z.object({
  title: z.string().trim().min(1, "Title is required."),
  subject: z.string().trim().min(1, "Subject is required."),
  assignmentType: z.enum(assignmentTypeOptions, {
    message: "Assignment type is required.",
  }),
  description: z
    .string()
    .trim()
    .min(1, "Description is required.")
    .max(2000, "Description must not exceed 2000 characters."),
  dueAt: z.date({
    message: "Due date and time are required.",
  }),
  totalMarks: z.string().trim().min(1, "Total marks is required."),
  attachmentLabel: z.string().optional(),
  allowLateSubmission: z.boolean(),
  lateSubmissionDeadline: z.date().optional(),
  additionalInstructions: z.string().optional(),
  notifyStudents: z.boolean(),
});

type AssignmentDialogValues = z.infer<typeof formSchema>;

type AssignmentDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: AssignmentDialogValues) => Promise<boolean>;
  record?: AssignmentRecord | null;
  subjectOptions: string[];
  submitting?: boolean;
};

const parseDueAtValue = (dateValue?: string, timeValue?: string) => {
  if (!dateValue) return undefined;

  const combined = timeValue ? `${dateValue} ${timeValue}` : dateValue;
  const parsed = new Date(combined);
  return Number.isNaN(parsed.getTime()) ? undefined : parsed;
};

export const formatTimeLabel = (value: string) => {
  const [hourText, minute] = value.split(":");
  const hour = Number(hourText);
  if (Number.isNaN(hour) || !minute) return value;

  const meridiem = hour >= 12 ? "PM" : "AM";
  const normalizedHour = hour % 12 || 12;

  return `${String(normalizedHour).padStart(2, "0")}:${minute} ${meridiem}`;
};

export const AssignmentDialog = ({
  open,
  onOpenChange,
  onSubmit,
  record,
  subjectOptions,
  submitting = false,
}: AssignmentDialogProps) => {
  const fileInputId = useId();

  const form = useForm<AssignmentDialogValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      subject: undefined,
      assignmentType: undefined,
      description: "",
      dueAt: undefined,
      totalMarks: "",
      attachmentLabel: "",
      allowLateSubmission: true,
      lateSubmissionDeadline: undefined,
      additionalInstructions: "",
      notifyStudents: true,
    },
  });

  const toDateValue = (value: string) => {
    const parsed = new Date(value);
    if (!Number.isNaN(parsed.getTime())) {
      return parsed;
    }

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

  useEffect(() => {
    if (!open) return;

    form.reset({
      title: record?.title ?? "",
      subject: record?.subject ?? subjectOptions[0] ?? undefined,
      assignmentType: record?.assignmentType ?? undefined,
      description: record?.description ?? "",
      dueAt: parseDueAtValue(record?.dueDate, record?.dueTime),
      totalMarks: record?.totalMarks ?? "",
      attachmentLabel: record?.attachmentLabel ?? "",
      allowLateSubmission: record?.allowLateSubmission ?? true,
      lateSubmissionDeadline: record?.lateSubmissionDeadline
        ? toDateValue(record.lateSubmissionDeadline)
        : undefined,
      additionalInstructions: record?.additionalInstructions ?? "",
      notifyStudents: record?.notifyStudents ?? true,
    });
  }, [form, open, record, subjectOptions]);

  const isEditing = Boolean(record);
  const lateSubmissionEnabled = useWatch({
    control: form.control,
    name: "allowLateSubmission",
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl! overflow-hidden p-0">
        <DialogHeader className="p-5 pb-0">
          <DialogTitle>
            {isEditing ? "Update Assignment" : "Create Assignment"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Update assignment details, submission schedule, and student instructions."
              : "Add a new assignment for your seminarians and define the submission details."}
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[80vh] p-5">
          <form
            onSubmit={form.handleSubmit(async (values) => {
              if (await onSubmit(values)) onOpenChange(false);
            })}
            className="space-y-5"
          >
            <div className="grid gap-4 md:grid-cols-3">
              <Controller
                control={form.control}
                name="title"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>Title *</FieldLabel>
                    <Input placeholder="Enter assignment title" {...field} />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                control={form.control}
                name="subject"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>Subject *</FieldLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select subject" />
                      </SelectTrigger>
                      <SelectContent>
                        {subjectOptions.map((option) => (
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
              <Controller
                control={form.control}
                name="assignmentType"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>Assignment Type *</FieldLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        {assignmentTypeOptions.map((option) => (
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

            <Controller
              control={form.control}
              name="description"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Description *</FieldLabel>
                  <RichTextEditor
                    {...field}
                    placeholder="Enter assignment description and instructions..."
                  />
                  <div className="flex justify-end text-xs text-muted-foreground">
                    {field.value.length} / 2000
                  </div>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <div className="grid gap-4 md:grid-cols-2">
              <Controller
                control={form.control}
                name="dueAt"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>Due Date & Time *</FieldLabel>
                    <DateTimePicker
                      value={field.value}
                      onChange={field.onChange}
                      placeholder="Select due date and time"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                control={form.control}
                name="totalMarks"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>Total Marks *</FieldLabel>
                    <Input placeholder="Enter total marks" {...field} />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </div>

            <Controller
              control={form.control}
              name="attachmentLabel"
              render={({ field }) => (
                <Field>
                  <FieldLabel>Attach Files</FieldLabel>
                  <label
                    htmlFor={fileInputId}
                    className="flex min-h-32 cursor-pointer flex-col items-center justify-center rounded-md border border-dashed border-slate-300 bg-slate-50 px-4 py-6 text-center"
                  >
                    <CloudUpload className="mb-3 size-8 text-slate-400" />
                    <p className="text-sm font-medium text-slate-700">
                      Drag and drop files here or{" "}
                      <span className="text-primary">click to browse</span>
                    </p>
                    <p className="mt-2 text-xs text-slate-500">
                      Supports: PDF, DOC, DOCX, PPT, PPTX, XLS, XLSX, ZIP
                    </p>
                    {field.value ? (
                      <p className="mt-3 text-xs font-medium text-slate-700">
                        {field.value}
                      </p>
                    ) : null}
                  </label>
                  <Input
                    id={fileInputId}
                    type="file"
                    multiple
                    className="hidden"
                    onChange={(event) => {
                      const files = Array.from(event.target.files ?? []);
                      const label = files.map((file) => file.name).join(", ");
                      field.onChange(label);
                    }}
                  />
                </Field>
              )}
            />

            <div className="space-y-4">
              <Controller
                control={form.control}
                name="allowLateSubmission"
                render={({ field }) => (
                  <Field
                    orientation="horizontal"
                    className="items-center justify-between"
                  >
                    <FieldLabel>Allow Late Submission</FieldLabel>
                    <Switch
                      checked={field.value}
                      onCheckedChange={(checked) => {
                        const enabled = Boolean(checked);
                        field.onChange(enabled);
                        if (!enabled) {
                          form.setValue("lateSubmissionDeadline", undefined);
                        }
                      }}
                    />
                  </Field>
                )}
              />

              {lateSubmissionEnabled ? (
                <Controller
                  control={form.control}
                  name="lateSubmissionDeadline"
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel>Late Submission Deadline</FieldLabel>
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
                              <span className="text-muted-foreground">
                                dd/mm/yyyy
                              </span>
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
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
              ) : null}
            </div>

            <Controller
              control={form.control}
              name="additionalInstructions"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Instructions for Students (Optional)</FieldLabel>
                  <Textarea
                    {...field}
                    placeholder="Add any additional instructions for students..."
                    className="min-h-24"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <DialogFooter className="flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
              <Controller
                control={form.control}
                name="notifyStudents"
                render={({ field }) => (
                  <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={(checked) =>
                        field.onChange(Boolean(checked))
                      }
                    />
                    Notify students
                  </label>
                )}
              />

              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={submitting}>
                  {submitting
                    ? "Saving..."
                    : isEditing
                      ? "Save Changes"
                      : "Create Assignment"}
                </Button>
              </div>
            </DialogFooter>
          </form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export type { AssignmentDialogValues };
