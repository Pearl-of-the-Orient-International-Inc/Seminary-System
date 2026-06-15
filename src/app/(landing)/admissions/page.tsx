"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, type RefObject } from "react";
import {
  ArrowRight,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  Globe,
  GraduationCap,
  HeartHandshake,
  Mail,
  MapPin,
  Phone,
  ScrollText,
  ShieldCheck,
  Sparkles,
  Users,
  type LucideIcon,
} from "lucide-react";

import { AnimatedBeam } from "@/components/animated-ui/animated-beam";
import { Button } from "@/components/ui/button";
import { admissionSteps } from "@/components/website/process";

const admissionHighlights = [
  {
    title: "Biblically-Centered Education",
    description: "Grounded on the Word of God.",
    icon: BookOpen,
  },
  {
    title: "Called to Serve",
    description: "Forming leaders for the church.",
    icon: Users,
  },
  {
    title: "Quality Formation",
    description: "Academic excellence.",
    icon: ShieldCheck,
  },
  {
    title: "Global Impact",
    description: "To reach communities globally.",
    icon: Globe,
  },
  {
    title: "Supportive Community",
    description: "A family you pray with.",
    icon: HeartHandshake,
  },
];

const requirements = [
  ["Transcript of Records (TOR)", "Official copy from your previous school."],
  ["2x2 or 2x2 ID Picture", "Recent, formal ID picture with white background."],
  ["Pastor&apos;s Recommendation Letter", "A letter of recommendation from your pastor."],
  ["Brief History of Conversion", "A short personal testimony of your faith journey."],
];

const programChoices: {
  title: string;
  description: string;
  icon: LucideIcon;
  accent: string;
}[] = [
  {
    title: "Certificate Programs",
    description: "Short-term specialized training designed for personal growth and ministry enhancement.",
    icon: ScrollText,
    accent: "#f5b739",
  },
  {
    title: "Bachelor Programs",
    description: "4-year undergraduate programs building a strong foundation for ministry and service.",
    icon: GraduationCap,
    accent: "#0b4b39",
  },
  {
    title: "Masteral Programs",
    description: "Advanced studies for deeper ministry and leadership with thesis.",
    icon: BookOpen,
    accent: "#1d78a8",
  },
  {
    title: "Doctorate Programs",
    description: "Research and scholarship for kingdom impact and transformation with dissertation.",
    icon: Sparkles,
    accent: "#8b4bb3",
  },
];

const importantDates = [
  ["Application Period", "January 1 - May 31, 2025"],
  ["Interview Period", "June 2 - June 30, 2025"],
  ["Enrollment Period", "July 1 - July 31, 2025"],
  ["Classes Begin", "August 4, 2025"],
];

const reasons = [
  "Faithful to Scripture",
  "Spiritually Transformative",
  "Academically Excellent",
  "Ministry Focused",
  "Global Perspective",
];

