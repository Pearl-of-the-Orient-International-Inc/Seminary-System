import Image from "next/image";
import Link from "next/link";
import {
  Bell,
  BookOpen,
  Building2,
  CalendarDays,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  DollarSign,
  FileText,
  GraduationCap,
  Mail,
  Megaphone,
  Search,
  ShieldCheck,
  Users,
  type LucideIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";

const categories: {
  title: string;
  count: number;
  icon: LucideIcon;
  active?: boolean;
}[] = [
  { title: "All Announcements", count: 24, icon: Megaphone, active: true },
  { title: "Academics", count: 7, icon: GraduationCap },
  { title: "Admissions", count: 4, icon: FileText },
  { title: "Events", count: 5, icon: CalendarDays },
  { title: "Student Life", count: 4, icon: Users },
  { title: "Finance", count: 2, icon: DollarSign },
  { title: "Policies & Guidelines", count: 2, icon: ShieldCheck },
];

const announcements: {
  title: string;
  category: string;
  description: string;
  date: string;
  office: string;
  isNew?: boolean;
  icon: LucideIcon;
  tone: string;
}[] = [
  {
    title: "Final Exam Schedule - 2nd Semester AY 2023-2024",
    category: "Academics",
    description:
      "Please be informed of the final exam schedule for all programs. Make sure to review your subjects and exam dates.",
    date: "May 10, 2024",
    office: "Office of the Academic Affairs",
    isNew: true,
    icon: CalendarDays,
    tone: "bg-[#e8f3ee] text-[#0b4b39]",
  },
  {
    title: "Enrollment for 1st Semester AY 2024-2025 is Now Open",
    category: "Announcements",
    description:
      "Enrollment is now open for all returning and new students. Please log in to your portal to complete your enrollment.",
    date: "May 8, 2024",
    office: "Registrar's Office",
    isNew: true,
    icon: Megaphone,
    tone: "bg-[#fff5d9] text-[#9a6700]",
  },
  {
    title: "POTSC Foundation Day Celebration",
    category: "Events",
    description:
      "Join us as we celebrate another year of faith, service, and excellence. See you on May 24, 2024!",
    date: "May 6, 2024",
    office: "Student Affairs Office",
    icon: Building2,
    tone: "bg-[#eaf1ff] text-[#1d4ed8]",
  },
  {
    title: "Updated Student Handbook",
    category: "Policies & Guidelines",
    description:
      "Please be advised that the Student Handbook has been updated. Kindly review the changes regarding policies and guidelines.",
    date: "May 3, 2024",
    office: "Office of the Student Services",
    icon: BookOpen,
    tone: "bg-[#f3e8ff] text-[#7e22ce]",
  },
  {
    title: "Payment Reminder: 2nd Semester Tuition Fees",
    category: "Finance",
    description:
      "This is a friendly reminder to settle your tuition fees on or before May 20, 2024 to avoid any penalties.",
    date: "May 1, 2024",
    office: "Accounting Office",
    icon: DollarSign,
    tone: "bg-[#e8f3ee] text-[#0b4b39]",
  },
];

const Page = () => {
  return (
    <main className="bg-white text-[#0b3327]">
      <section className="relative isolate min-h-72 overflow-hidden bg-[#082f25] text-white">
        <Image
          src="https://images.pexels.com/photos/18524143/pexels-photo-18524143.jpeg"
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
            <span className="text-[#f5b739]">Announcements</span>
          </nav>

          <h1 className="mt-5 font-serif text-4xl font-bold leading-tight tracking-normal sm:text-5xl">
            Announcements
          </h1>
          <div className="mt-5 h-1 w-20 bg-[#f5b739]" />
          <p className="mt-5 max-w-xl text-sm leading-6 text-white/88 sm:text-base">
            Stay informed about the latest updates, news, and important notices
            from POTSC.
          </p>
        </div>
      </section>

      <section className="px-6 py-10 lg:px-20">
        <div className="container mx-auto grid gap-8 lg:grid-cols-[300px_minmax(0,1fr)]">
          <aside className="rounded-md bg-[#f8faf9] p-6 shadow-[0_12px_30px_rgba(10,51,39,0.06)] ring-1 ring-[#0b3327]/5">
            <section>
              <h2 className="font-bold">Categories</h2>
              <div className="mt-3 h-1 w-12 bg-[#f5b739]" />
              <div className="mt-5 space-y-2">
                {categories.map((category) => {
                  const Icon = category.icon;

                  return (
                    <Link
                      key={category.title}
                      href="/announcements"
                      className={`flex items-center justify-between rounded-md px-3 py-2 text-sm font-semibold ${
                        category.active
                          ? "bg-[#003f2b] text-white"
                          : "text-[#31463f] hover:bg-white"
                      }`}
                    >
                      <span className="flex items-center gap-3">
                        <Icon
                          className={`size-4 ${
                            category.active ? "text-[#f5b739]" : "text-[#0b4b39]"
                          }`}
                        />
                        {category.title}
                      </span>
                      <span>{category.count}</span>
                    </Link>
                  );
                })}
              </div>
            </section>

            <section className="mt-8 border-t border-[#0b3327]/10 pt-6">
              <h2 className="font-bold">Filters</h2>
              <div className="mt-3 h-1 w-12 bg-[#f5b739]" />
              <div className="mt-5 space-y-5">
                <label className="block">
                  <span className="text-sm font-bold">Date Range</span>
                  <div className="mt-2 flex h-10 items-center justify-between rounded-md border border-[#0b3327]/10 bg-white px-3 text-sm text-[#31463f]">
                    All Time
                    <ChevronDown className="size-4" />
                  </div>
                </label>
                <label className="block">
                  <span className="text-sm font-bold">Sort By</span>
                  <div className="mt-2 flex h-10 items-center justify-between rounded-md border border-[#0b3327]/10 bg-white px-3 text-sm text-[#31463f]">
                    Newest First
                    <ChevronDown className="size-4" />
                  </div>
                </label>
              </div>
            </section>

            <section className="mt-8 border-t border-[#0b3327]/10 pt-6">
              <h2 className="font-bold">Subscribe to Announcements</h2>
              <p className="mt-3 text-sm leading-6 text-[#31463f]">
                Get the latest announcements delivered straight to your email.
              </p>
              <Button className="mt-5 h-10 rounded-md bg-[#003f2b] px-5 text-sm font-semibold text-white shadow-none hover:bg-[#07533a]">
                <Mail className="size-4" />
                Subscribe
              </Button>
            </section>
          </aside>

          <section>
            <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex h-11 flex-1 items-center gap-3 rounded-md border border-[#0b3327]/10 bg-white px-4 shadow-[0_8px_20px_rgba(10,51,39,0.04)]">
                <span className="text-sm text-[#31463f]/65">
                  Search announcements...
                </span>
                <Search className="ml-auto size-4 text-[#0b4b39]" />
              </div>
              <Button
                variant="outline"
                className="h-11 rounded-md bg-white px-5 text-sm font-bold text-[#0b4b39] shadow-none"
              >
                <Bell className="size-4" />
                Mark all as read
              </Button>
            </div>

            <div className="overflow-hidden rounded-md border border-[#0b3327]/10 bg-white shadow-[0_12px_30px_rgba(10,51,39,0.06)]">
              {announcements.map((announcement) => {
                const Icon = announcement.icon;

                return (
                  <article
                    key={announcement.title}
                    className="grid gap-5 border-b border-[#0b3327]/10 px-6 py-6 last:border-b-0 sm:grid-cols-[72px_minmax(0,1fr)_80px]"
                  >
                    <div
                      className={`flex size-14 items-center justify-center rounded-full ${announcement.tone}`}
                    >
                      <Icon className="size-7" strokeWidth={1.6} />
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-3">
                        <span className="rounded-full bg-[#e8f3ee] px-2.5 py-1 text-[10px] font-extrabold uppercase text-[#0b4b39]">
                          {announcement.category}
                        </span>
                        {announcement.isNew ? (
                          <span className="rounded-full bg-[#d7f9b9] px-2.5 py-1 text-[10px] font-extrabold text-[#236400]">
                            New
                          </span>
                        ) : null}
                      </div>
                      <h2 className="mt-3 text-lg font-bold">
                        {announcement.title}
                      </h2>
                      <p className="mt-2 max-w-2xl text-sm leading-6 text-[#31463f]">
                        {announcement.description}
                      </p>
                      <p className="mt-4 text-xs text-[#31463f]/75">
                        {announcement.date} <span className="px-2">•</span>
                        {announcement.office}
                      </p>
                    </div>
                    <div className="flex items-center justify-end">
                      <ChevronRight className="size-5 text-[#0b4b39]" />
                    </div>
                  </article>
                );
              })}
            </div>

            <div className="mt-6 flex items-center justify-center gap-2">
              <Button
                variant="outline"
                size="icon"
                className="size-9 rounded-md bg-white"
                aria-label="Previous page"
              >
                <ChevronLeft className="size-4" />
              </Button>
              {[1, 2, 3].map((page) => (
                <Button
                  key={page}
                  variant={page === 1 ? "default" : "outline"}
                  size="icon"
                  className={
                    page === 1
                      ? "size-9 rounded-md bg-[#003f2b] text-white"
                      : "size-9 rounded-md bg-white"
                  }
                >
                  {page}
                </Button>
              ))}
              <span className="px-2 text-sm text-[#31463f]">...</span>
              <Button variant="outline" size="icon" className="size-9 rounded-md bg-white">
                5
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="size-9 rounded-md bg-white"
                aria-label="Next page"
              >
                <ChevronRight className="size-4" />
              </Button>
            </div>
          </section>
        </div>

        <div className="container mx-auto mt-10 rounded-md bg-[#f8faf9] p-6 shadow-[0_12px_30px_rgba(10,51,39,0.06)] ring-1 ring-[#0b3327]/5">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex gap-4">
              <div className="flex size-14 shrink-0 items-center justify-center rounded-full bg-[#003f2b] text-[#f5b739]">
                <Bell className="size-7" />
              </div>
              <div>
                <h2 className="text-xl font-bold">Never Miss an Update</h2>
                <p className="mt-2 text-sm leading-6 text-[#31463f]">
                  Subscribe to announcements and receive important updates
                  directly to your email.
                </p>
              </div>
            </div>
            <Button className="h-11 rounded-md bg-[#003f2b] px-5 text-sm font-semibold text-white shadow-none hover:bg-[#07533a]">
              <Mail className="size-4" />
              Subscribe Now
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Page;
