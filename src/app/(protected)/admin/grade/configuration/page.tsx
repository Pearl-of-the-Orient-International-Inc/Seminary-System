"use client";

import { useState } from "react";
import Link from "next/link";
import {
  BadgeCheck,
  BookCheck,
  Filter,
  Save,
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
import { Button } from "@/components/ui/button";
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

import { StatCard } from "../../academics/classes/_components/stat-card";
import {
  defaultGradeScale,
  gradingWeightProfiles,
  releaseWindows,
} from "./_components/config-data";
import { GradingScaleCard } from "./_components/grading-scale-card";

const Page = () => {
  const [passingEquivalent, setPassingEquivalent] = useState("2.50");
  const [releaseWindow, setReleaseWindow] = useState(
    "After dean confirmation",
  );
  const [weightProfile, setWeightProfile] = useState("Standard Coursework");
  const [completionWindowDays, setCompletionWindowDays] = useState("30");
  const [approvalWorkflow, setApprovalWorkflow] = useState(true);
  const [allowFacultyOverride, setAllowFacultyOverride] = useState(true);
  const [autoPublishApproved, setAutoPublishApproved] = useState(false);
  const [showConditionalRemark, setShowConditionalRemark] = useState(true);
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
                <BreadcrumbPage>Grades</BreadcrumbPage>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Configuration</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <Button size="sm">
            <Save className="size-4" />
            Save Configuration
          </Button>
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
        <GradingScaleCard rows={defaultGradeScale} />

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
                  onValueChange={setPassingEquivalent}
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
                <Select value={releaseWindow} onValueChange={setReleaseWindow}>
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
                <Select value={weightProfile} onValueChange={setWeightProfile}>
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
                  onChange={(event) => setCompletionWindowDays(event.target.value)}
                />
              </Field>
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
                    checked={approvalWorkflow}
                    onCheckedChange={setApprovalWorkflow}
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
                    checked={allowFacultyOverride}
                    onCheckedChange={setAllowFacultyOverride}
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
                    checked={autoPublishApproved}
                    onCheckedChange={setAutoPublishApproved}
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
                    checked={showConditionalRemark}
                    onCheckedChange={setShowConditionalRemark}
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
