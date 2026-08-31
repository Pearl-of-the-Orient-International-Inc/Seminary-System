"use client";

import { useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { ChangeEvent, DragEvent, ReactNode } from "react";
import { AlertCircle, CloudUpload, Save } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  useCreateSeminaryInstructorMutation,
  useSeminaryInstructorQuery,
  toApiError,
  useUpdateSeminaryInstructorMutation,
} from "@/features/seminary/seminary.hooks";
import { useToast } from "@/hooks/use-toast";

import {
  createInstructorEvaluation,
  instructorProgramOptions,
  instructorStatusOptions,
  type InstructorProgram,
  type InstructorRank,
  type InstructorStatus,
} from "../../_components/instructor-data";

const rankOptions: InstructorRank[] = [
  "Adjunct Instructor",
  "Lecturer",
  "Assistant Professor",
  "Associate Professor",
  "Professor",
];

const defaultFormValues = {
  areasOfExpertise: "",
  attendanceParticipation: 85,
  biography: "",
  contactNumber: "",
  credentials: "",
  educationalBackground: "",
  email: "",
  formalPhotoUrl: "",
  highSchoolGraduateOrEquivalent: true,
  isFilipinoCitizen: true,
  knowledgeSkillsAssessment: 85,
  leadershipCharacter: 85,
  loadUnits: 0,
  ministerialExperienceYears: 5,
  ministryCommunityEngagement: 85,
  name: "",
  professionalConductEthics: 85,
  professionalTitle: "",
  rank: "Lecturer" as InstructorRank,
  status: "Active" as InstructorStatus,
  teachingPrograms: ["Certificate"] as InstructorProgram[],
};

type FormValues = typeof defaultFormValues;

type InstructorFormProps = {
  instructorId?: string;
};

const splitList = (value: string) =>
  value
    .split(/\n|,/)
    .map((item) => item.trim())
    .filter(Boolean);

const Field = ({
  children,
  label,
}: {
  children: ReactNode;
  label: string;
}) => (
  <div className="space-y-2">
    <Label>{label}</Label>
    {children}
  </div>
);

const NumberField = ({
  label,
  max = 100,
  min = 0,
  onChange,
  value,
}: {
  label: string;
  max?: number;
  min?: number;
  onChange: (value: number) => void;
  value: number;
}) => (
  <Field label={label}>
    <Input
      type="number"
      min={min}
      max={max}
      value={value}
      onChange={(event) => onChange(Number(event.target.value))}
    />
  </Field>
);

