import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Globe,
  GraduationCap,
  MessageSquareMore,
  ScrollText,
  ShieldCheck,
  Sparkles,
  Users,
  type LucideIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";

const highlights = [
  {
    title: "Biblical Foundation",
    description: "Rooted in the bible as our ultimate authority.",
    icon: BookOpen,
  },
  {
    title: "Experienced Faculty",
    description: "Learn from dedicated servant-leaders.",
    icon: Users,
  },
  {
    title: "Faith-Based Education",
    description: "Christ-centered in a community.",
    icon: ShieldCheck,
  },
  {
    title: "Global Impact",
    description: "Preparing leaders to serve globally.",
    icon: Globe,
  },
];

const programGroups: {
  title: string;
  description: string;
  icon: LucideIcon;
  accent: string;
  buttonClassName: string;
  programs: string[];
}[] = [
  {
    title: "Certificate Programs",
    description: "Designed for personal growth and ministry enhancement.",
    icon: ScrollText,
    accent: "#f5b739",
    buttonClassName:
      "border-[#f5b739] text-[#a46b00] hover:bg-[#f5b739] hover:text-[#073722]",
    programs: [
      "Certificate in Christian Evangelism",
      "Certificate in Christian Ministry",
      "Certificate in ECE & SPED Management",
      "Certificate in Advanced Ministerial",
      "Certificate in Advanced Theology",
    ],
  },
  {
    title: "Bachelor Programs",
    description: "Building a strong foundation for ministry and service.",
    icon: GraduationCap,
    accent: "#0b4b39",
    buttonClassName:
      "border-[#0b4b39] text-[#0b4b39] hover:bg-[#0b4b39] hover:text-white",
    programs: [
      "Bachelor of Theology",
      "Bachelor of Theology (Major in Pastoral Ministry)",
      "Bachelor of Theology (Major in Chaplaincy)",
      "Bachelor of Religious Education",
      "Bachelor of Christian Ministry (Major in Human Resources & Community Development)",
      "Bachelor of Christian Ministry (Major in Christian Leadership)",
      "Bachelor in Mission (Major in Cross-Culture)",
      "Bachelor in Christian Counseling",
      "Bachelor of Christian Ministry in Naturopathic Medicine",
    ],
  },
  {
    title: "Masteral Programs",
    description:
      "Advanced studies for those called to deeper ministry and leadership.",
    icon: ScrollText,
    accent: "#1d78a8",
    buttonClassName:
      "border-[#1d78a8] text-[#1d78a8] hover:bg-[#1d78a8] hover:text-white",
    programs: [
      "Master in Theology",
      "Master in Divinity",
      "Master of Religious Education",
      "Master of Christian Ministry in Complementary and Alternative Medicine (Major in Naturopathy)",
      "Master of Christian Ministry (Major in Christian Leadership)",
      "Master of Arts & Mission",
      "Master in Christian Counseling",
    ],
  },
  {
    title: "Doctorate Programs",
    description:
      "Research and scholarship for kingdom impact and transformation.",
    icon: Sparkles,
    accent: "#8b4bb3",
    buttonClassName:
      "border-[#8b4bb3] text-[#8b4bb3] hover:bg-[#8b4bb3] hover:text-white",
    programs: [
      "Doctor of Christian Ministry",
      "Doctor of Ministry Alternative Medicine",
      "Doctor of Theology",
      "Doctor of Religious Education",
      "Doctor of Philosophy (Major in Christian Leadership & Management)",
      "Doctor of Philosophy (Major in Biblical Studies)",
      "Doctor of Philosophy in Theology",
      "Doctor of Philosophy in Christian Apologetics",
      "Doctor of Philosophy in Religion",
      "Doctor of Philosophy (Major in Pastoral Ministry)",
      "Doctor of Philosophy (Major in Pastoral Guidance & Counseling)",
    ],
  },
];

