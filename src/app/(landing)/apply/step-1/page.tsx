"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { ArrowRight } from "lucide-react";

import {
  ApplicationShell,
  FieldBox,
  SelectBox,
  useApplyFormField,
  validateApplyStep,
} from "../_components/application-shell";
import { Button } from "@/components/ui/button";
import { useSeminaryCoursesQuery } from "@/features/seminary/seminary.hooks";
import type {
  SeminaryCourse,
  SeminaryProgramLevel,
} from "@/features/seminary/seminary.types";

const programLevelLabelMap: Record<SeminaryProgramLevel, string> = {
  CERTIFICATE: "Certificate",
  BACHELOR: "Bachelor",
  MASTER_WITH_THESIS: "Master with Thesis",
  DOCTORATE_WITH_DISSERTATION: "Doctorate with Dissertation",
};

type CurriculumGroup = {
  title: string;
  programs: string[];
};

function buildCurriculumGroupsFromCourses(courses: SeminaryCourse[]) {
  const activeCourses = courses
    .filter((course) => course.status === "ACTIVE")
    .sort((left, right) => left.sortOrder - right.sortOrder);

  if (!activeCourses.length) {
    return [];
  }

  const groupsByTitle = new Map<string, CurriculumGroup>();

  activeCourses.forEach((course) => {
    const title = programLevelLabelMap[course.program];
    const currentGroup = groupsByTitle.get(title);

    if (currentGroup) {
      if (!currentGroup.programs.includes(course.courseName)) {
        currentGroup.programs.push(course.courseName);
      }
      return;
    }

    groupsByTitle.set(title, {
      title,
      programs: [course.courseName],
    });
  });

  return Array.from(groupsByTitle.values());
}