export const InstructorForm = ({ instructorId }: InstructorFormProps) => {
  const router = useRouter();
  const photoInputRef = useRef<HTMLInputElement>(null);
  const [draftValues, setDraftValues] = useState<FormValues | null>(null);
  const [error, setError] = useState("");
  const { toast } = useToast();
  const isEditMode = Boolean(instructorId);
  const instructorQuery = useSeminaryInstructorQuery(instructorId ?? "", {
    enabled: isEditMode,
  });
  const createInstructorMutation = useCreateSeminaryInstructorMutation();
  const updateInstructorMutation = useUpdateSeminaryInstructorMutation();
  const isSaving =
    createInstructorMutation.isPending || updateInstructorMutation.isPending;

  const loadedValues = useMemo<FormValues | null>(() => {
    const instructor = instructorQuery.data?.data;

    if (!instructor) {
      return null;
    }

    return {
      areasOfExpertise: instructor.areasOfExpertise.join("\n"),
      attendanceParticipation:
        instructor.evaluation.attendanceParticipation,
      biography: instructor.biography,
      contactNumber: instructor.contactNumber,
      credentials: instructor.credentials.join("\n"),
      educationalBackground: instructor.educationalBackground,
      email: instructor.email,
      formalPhotoUrl: instructor.formalPhotoUrl,
      highSchoolGraduateOrEquivalent:
        instructor.highSchoolGraduateOrEquivalent,
      isFilipinoCitizen: instructor.isFilipinoCitizen,
      knowledgeSkillsAssessment:
        instructor.evaluation.knowledgeSkillsAssessment,
      leadershipCharacter: instructor.evaluation.leadershipCharacter,
      loadUnits: instructor.loadUnits,
      ministerialExperienceYears: instructor.ministerialExperienceYears,
      ministryCommunityEngagement:
        instructor.evaluation.ministryCommunityEngagement,
      name: instructor.name,
      professionalConductEthics:
        instructor.evaluation.professionalConductEthics,
      professionalTitle: instructor.professionalTitle,
      rank: instructor.rankLabel as InstructorRank,
      status: instructor.statusLabel as InstructorStatus,
      teachingPrograms: instructor.teachingProgramLabels as InstructorProgram[],
    };
  }, [instructorQuery.data]);

  const values = draftValues ?? loadedValues ?? defaultFormValues;

  const evaluation = useMemo(
    () =>
      createInstructorEvaluation({
        attendanceParticipation: values.attendanceParticipation,
        knowledgeSkillsAssessment: values.knowledgeSkillsAssessment,
        leadershipCharacter: values.leadershipCharacter,
        ministryCommunityEngagement: values.ministryCommunityEngagement,
        professionalConductEthics: values.professionalConductEthics,
      }),
    [
      values.attendanceParticipation,
      values.knowledgeSkillsAssessment,
      values.leadershipCharacter,
      values.ministryCommunityEngagement,
      values.professionalConductEthics,
    ],
  );

  const setValue = <TKey extends keyof FormValues>(
    key: TKey,
    value: FormValues[TKey],
  ) => {
    setDraftValues((current) => ({ ...(current ?? values), [key]: value }));
  };

  const toggleTeachingProgram = (
    program: InstructorProgram,
    checked: boolean,
  ) => {
    setValue(
      "teachingPrograms",
      checked
        ? Array.from(new Set([...values.teachingPrograms, program]))
        : values.teachingPrograms.filter((current) => current !== program),
    );
  };

  const processPhotoFile = (file?: File) => {
    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      setError("Upload a valid image file for the formal photograph.");
      if (photoInputRef.current) {
        photoInputRef.current.value = "";
      }
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setValue("formalPhotoUrl", reader.result);
        setError("");
      }
    };
    reader.readAsDataURL(file);
  };

  const handlePhotoUpload = (event: ChangeEvent<HTMLInputElement>) => {
    processPhotoFile(event.target.files?.[0]);
  };

  const handlePhotoDrop = (event: DragEvent<HTMLButtonElement>) => {
    event.preventDefault();
    processPhotoFile(event.dataTransfer.files[0]);
  };

  const handleSubmit = async () => {
    const requiredTextFields: Array<keyof FormValues> = [
      "areasOfExpertise",
      "biography",
      "contactNumber",
      "credentials",
      "educationalBackground",
      "email",
      "formalPhotoUrl",
      "name",
      "professionalTitle",
    ];
    const missingField = requiredTextFields.find((key) => {
      const value = values[key];
      return typeof value === "string" && !value.trim();
    });

    if (missingField) {
      setError("Complete all profile, photograph, and credential fields.");
      return;
    }

    if (!values.teachingPrograms.length) {
      setError("Select at least one teaching program.");
      return;
    }

    if (values.ministerialExperienceYears < 5) {
      setError("Instructor must have at least five years of ministerial experience.");
      return;
    }

    if (!values.isFilipinoCitizen || !values.highSchoolGraduateOrEquivalent) {
      setError("Instructor must meet basic citizenship and education qualifications.");
      return;
    }

    const payload = {
      areasOfExpertise: splitList(values.areasOfExpertise),
      biography: values.biography.trim(),
      contactNumber: values.contactNumber.trim(),
      credentials: splitList(values.credentials),
      educationalBackground: values.educationalBackground.trim(),
      email: values.email.trim(),
      evaluation: {
        attendanceParticipation: values.attendanceParticipation,
        knowledgeSkillsAssessment: values.knowledgeSkillsAssessment,
        leadershipCharacter: values.leadershipCharacter,
        ministryCommunityEngagement: values.ministryCommunityEngagement,
        professionalConductEthics: values.professionalConductEthics,
      },
      formalPhotoUrl: values.formalPhotoUrl.trim(),
      highSchoolGraduateOrEquivalent: values.highSchoolGraduateOrEquivalent,
      isFilipinoCitizen: values.isFilipinoCitizen,
      loadUnits: values.loadUnits,
      ministerialExperienceYears: values.ministerialExperienceYears,
      name: values.name.trim(),
      professionalTitle: values.professionalTitle.trim(),
      rank: values.rank,
      status: values.status,
      submissionDeadline: "2026-08-01",
      teachingPrograms: values.teachingPrograms,
    };

    try {
      if (instructorId) {
        await updateInstructorMutation.mutateAsync({
          id: instructorId,
          payload,
        });
      } else {
        await createInstructorMutation.mutateAsync(payload);
      }

      toast({
        variant: "success",
        title: instructorId ? "Instructor updated" : "Instructor created",
        description: `${values.name.trim()} was saved to the faculty registry.`,
      });
      router.push("/admin/users/instructors");
    } catch (error) {
      const apiError = toApiError(error);

      toast({
        title: "Save failed",
        description: apiError.message ?? "Unable to save instructor.",
        variant: "error",
      });
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[1.4fr_0.9fr]">
      <Card className="py-0! h-fit">
        <CardContent className="space-y-5 p-5">
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Full Name">
              <Input
                value={values.name}
                onChange={(event) => setValue("name", event.target.value)}
                placeholder="Dr. Juan Dela Cruz"
              />
            </Field>
            <Field label="Professional Credentials / Post-nominal Title">
              <Input
                value={values.professionalTitle}
                onChange={(event) =>
                  setValue("professionalTitle", event.target.value)
                }
                placeholder="MIT, MIEE, LPT"
              />
            </Field>
            <Field label="Email">
              <Input
                value={values.email}
                onChange={(event) => setValue("email", event.target.value)}
                placeholder="jdelacruz@gmail.com"
              />
            </Field>
            <Field label="Contact Number">
              <Input
                value={values.contactNumber}
                onChange={(event) => setValue("contactNumber", event.target.value)}
                placeholder="09171234567"
              />
            </Field>
            <Field label="Rank">
              <Select
                value={values.rank}
                onValueChange={(value) => setValue("rank", value as InstructorRank)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {rankOptions.map((rank) => (
                    <SelectItem key={rank} value={rank}>
                      {rank}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            <Field label="Status">
              <Select
                value={values.status}
                onValueChange={(value) =>
                  setValue("status", value as InstructorStatus)
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {instructorStatusOptions.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            <NumberField
              label="Teaching Load Units"
              max={30}
              value={values.loadUnits}
              onChange={(value) => setValue("loadUnits", value)}
            />
          </div>

          <Field label="Brief Biography / Professional Profile">
            <Textarea
              value={values.biography}
              onChange={(event) => setValue("biography", event.target.value)}
              className="min-h-28"
              placeholder="Write concise official profile for the Seminary Website."
            />
          </Field>
          <Field label="Educational Background">
            <Textarea
              value={values.educationalBackground}
              onChange={(event) =>
                setValue("educationalBackground", event.target.value)
              }
              className="min-h-24"
              placeholder="Degrees, schools, training background."
            />
          </Field>
          <Field label="Areas of Expertise">
            <Textarea
              value={values.areasOfExpertise}
              onChange={(event) => setValue("areasOfExpertise", event.target.value)}
              className="min-h-24"
              placeholder="Separate by comma or new line."
            />
          </Field>
          <Field label="Recent High-Quality Formal Photograph">
            <div className="space-y-3">
              <Input
                ref={photoInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handlePhotoUpload}
              />

              <Button
                type="button"
                variant="outline"
                className="flex min-h-60 w-full flex-col gap-2 rounded-2xl border-dashed bg-primary/5 py-12 text-center"
                onClick={() => photoInputRef.current?.click()}
                onDragOver={(event) => event.preventDefault()}
                onDrop={handlePhotoDrop}
              >
                {values.formalPhotoUrl ? (
                  <span
                    aria-label="Formal photograph preview"
                    className="mb-2 block h-32 w-28 rounded-lg border bg-cover bg-center"
                    role="img"
                    style={{ backgroundImage: `url(${values.formalPhotoUrl})` }}
                  />
                ) : (
                  <CloudUpload className="size-10 text-primary" strokeWidth={1.5} />
                )}
                Upload formal photograph
                <span className="text-xs font-normal text-muted-foreground">
                  Drag and drop your image here <br /> or click to browse
                </span>
              </Button>

              <div className="flex items-start gap-2 rounded-xl border border-dashed bg-blue-600/10 p-4 text-xs text-blue-600">
                <AlertCircle className="size-4 shrink-0" strokeWidth={1.5} />
                Use a recent high-quality formal photograph in JPG, PNG, or WebP
                format for faculty directory display.
              </div>
            </div>
          </Field>
          <Field label="Supporting Qualifications and Credentials">
            <Textarea
              value={values.credentials}
              onChange={(event) => setValue("credentials", event.target.value)}
              className="min-h-28"
              placeholder="Certificates, TESDA NC/COC, licenses, awards, community or ministry certificates."
            />
          </Field>
        </CardContent>
      </Card>

      <div className="space-y-5">
        <Card className="py-0!">
          <CardContent className="space-y-4 p-5">
            <h3 className="font-semibold">Basic Qualifications</h3>
            <label className="flex items-center gap-3 text-sm">
              <Checkbox
                checked={values.isFilipinoCitizen}
                onCheckedChange={(checked) =>
                  setValue("isFilipinoCitizen", checked === true)
                }
              />
              Filipino citizen
            </label>
            <label className="flex items-center gap-3 text-sm">
              <Checkbox
                checked={values.highSchoolGraduateOrEquivalent}
                onCheckedChange={(checked) =>
                  setValue("highSchoolGraduateOrEquivalent", checked === true)
                }
              />
              High School, ALS, or PEPT passer
            </label>
            <Field label="Teaching Programs">
              <div className="grid pt-1.5 gap-3">
                {instructorProgramOptions.map((program) => (
                  <label
                    key={program}
                    className="flex items-center gap-3 text-sm"
                  >
                    <Checkbox
                      checked={values.teachingPrograms.includes(program)}
                      onCheckedChange={(checked) =>
                        toggleTeachingProgram(program, checked === true)
                      }
                    />
                    {program}
                  </label>
                ))}
              </div>
            </Field>
            <NumberField
              label="Ministerial Experience Years"
              max={60}
              value={values.ministerialExperienceYears}
              onChange={(value) => setValue("ministerialExperienceYears", value)}
            />
          </CardContent>
        </Card>

        <Card className="py-0!">
          <CardContent className="space-y-3 p-5">
            <h3 className="font-semibold">Evaluation Criteria</h3>
            <NumberField
              label="Attendance and Participation (20%)"
              value={values.attendanceParticipation}
              onChange={(value) => setValue("attendanceParticipation", value)}
            />
            <NumberField
              label="Leadership and Character (20%)"
              value={values.leadershipCharacter}
              onChange={(value) => setValue("leadershipCharacter", value)}
            />
            <NumberField
              label="Ministry Service and Community Engagement (25%)"
              value={values.ministryCommunityEngagement}
              onChange={(value) => setValue("ministryCommunityEngagement", value)}
            />
            <NumberField
              label="Knowledge and Skills Assessment (20%)"
              value={values.knowledgeSkillsAssessment}
              onChange={(value) => setValue("knowledgeSkillsAssessment", value)}
            />
            <NumberField
              label="Professional Conduct and Ethics (15%)"
              value={values.professionalConductEthics}
              onChange={(value) => setValue("professionalConductEthics", value)}
            />
          </CardContent>
        </Card>

        <Card className="py-0!">
          <CardContent className="space-y-3 p-5">
            <h3 className="font-semibold">Ranking Result</h3>
            <div>
              <div className="text-muted-foreground">Overall Score</div>
              <div className="text-3xl font-semibold">{evaluation.totalScore}%</div>
            </div>
            <div>
              <div className="text-muted-foreground">Rating</div>
              <div className="font-medium">{evaluation.rating}</div>
            </div>
            <div>
              <div className="text-muted-foreground">Classification</div>
              <div className="font-medium">{evaluation.rankingClassification}</div>
            </div>
            <div>
              <div className="text-muted-foreground">Award</div>
              <div className="font-medium">{evaluation.award}</div>
            </div>
          </CardContent>
        </Card>

        {error ? <p className="text-sm text-destructive">{error}</p> : null}
        <div className="flex flex-col gap-2 sm:flex-row">
          <Button type="button" asChild variant="outline">
            <Link href="/admin/users/instructors">Cancel</Link>
          </Button>
          <Button type="button" disabled={isSaving} onClick={handleSubmit}>
            <Save className="size-4" />
            {isSaving
              ? "Saving..."
              : instructorId
                ? "Update Instructor"
                : "Create Instructor"}
          </Button>
        </div>
      </div>
    </div>
  );
};
