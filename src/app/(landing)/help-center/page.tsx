import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Bell,
  BookOpen,
  ChevronDown,
  Compass,
  FileText,
  GraduationCap,
  Grid3X3,
  MessageSquare,
  Monitor,
  Phone,
  Search,
  ShieldCheck,
  UserRound,
  Users,
  Wallet,
  type LucideIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";

const popularSearches = [
  "Reset Password",
  "Enrollment",
  "Grades",
  "Payment",
  "Calendar",
];

const topics: {
  title: string;
  description: string;
  articles: number;
  icon: LucideIcon;
}[] = [
  {
    title: "Getting Started",
    description: "New to the portal? Learn the basics and set up your account.",
    articles: 5,
    icon: Compass,
  },
  {
    title: "Account & Profile",
    description: "Manage your account settings, profile, and security.",
    articles: 8,
    icon: UserRound,
  },
  {
    title: "Academics",
    description: "Courses, grades, schedules, and academic records.",
    articles: 14,
    icon: GraduationCap,
  },
  {
    title: "Finances",
    description: "Payments, billing, financial aid, and transactions.",
    articles: 10,
    icon: Wallet,
  },
  {
    title: "Admissions",
    description: "Application status, enrollment steps, and requirements.",
    articles: 6,
    icon: FileText,
  },
  {
    title: "Student Life",
    description: "Campus activities, events, organizations, and services.",
    articles: 7,
    icon: Users,
  },
  {
    title: "Resources",
    description: "Library, research tools, downloads, and academic resources.",
    articles: 9,
    icon: BookOpen,
  },
  {
    title: "Technical Support",
    description: "Technical issues, troubleshooting, and system requirements.",
    articles: 6,
    icon: Monitor,
  },
  {
    title: "Policies & Guidelines",
    description: "Institutional policies, guidelines, and important information.",
    articles: 8,
    icon: ShieldCheck,
  },
  {
    title: "Portal Features",
    description: "Learn about all the features available in the portal.",
    articles: 11,
    icon: Grid3X3,
  },
];

const faqs = [
  "How do I reset my password?",
  "How can I view my grades?",
  "How do I enroll in classes?",
  "What payment methods are accepted?",
  "Where can I find the academic calendar?",
];

const supportOptions = [
  {
    title: "Contact Support",
    description: "Our support team is here to help you.",
    action: "Submit a Ticket",
    icon: MessageSquare,
  },
  {
    title: "Live Chat",
    description: "Chat with our support team during office hours.",
    action: "Start Live Chat",
    icon: Phone,
  },
  {
    title: "User Guides",
    description: "Step-by-step guides and walkthroughs.",
    action: "View User Guides",
    icon: BookOpen,
  },
];

