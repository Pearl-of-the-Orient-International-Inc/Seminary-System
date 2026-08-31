"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Check,
  ChevronLeft,
  ChevronRight,
  Plus,
  Save,
  Trash2,
} from "lucide-react";

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
import { DateTimePicker } from "@/components/ui/date-time-picker";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useCurrentUserQuery } from "@/features/auth/auth.hooks";
import {
  toApiError,
  useCreateSeminaryExaminationMutation,
  useSeminaryCoursesQuery,
  useSeminaryExaminationQuery,
  useUpdateSeminaryExaminationMutation,
} from "@/features/seminary/seminary.hooks";
import type {
  SeminaryExaminationPayload,
  SeminaryExaminationQuestion,
  SeminaryExaminationQuestionType,
  SeminaryExaminationStatus,
} from "@/features/seminary/seminary.types";
import { useToast } from "@/hooks/use-toast";

const examTypeOptions = [
  "Unit Test",
  "Quarterly",
  "Midterm",
  "Practical",
  "Comprehensive",
  "Annual",
];
const statusOptions: Array<{
  label: string;
  value: SeminaryExaminationStatus;
}> = [
  { label: "Draft", value: "DRAFT" },
  { label: "Scheduled", value: "SCHEDULED" },
  { label: "Ongoing", value: "ONGOING" },
  { label: "Completed", value: "COMPLETED" },
];
const questionTypeOptions: Array<{
  label: string;
  value: SeminaryExaminationQuestionType;
}> = [
  { label: "Multiple Choice", value: "MULTIPLE_CHOICE" },
  { label: "True or False", value: "TRUE_FALSE" },
  { label: "Short Answer", value: "SHORT_ANSWER" },
  { label: "Essay", value: "ESSAY" },
];

type Step = 0 | 1;

type FormState = {
  coverage: string;
  durationMinutes: string;
  examType: string;
  instructions: string;
  passingScore: string;
  questions: SeminaryExaminationQuestion[];
  randomizeQuestions: boolean;
  scheduledAt?: Date;
  showResults: boolean;
  status: SeminaryExaminationStatus;
  subject: string;
  title: string;
  totalPoints: string;
};

const emptyQuestion = (): SeminaryExaminationQuestion => ({
  id:
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : String(Date.now()),
  type: "MULTIPLE_CHOICE",
  prompt: "",
  points: "1",
  options: ["", "", "", ""],
  answer: "",
});

const defaultForm: FormState = {
  coverage: "",
  durationMinutes: "60",
  examType: "Unit Test",
  instructions: "",
  passingScore: "1",
  questions: [emptyQuestion()],
  randomizeQuestions: false,
  scheduledAt: undefined,
  showResults: true,
  status: "DRAFT",
  subject: "",
  title: "",
  totalPoints: "1",
};