const Page = () => {
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
    <main className="bg-white text-[#0b3327]">
      <section className="relative isolate min-h-88 overflow-hidden bg-[#082f25] text-white">
        <Image
          src="https://images.pexels.com/photos/7820383/pexels-photo-7820383.jpeg"
          alt="Pearl of The Orient Theological Seminary and Colleges campus"
          fill
          priority
          sizes="100vw"
          className="absolute inset-0 -z-20 object-cover"
        />
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(0,42,35,0.96)_0%,rgba(0,52,39,0.82)_44%,rgba(0,52,39,0.28)_80%,rgba(0,52,39,0.14)_100%)]" />

        <div className="container mx-auto px-6 py-14 lg:px-20">
          <nav className="flex items-center gap-2 text-xs font-semibold text-white/76">
            <Link href="/" className="hover:text-[#f5b739]">
              Home
            </Link>
            <span>›</span>
            <span className="text-[#f5b739]">Admissions</span>
          </nav>

          <h1 className="mt-5 font-serif text-4xl font-bold leading-tight tracking-normal sm:text-5xl">
            Admissions
          </h1>
          <div className="mt-5 h-1 w-20 bg-[#f5b739]" />
          <p className="mt-5 max-w-xl text-sm leading-6 text-white/88 sm:text-base">
            We are glad you are considering Pearl of The Orient Theological
            Seminary and Colleges as a part of your calling and journey. Here,
            you will be equipped for effective ministry and lifelong service
            for God&apos;s glory.
          </p>
        </div>
      </section>

      <section className="bg-[#003f2b] px-6 py-6 text-white lg:px-20">
        <div className="container mx-auto grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
          {admissionHighlights.map((highlight) => {
            const Icon = highlight.icon;

            return (
              <article
                key={highlight.title}
                className="flex gap-4 border-white/16 lg:border-l lg:pl-6 lg:first:border-l-0 lg:first:pl-0"
              >
                <Icon className="size-8 shrink-0 text-[#f5b739]" strokeWidth={1.7} />
                <div>
                  <h2 className="text-sm font-extrabold">{highlight.title}</h2>
                  <p className="mt-1 text-xs leading-5 text-white/76">
                    {highlight.description}
                  </p>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="px-6 py-12 lg:px-20">
        <div className="container mx-auto grid gap-8 lg:grid-cols-[minmax(0,1fr)_310px]">
          <div>
            <section>
              <h2 className="text-2xl font-bold">Start Your Journey</h2>
              <div className="mt-3 h-1 w-16 bg-[#f5b739]" />
              <p className="mt-3 text-sm text-[#31463f]">
                Our admission process is designed to be simple and helpful.
              </p>

              <div className="mt-8 rounded-md border border-[#0b3327]/10 bg-white p-6 shadow-[0_12px_30px_rgba(10,51,39,0.06)]">
                <div
                  ref={beamContainerRef}
                  className="relative grid overflow-hidden gap-7 sm:grid-cols-2 lg:grid-cols-4"
                >
                  {admissionSteps.map((step, index) => {
                    const Icon = step.icon;

                    return (
                      <article key={step.title} className="relative text-center">
                        <div
                          ref={stepRefs[index]}
                          className="relative z-10 mx-auto flex size-18 items-center justify-center rounded-full bg-[#eef5f2] text-[#0b4b39] ring-1 ring-[#0b4b39]/10"
                        >
                          <Icon className="size-7" strokeWidth={1.6} />
                        </div>
                        <p className="mt-4 text-xs font-bold text-[#0b4b39]">
                          Step {index + 1}
                        </p>
                        <h3 className="mt-1 text-sm font-extrabold">
                          {step.title}
                        </h3>
                        <p className="mt-2 text-xs leading-5 text-[#31463f]">
                          {step.description}
                        </p>
                      </article>
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
            </section>

            <section className="mt-10">
              <h2 className="text-2xl font-bold">Admission Requirements</h2>
              <div className="mt-3 h-1 w-16 bg-[#f5b739]" />
              <p className="mt-3 text-sm text-[#31463f]">
                Prepare and submit the following requirements to complete your
                application.
              </p>

              <div className="mt-5 overflow-hidden rounded-md border border-[#0b3327]/10 bg-white shadow-[0_12px_30px_rgba(10,51,39,0.06)]">
                {requirements.map(([requirement, detail], index) => (
                  <div
                    key={requirement}
                    className="grid gap-3 border-b border-[#0b3327]/8 px-5 py-3 text-sm last:border-b-0 md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]"
                  >
                    <div className="flex items-center gap-3 font-bold">
                      <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-[#eef5f2] text-xs text-[#0b4b39]">
                        {index + 1}
                      </span>
                      <span>{requirement}</span>
                    </div>
                    <p className="text-[#31463f]">{detail}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className="mt-10">
              <h2 className="text-2xl font-bold">Choose Your Program</h2>
              <div className="mt-3 h-1 w-16 bg-[#f5b739]" />
              <p className="mt-3 text-sm text-[#31463f]">
                Select the program that best fits your calling and goals.
              </p>

              <div className="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
                {programChoices.map((program) => {
                  const Icon = program.icon;

                  return (
                    <article
                      key={program.title}
                      className="rounded-md border border-[#0b3327]/10 bg-white p-6 text-center shadow-[0_12px_30px_rgba(10,51,39,0.06)]"
                      style={{ borderTop: `3px solid ${program.accent}` }}
                    >
                      <Icon
                        className="mx-auto size-11"
                        style={{ color: program.accent }}
                        strokeWidth={1.6}
                      />
                      <h3 className="mt-4 font-serif text-lg font-bold">
                        {program.title}
                      </h3>
                      <p className="mt-3 min-h-16 text-xs leading-5 text-[#31463f]">
                        {program.description}
                      </p>
                      <Button
                        asChild
                        variant="outline"
                        className="mt-5 h-10 w-full rounded-md bg-white text-xs font-bold shadow-none"
                        style={{
                          borderColor: program.accent,
                          color: program.accent,
                        }}
                      >
                        <Link href="/academics">
                          View Programs
                          <ArrowRight className="size-4" strokeWidth={2.5} />
                        </Link>
                      </Button>
                    </article>
                  );
                })}
              </div>
            </section>
          </div>

          <aside className="space-y-6">
            <section className="rounded-md bg-[#f8faf9] p-6 shadow-[0_12px_30px_rgba(10,51,39,0.06)] ring-1 ring-[#0b3327]/5">
              <h2 className="text-lg font-bold">Important Dates</h2>
              <div className="mt-5 space-y-5">
                {importantDates.map(([title, date]) => (
                  <div key={title} className="flex gap-3">
                    <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[#eef5f2] text-[#0b4b39]">
                      <CalendarDays className="size-5" strokeWidth={1.6} />
                    </div>
                    <div>
                      <h3 className="text-sm font-extrabold">{title}</h3>
                      <p className="mt-1 text-xs text-[#31463f]">{date}</p>
                    </div>
                  </div>
                ))}
              </div>
              <Button
                asChild
                className="mt-6 h-11 w-full rounded-md bg-[#003f2b] px-5 text-sm font-semibold text-white shadow-none hover:bg-[#07533a]"
              >
                <Link href="/calendar">
                  View Academic Calendar
                  <CalendarDays className="size-4" strokeWidth={2} />
                </Link>
              </Button>
            </section>

            <section className="rounded-md bg-[#f8faf9] p-6 shadow-[0_12px_30px_rgba(10,51,39,0.06)] ring-1 ring-[#0b3327]/5">
              <h2 className="text-lg font-bold">Need Help?</h2>
              <p className="mt-3 text-sm leading-6 text-[#31463f]">
                Our Admissions Team is here to assist you.
              </p>
              <div className="mt-5 space-y-3 text-sm text-[#31463f]">
                <div className="flex items-center gap-3">
                  <Phone className="size-4 text-[#0b4b39]" />
                  <span>(043) 123-4567</span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="size-4 text-[#0b4b39]" />
                  <span>admissions@potsc.edu.ph</span>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="size-4 text-[#0b4b39]" />
                  <span>Mon - Fri: 8:00 AM - 5:00 PM</span>
                </div>
              </div>
              <Button
                asChild
                className="mt-6 h-11 w-full rounded-md bg-[#f5b739] px-5 text-sm font-bold text-[#073722] shadow-none hover:bg-[#e7a82f]"
              >
                <Link href="/contact">
                  Contact Admissions
                  <ArrowRight className="size-4" strokeWidth={2.5} />
                </Link>
              </Button>
            </section>

            <section className="rounded-md bg-[#f8faf9] p-6 shadow-[0_12px_30px_rgba(10,51,39,0.06)] ring-1 ring-[#0b3327]/5">
              <h2 className="text-lg font-bold">Why Choose POTSC?</h2>
              <ul className="mt-5 space-y-3">
                {reasons.map((reason) => (
                  <li key={reason} className="flex items-center gap-3 text-sm">
                    <CheckCircle2
                      className="size-4 shrink-0 text-[#0b4b39]"
                      strokeWidth={2}
                    />
                    <span>{reason}</span>
                  </li>
                ))}
              </ul>
              <Button
                asChild
                className="mt-6 h-11 w-full rounded-md bg-[#003f2b] px-5 text-sm font-semibold text-white shadow-none hover:bg-[#07533a]"
              >
                <Link href="/admissions">
                  Apply Now
                  <ArrowRight className="size-4" strokeWidth={2.5} />
                </Link>
              </Button>
            </section>
          </aside>
        </div>
      </section>
    </main>
  );
};

export default Page;