const Page = () => {
  const router = useRouter();
  const coursesQuery = useSeminaryCoursesQuery({
    limit: 200,
    page: 1,
    status: "ACTIVE",
  });
  const [validationMessage, setValidationMessage] = useState("");
  const dynamicCurriculumGroups = useMemo(
    () => buildCurriculumGroupsFromCourses(coursesQuery.data?.data ?? []),
    [coursesQuery.data?.data],
  );
  const [selectedProgramLevel, setSelectedProgramLevel] = useApplyFormField(
    "program_level",
    ""
  );
  const [selectedCourse, setSelectedCourse] = useApplyFormField("program_course");
  const selectedProgramGroup =
    dynamicCurriculumGroups.find((group) => group.title === selectedProgramLevel) ??
    dynamicCurriculumGroups[0];

  useEffect(() => {
    if (!dynamicCurriculumGroups.length) {
      return;
    }

    const selectedGroupExists = dynamicCurriculumGroups.some(
      (group) => group.title === selectedProgramLevel,
    );

    if (!selectedGroupExists) {
      setSelectedProgramLevel(dynamicCurriculumGroups[0].title);
      setSelectedCourse("");
    }
  }, [
    dynamicCurriculumGroups,
    selectedProgramLevel,
    setSelectedCourse,
    setSelectedProgramLevel,
  ]);
  const handleContinue = () => {
    const result = validateApplyStep(1);

    if (!result.isValid) {
      setValidationMessage(result.message);
      return;
    }

    setValidationMessage("");
    router.push("/apply/step-2");
  };

  return (
    <ApplicationShell activeStep={1}>
      <form className="space-y-5">
        <section className="rounded-md border border-[#0b3327]/10 bg-white p-6 shadow-[0_12px_30px_rgba(10,51,39,0.06)]">
          <h2 className="font-serif text-2xl font-bold">
            1. Personal Information
          </h2>
          <div className="mt-5 grid gap-4 md:grid-cols-3">
            <FieldBox label="Academic Year" isRequired />
            <FieldBox label="Surname" isRequired />
            <FieldBox label="Given Name" isRequired />
            <FieldBox label="Middle Name" isRequired />
            <FieldBox label="Email Address" isRequired />
            <FieldBox label="Mobile Phone" isRequired />
            <FieldBox label="Home Address" isRequired className="md:col-span-3" />
            <FieldBox label="Date of Birth" isRequired />
            <FieldBox label="Birth Place" isRequired className="md:col-span-2" />
            <FieldBox label="Age" isRequired />
            <SelectBox label="Gender" placeholder="Select gender" isRequired />
            <FieldBox label="Height (cm)" isRequired />
            <FieldBox label="Weight (kg)" isRequired />
            <SelectBox
              label="Civil Status"
              isRequired
              placeholder="Select civil status"
            />
            <FieldBox label="Office Phone" />
          </div>
        </section>

        <section className="rounded-md border border-[#0b3327]/10 bg-white p-6 shadow-[0_12px_30px_rgba(10,51,39,0.06)]">
          <h2 className="font-serif text-2xl font-bold">
            2. Ministry
          </h2>
          <div className="mt-5 grid gap-4 md:grid-cols-3">
            <FieldBox label="Name of Church You Attended" isRequired className="md:col-span-3" />
            <FieldBox label="Church Address" isRequired className="md:col-span-3" />
            <FieldBox label="Name of Pastor" isRequired className="md:col-span-2" />
            <FieldBox label="Contact #" isRequired />
            <FieldBox label="Ministry you involved" isRequired className="md:col-span-3" />
          </div>
        </section>

        <section className="rounded-md border border-[#0b3327]/10 bg-white p-6 shadow-[0_12px_30px_rgba(10,51,39,0.06)]">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 className="font-serif text-2xl font-bold">
                3. Curriculum of Interest
              </h2>
              <p className="mt-2 text-sm text-[#31463f]">
                Select a program level first. Courses shown below will update
                based on your selection.
              </p>
            </div>
            <SelectBox
              label="Select Program"
              name="program_level"
              placeholder="Select program"
              isRequired
              className="md:w-80"
              value={selectedProgramLevel}
              onValueChange={(nextProgramLevel) => {
                setSelectedProgramLevel(nextProgramLevel);
                setSelectedCourse("");
              }}
              options={dynamicCurriculumGroups.map((group) => group.title)}
            />
          </div>

          <section className="mt-6 rounded-md border border-[#0b3327]/10 bg-[#fbfcfb] p-4">
            <h3 className="font-serif text-lg font-bold">
              {selectedProgramGroup?.title ?? "Available"} Courses
            </h3>
            <p className="mt-1 text-sm text-[#31463f]">
              {coursesQuery.isLoading
                ? "Loading active courses from the course catalog."
                : "Showing active courses from the course catalog."}
            </p>
            <div className="mt-4 grid gap-2 md:grid-cols-2">
              {selectedProgramGroup?.programs.map((program) => (
                <label
                  key={program}
                  className="flex cursor-pointer items-start gap-3 rounded-md bg-white px-3 py-2 text-sm leading-5 text-[#31463f] ring-1 ring-[#0b3327]/8 transition hover:ring-[#0b4b39]/35"
                >
                  <input
                    type="radio"
                    name="program_course"
                    value={program}
                    checked={selectedCourse === program}
                    onChange={(event) => setSelectedCourse(event.target.value)}
                    className="mt-0.5 size-4 shrink-0 accent-[#0b4b39]"
                  />
                  {program}
                </label>
              ))}
            </div>
            {!coursesQuery.isLoading && !selectedProgramGroup?.programs.length ? (
              <div className="mt-4 rounded-md border border-dashed border-[#0b3327]/20 bg-white px-4 py-6 text-sm text-[#31463f]">
                No active courses available in the course catalog.
              </div>
            ) : null}
          </section>
        </section>

        <section className="rounded-md border border-[#0b3327]/10 bg-white p-6 shadow-[0_12px_30px_rgba(10,51,39,0.06)]">
          <h2 className="font-serif text-2xl font-bold">
            4. Educational Background
          </h2>
          <div className="mt-5 grid gap-4 md:grid-cols-3">
            <FieldBox label="High School" isRequired className="md:col-span-2" />
            <FieldBox label="High School Year Graduated" isRequired />
            <FieldBox label="College School" className="md:col-span-3" />
            <FieldBox label="College Course" className="md:col-span-2" />
            <FieldBox label="College Year Graduated" />
            <FieldBox label="Vocational School" className="md:col-span-3" />
            <FieldBox label="Vocational Course" className="md:col-span-2" />
            <FieldBox label="Vocational Year Graduated" />
            <FieldBox label="Others School" className="md:col-span-3" />
            <FieldBox label="Others Course" className="md:col-span-2" />
            <FieldBox label="Others Year Graduated" />
          </div>
        </section>

        <div className="flex justify-end gap-3">
          {validationMessage ? (
            <p className="flex min-h-10 items-center rounded-md bg-[#fff2f0] px-4 text-sm font-semibold text-[#b42318] ring-1 ring-[#f1b7ad]">
              {validationMessage}
            </p>
          ) : null}
          <Button
            type="button"
            onClick={handleContinue}
            className="h-10 rounded-md bg-[#003f2b] px-6 text-sm font-semibold text-white shadow-none hover:bg-[#07533a]"
          >
            Save & Next
            <ArrowRight className="size-4" />
          </Button>
        </div>
      </form>
    </ApplicationShell>
  );
};

export default Page;
