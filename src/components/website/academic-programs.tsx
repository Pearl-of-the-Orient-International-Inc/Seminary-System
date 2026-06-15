import {
  ArrowRight,
  BookOpen,
  GraduationCap,
  Presentation,
  School,
  ShieldCheck,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";

const academicPrograms: {
  title: string;
  description: string;
  icon: LucideIcon;
}[] = [
  {
    title: "Theology & Ministry",
    description:
      "Biblical, pastoral, and doctrinal formation for church and ministry leadership.",
    icon: BookOpen,
  },
  {
    title: "Chaplaincy",
    description:
      "Practical preparation for spiritual care in community, institutional, and service settings.",
    icon: ShieldCheck,
  },
  {
    title: "Christian Education",
    description:
      "Faith-centered teaching, curriculum, and discipleship training for educators.",
    icon: School,
  },
  {
    title: "Leadership Studies",
    description:
      "Formation in ethical leadership, administration, and service-oriented decision making.",
    icon: Presentation,
  },
  {
    title: "Biblical Studies",
    description:
      "Focused study of scripture, interpretation, theology, and Christian tradition.",
    icon: GraduationCap,
  },
  {
    title: "Continuing Formation",
    description:
      "Short courses and certificate pathways for lifelong learning and ministry growth.",
    icon: Sparkles,
  },
];

const AcademicPrograms = () => {
  return (
    <section className="bg-[#f7faf8] px-6 py-16 text-[#0b3327] lg:px-20">
      <div className="container mx-auto">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <h2 className="text-2xl font-bold tracking-normal sm:text-3xl">
              Academic Programs
            </h2>
            <div className="mt-3 h-1 w-15 bg-[#f5b739]" />
            <p className="mt-5 text-sm leading-6 text-[#31463f] sm:text-base">
              Explore faith-centered programs designed to prepare students for
              ministry, chaplaincy, education, leadership, and lifelong service.
            </p>
          </div>

          <Button
            asChild
            variant="outline"
            className="h-11 w-fit rounded-md border-[#0b4b39] bg-white px-5 text-sm font-semibold text-[#0b4b39] shadow-none hover:bg-[#0b4b39] hover:text-white"
          >
            <Link href="/academics">
              View All Programs
              <ArrowRight className="size-4" strokeWidth={2.5} />
            </Link>
          </Button>
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {academicPrograms.map((program) => {
            const Icon = program.icon;

            return (
              <Link
                key={program.title}
                href="/academics"
                className="group rounded-md border border-[#0b3327]/10 bg-white p-6 shadow-[0_12px_30px_rgba(10,51,39,0.06)] transition-all hover:-translate-y-1 hover:border-[#f5b739] hover:shadow-[0_18px_40px_rgba(10,51,39,0.12)]"
              >
                <div className="flex size-12 items-center justify-center rounded-md bg-[#003f2b] text-[#f5b739] transition-colors group-hover:bg-[#f5b739] group-hover:text-[#073722]">
                  <Icon className="size-6" strokeWidth={1.6} />
                </div>
                <h3 className="mt-5 text-lg font-bold leading-tight">
                  {program.title}
                </h3>
                <p className="mt-3 text-sm leading-6 text-[#31463f]">
                  {program.description}
                </p>
                <div className="mt-6 flex items-center gap-2 text-sm font-bold text-[#0b4b39]">
                  Learn More
                  <ArrowRight
                    className="size-4 transition-transform group-hover:translate-x-1"
                    strokeWidth={2.5}
                  />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default AcademicPrograms;
