"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  BadgeCheck,
  BookCheck,
  CheckCircle2,
  Filter,
  Settings2,
  ShieldCheck,
} from "lucide-react";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Card, CardContent } from "@/components/ui/card";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  toApiError,
  useSeminaryGradeConfigurationQuery,
  useUpdateSeminaryGradeConfigurationMutation,
} from "@/features/seminary/seminary.hooks";
import type {
  SeminaryGradeConfiguration,
  SeminaryGradeConfigurationPayload,
} from "@/features/seminary/seminary.types";
import { useToast } from "@/hooks/use-toast";

import { StatCard } from "../../academics/classes/_components/stat-card";
import {
  defaultCriteriaWeights,
  defaultGradeScale,
  gradingWeightProfiles,
  releaseWindows,
} from "./_components/config-data";
import { GradingScaleCard } from "./_components/grading-scale-card";

type GradeConfigurationForm = Omit<
  SeminaryGradeConfigurationPayload,
  "completionWindowDays"
> & {
  completionWindowDays: string;
};

const defaultConfiguration: GradeConfigurationForm = {
  passingEquivalent: "2.50",
  releaseWindow: "After dean confirmation",
  weightProfile: "Standard Coursework",
  completionWindowDays: "30",
  approvalWorkflow: true,
  allowFacultyOverride: true,
  autoPublishApproved: false,
  showConditionalRemark: true,
  gradeScale: defaultGradeScale,
  criteriaWeights: defaultCriteriaWeights,
};

const toFormState = (
  configuration: SeminaryGradeConfiguration,
): GradeConfigurationForm => ({
  passingEquivalent: configuration.passingEquivalent,
  releaseWindow: configuration.releaseWindow,
  weightProfile: configuration.weightProfile,
  completionWindowDays: String(configuration.completionWindowDays),
  approvalWorkflow: configuration.approvalWorkflow,
  allowFacultyOverride: configuration.allowFacultyOverride,
  autoPublishApproved: configuration.autoPublishApproved,
  showConditionalRemark: configuration.showConditionalRemark,
  gradeScale: configuration.gradeScale,
  criteriaWeights: configuration.criteriaWeights ?? defaultCriteriaWeights,
});

const toPayload = (
  configuration: GradeConfigurationForm,
): SeminaryGradeConfigurationPayload => ({
  passingEquivalent: configuration.passingEquivalent,
  releaseWindow: configuration.releaseWindow,
  weightProfile: configuration.weightProfile,
  completionWindowDays: Math.max(
    Number.parseInt(configuration.completionWindowDays || "1", 10),
    1,
  ),
  approvalWorkflow: configuration.approvalWorkflow,
  allowFacultyOverride: configuration.allowFacultyOverride,
  autoPublishApproved: configuration.autoPublishApproved,
  showConditionalRemark: configuration.showConditionalRemark,
  gradeScale: configuration.gradeScale,
  criteriaWeights: configuration.criteriaWeights,
});

