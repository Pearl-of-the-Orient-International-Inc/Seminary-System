"use client";

import Link from "next/link";
import React, { forwardRef, useRef, type RefObject } from "react";
import {
  ArrowRight,
  ClipboardCheck,
  CloudUpload,
  CreditCard,
  FilePenLine,
  Library,
  MonitorCheck,
  UserRoundCheck,
} from "lucide-react";

import { AnimatedBeam } from "@/components/animated-ui/animated-beam";
import { AnimatedList } from "@/components/animated-ui/animated-list";
import { BentoCard, BentoGrid } from "@/components/animated-ui/bento-grid";
import { Marquee } from "@/components/animated-ui/marquee";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const admissionSteps = [
  {
    title: "Submit Online Application",
    description: "Fill out the online application form.",
    icon: FilePenLine,
  },
  {
    title: "Upload of Requirements",
    description: "Upload necessary documents.",
    icon: CloudUpload,
  },
  {
    title: "Payment of Admission Fee",
    description: "Pay the non-refundable admission fee.",
    icon: CreditCard,
  },
  {
    title: "Review or Waiting for Approval",
    description: "Wait to review your application.",
    icon: ClipboardCheck,
  },
];

const serviceUpdates = [
  {
    name: "Enrollment Request",
    description: "Subject load submitted",
    time: "2m ago",
    color: "#0b4b39",
  },
  {
    name: "Certificate Request",
    description: "Document queued for review",
    time: "5m ago",
    color: "#f5b739",
  },
  {
    name: "Student Profile",
    description: "Account details updated",
    time: "10m ago",
    color: "#0f766e",
  },
  {
    name: "Advising Notice",
    description: "Schedule confirmed",
    time: "15m ago",
    color: "#d97706",
  },
];

const lmsFiles = [
  {
    name: "syllabus.pdf",
    body: "Course outlines, reading schedules, and weekly learning outcomes.",
  },
  {
    name: "module-01.docx",
    body: "Introductory lessons and guided reflection activities.",
  },
  {
    name: "assignment.xlsx",
    body: "Submission tracking, due dates, and activity scores.",
  },
  {
    name: "lecture-notes.pdf",
    body: "Downloadable class materials for online and blended learning.",
  },
  {
    name: "quiz-results.csv",
    body: "Recorded assessments and progress data from the LMS.",
  },
];

const libraryFiles = [
  {
    name: "Theology Journal",
    extension: "PDF",
    color: "#ef4444",
  },
  {
    name: "Research Guide",
    extension: "DOCS",
    color: "#3b82f6",
  },
  {
    name: "Reading List",
    extension: "XLS",
    color: "#16a34a",
  },
  {
    name: "Class Slides",
    extension: "PPT",
    color: "#f97316",
  },
  {
    name: "Archive Notes",
    extension: "PDF",
    color: "#ef4444",
  },
  {
    name: "Bibliography",
    extension: "DOCS",
    color: "#3b82f6",
  },
  {
    name: "Resource Index",
    extension: "XLS",
    color: "#16a34a",
  },
  {
    name: "Seminar Deck",
    extension: "PPT",
    color: "#f97316",
  },
];

const FileTypeIcon = ({
  extension,
  color,
}: {
  extension: string;
  color: string;
}) => {
  return (
    <div
      className="relative flex size-11 items-center justify-center rounded-md text-[10px] font-extrabold text-white shadow-sm"
      style={{ backgroundColor: color }}
    >
      <span>{extension}</span>
      <span className="absolute right-0 top-0 size-0 border-l-8 border-t-8 border-l-white/55 border-t-white/85" />
    </div>
  );
};

const ServiceUpdateItem = ({
  name,
  description,
  time,
  color,
}: {
  name: string;
  description: string;
  time: string;
  color: string;
}) => {
  return (
    <figure className="w-full rounded-xl border border-[#0b4b39]/10 bg-white/90 p-4 shadow-[0_12px_28px_rgba(10,51,39,0.08)] backdrop-blur-sm transition-transform duration-200 hover:scale-[1.02]">
      <div className="flex items-center gap-3">
        <div
          className="flex size-8 shrink-0 items-center justify-center rounded-md text-xs font-bold text-white"
          style={{ backgroundColor: color }}
        >
          {name.charAt(0)}
        </div>
        <div className="min-w-0">
          <figcaption className="flex items-center gap-1 text-sm font-bold text-[#0b3327]/75">
            <span className="truncate">{name}</span>
            <span className="text-[#31463f]/45">·</span>
            <span className="shrink-0 text-xs text-[#31463f]/55">
              {time}
            </span>
          </figcaption>
          <p className="mt-1 truncate text-sm text-[#31463f]/65">
            {description}
          </p>
        </div>
      </div>
    </figure>
  );
};