const Page = () => {
  return (
    <main className="bg-white text-[#0b3327]">
      <section className="relative isolate overflow-hidden bg-[#082f25] text-white">
        <Image
          src="https://images.pexels.com/photos/8204367/pexels-photo-8204367.jpeg"
          alt="Pearl of The Orient campus"
          fill
          priority
          sizes="100vw"
          className="absolute inset-0 -z-20 object-cover"
        />
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(0,42,35,0.98)_0%,rgba(0,52,39,0.84)_48%,rgba(0,52,39,0.36)_78%,rgba(0,52,39,0.26)_100%)]" />

        <div className="container mx-auto px-6 py-14 lg:px-20">
          <nav className="flex items-center gap-2 text-xs font-semibold text-white/76">
            <Link href="/" className="hover:text-[#f5b739]">
              Home
            </Link>
            <span>›</span>
            <span className="text-[#f5b739]">Help Center</span>
          </nav>

          <h1 className="mt-5 font-serif text-4xl font-bold leading-tight tracking-normal sm:text-5xl">
            Help Center
          </h1>
          <div className="mt-5 h-1 w-20 bg-[#f5b739]" />
          <p className="mt-5 max-w-xl text-sm leading-6 text-white/88 sm:text-base">
            Find answers to frequently asked questions, guides, and resources
            to help you get the most out of your student portal.
          </p>

          <div className="mt-8 max-w-5xl">
            <div className="flex items-center gap-3 rounded-md bg-white p-2 shadow-[0_12px_30px_rgba(0,0,0,0.24)]">
              <Search className="ml-3 size-5 shrink-0 text-[#0b4b39]" />
              <div className="flex-1 px-1 text-sm text-[#31463f]/70">
                Search for help articles, topics, or keywords...
              </div>
              <Button className="h-10 rounded-md bg-[#003f2b] px-7 text-sm font-semibold text-white shadow-none hover:bg-[#07533a]">
                Search
              </Button>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-white/86">
              <span>Popular searches:</span>
              {popularSearches.map((term) => (
                <Link
                  key={term}
                  href="/help-center"
                  className="rounded-md border border-white/35 px-3 py-1.5 font-semibold hover:border-[#f5b739] hover:text-[#f5b739]"
                >
                  {term}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 py-10 lg:px-20">
        <div className="container mx-auto">
          <section>
            <h2 className="text-2xl font-bold">Browse Help Topics</h2>
            <div className="mt-3 h-1 w-16 bg-[#f5b739]" />
            <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
              {topics.map((topic) => {
                const Icon = topic.icon;

                return (
                  <Link
                    key={topic.title}
                    href="/help-center"
                    className="group rounded-md border border-[#0b3327]/10 bg-white p-6 text-center shadow-[0_12px_30px_rgba(10,51,39,0.06)] transition-all hover:-translate-y-1 hover:border-[#f5b739]"
                  >
                    <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-[#eef5f2] text-[#0b4b39] transition-colors group-hover:bg-[#003f2b] group-hover:text-[#f5b739]">
                      <Icon className="size-7" strokeWidth={1.6} />
                    </div>
                    <h3 className="mt-4 font-bold">{topic.title}</h3>
                    <p className="mt-3 min-h-12 text-xs leading-5 text-[#31463f]">
                      {topic.description}
                    </p>
                    <div className="mt-5 flex items-center justify-center gap-3 text-xs font-bold text-[#0b4b39]">
                      {topic.articles} Articles
                      <ArrowRight className="size-3 transition-transform group-hover:translate-x-1" />
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>

          <div className="mt-12 grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
            <section>
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold">
                    Frequently Asked Questions
                  </h2>
                  <div className="mt-3 h-1 w-16 bg-[#f5b739]" />
                </div>
              </div>

              <div className="mt-6 overflow-hidden rounded-md border border-[#0b3327]/10 bg-white shadow-[0_12px_30px_rgba(10,51,39,0.06)]">
                {faqs.map((faq) => (
                  <button
                    key={faq}
                    className="flex w-full items-center justify-between border-b border-[#0b3327]/10 px-5 py-4 text-left text-sm font-semibold last:border-b-0"
                  >
                    {faq}
                    <ChevronDown className="size-4 text-[#0b4b39]" />
                  </button>
                ))}
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold">Need More Help?</h2>
              <div className="mt-3 h-1 w-16 bg-[#f5b739]" />
              <div className="mt-6 rounded-md bg-[#f8faf9] p-6 shadow-[0_12px_30px_rgba(10,51,39,0.06)] ring-1 ring-[#0b3327]/5">
                <div className="space-y-6">
                  {supportOptions.map((option) => {
                    const Icon = option.icon;

                    return (
                      <article
                        key={option.title}
                        className="flex gap-4 border-b border-[#0b3327]/10 pb-6 last:border-b-0 last:pb-0"
                      >
                        <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-[#eef5f2] text-[#0b4b39]">
                          <Icon className="size-6" strokeWidth={1.6} />
                        </div>
                        <div>
                          <h3 className="font-bold">{option.title}</h3>
                          <p className="mt-1 text-sm leading-6 text-[#31463f]">
                            {option.description}
                          </p>
                          <Link
                            href="/contact"
                            className="mt-2 flex items-center gap-2 text-sm font-bold text-[#0b4b39] hover:text-[#c48a17]"
                          >
                            {option.action}
                            <ArrowRight className="size-4" />
                          </Link>
                        </div>
                      </article>
                    );
                  })}
                </div>
              </div>
            </section>
          </div>

          <section className="mt-12 rounded-md bg-[#f8faf9] p-6 shadow-[0_12px_30px_rgba(10,51,39,0.06)] ring-1 ring-[#0b3327]/5">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex gap-4">
                <div className="flex size-14 shrink-0 items-center justify-center rounded-full bg-[#003f2b] text-[#f5b739]">
                  <Bell className="size-7" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">Stay Updated</h2>
                  <p className="mt-2 max-w-2xl text-sm leading-6 text-[#31463f]">
                    Check announcements for system updates, maintenance
                    schedules, and important notifications.
                  </p>
                </div>
              </div>
              <Button
                asChild
                variant="outline"
                className="h-10 w-fit rounded-md bg-white px-5 text-sm font-bold text-[#0b4b39] shadow-none"
              >
                <Link href="/announcements">
                  View Announcements
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
            </div>
          </section>
        </div>
      </section>
    </main>
  );
};

export default Page;