const Page = () => {
  const [configuration, setConfiguration] =
    useState<GradeConfigurationForm>(defaultConfiguration);
  const [lastSavedAt, setLastSavedAt] = useState<string | null>(null);
  const hydratedRef = useRef(false);
  const lastSavedPayloadRef = useRef("");
  const { toast } = useToast();
  const configurationQuery = useSeminaryGradeConfigurationQuery();
  const updateConfigurationMutation =
    useUpdateSeminaryGradeConfigurationMutation();

  useEffect(() => {
    if (!configurationQuery.data?.data || hydratedRef.current) return;

    const nextConfiguration = toFormState(configurationQuery.data.data);
    const serializedPayload = JSON.stringify(toPayload(nextConfiguration));

    setConfiguration(nextConfiguration);
    lastSavedPayloadRef.current = serializedPayload;
    hydratedRef.current = true;
  }, [configurationQuery.data?.data]);

  useEffect(() => {
    if (!hydratedRef.current) return;

    const payload = toPayload(configuration);
    const serializedPayload = JSON.stringify(payload);
    const weights = payload.criteriaWeights;

    if (serializedPayload === lastSavedPayloadRef.current) return;
    if (
      weights &&
      weights.attendance + weights.coursework + weights.exam !== 100
    ) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      updateConfigurationMutation.mutate(payload, {
        onSuccess: () => {
          lastSavedPayloadRef.current = serializedPayload;
          setLastSavedAt(
            new Intl.DateTimeFormat("en", {
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
            }).format(new Date()),
          );
        },
        onError: (error) => {
          const apiError = toApiError(error);
          toast({
            title: "Auto-save failed",
            description: apiError.message ?? "Unable to save configuration.",
            variant: "error",
          });
        },
      });
    }, 600);

    return () => window.clearTimeout(timeoutId);
  }, [configuration, toast, updateConfigurationMutation]);

  const gradeScale = useMemo(
    () => configuration.gradeScale ?? defaultGradeScale,
    [configuration.gradeScale],
  );

  const updateField = <Key extends keyof GradeConfigurationForm>(
    key: Key,
    value: GradeConfigurationForm[Key],
  ) => {
    setConfiguration((current) => ({ ...current, [key]: value }));
  };

  const updateCriteriaWeight = (
    key: keyof typeof defaultCriteriaWeights,
    value: string,
  ) => {
    setConfiguration((current) => ({
      ...current,
      criteriaWeights: {
        ...(current.criteriaWeights ?? defaultCriteriaWeights),
        [key]: Math.max(Number.parseInt(value || "0", 10), 0),
      },
    }));
  };

  const completionWindowDays = configuration.completionWindowDays ?? "30";
  const passingEquivalent = configuration.passingEquivalent ?? "2.50";
  const releaseWindow =
    configuration.releaseWindow ?? "After dean confirmation";
  const weightProfile = configuration.weightProfile ?? "Standard Coursework";
  const criteriaWeights =
    configuration.criteriaWeights ?? defaultCriteriaWeights;
  const saveStatus = updateConfigurationMutation.isPending
    ? "Saving..."
    : lastSavedAt
      ? `Auto-saved ${lastSavedAt}`
      : "Auto-save enabled";

  return (
    <section className="space-y-6 p-10">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
        <div className="space-y-2">
          <h1 className="font-serif text-4xl text-emerald-950 dark:text-emerald-50">
            Grade Configuration
          </h1>
          <p className="text-sm leading-6 text-muted-foreground">
            Configure the seminary grading scale, release workflow, and academic
            policies in the same administrative style used across the platform.
          </p>
        </div>

        <div className="flex flex-col items-start gap-3 xl:items-end">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="/admin/dashboard">Dashboard</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Configuration</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-950/10 bg-emerald-950/3 px-3 py-1 text-xs text-muted-foreground dark:border-emerald-100/10">
            <CheckCircle2 className="size-3.5 text-emerald-700" />
            {saveStatus}
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Passing Equivalent"
          value={passingEquivalent}
          description="Current institutional threshold"
          icon={<BadgeCheck className="size-6" />}
          accentClassName="bg-emerald-500/10 text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-300"
        />
        <StatCard
          title="Release Window"
          value="Dean"
          description={releaseWindow}
          icon={<ShieldCheck className="size-6" />}
          accentClassName="bg-teal-500/10 text-teal-700 dark:bg-teal-400/10 dark:text-teal-300"
        />
        <StatCard
          title="Weight Profile"
          value="Standard"
          description={weightProfile}
          icon={<BookCheck className="size-6" />}
          accentClassName="bg-amber-500/10 text-amber-700 dark:bg-amber-400/10 dark:text-amber-300"
        />
        <StatCard
          title="Completion Window"
          value={`${completionWindowDays} days`}
          description="For incomplete marks"
          icon={<Settings2 className="size-6" />}
          accentClassName="bg-violet-500/10 text-violet-700 dark:bg-violet-400/10 dark:text-violet-300"
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_1fr]">
        <GradingScaleCard rows={gradeScale} />

        <Card className="overflow-hidden gap-0! pt-0! border-emerald-950/10 shadow-sm dark:border-emerald-100/10">
          <div className="border-b border-emerald-950/10 bg-linear-to-r from-emerald-950 to-emerald-900 px-6 py-5 dark:border-emerald-100/10">
            <div className="inline-flex items-center gap-2 text-xs uppercase text-emerald-100/70">
              <Filter className="size-3.5" />
              Academic Rules
            </div>
            <h2 className="mt-2 text-2xl font-semibold text-white">
              Configuration Controls
            </h2>
            <p className="mt-1 text-sm text-emerald-50/80">
              Manage release timing, completion deadlines, and faculty permissions.
            </p>
          </div>

          <CardContent className="space-y-6 p-6">
            <div className="grid gap-4 md:grid-cols-2">
              <Field>
                <FieldLabel>Passing Equivalent</FieldLabel>
                <Select
                  value={passingEquivalent}
                  onValueChange={(value) =>
                    updateField("passingEquivalent", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select passing equivalent" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2.25">2.25</SelectItem>
                    <SelectItem value="2.50">2.50</SelectItem>
                    <SelectItem value="2.75">2.75</SelectItem>
                    <SelectItem value="3.00">3.00</SelectItem>
                  </SelectContent>
                </Select>
              </Field>

              <Field>
                <FieldLabel>Release Window</FieldLabel>
                <Select
                  value={releaseWindow}
                  onValueChange={(value) => updateField("releaseWindow", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select release window" />
                  </SelectTrigger>
                  <SelectContent>
                    {releaseWindows.map((window) => (
                      <SelectItem key={window} value={window}>
                        {window}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <Field>
                <FieldLabel>Weight Profile</FieldLabel>
                <Select
                  value={weightProfile}
                  onValueChange={(value) => updateField("weightProfile", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select weight profile" />
                  </SelectTrigger>
                  <SelectContent>
                    {gradingWeightProfiles.map((profile) => (
                      <SelectItem key={profile} value={profile}>
                        {profile}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>

              <Field>
                <FieldLabel>Completion Window in Days</FieldLabel>
                <Input
                  type="number"
                  min={1}
                  value={completionWindowDays}
                  onChange={(event) =>
                    updateField("completionWindowDays", event.target.value)
                  }
                />
              </Field>
            </div>

            <div className="space-y-4 rounded-2xl border border-emerald-950/10 bg-emerald-950/3 p-5 dark:border-emerald-100/10 dark:bg-emerald-100/4">
              <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h3 className="font-semibold text-emerald-950 dark:text-emerald-50">
                    Criteria Weights
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    These percentages compute grade equivalents in grade records.
                  </p>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <Field>
                  <FieldLabel>Attendance %</FieldLabel>
                  <Input
                    type="number"
                    min={0}
                    max={100}
                    value={criteriaWeights.attendance}
                    onChange={(event) =>
                      updateCriteriaWeight("attendance", event.target.value)
                    }
                  />
                </Field>
                <Field>
                  <FieldLabel>Coursework %</FieldLabel>
                  <Input
                    type="number"
                    min={0}
                    max={100}
                    value={criteriaWeights.coursework}
                    onChange={(event) =>
                      updateCriteriaWeight("coursework", event.target.value)
                    }
                  />
                </Field>
                <Field>
                  <FieldLabel>Exam %</FieldLabel>
                  <Input
                    type="number"
                    min={0}
                    max={100}
                    value={criteriaWeights.exam}
                    onChange={(event) =>
                      updateCriteriaWeight("exam", event.target.value)
                    }
                  />
                </Field>
              </div>
            </div>

            <div className="space-y-4 rounded-2xl border border-emerald-950/10 bg-emerald-950/3 p-5 dark:border-emerald-100/10 dark:bg-emerald-100/4">
              <div className="space-y-1">
                <h3 className="font-semibold text-emerald-950 dark:text-emerald-50">
                  Workflow Toggles
                </h3>
                <p className="text-sm text-muted-foreground">
                  Enable or disable core registrar controls for grade publication.
                </p>
              </div>

              <div className="space-y-4">
                <Field orientation="horizontal" className="items-center justify-between">
                  <div>
                    <FieldLabel>Approval Workflow</FieldLabel>
                    <FieldDescription>
                      Require dean review before grades can be released.
                    </FieldDescription>
                  </div>
                  <Switch
                    checked={configuration.approvalWorkflow ?? true}
                    onCheckedChange={(value) =>
                      updateField("approvalWorkflow", value)
                    }
                  />
                </Field>

                <Field orientation="horizontal" className="items-center justify-between">
                  <div>
                    <FieldLabel>Allow Faculty Override</FieldLabel>
                    <FieldDescription>
                      Permit authorized faculty to revise submitted grades.
                    </FieldDescription>
                  </div>
                  <Switch
                    checked={configuration.allowFacultyOverride ?? true}
                    onCheckedChange={(value) =>
                      updateField("allowFacultyOverride", value)
                    }
                  />
                </Field>

                <Field orientation="horizontal" className="items-center justify-between">
                  <div>
                    <FieldLabel>Auto Publish Approved Grades</FieldLabel>
                    <FieldDescription>
                      Automatically release grades once approval is completed.
                    </FieldDescription>
                  </div>
                  <Switch
                    checked={configuration.autoPublishApproved ?? false}
                    onCheckedChange={(value) =>
                      updateField("autoPublishApproved", value)
                    }
                  />
                </Field>

                <Field orientation="horizontal" className="items-center justify-between">
                  <div>
                    <FieldLabel>Show Conditional Remark</FieldLabel>
                    <FieldDescription>
                      Include the conditional remark for borderline passing outcomes.
                    </FieldDescription>
                  </div>
                  <Switch
                    checked={configuration.showConditionalRemark ?? true}
                    onCheckedChange={(value) =>
                      updateField("showConditionalRemark", value)
                    }
                  />
                </Field>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default Page;
