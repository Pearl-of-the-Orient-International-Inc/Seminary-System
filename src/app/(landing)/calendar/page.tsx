import Image from "next/image";
import Link from "next/link";
import {
  CalendarDays,
  ChevronDown,
  Clock,
  Download,
  FileDown,
  Mail,
  Phone,
  Printer,
  type LucideIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";

type EventType = "academic" | "registration" | "holiday" | "exam" | "special";

const typeStyles: Record<
  EventType,
  { label: string; dot: string; badge: string; iconBg: string }
> = {
  academic: {
    label: "Academic",
    dot: "bg-[#0b4b39]",
    badge: "bg-[#e8f3ee] text-[#0b4b39]",
    iconBg: "bg-[#e8f3ee] text-[#0b4b39]",
  },
  registration: {
    label: "Registration",
    dot: "bg-[#3b82f6]",
    badge: "bg-[#eaf1ff] text-[#1d4ed8]",
    iconBg: "bg-[#eaf1ff] text-[#1d4ed8]",
  },
  holiday: {
    label: "Break",
    dot: "bg-[#f5b739]",
    badge: "bg-[#fff5d9] text-[#9a6700]",
    iconBg: "bg-[#fff5d9] text-[#9a6700]",
  },
  exam: {
    label: "Examination",
    dot: "bg-[#8b4bb3]",
    badge: "bg-[#f3e8ff] text-[#7e22ce]",
    iconBg: "bg-[#f3e8ff] text-[#7e22ce]",
  },
  special: {
    label: "Special Event",
    dot: "bg-[#22c55e]",
    badge: "bg-[#eaf8ef] text-[#15803d]",
    iconBg: "bg-[#eaf8ef] text-[#15803d]",
  },
};

const months = [
  {
    name: "June 2026",
    offset: 0,
    days: 30,
    events: [
      { day: 2, type: "registration" as EventType },
      { day: 5, type: "academic" as EventType },
      { day: 12, type: "holiday" as EventType },
      { day: 24, type: "holiday" as EventType },
      { day: 30, type: "registration" as EventType },
    ],
  },
  {
    name: "July 2026",
    offset: 2,
    days: 31,
    events: [
      { day: 1, type: "registration" as EventType },
      { day: 14, type: "academic" as EventType },
      { day: 21, type: "special" as EventType },
      { day: 31, type: "registration" as EventType },
    ],
  },
  {
    name: "August 2026",
    offset: 4,
    days: 31,
    events: [
      { day: 4, type: "academic" as EventType },
      { day: 18, type: "special" as EventType },
      { day: 26, type: "exam" as EventType },
    ],
  },
  {
    name: "September 2026",
    offset: 0,
    days: 30,
    events: [
      { day: 8, type: "academic" as EventType },
      { day: 22, type: "exam" as EventType },
      { day: 26, type: "exam" as EventType },
    ],
  },
];

const importantDates: {
  date: string;
  activity: string;
  description: string;
  type: EventType;
}[] = [
  {
    date: "June 2, 2026 (Mon)",
    activity: "Start of Registration",
    description: "Online and on-site enrollment begins.",
    type: "registration",
  },
  {
    date: "June 12, 2026 (Thu)",
    activity: "National Holiday",
    description: "First day of the first semester.",
    type: "holiday",
  },
  {
    date: "June 30, 2026 (Mon)",
    activity: "Last Day of Late Registration",
    description: "Deadline for late enrollees.",
    type: "registration",
  },
  {
    date: "July 14, 2026 (Mon)",
    activity: "Add/Drop Subjects",
    description: "Deadline for adding or dropping subjects without grades.",
    type: "registration",
  },
  {
    date: "August 4, 2026 (Mon)",
    activity: "Midterm Examinations",
    description: "Midterm exams for all subjects.",
    type: "exam",
  },
  {
    date: "August 26, 2026 (Mon)",
    activity: "End of First Semester",
    description: "Last day of classes for the first semester.",
    type: "academic",
  },
  {
    date: "August 26 - Sept. 2, 2026",
    activity: "Semester Break",
    description: "No classes and work period.",
    type: "holiday",
  },
  {
    date: "September 8, 2026 (Mon)",
    activity: "Start of Second Semester",
    description: "First day of classes for the second semester.",
    type: "academic",
  },
  {
    date: "October 27 - Nov. 1, 2026",
    activity: "Pre-Final Examinations",
    description: "Pre-final exams for all subjects.",
    type: "exam",
  },
  {
    date: "November 17 - 22, 2026",
    activity: "Final Examinations",
    description: "Final exams for all subjects.",
    type: "exam",
  },
  {
    date: "November 24, 2026 (Mon)",
    activity: "End of Second Semester",
    description: "Submission of grades.",
    type: "academic",
  },
  {
    date: "November 25 - 29, 2026",
    activity: "Christmas Break",
    description: "No classes.",
    type: "holiday",
  },
];

const upcomingEvents = [
  {
    month: "JUN",
    day: "16",
    title: "Start of Classes",
    description: "First day of the first semester.",
    type: "academic" as EventType,
  },
  {
    month: "AUG",
    day: "11",
    title: "Midterm Examination",
    description: "Midterm exams for all subjects.",
    type: "exam" as EventType,
  },
  {
    month: "AUG",
    day: "26",
    title: "Semester Break",
    description: "No classes and administrative work period.",
    type: "holiday" as EventType,
  },
  {
    month: "SEP",
    day: "8",
    title: "Start of Second Semester",
    description: "First day of classes for the second semester.",
    type: "academic" as EventType,
  },
];

const categories: { title: string; description: string; type: EventType }[] = [
  {
    title: "Academic",
    description: "Classes, semesters, start and end dates",
    type: "academic",
  },
  {
    title: "Registration",
    description: "Enrollment, add/drop, deadlines",
    type: "registration",
  },
  {
    title: "Examination",
    description: "Exams, midterms, finals",
    type: "exam",
  },
  {
    title: "Break / Holiday",
    description: "Breaks, holidays, special non-working days",
    type: "holiday",
  },
  {
    title: "Event",
    description: "Conferences, seminars, special events",
    type: "special",
  },
];

const DayGrid = ({
  offset,
  days,
  events,
}: {
  offset: number;
  days: number;
  events: { day: number; type: EventType }[];
}) => {
  const cells = [
    ...Array.from({ length: offset }, () => null),
    ...Array.from({ length: days }, (_, index) => index + 1),
  ];

  return (
    <div className="grid grid-cols-7 gap-1 text-center text-[10px]">
      {["S", "M", "T", "W", "T", "F", "S"].map((day, index) => (
        <div key={`${day}-${index}`} className="font-bold text-[#0b4b39]/60">
          {day}
        </div>
      ))}
      {cells.map((day, index) => {
        const event = events.find((item) => item.day === day);

        return (
          <div
            key={`${day ?? "blank"}-${index}`}
            className="flex min-h-6 items-center justify-center"
          >
            {day ? (
              <span
                className={
                  event
                    ? `flex size-5 items-center justify-center rounded-full text-white ${typeStyles[event.type].dot}`
                    : "text-[#243b34]/70"
                }
              >
                {day}
              </span>
            ) : null}
          </div>
        );
      })}
    </div>
  );
};

const SidebarCard = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <section className="rounded-md bg-[#f8faf9] p-6 shadow-[0_12px_30px_rgba(10,51,39,0.06)] ring-1 ring-[#0b3327]/5">
    <h2 className="text-lg font-bold">{title}</h2>
    {children}
  </section>
);

