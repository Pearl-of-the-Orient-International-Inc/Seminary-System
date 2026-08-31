"use client";

import {
  Award,
  BookOpenText,
  Camera,
  FileCheck2,
  GraduationCap,
  Mail,
  Phone,
  UserRound,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

import type { InstructorRecord } from "./instructor-data";

type InstructorDetailsDialogProps = {
  instructor: InstructorRecord | null;
  onOpenChange: (open: boolean) => void;
  open: boolean;
};

const sectionClassName =
  "border-b border-emerald-950/10 pb-5 last:border-b-0 dark:border-emerald-100/10";

const statClassName =
  "rounded-xl border border-emerald-950/10 bg-emerald-950/[0.03] p-4 dark:border-emerald-100/10 dark:bg-emerald-100/[0.04]";

const listItemClassName =
  "border-b border-emerald-950/10 py-3 last:border-b-0 dark:border-emerald-100/10";

const getInitials = (name: string) =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("");

export const InstructorDetailsDialog = ({
  instructor,
  onOpenChange,
  open,
}: InstructorDetailsDialogProps) => (
  <Sheet open={open} onOpenChange={onOpenChange}>
    <SheetContent
      side="right"
      className="w-full overflow-y-auto border-emerald-950/10 p-0 max-w-4xl! dark:border-emerald-100/10"
      showCloseButton={false}
    >
      {instructor ? (
        <>
          <SheetHeader className="border-b border-emerald-950/10 bg-emerald-950 px-6 py-6 text-left dark:border-emerald-100/10">
            <div className="grid gap-5 md:grid-cols-[160px_1fr] md:items-center">
              <div className="aspect-4/5 overflow-hidden rounded-xl border border-white/15 bg-white/10">
                {instructor.formalPhotoUrl ? (
                  <div
                    role="img"
                    aria-label={`${instructor.name} formal faculty photograph`}
                    className="size-full bg-cover bg-center"
                    style={{
                      backgroundImage: `url(${instructor.formalPhotoUrl})`,
                    }}
                  />
                ) : (
                  <div className="flex size-full items-center justify-center bg-emerald-900 text-5xl font-semibold text-emerald-50">
                    {getInitials(instructor.name)}
                  </div>
                )}
              </div>

              <div className="min-w-0">
                <div className="mb-3 flex flex-wrap items-center gap-2">
                  <Badge className="rounded-full bg-white/12 text-white hover:bg-white/12">
                    Faculty Directory
                  </Badge>
                  <Badge className="rounded-full bg-white/12 text-white hover:bg-white/12">
                    {instructor.status}
                  </Badge>
                </div>
                <SheetTitle className="font-serif text-3xl text-white md:text-4xl">
                  {instructor.name}
                </SheetTitle>
                <SheetDescription className="mt-2 text-sm text-emerald-50/85">
                  {instructor.facultyId} - {instructor.rank}
                </SheetDescription>
                <p className="mt-3 max-w-2xl text-sm leading-6 text-emerald-50/85">
                  {instructor.professionalTitle}
                </p>
                <div className="mt-5 grid gap-2 text-sm text-emerald-50/90 sm:grid-cols-2">
                  <div className="flex min-w-0 items-center gap-2 rounded-lg bg-white/10 px-3 py-2">
                    <Mail className="size-4 shrink-0" />
                    <span className="truncate">{instructor.email}</span>
                  </div>
                  <div className="flex items-center gap-2 rounded-lg bg-white/10 px-3 py-2">
                    <Phone className="size-4 shrink-0" />
                    <span>{instructor.contactNumber}</span>
                  </div>
                </div>
              </div>
            </div>
          </SheetHeader>

          <div className="space-y-5 px-6 py-6">
            <div className="grid gap-3 md:grid-cols-4">
              <div className={statClassName}>
                <div className="text-muted-foreground text-xs uppercase">
                  Score
                </div>
                <div className="mt-1 text-2xl font-semibold text-emerald-950 dark:text-emerald-50">
                  {instructor.evaluation.totalScore}%
                </div>
              </div>
              <div className={statClassName}>
                <div className="text-muted-foreground text-xs uppercase">
                  Load
                </div>
                <div className="mt-1 text-2xl font-semibold text-emerald-950 dark:text-emerald-50">
                  {instructor.loadUnits}
                  <span className="ml-1 text-sm font-medium text-muted-foreground">
                    units
                  </span>
                </div>
              </div>
              <div className={statClassName}>
                <div className="text-muted-foreground text-xs uppercase">
                  Experience
                </div>
                <div className="mt-1 text-2xl font-semibold text-emerald-950 dark:text-emerald-50">
                  {instructor.ministerialExperienceYears}
                  <span className="ml-1 text-sm font-medium text-muted-foreground">
                    years
                  </span>
                </div>
              </div>
              <div className={statClassName}>
                <div className="text-muted-foreground text-xs uppercase">
                  Award
                </div>
                <div className="mt-2 text-sm font-semibold text-emerald-950 dark:text-emerald-50">
                  {instructor.evaluation.award}
                </div>
              </div>
            </div>

            <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
              <aside className="space-y-5">
                <div className={sectionClassName}>
                  <div className="mb-2 flex items-center gap-2 font-medium text-emerald-950 dark:text-emerald-50">
                    <UserRound className="size-4" />
                    Faculty Profile
                  </div>
                  <div className="text-sm">
                    <div className={listItemClassName}>
                      <div className="text-muted-foreground">Rank</div>
                      <div className="font-medium">{instructor.rank}</div>
                    </div>
                    <div className={listItemClassName}>
                      <div className="text-muted-foreground">Programs</div>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {instructor.teachingPrograms.map((program) => (
                          <Badge
                            key={program}
                            variant="secondary"
                            className="rounded-full"
                          >
                            {program}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className={listItemClassName}>
                      <div className="text-muted-foreground">
                        Submission Deadline
                      </div>
                      <div className="font-medium">
                        {new Intl.DateTimeFormat("en", {
                          dateStyle: "medium",
                        }).format(new Date(instructor.submissionDeadline))}
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-6 py-3">
                      <div>
                        <div className="text-muted-foreground text-xs">
                          Filipino
                        </div>
                        <div className="font-medium">
                          {instructor.isFilipinoCitizen ? "Yes" : "No"}
                        </div>
                      </div>
                      <div>
                        <div className="text-muted-foreground text-xs">
                          HS / ALS
                        </div>
                        <div className="font-medium">
                          {instructor.highSchoolGraduateOrEquivalent
                            ? "Yes"
                            : "No"}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className={sectionClassName}>
                  <div className="mb-2 flex items-center gap-2 font-medium text-emerald-950 dark:text-emerald-50">
                    <BookOpenText className="size-4" />
                    Teaching Snapshot
                  </div>
                  <div className="text-sm">
                    <div className={listItemClassName}>
                      <div className="text-muted-foreground">Teaching Load</div>
                      <div className="font-medium">
                        {instructor.loadUnits} units
                      </div>
                    </div>
                    <div className={listItemClassName}>
                      <div className="text-muted-foreground">Classification</div>
                      <div className="font-medium">
                        {instructor.evaluation.rankingClassification}
                      </div>
                    </div>
                    <div className={listItemClassName}>
                      <div className="text-muted-foreground">Rating</div>
                      <div className="font-medium">
                        {instructor.evaluation.rating}
                      </div>
                    </div>
                  </div>
                </div>
              </aside>

              <main className="space-y-5">
                <div className={sectionClassName}>
                  <div className="mb-2 flex items-center gap-2 font-medium text-emerald-950 dark:text-emerald-50">
                    <Camera className="size-4" />
                    About
                  </div>
                  <div className="grid gap-5 text-sm md:grid-cols-2">
                    <div className={listItemClassName}>
                      <div className="text-muted-foreground text-sm">
                        Biography
                      </div>
                      <p className="mt-2 text-sm leading-6">
                        {instructor.biography}
                      </p>
                    </div>
                    <div className={listItemClassName}>
                      <div className="text-muted-foreground text-sm">
                        Educational Background
                      </div>
                      <p className="mt-2 text-sm leading-6">
                        {instructor.educationalBackground}
                      </p>
                    </div>
                  </div>
                </div>

                <div className={sectionClassName}>
                  <div className="mb-2 flex items-center gap-2 font-medium text-emerald-950 dark:text-emerald-50">
                    <FileCheck2 className="size-4" />
                    Credentials
                  </div>
                  <div className="grid gap-5 md:grid-cols-2">
                    <div className={listItemClassName}>
                      <div className="text-muted-foreground text-xs uppercase">
                        Areas of Expertise
                      </div>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {instructor.areasOfExpertise.map((area) => (
                          <Badge
                            key={area}
                            variant="outline"
                            className="rounded-full"
                          >
                            {area}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className={listItemClassName}>
                      <div className="text-muted-foreground text-xs uppercase">
                        Supporting Credentials
                      </div>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {instructor.credentials.map((credential) => (
                          <Badge
                            key={credential}
                            variant="secondary"
                            className="rounded-full"
                          >
                            {credential}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className={sectionClassName}>
                  <div className="mb-2 flex items-center gap-2 font-medium text-emerald-950 dark:text-emerald-50">
                    <Award className="size-4" />
                    Evaluation
                  </div>
                  <div className="grid gap-x-8 text-sm md:grid-cols-2">
                    <div className={listItemClassName}>
                      <div className="text-muted-foreground uppercase">
                        Score
                      </div>
                      <div className="mt-1 font-semibold">
                        {instructor.evaluation.totalScore}%
                      </div>
                    </div>
                    <div className={listItemClassName}>
                      <div className="text-muted-foreground uppercase">
                        Rating
                      </div>
                      <div className="mt-1 font-medium">
                        {instructor.evaluation.rating}
                      </div>
                    </div>
                    <div className={listItemClassName}>
                      <div className="text-muted-foreground uppercase">
                        Classification
                      </div>
                      <div className="mt-1 font-medium">
                        {instructor.evaluation.rankingClassification}
                      </div>
                    </div>
                    <div className={listItemClassName}>
                      <div className="text-muted-foreground uppercase">
                        Award
                      </div>
                      <div className="mt-1 font-medium">
                        {instructor.evaluation.award}
                      </div>
                    </div>
                  </div>
                </div>

                <div className={sectionClassName}>
                  <div className="mb-2 flex items-center gap-2 font-medium text-emerald-950 dark:text-emerald-50">
                    <GraduationCap className="size-4" />
                    Faculty Focus
                  </div>
                  <p className="text-sm leading-6 text-muted-foreground">
                    {instructor.name} currently supports{" "}
                    {instructor.teachingPrograms.join(", ").toLowerCase()}-level
                    formation with {instructor.loadUnits} teaching load units.
                  </p>
                </div>
              </main>
            </div>
          </div>

          <SheetFooter className="border-t px-6 py-4 sm:flex-row sm:justify-end">
            <SheetClose asChild>
              <Button variant="outline">Close</Button>
            </SheetClose>
          </SheetFooter>
        </>
      ) : null}
    </SheetContent>
  </Sheet>
);