const ecosystemFeatures = [
  {
    name: "LMS",
    description: "Access materials, assignments, and more.",
    Icon: MonitorCheck,
    href: "/all-features",
    cta: "Open LMS",
    className: "col-span-3 lg:col-span-1",
    background: (
      <Marquee
        pauseOnHover
        repeat={3}
        className="absolute -left-10 right-0 top-8 [--duration:22s] mask-[linear-gradient(to_bottom,#000_15%,transparent_92%)]"
      >
        {lmsFiles.map((file) => (
          <figure
            key={file.name}
            className="relative w-36 shrink-0 cursor-pointer overflow-hidden rounded-xl border border-[#0b4b39]/10 bg-white/90 p-4 shadow-[0_12px_28px_rgba(10,51,39,0.08)] backdrop-blur-sm blur-[1px] transition-all duration-300 ease-out hover:blur-none"
          >
            <div className="flex items-center gap-2">
              <FilePenLine
                className="size-5 text-[#0b4b39]"
                strokeWidth={1.6}
              />
              <figcaption className="truncate text-sm font-bold text-[#0b3327]/75">
                {file.name}
              </figcaption>
            </div>
            <blockquote className="mt-3 line-clamp-4 text-xs leading-5 text-[#31463f]/60">
              {file.body}
            </blockquote>
          </figure>
        ))}
      </Marquee>
    ),
  },
  {
    name: "Grading System",
    description: "View grades, GPA, and academic records.",
    Icon: ClipboardCheck,
    href: "/all-features",
    cta: "View Records",
    className: "col-span-3 lg:col-span-1",
    background: (
      <div className="absolute inset-x-5 top-7 rounded-lg border border-[#0b4b39]/10 bg-white/90 p-4 shadow-[0_16px_36px_rgba(10,51,39,0.1)] backdrop-blur-sm transition-transform duration-500 group-hover:scale-105">
        {[
          ["Theology", "92%"],
          ["Counseling", "88%"],
          ["Chaplaincy", "96%"],
        ].map(([subject, width], index) => (
          <div key={subject} className="mb-4 last:mb-0">
            <div className="flex justify-between text-xs font-bold text-[#0b3327]/70">
              <span>{subject}</span>
              <span>{width}</span>
            </div>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-[#0b4b39]/10">
              <div
                className="h-full rounded-full bg-[#f5b739] transition-all duration-700 group-hover:bg-[#0b4b39]"
                style={{ width, transitionDelay: `${index * 120}ms` }}
              />
            </div>
          </div>
        ))}
      </div>
    ),
  },
  {
    name: "Student Services",
    description: "Enrollment, subjects, certificates & more.",
    Icon: UserRoundCheck,
    href: "/all-features",
    cta: "Get Services",
    className: "col-span-3 lg:col-span-2",
    background: (
      <div className="absolute right-4 top-4 h-60 w-full max-w-130 overflow-hidden scale-90 mask-[linear-gradient(to_bottom,#000_45%,transparent_100%)] transition-transform duration-500 group-hover:scale-95">
        <AnimatedList delay={900} className="gap-2">
          {serviceUpdates.map((item) => (
            <ServiceUpdateItem key={item.name} {...item} />
          ))}
        </AnimatedList>
      </div>
    ),
  },
  {
    name: "Library",
    description: "Access digital books, journals and resources.",
    Icon: Library,
    href: "/all-features",
    cta: "Browse Library",
    className: "col-span-3 lg:col-span-2",
    background: (
      <div className="absolute inset-x-7 top-7 grid grid-cols-4 gap-3 opacity-85 mask-[linear-gradient(to_bottom,#000_45%,transparent_100%)] transition-transform duration-500 group-hover:-translate-y-2 group-hover:scale-[1.02]">
        {libraryFiles.map((file, index) => (
          <figure
            key={`${file.name}-${index}`}
            className="rounded-lg border border-[#0b4b39]/10 bg-white/90 p-3 shadow-[0_12px_28px_rgba(10,51,39,0.08)] backdrop-blur-sm transition-transform duration-300 hover:-translate-y-1"
          >
            <FileTypeIcon extension={file.extension} color={file.color} />
            <figcaption className="mt-3 line-clamp-2 text-xs font-bold leading-4 text-[#0b3327]/60">
              {file.name}
            </figcaption>
          </figure>
        ))}
      </div>
    ),
  },
];

const ecosystemFeatureOrder = [
  "LMS",
  "Library",
  "Student Services",
  "Grading System",
];

const StepCircle = forwardRef<
  HTMLDivElement,
  {
    className?: string;
    children?: React.ReactNode;
  }
>(({ className, children }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "relative z-10 flex size-20 items-center justify-center rounded-full border border-[#f5b739] bg-white shadow-[0_8px_22px_rgba(0,0,0,0.12)] ring-1 ring-[#0b4b39]/10",
        className
      )}
    >
      {children}
    </div>
  );
});