const Page = () => {
  return (
    <main className="bg-white text-[#0b3327]">
      <section className="relative isolate min-h-80 overflow-hidden bg-[#082f25] text-white">
        <Image
          src="/main/academics.jpg"
          alt="Open Bible and study materials on a desk"
          fill
          priority
          sizes="100vw"
          className="absolute inset-0 -z-20 object-cover"
        />
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(0,42,35,0.96)_0%,rgba(0,52,39,0.82)_42%,rgba(0,52,39,0.28)_78%,rgba(0,52,39,0.12)_100%)]" />

        <div className="container mx-auto px-6 py-14 lg:px-20">
          <nav className="flex items-center gap-2 text-xs font-semibold text-white/76">
            <Link href="/" className="hover:text-[#f5b739]">
              Home
            </Link>
            <span>›</span>
            <span className="text-[#f5b739]">Academics</span>
          </nav>

          <h1 className="mt-5 font-serif text-4xl font-bold leading-tight tracking-normal sm:text-5xl">
            Academic Programs
          </h1>
          <div className="mt-5 h-1 w-20 bg-[#f5b739]" />
          <p className="mt-5 max-w-xl text-sm leading-6 text-white/88 sm:text-base">
            Equipping faithful leaders through biblically-centered education and
            practical training for ministry, chaplaincy, education, and
            community service.
          </p>
        </div>
      </section>

      <section className="bg-[#003f2b] px-6 py-6 text-white lg:px-20">
        <div className="container mx-auto grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {highlights.map((highlight) => {
            const Icon = highlight.icon;

            return (
              <article
                key={highlight.title}
                className="flex gap-4 border-white/16 lg:border-l lg:pl-8 lg:first:border-l-0 lg:first:pl-0"
              >
                <Icon
                  className="size-9 shrink-0 text-[#f5b739]"
                  strokeWidth={1.7}
                />
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

      <section className="px-6 py-14 lg:px-20">
        <div className="container mx-auto">
          <div className="text-center">
            <h2 className="font-serif text-3xl font-bold">
              Our Academic Programs
            </h2>
            <div className="mx-auto mt-3 h-1 w-16 bg-[#f5b739]" />
            <p className="mx-auto mt-5 max-w-3xl text-sm leading-6 text-[#31463f]">
              We offer a comprehensive range of programs designed to equip you
              for effective ministry and professional service.
            </p>
          </div>

          <div className="mt-10 grid gap-6 lg:grid-cols-4">
            {programGroups.map((group) => {
              const Icon = group.icon;

              return (
                <article
                  key={group.title}
                  className="flex rounded-md border border-[#0b3327]/10 bg-white shadow-[0_12px_30px_rgba(10,51,39,0.06)]"
                  style={{ borderTop: `4px solid ${group.accent}` }}
                >
                  <div className="flex w-full flex-col p-6 text-center">
                    <Icon
                      className="mx-auto size-12"
                      style={{ color: group.accent }}
                      strokeWidth={1.6}
                    />
                    <h3 className="mt-4 font-serif text-xl font-bold">
                      {group.title}
                    </h3>
                    <p className="mx-auto mt-2 min-h-12 text-xs text-[#31463f]">
                      {group.description}
                    </p>

                    <ol className="mt-2 flex-1 list-decimal space-y-2 border-t border-[#0b3327]/10 pl-5 pt-5 text-left text-xs text-[#1f3831]">
                      {group.programs.map((program) => (
                        <li key={program}>{program}</li>
                      ))}
                    </ol>

                    <Button
                      asChild
                      variant="outline"
                      className={`mx-auto mt-8 h-10 rounded-md bg-white px-6 text-xs font-bold shadow-none ${group.buttonClassName}`}
                    >
                      <Link href="/admissions">
                        View Details
                        <ArrowRight className="size-4" strokeWidth={2.5} />
                      </Link>
                    </Button>
                  </div>
                </article>
              );
            })}
          </div>

          <div className="mt-10 flex flex-col gap-6 rounded-md bg-[#f7f5ee] p-6 shadow-[0_12px_30px_rgba(10,51,39,0.06)] md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-5">
              <BookOpen
                className="size-16 shrink-0 text-[#0b4b39]"
                strokeWidth={1.5}
              />
              <div>
                <h2 className="font-serif text-xl font-bold">
                  Biblically-Centered. Academically-Excellent. Ministry-Focused.
                </h2>
                <p className="mt-2 max-w-3xl text-sm leading-6 text-[#31463f]">
                  Every program is infused with sound doctrine, academic rigor,
                  and practical training to prepare you for effective service in
                  the church, society, and the world.
                </p>
              </div>
            </div>

            <Button
              asChild
              className="h-11 w-fit shrink-0 rounded-md bg-[#003f2b] px-5 text-sm font-semibold text-white shadow-none hover:bg-[#07533a]"
            >
              <Link href="/admissions">
                Talk to Admissions
                <MessageSquareMore className="size-4" strokeWidth={2} />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Page;