const DownloadButton = ({
  icon: Icon,
  label,
}: {
  icon: LucideIcon;
  label: string;
}) => (
  <Button
    variant="outline"
    className="h-10 w-full justify-start rounded-md bg-white text-sm font-semibold text-[#0b3327] shadow-none"
  >
    <Icon className="size-4 text-[#0b4b39]" strokeWidth={1.7} />
    {label}
  </Button>
);

const Page = () => {
  return (
    <main className="bg-white text-[#0b3327]">
      <section className="relative isolate min-h-70 overflow-hidden bg-[#082f25] text-white">
        <Image
          src="https://images.pexels.com/photos/12052483/pexels-photo-12052483.jpeg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="absolute inset-0 -z-20 object-cover"
        />
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(0,42,35,0.98)_0%,rgba(0,52,39,0.9)_45%,rgba(0,52,39,0.62)_72%,rgba(0,52,39,0.72)_100%)]" />

        <div className="container mx-auto grid min-h-70 items-center gap-8 px-6 py-12 lg:grid-cols-[minmax(0,1fr)_420px] lg:px-20">
          <div>
          <nav className="flex items-center gap-2 text-xs font-semibold text-white/76">
            <Link href="/" className="hover:text-[#f5b739]">
              Home
            </Link>
            <span>›</span>
            <Link href="/academics" className="hover:text-[#f5b739]">
              Academics
            </Link>
            <span>›</span>
            <span className="text-[#f5b739]">Academic Calendar</span>
          </nav>

          <h1 className="mt-5 font-serif text-4xl font-bold leading-tight tracking-normal sm:text-5xl">
            Academic Calendar
          </h1>
          <div className="mt-5 h-1 w-20 bg-[#f5b739]" />
          <p className="mt-5 max-w-xl text-sm leading-6 text-white/88 sm:text-base">
            Plan your academic journey. View important dates, registration
            periods, breaks, and special events for the school year.
          </p>

          <div className="mt-7 flex w-fit items-center gap-3 rounded-md border border-[#f5b739]/40 bg-[#003f2b]/80 p-2">
            <Button className="h-9 rounded-md bg-[#003f2b] text-xs font-bold text-white shadow-none hover:bg-[#07533a]">
              <CalendarDays className="size-4 text-[#f5b739]" />
              Academic Year
            </Button>
            <Button
              variant="outline"
              className="h-9 rounded-md border-[#f5b739]/50 bg-transparent text-xs font-bold text-white shadow-none hover:bg-[#f5b739] hover:text-[#073722]"
            >
              2026 - 2027
              <ChevronDown className="size-4" />
            </Button>
          </div>
          </div>
        </div>
      </section>

      <section className="px-6 py-10 lg:px-20">
        <div className="container mx-auto grid gap-8 lg:grid-cols-[minmax(0,1fr)_310px]">
          <div>
            <section>
              <h2 className="text-2xl font-bold">At a Glance</h2>
              <div className="mt-3 h-1 w-16 bg-[#f5b739]" />

              <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                {months.map((month) => (
                  <article
                    key={month.name}
                    className="overflow-hidden rounded-md border border-[#0b3327]/10 bg-white shadow-[0_12px_30px_rgba(10,51,39,0.06)]"
                  >
                    <h3 className="bg-[#003f2b] py-2 text-center text-xs font-bold uppercase text-white">
                      {month.name}
                    </h3>
                    <div className="p-4">
                      <DayGrid
                        offset={month.offset}
                        days={month.days}
                        events={month.events}
                      />
                    </div>
                  </article>
                ))}
              </div>

              <div className="mt-5 flex flex-wrap gap-x-6 gap-y-3 text-xs text-[#31463f]">
                {categories.map((category) => (
                  <div key={category.title} className="flex items-center gap-2">
                    <span
                      className={`size-3 rounded-full ${typeStyles[category.type].dot}`}
                    />
                    {category.title}
                  </div>
                ))}
              </div>
            </section>

            <section className="mt-10">
              <h2 className="text-2xl font-bold">
                Important Dates and Activities
              </h2>
              <div className="mt-3 h-1 w-16 bg-[#f5b739]" />

              <div className="mt-5 overflow-hidden rounded-md border border-[#0b3327]/10 bg-white shadow-[0_12px_30px_rgba(10,51,39,0.06)]">
                <div className="grid grid-cols-[1fr_1fr_1.3fr_0.8fr] bg-[#003f2b] px-4 py-3 text-xs font-bold uppercase text-white">
                  <span>Date</span>
                  <span>Activity</span>
                  <span>Description</span>
                  <span>Type</span>
                </div>
                {importantDates.map((item) => (
                  <div
                    key={`${item.date}-${item.activity}`}
                    className="grid grid-cols-1 gap-2 border-b border-[#0b3327]/8 px-4 py-3 text-sm last:border-b-0 md:grid-cols-[1fr_1fr_1.3fr_0.8fr]"
                  >
                    <span className="font-semibold">{item.date}</span>
                    <span>{item.activity}</span>
                    <span className="text-[#31463f]">{item.description}</span>
                    <span>
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${typeStyles[item.type].badge}`}
                      >
                        {typeStyles[item.type].label}
                      </span>
                    </span>
                  </div>
                ))}
              </div>
              <p className="mt-3 text-xs text-[#31463f]/78">
                Please note that dates are subject to change. Official
                announcements will be posted on the Student Portal and via
                email.
              </p>
            </section>

            <section className="mt-10">
              <h2 className="text-2xl font-bold">Upcoming Events</h2>
              <div className="mt-3 h-1 w-16 bg-[#f5b739]" />
              <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                {upcomingEvents.map((event) => (
                  <article
                    key={event.title}
                    className="rounded-md border border-[#0b3327]/10 bg-white p-5 shadow-[0_12px_30px_rgba(10,51,39,0.06)]"
                  >
                    <div className="flex gap-4">
                      <div className="flex size-14 shrink-0 flex-col items-center justify-center rounded-md border border-[#0b3327]/15 bg-[#eef3f0] text-center">
                        <span className="text-[10px] font-bold leading-none text-[#0b4b39]">
                          {event.month}
                        </span>
                        <span className="mt-1 text-xl font-bold leading-none">
                          {event.day}
                        </span>
                      </div>
                      <div>
                        <h3 className="text-sm font-extrabold leading-tight">
                          {event.title}
                        </h3>
                        <p className="mt-2 text-xs leading-5 text-[#31463f]">
                          {event.description}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`mt-4 inline-flex rounded-full px-3 py-1 text-xs font-bold ${typeStyles[event.type].badge}`}
                    >
                      {typeStyles[event.type].label}
                    </span>
                  </article>
                ))}
              </div>
            </section>
          </div>

          <aside className="space-y-6">
            <SidebarCard title="Calendar Categories">
              <div className="mt-5 space-y-4">
                {categories.map((category) => (
                  <div key={category.title} className="flex gap-3">
                    <div
                      className={`flex size-9 shrink-0 items-center justify-center rounded-md ${typeStyles[category.type].iconBg}`}
                    >
                      <CalendarDays className="size-5" strokeWidth={1.6} />
                    </div>
                    <div>
                      <h3 className="text-sm font-extrabold">
                        {category.title}
                      </h3>
                      <p className="mt-1 text-xs leading-5 text-[#31463f]">
                        {category.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </SidebarCard>

            <SidebarCard title="Download Calendar">
              <p className="mt-3 text-sm leading-6 text-[#31463f]">
                Add the academic calendar to your device or print it for easy
                reference.
              </p>
              <div className="mt-5 space-y-3">
                <DownloadButton icon={Download} label="Download PDF" />
                <DownloadButton
                  icon={FileDown}
                  label="Download Google Calendar"
                />
                <DownloadButton icon={Printer} label="Print Calendar" />
              </div>
            </SidebarCard>

            <SidebarCard title="Need Help?">
              <p className="mt-3 text-sm leading-6 text-[#31463f]">
                For questions about the academic calendar, please contact the
                Registrar&apos;s Office.
              </p>
              <div className="mt-5 space-y-3 text-sm text-[#31463f]">
                <div className="flex items-center gap-3">
                  <Phone className="size-4 text-[#0b4b39]" />
                  <span>(043) 123-4567 loc. 102</span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="size-4 text-[#0b4b39]" />
                  <span>registrar@potsc.edu.ph</span>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="size-4 text-[#0b4b39]" />
                  <span>Mon - Fri: 8:00 AM - 5:00 PM</span>
                </div>
              </div>
            </SidebarCard>
          </aside>
        </div>
      </section>
    </main>
  );
};

export default Page;
