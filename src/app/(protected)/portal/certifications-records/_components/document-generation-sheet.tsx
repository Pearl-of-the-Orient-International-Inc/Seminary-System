"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  Award,
  Check,
  ChevronsUpDown,
  Download,
  ExternalLink,
  FileText,
  UserPlus,
  X,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

import {
  documentTypeLabels,
  type SeminaryDocumentType,
} from "./certifications-records-data";
import { TranscriptPreview } from "./tor-preview";
import { useGenerateSeminaryTranscriptBatchMutation, useSeminaryGradeRecordsQuery, useSeminaryStudentsQuery } from "@/features/seminary/seminary.hooks";
import { useToast } from "@/hooks/use-toast";

type Student = {
  id: string;
  name: string;
  program: string;
  studentNumber: string;
};

type DocumentGenerationSheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  documentType: SeminaryDocumentType;
};

export function DocumentGenerationSheet({
  open,
  onOpenChange,
  documentType,
}: DocumentGenerationSheetProps) {
  const { toast } = useToast();
  const studentsQuery = useSeminaryStudentsQuery({ page: 1, limit: 100 });
  const generateTranscript = useGenerateSeminaryTranscriptBatchMutation();
  const students = useMemo<Student[]>(() => (studentsQuery.data?.data ?? []).flatMap((student) => student.studentId ? [{ id: student.studentId, name: [student.givenName, student.middleName, student.surname].filter(Boolean).join(" ") || student.studentId, program: student.programCourse || "Program not set", studentNumber: student.studentId }] : []), [studentsQuery.data]);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>([]);
  const selectedStudents = students.filter((student) =>
    selectedStudentIds.includes(student.id),
  );
  const isReady = selectedStudents.length > 0;
  const previewStudent = selectedStudents[0];
  const gradesQuery = useSeminaryGradeRecordsQuery({ page: 1, limit: 100, search: previewStudent?.studentNumber });
  const previewGrades = (gradesQuery.data?.data ?? []).filter((grade) => grade.studentId === previewStudent?.studentNumber).map((grade) => ({ courseCode: grade.courseCode, courseTitle: grade.courseTitle, finalGrade: grade.finalGrade, units: null, remarks: grade.remarks, term: grade.term }));

  const toggleStudent = (studentId: string) =>
    setSelectedStudentIds((current) =>
      current.includes(studentId)
        ? current.filter((id) => id !== studentId)
        : [...current, studentId],
    );

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="h-dvh w-full max-w-full! gap-0 overflow-y-hidden p-0"
      >
        <SheetHeader className="border-b px-6 py-5 text-left">
          <SheetTitle>
            Generate {documentTypeLabels[documentType]} Batch
          </SheetTitle>
          <SheetDescription>
            Choose students to generate this document using its official
            Seminary template.
          </SheetDescription>
        </SheetHeader>

        <div className="grid h-[calc(100dvh-89px)] gap-6 overflow-hidden p-6 xl:grid-cols-[450px_minmax(0,1fr)]">
          <div className="space-y-5">
            <Card>
              <CardHeader>
                <CardTitle>Students / Recipients</CardTitle>
                <CardDescription>
                  Select one or more approved students for this document run.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Popover open={pickerOpen} onOpenChange={setPickerOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full justify-between"
                    >
                      <span className="flex items-center gap-2 truncate">
                        <UserPlus className="size-4" />
                        {selectedStudents.length
                          ? `${selectedStudents.length} student${selectedStudents.length === 1 ? "" : "s"} selected`
                          : "Choose students"}
                      </span>
                      <ChevronsUpDown className="size-4 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent align="start" className="w-105 p-0">
                    <Command>
                      <CommandInput placeholder="Search students..." />
                      <CommandList>
                        <CommandEmpty>No student found.</CommandEmpty>
                        <CommandGroup>
                          {students.map((student) => {
                            const selected = selectedStudentIds.includes(
                              student.id,
                            );
                            return (
                              <CommandItem
                                key={student.id}
                                value={`${student.name} ${student.studentNumber} ${student.program}`}
                                onSelect={() => toggleStudent(student.id)}
                                className="flex items-center gap-3 py-2.5"
                              >
                                <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-emerald-700/10 text-xs font-semibold text-emerald-800">
                                  {student.name
                                    .split(" ")
                                    .map((part) => part[0])
                                    .join("")
                                    .slice(0, 2)}
                                </div>
                                <div className="min-w-0 flex-1">
                                  <p className="truncate font-medium">
                                    {student.name}
                                  </p>
                                  <p className="truncate text-xs text-muted-foreground">
                                    {student.studentNumber}
                                  </p>
                                </div>
                                {selected ? (
                                  <Check className="size-4 shrink-0" />
                                ) : null}
                              </CommandItem>
                            );
                          })}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
                {selectedStudents.length ? (
                  <div className="flex flex-wrap gap-2">
                    {selectedStudents.map((student) => (
                      <Badge
                        key={student.id}
                        variant="secondary"
                        className="gap-2 rounded-full px-2 py-1"
                      >
                        <Checkbox
                          checked
                          onCheckedChange={() => toggleStudent(student.id)}
                          className="border-muted-foreground/50"
                        />
                        <span>{student.name}</span>
                        <button
                          type="button"
                          className="rounded-full p-0.5 hover:bg-background/70"
                          onClick={() => toggleStudent(student.id)}
                          aria-label={`Remove ${student.name}`}
                        >
                          <X className="size-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-muted-foreground">
                    No students selected yet.
                  </p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Institutional Template</CardTitle>
                <CardDescription>
                  Each document type uses a fixed, Registrar-approved template.
                  Uploading or changing layouts is not available.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3 rounded-2xl border border-[#032a0d] bg-[#032a0d]/5 p-3">
                  <div className="flex h-26 w-20 shrink-0 items-center justify-center rounded-xl border bg-[#fffdf7] text-emerald-800">
                    <FileText className="size-8" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium">
                      Official {documentTypeLabels[documentType]} Template
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {documentType === "TRANSCRIPT"
                        ? "TOR-bg.png with official Registrar typography"
                        : "Fixed Seminary document layout"}
                    </p>
                  </div>
                  <Check className="size-5 shrink-0 text-green-800" />
                </div>
              </CardContent>
            </Card>

            <Button
              type="button"
              disabled={!isReady || documentType !== "TRANSCRIPT" || generateTranscript.isPending}
              className="w-full"
              onClick={() => generateTranscript.mutate(selectedStudentIds, { onSuccess: () => toast({ title: "Transcript batch generated", description: `${selectedStudents.length} transcript record${selectedStudents.length === 1 ? "" : "s"} is ready for preview.` }), onError: () => toast({ title: "Unable to generate transcripts", variant: "error" }) })}
            >
              <Download className="size-4" />
              Generate, publish &amp; download batch PDF
            </Button>
          </div>

          <Card className="flex h-full min-h-0 flex-col overflow-hidden">
            <CardHeader className="border-b bg-accent/30">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <CardTitle>
                    {documentTypeLabels[documentType]} Preview
                  </CardTitle>
                  <CardDescription>
                    A compact sneak peek of the official generated document.
                  </CardDescription>
                </div>
                {previewStudent ? (
                  <Button asChild variant="outline" size="sm">
                    <Link
                      href={`/preview?student=${encodeURIComponent(previewStudent.id)}&type=${documentType}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Full preview <ExternalLink className="size-4" />
                    </Link>
                  </Button>
                ) : null}
              </div>
            </CardHeader>
            <CardContent className="min-h-0 flex-1 overflow-hidden p-6">
              {isReady && previewStudent ? (
                <div className="relative h-full overflow-hidden rounded-xl border bg-muted/20">
                  <div
                    className="absolute top-4 left-1/2 p-4"
                    style={{
                      width: "138.89%",
                      transform: "translateX(-50%) scale(.72)",
                      transformOrigin: "top center",
                    }}
                  >
                    {documentType === "TRANSCRIPT" ? (
                      <TranscriptPreview student={previewStudent} grades={previewGrades} />
                    ) : (
                      <div className="aspect-[1/1.414] rounded-xl border bg-[#fffdf7] p-6 text-center shadow-sm">
                        <Award className="mx-auto size-9 text-[#9a916f]" />
                        <p className="mt-7 text-xs uppercase tracking-[0.24em] text-[#796f51]">
                          Pearl of the Orient
                        </p>
                        <p className="mt-10 font-serif text-2xl text-[#3c3728]">
                          {documentTypeLabels[documentType]}
                        </p>
                        <p className="mt-6 text-lg font-semibold text-[#3c3728]">
                          {previewStudent.name}
                        </p>
                      </div>
                    )}
                  </div>
                  <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-linear-to-t from-muted/95 to-transparent" />
                </div>
              ) : (
                <div className="rounded-4xl border border-dashed border-[#d7cfb7] bg-[#fffdf7] px-6 py-12 text-center">
                  <Award className="mx-auto size-10 text-[#9a916f]" />
                  <p className="mt-4 text-lg font-medium text-[#3c3728]">
                    Generated PDF preview will appear here
                  </p>
                  <p className="mt-2 text-sm text-[#796f51]">
                    Select students to preview the final generated output.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </SheetContent>
    </Sheet>
  );
}