StepCircle.displayName = "StepCircle";

const Process = () => {
  const beamContainerRef = useRef<HTMLDivElement>(null);
  const stepOneRef = useRef<HTMLDivElement>(null);
  const stepTwoRef = useRef<HTMLDivElement>(null);
  const stepThreeRef = useRef<HTMLDivElement>(null);
  const stepFourRef = useRef<HTMLDivElement>(null);

  const stepRefs = [stepOneRef, stepTwoRef, stepThreeRef, stepFourRef];
  const beams: [RefObject<HTMLDivElement | null>, RefObject<HTMLDivElement | null>][] =
    [
      [stepOneRef, stepTwoRef],
      [stepTwoRef, stepThreeRef],
      [stepThreeRef, stepFourRef],
    ];

  return (
    <section className="bg-white px-6 py-5 text-[#0b3327] lg:px-20">
      <div className="grid gap-10">
        <div>
          <h2 className="text-2xl font-bold tracking-normal sm:text-3xl">
            Enrollment & Admission Process
          </h2>
          <div className="mt-3 h-1 w-15 bg-[#f5b739]" />

          <div
            ref={beamContainerRef}
            className="relative mt-10 grid overflow-hidden px-2 py-2 sm:grid-cols-2 xl:grid-cols-4"
          >
            {admissionSteps.map((step, index) => {
              const Icon = step.icon;

              return (
                <div
                  key={step.title}
                  className="relative flex min-h-56 flex-col items-center px-4 text-center"
                >
                  <StepCircle ref={stepRefs[index]}>
                    <Icon className="size-8 text-[#0b4b39]" strokeWidth={1.5} />
                    <span className="absolute -right-1 -top-2 flex size-7 items-center justify-center rounded-full bg-[#063b2c] text-xs font-bold text-white">
                      {index + 1}
                    </span>
                  </StepCircle>
                  <h3 className="mt-5 text-base font-bold leading-tight">
                    {step.title}
                  </h3>
                  <p className="mt-1 max-w-48 text-sm text-[#273f37]">
                    {step.description}
                  </p>
                </div>
              );
            })}

            {beams.map(([fromRef, toRef], index) => (
              <AnimatedBeam
                key={`${index}-${admissionSteps[index].title}`}
                containerRef={beamContainerRef}
                fromRef={fromRef}
                toRef={toRef}
                duration={3}
                delay={index * 0.25}
                pathColor="#d8c798"
                pathOpacity={0.45}
                pathWidth={2}
                gradientStartColor="#f5b739"
                gradientStopColor="#0b4b39"
              />
            ))}
          </div>
        </div>

        <div className="rounded-md bg-[#f8faf9] p-7 shadow-[0_16px_40px_rgba(10,51,39,0.08)] ring-1 ring-[#0b3327]/5 sm:p-8">
          <h2 className="font-serif text-2xl font-bold tracking-normal sm:text-3xl">
            Digital Learning Ecosystem
          </h2>
          <p className="mt-3 max-w-md text-sm leading-6 text-[#31463f] sm:text-base">
            Empowering students and faculty with technology for effective
            learning.
          </p>

          <div className="mt-9">
            <BentoGrid className="auto-rows-[22rem]">
              {ecosystemFeatureOrder.map((featureName) => {
                const feature = ecosystemFeatures.find(
                  (item) => item.name === featureName
                );

                if (!feature) {
                  return null;
                }

                return (
                  <BentoCard
                    key={feature.name}
                    {...feature}
                    className={cn(
                      "border border-[#0b3327]/10 bg-white shadow-[0_18px_44px_rgba(10,51,39,0.09)]",
                      "before:pointer-events-none before:absolute before:inset-0 before:z-1 before:bg-[linear-gradient(to_top,rgba(255,255,255,0.98)_0%,rgba(255,255,255,0.82)_28%,transparent_64%)]",
                      feature.className
                    )}
                  />
                );
              })}
            </BentoGrid>
          </div>

          <Button
            asChild
            className="mt-8 h-10 rounded-md bg-[#003f2b] px-6 text-sm font-semibold text-white shadow-none hover:bg-[#07533a]"
          >
            <Link href="/all-features">
              Explore All Features
              <ArrowRight className="size-4" strokeWidth={2.5} />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Process;