const Page = () => {
  const params = useParams<{ examinationId: string }>();
  const router = useRouter();
  const { toast } = useToast();
  const examinationId = params.examinationId;
  const isCreate = examinationId === "new";
  const [step, setStep] = useState<Step>(0);
  const [form, setForm] = useState<FormState>(defaultForm);
  const { data: currentUser } = useCurrentUserQuery();
  const coursesQuery = useSeminaryCoursesQuery({ limit: 100, page: 1 });
  const examinationQuery = useSeminaryExaminationQuery(examinationId, {
    enabled: !isCreate,
  });
  const createMutation = useCreateSeminaryExaminationMutation();
  const updateMutation = useUpdateSeminaryExaminationMutation();
  const currentName = currentUser?.name ?? "";

  const subjectOptions = useMemo(() => {
    const isInstructor = currentUser?.role === "INSTRUCTOR";

    return Array.from(
      new Set(
        (coursesQuery.data?.data ?? [])
          .flatMap((course) => course.subjects ?? [])
          .filter(
            (subject) =>
              !isInstructor ||
              subject.professor.toLowerCase() === currentName.toLowerCase(),
          )
          .map((subject) => subject.subjectName)
          .filter(Boolean),
      ),
    ).sort((first, second) => first.localeCompare(second));
  }, [coursesQuery.data?.data, currentName, currentUser?.role]);

  const questionTotal = useMemo(
    () =>
      form.questions.reduce((total, question) => {
        const points = Number(question.points);
        return total + (Number.isFinite(points) ? points : 0);
      }, 0),
    [form.questions],
  );

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    if (isCreate) {
      setForm((current) => ({
        ...current,
        subject: current.subject || subjectOptions[0] || "",
      }));
      return;
    }

    const examination = examinationQuery.data?.data;
    if (!examination) return;

    setForm({
      coverage: examination.coverage,
      durationMinutes: examination.durationMinutes,
      examType: examination.examType,
      instructions: examination.instructions ?? "",
      passingScore: examination.passingScore,
      questions:
        examination.questions.length > 0
          ? examination.questions.map((question) => ({
              ...question,
              points: String(question.points),
              options:
                question.type === "MULTIPLE_CHOICE"
                  ? question.options?.length
                    ? question.options
                    : ["", "", "", ""]
                  : question.options,
            }))
          : [emptyQuestion()],
      randomizeQuestions: examination.randomizeQuestions,
      scheduledAt: new Date(examination.scheduledAt),
      showResults: examination.showResults,
      status: examination.status,
      subject: examination.subject,
      title: examination.title,
      totalPoints: examination.totalPoints,
    });
  }, [examinationQuery.data?.data, isCreate, subjectOptions]);
  /* eslint-enable react-hooks/set-state-in-effect */

  const updateField = <K extends keyof FormState>(
    field: K,
    value: FormState[K],
  ) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const updateQuestion = (
    index: number,
    patch: Partial<SeminaryExaminationQuestion>,
  ) => {
    setForm((current) => ({
      ...current,
      questions: current.questions.map((question, questionIndex) =>
        questionIndex === index ? { ...question, ...patch } : question,
      ),
    }));
  };

  const updateOption = (
    questionIndex: number,
    optionIndex: number,
    value: string,
  ) => {
    setForm((current) => ({
      ...current,
      questions: current.questions.map((question, index) => {
        if (index !== questionIndex) return question;

        const options = [...(question.options ?? [])];
        options[optionIndex] = value;
        return { ...question, options };
      }),
    }));
  };

  const addQuestion = () => {
    setForm((current) => ({
      ...current,
      questions: [...current.questions, emptyQuestion()],
    }));
  };

  const removeQuestion = (index: number) => {
    setForm((current) => ({
      ...current,
      questions:
        current.questions.length === 1
          ? current.questions
          : current.questions.filter((_, questionIndex) => questionIndex !== index),
    }));
  };

  const validateStep = () => {
    if (step === 0) {
      return Boolean(
        form.title.trim() &&
          form.coverage.trim() &&
          form.subject &&
          form.examType &&
          form.scheduledAt &&
          Number(form.durationMinutes) > 0 &&
          Number(form.totalPoints) > 0 &&
          Number(form.passingScore) > 0,
      );
    }

    return form.questions.every((question) => {
      const baseValid = question.prompt.trim() && Number(question.points) > 0;
      if (question.type === "MULTIPLE_CHOICE") {
        return (
          baseValid &&
          (question.options ?? []).filter((option) => option.trim()).length >= 2 &&
          Boolean(question.answer?.trim())
        );
      }

      if (question.type === "TRUE_FALSE") {
        return baseValid && Boolean(question.answer);
      }

      return Boolean(baseValid);
    });
  };

  const toPayload = (): SeminaryExaminationPayload => ({
    coverage: form.coverage,
    durationMinutes: form.durationMinutes,
    examType: form.examType,
    instructions: form.instructions || undefined,
    passingScore: form.passingScore,
    questions: form.questions.map((question) => ({
      ...question,
      options:
        question.type === "MULTIPLE_CHOICE"
          ? (question.options ?? []).filter((option) => option.trim())
          : question.type === "TRUE_FALSE"
            ? ["True", "False"]
            : undefined,
      points: Number(question.points),
    })),
    randomizeQuestions: form.randomizeQuestions,
    scheduledAt: (form.scheduledAt ?? new Date()).toISOString(),
    showResults: form.showResults,
    status: form.status,
    subject: form.subject,
    title: form.title,
    totalPoints: form.totalPoints,
  });

  const handleSubmit = async () => {
    if (!validateStep()) {
      toast({
        title: "Incomplete examination",
        description: "Complete required fields before saving.",
        variant: "error",
      });
      return;
    }

    try {
      const payload = toPayload();

      if (isCreate) {
        const response = await createMutation.mutateAsync(payload);
        toast({
          title: "Examination created",
          description: `${response.data.title} was saved.`,
          variant: "success",
        });
        router.push("/portal/lms/examinations");
      } else {
        await updateMutation.mutateAsync({ id: examinationId, payload });
        toast({
          title: "Examination updated",
          description: `${form.title} was saved.`,
          variant: "success",
        });
        router.push("/portal/lms/examinations");
      }
      router.refresh();
    } catch (error) {
      const apiError = toApiError(error);
      toast({
        title: isCreate ? "Create failed" : "Update failed",
        description: apiError.message ?? "Unable to save examination.",
        variant: "error",
      });
    }
  };

  const saving = createMutation.isPending || updateMutation.isPending;

  return (
    <section className="space-y-6 p-10">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
        <div className="space-y-2">
          <Button asChild variant="ghost" className="-ml-3">
            <Link href="/portal/lms/examinations">
              <ArrowLeft className="size-4" />
              Back to examinations
            </Link>
          </Button>
          <h1 className="text-3xl font-semibold tracking-tight text-blue-950 dark:text-blue-100">
            {isCreate ? "Create Examination" : "Update Examination"}
          </h1>
          <p className="text-sm text-muted-foreground">
            Configure examination details, then add questions and answers.
          </p>
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
              <BreadcrumbLink asChild>
                <Link href="/portal/lms/examinations">Examinations</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{isCreate ? "Create" : "Edit"}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <Card className="border-border/70 shadow-sm">
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between gap-3 text-sm">
              <span className={step === 0 ? "font-medium" : "text-muted-foreground"}>
                1. Configuration
              </span>
              <span className={step === 1 ? "font-medium" : "text-muted-foreground"}>
                2. Questions and Answers
              </span>
            </div>
            <Progress value={step === 0 ? 50 : 100} />
          </div>

          {step === 0 ? (
            <div className="grid gap-5 lg:grid-cols-2">
              <Field>
                <FieldLabel>Examination Title</FieldLabel>
                <Input
                  value={form.title}
                  onChange={(event) => updateField("title", event.target.value)}
                  placeholder="Enter examination title"
                />
              </Field>
              <Field>
                <FieldLabel>Subject</FieldLabel>
                <Select
                  value={form.subject}
                  onValueChange={(value) => updateField("subject", value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select subject" />
                  </SelectTrigger>
                  <SelectContent>
                    {subjectOptions.map((subject) => (
                      <SelectItem key={subject} value={subject}>
                        {subject}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
              <Field>
                <FieldLabel>Coverage</FieldLabel>
                <Input
                  value={form.coverage}
                  onChange={(event) =>
                    updateField("coverage", event.target.value)
                  }
                  placeholder="Coverage or chapters"
                />
              </Field>
              <Field>
                <FieldLabel>Exam Type</FieldLabel>
                <Select
                  value={form.examType}
                  onValueChange={(value) => updateField("examType", value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select exam type" />
                  </SelectTrigger>
                  <SelectContent>
                    {examTypeOptions.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
              <Field>
                <FieldLabel>Schedule</FieldLabel>
                <DateTimePicker
                  value={form.scheduledAt}
                  onChange={(value) => updateField("scheduledAt", value)}
                  placeholder="Select date and time"
                />
              </Field>
              <Field>
                <FieldLabel>Duration Minutes</FieldLabel>
                <Input
                  type="number"
                  min={1}
                  value={form.durationMinutes}
                  onChange={(event) =>
                    updateField("durationMinutes", event.target.value)
                  }
                />
              </Field>
              <Field>
                <FieldLabel>Total Points</FieldLabel>
                <div className="flex gap-2">
                  <Input
                    type="number"
                    min={1}
                    value={form.totalPoints}
                    onChange={(event) =>
                      updateField("totalPoints", event.target.value)
                    }
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => updateField("totalPoints", String(questionTotal))}
                  >
                    Use {questionTotal}
                  </Button>
                </div>
              </Field>
              <Field>
                <FieldLabel>Passing Score</FieldLabel>
                <Input
                  type="number"
                  min={1}
                  value={form.passingScore}
                  onChange={(event) =>
                    updateField("passingScore", event.target.value)
                  }
                />
              </Field>
              <Field>
                <FieldLabel>Status</FieldLabel>
                <Select
                  value={form.status}
                  onValueChange={(value) =>
                    updateField("status", value as SeminaryExaminationStatus)
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.map((status) => (
                      <SelectItem key={status.value} value={status.value}>
                        {status.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
              <div className="grid gap-4 sm:grid-cols-2">
                <ToggleRow
                  checked={form.randomizeQuestions}
                  label="Randomize questions"
                  onChange={(checked) =>
                    updateField("randomizeQuestions", checked)
                  }
                />
                <ToggleRow
                  checked={form.showResults}
                  label="Show results"
                  onChange={(checked) => updateField("showResults", checked)}
                />
              </div>
              <Field className="lg:col-span-2">
                <FieldLabel>Instructions</FieldLabel>
                <Textarea
                  value={form.instructions}
                  onChange={(event) =>
                    updateField("instructions", event.target.value)
                  }
                  placeholder="Exam instructions for students"
                  className="min-h-28"
                />
              </Field>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="font-medium">Questions and Answers</p>
                  <p className="text-sm text-muted-foreground">
                    {form.questions.length} questions, {questionTotal} points.
                  </p>
                </div>
                <Button type="button" onClick={addQuestion}>
                  <Plus className="size-4" />
                  Add Question
                </Button>
              </div>

              {form.questions.map((question, index) => (
                <Card key={question.id} className="border-border/70 shadow-sm">
                  <CardContent className="space-y-4">
                    <div className="flex items-start justify-between gap-3">
                      <p className="font-medium">Question {index + 1}</p>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => removeQuestion(index)}
                        disabled={form.questions.length === 1}
                      >
                        <Trash2 className="size-4 text-destructive" />
                      </Button>
                    </div>

                    <div className="grid gap-4 md:grid-cols-[1fr_8rem]">
                      <Field>
                        <FieldLabel>Question Type</FieldLabel>
                        <Select
                          value={question.type}
                          onValueChange={(value) => {
                            const type = value as SeminaryExaminationQuestionType;
                            updateQuestion(index, {
                              answer: "",
                              options:
                                type === "MULTIPLE_CHOICE"
                                  ? ["", "", "", ""]
                                  : type === "TRUE_FALSE"
                                    ? ["True", "False"]
                                    : undefined,
                              type,
                            });
                          }}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select question type" />
                          </SelectTrigger>
                          <SelectContent>
                            {questionTypeOptions.map((type) => (
                              <SelectItem key={type.value} value={type.value}>
                                {type.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </Field>
                      <Field>
                        <FieldLabel>Points</FieldLabel>
                        <Input
                          type="number"
                          min={1}
                          value={question.points}
                          onChange={(event) =>
                            updateQuestion(index, {
                              points: event.target.value,
                            })
                          }
                        />
                      </Field>
                    </div>

                    <Field>
                      <FieldLabel>Question Prompt</FieldLabel>
                      <Textarea
                        value={question.prompt}
                        onChange={(event) =>
                          updateQuestion(index, { prompt: event.target.value })
                        }
                        placeholder="Enter question prompt"
                        className="min-h-24"
                      />
                    </Field>

                    {question.type === "MULTIPLE_CHOICE" ? (
                      <div className="grid gap-3 md:grid-cols-2">
                        {(question.options ?? ["", "", "", ""]).map(
                          (option, optionIndex) => (
                            <Field key={optionIndex}>
                              <FieldLabel>Option {optionIndex + 1}</FieldLabel>
                              <Input
                                value={option}
                                onChange={(event) =>
                                  updateOption(index, optionIndex, event.target.value)
                                }
                                placeholder={`Option ${optionIndex + 1}`}
                              />
                            </Field>
                          ),
                        )}
                        <Field className="md:col-span-2">
                          <FieldLabel>Correct Answer</FieldLabel>
                          <Input
                            value={question.answer ?? ""}
                            onChange={(event) =>
                              updateQuestion(index, {
                                answer: event.target.value,
                              })
                            }
                            placeholder="Type exact correct option"
                          />
                        </Field>
                      </div>
                    ) : null}

                    {question.type === "TRUE_FALSE" ? (
                      <Field>
                        <FieldLabel>Correct Answer</FieldLabel>
                        <Select
                          value={question.answer ?? ""}
                          onValueChange={(value) =>
                            updateQuestion(index, { answer: value })
                          }
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select correct answer" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="True">True</SelectItem>
                            <SelectItem value="False">False</SelectItem>
                          </SelectContent>
                        </Select>
                      </Field>
                    ) : null}

                    {question.type === "SHORT_ANSWER" ? (
                      <Field>
                        <FieldLabel>Answer Key</FieldLabel>
                        <Input
                          value={question.answer ?? ""}
                          onChange={(event) =>
                            updateQuestion(index, { answer: event.target.value })
                          }
                          placeholder="Expected short answer"
                        />
                      </Field>
                    ) : null}

                    {question.type === "ESSAY" ? (
                      <Field>
                        <FieldLabel>Rubric / Expected Answer</FieldLabel>
                        <Textarea
                          value={question.answer ?? ""}
                          onChange={(event) =>
                            updateQuestion(index, { answer: event.target.value })
                          }
                          placeholder="Optional rubric or expected answer"
                          className="min-h-20"
                        />
                      </Field>
                    ) : null}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          <div className="flex flex-col-reverse gap-3 border-t pt-5 sm:flex-row sm:justify-between">
            <Button
              type="button"
              variant="outline"
              disabled={step === 0}
              onClick={() => setStep(0)}
            >
              <ChevronLeft className="size-4" />
              Configuration
            </Button>
            <div className="flex gap-2">
              {step === 0 ? (
                <Button
                  type="button"
                  onClick={() => {
                    if (!validateStep()) {
                      toast({
                        title: "Incomplete configuration",
                        description: "Complete required fields before continuing.",
                        variant: "error",
                      });
                      return;
                    }
                    setStep(1);
                  }}
                >
                  Questions
                  <ChevronRight className="size-4" />
                </Button>
              ) : (
                <Button type="button" onClick={handleSubmit} disabled={saving}>
                  {saving ? (
                    "Saving..."
                  ) : (
                    <>
                      {isCreate ? <Check className="size-4" /> : <Save className="size-4" />}
                      {isCreate ? "Create Examination" : "Save Changes"}
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
};

export default Page;

const ToggleRow = ({
  checked,
  label,
  onChange,
}: {
  checked: boolean;
  label: string;
  onChange: (checked: boolean) => void;
}) => (
  <div className="flex items-center justify-between rounded-md border px-4 py-3">
    <span className="text-sm font-medium">{label}</span>
    <Switch checked={checked} onCheckedChange={(value) => onChange(Boolean(value))} />
  </div>
);
