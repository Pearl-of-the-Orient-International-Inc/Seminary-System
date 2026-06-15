import Link from "next/link";

import { Button } from "@/components/ui/button";
import { ArrowRight, CalendarCheck, ChevronLeft, ChevronRight, ClipboardCheck, MonitorCheck, Quote, UserCog } from "lucide-react";

const facultyMembers = [
  {
    name: "Rev. Dr. Samuel P. Reyes",
    role: "President / Professor of Theology",
    degree: "Ph.D. Theology",
    experience: "30+ Years in Ministry",
    initials: "SR",
  },
  {
    name: "Dr. Maria Lourdes Tan",
    role: "Dean of Academics",
    degree: "Ph.D. Christian Education",
    experience: "20+ Years in Ministry",
    initials: "MT",
  },
  {
    name: "Rev. Dr. Daniel C. Mercado",
    role: "Professor of Pastoral Ministry",
    degree: "D.Min. Pastoral Theology",
    experience: "25+ Years in Ministry",
    initials: "DM",
  },
  {
    name: "Dr. Rachel Ann Baloy",
    role: "Professor of Counseling",
    degree: "Ph.D. Counseling",
    experience: "15+ Years in Ministry",
    initials: "RB",
  },
  {
    name: "Rev. Capt. Elmer Dela Cruz",
    role: "Director, Chaplaincy Programs",
    degree: "Th.M. Chaplaincy",
    experience: "20+ Years in Chaplaincy",
    initials: "EC",
  },
];

const quickAccessLinks = [
  {
    title: "LMS Login",
    description: "Access your courses",
    icon: MonitorCheck,
  },
  {
    title: "Grades & Records",
    description: "View your grades",
    icon: ClipboardCheck,
  },
  {
    title: "Attendance",
    description: "Check your attendance",
    icon: CalendarCheck,
  },
  {
    title: "Account Dashboard",
    description: "Update your profile",
    icon: UserCog,
  },
];

const upcomingEvents = [
  {
    month: "MAY",
    day: "20",
    title: "Enrollment Period",
    date: "May 20 - June 30, 2025",
  },
  {
    month: "JUN",
    day: "05",
    title: "New Student Orientation",
    date: "June 5, 2025",
  },
  {
    month: "JUL",
    day: "14",
    title: "Start of Classes",
    date: "July 14, 2025",
  },
  {
    month: "SEP",
    day: "22",
    title: "Midterm Examinations",
    date: "September 22 - 26, 2025",
  },
];

const announcements = [
  {
    title: "Enrollment is now open for SY 2025-2026",
    description: "Apply now and be part of our growing community.",
    date: "May 15, 2025",
  },
  {
    title: "Scholarship Program Available",
    description: "Merit-based and need-based scholarships are now available.",
    date: "May 10, 2025",
  },
  {
    title: "Graduation Ceremony 2025",
    description: "Join us as we celebrate our graduates.",
    date: "April 26, 2025",
  },
];

const Faculty = () => {
  return (
    <section className="bg-white px-6 py-16 text-[#0b3327] lg:px-20">
      <div className="container mx-auto">
        <div className="flex items-center justify-between gap-6">
          <div>
            <h2 className="text-2xl font-bold tracking-normal sm:text-3xl">
              Meet Our Faculty & Instructors
            </h2>
            <div className="mt-3 h-1 w-24 bg-[#f5b739]" />
          </div>

          <Link
            href="/faculty"
            className="hidden items-center gap-2 text-sm font-bold text-[#0b4b39] transition-colors hover:text-[#c48a17] sm:flex"
          >
            View All Faculty
            <ArrowRight className="size-4" strokeWidth={2.5} />
          </Link>
        </div>

        <div className="relative mt-8">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label="Previous faculty"
            className="absolute -left-5 top-24 z-10 hidden size-10 rounded-full border border-[#0b3327]/10 bg-white text-[#0b4b39] shadow-md hover:bg-[#f5b739] hover:text-[#073722] lg:inline-flex"
          >
            <ChevronLeft className="size-5" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label="Next faculty"
            className="absolute -right-5 top-24 z-10 hidden size-10 rounded-full border border-[#0b3327]/10 bg-white text-[#0b4b39] shadow-md hover:bg-[#f5b739] hover:text-[#073722] lg:inline-flex"
          >
            <ChevronRight className="size-5" />
          </Button>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {facultyMembers.map((member) => (
              <article
                key={member.name}
                className="overflow-hidden rounded-md border border-[#0b3327]/10 bg-white shadow-[0_10px_26px_rgba(10,51,39,0.08)]"
              >
                <div className="flex h-36 items-end justify-center bg-[linear-gradient(135deg,#eee8dd,#ffffff_48%,#d6cdc0)] px-6 pt-5">
                  <div className="flex size-28 items-center justify-center rounded-t-full bg-[linear-gradient(160deg,#123d31,#0b4b39)] text-3xl font-bold text-[#f5b739] shadow-[0_12px_28px_rgba(10,51,39,0.22)]">
                    {member.initials}
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-sm font-extrabold leading-tight">
                    {member.name}
                  </h3>
                  <p className="mt-2 text-xs font-bold leading-5 text-[#273f37]">
                    {member.role}
                  </p>
                  <p className="mt-2 text-xs leading-5 text-[#31463f]">
                    {member.degree}
                  </p>
                  <p className="text-xs leading-5 text-[#31463f]">
                    {member.experience}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className="mt-10 grid gap-5 lg:grid-cols-[1fr_1fr_1.08fr_0.95fr]">
          <div className="rounded-md border border-[#0b3327]/10 bg-white p-6 shadow-[0_12px_30px_rgba(10,51,39,0.06)]">
            <h2 className="text-xl font-bold tracking-normal">
              Student Quick Access
            </h2>
            <div className="mt-6 space-y-5">
              {quickAccessLinks.map((item) => {
                const Icon = item.icon;

                return (
                  <Link
                    key={item.title}
                    href="/student/dashboard"
                    className="flex items-center gap-4"
                  >
                    <div className="flex size-9 shrink-0 items-center justify-center rounded-md border border-[#e0b34b]/55 bg-white text-[#0b4b39]">
                      <Icon className="size-5" strokeWidth={1.6} />
                    </div>
                    <div>
                      <h3 className="text-sm font-extrabold leading-none">
                        {item.title}
                      </h3>
                      <p className="mt-2 text-xs text-[#31463f]">
                        {item.description}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
            <Button
              asChild
              className="mt-7 h-11 rounded-md bg-[#003f2b] px-5 text-sm font-semibold text-white shadow-none hover:bg-[#07533a]"
            >
              <Link href="/student/dashboard">
                Go to Student Portal
                <ArrowRight className="size-4" strokeWidth={2.5} />
              </Link>
            </Button>
          </div>

          <div className="rounded-md border border-[#0b3327]/10 bg-white p-6 shadow-[0_12px_30px_rgba(10,51,39,0.06)]">
            <h2 className="text-xl font-bold tracking-normal">
              Upcoming Events
            </h2>
            <div className="mt-6 space-y-5">
              {upcomingEvents.map((event) => (
                <div key={event.title} className="flex gap-4">
                  <div className="flex size-12 shrink-0 flex-col items-center justify-center rounded-md border border-[#0b3327]/15 bg-[#eef3f0] text-center">
                    <span className="text-[10px] font-bold leading-none text-[#0b4b39]">
                      {event.month}
                    </span>
                    <span className="mt-1 text-lg font-bold leading-none">
                      {event.day}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-sm font-extrabold leading-tight">
                      {event.title}
                    </h3>
                    <p className="mt-1 text-xs text-[#31463f]">{event.date}</p>
                  </div>
                </div>
              ))}
            </div>
            <Link
              href="/calendar"
              className="mt-7 flex items-center gap-2 text-sm font-bold text-[#0b4b39] hover:text-[#c48a17]"
            >
              View Academic Calendar
              <ArrowRight className="size-4" strokeWidth={2.5} />
            </Link>
          </div>

          <div className="rounded-md border border-[#0b3327]/10 bg-white p-6 shadow-[0_12px_30px_rgba(10,51,39,0.06)]">
            <h2 className="text-xl font-bold tracking-normal">
              Latest Announcements
            </h2>
            <div className="mt-6 space-y-6">
              {announcements.map((announcement) => (
                <article
                  key={announcement.title}
                  className="border-l-2 border-[#f5b739] pl-4"
                >
                  <h3 className="text-sm font-extrabold leading-tight">
                    {announcement.title}
                  </h3>
                  <p className="mt-2 text-xs leading-5 text-[#31463f]">
                    {announcement.description}
                  </p>
                  <p className="mt-2 text-xs text-[#586c65]">
                    {announcement.date}
                  </p>
                </article>
              ))}
            </div>
            <Link
              href="/announcements"
              className="mt-7 flex items-center gap-2 text-sm font-bold text-[#0b4b39] hover:text-[#c48a17]"
            >
              View All Announcements
              <ArrowRight className="size-4" strokeWidth={2.5} />
            </Link>
          </div>

          <div className="rounded-md bg-[#003f2b] p-7 text-white shadow-[0_16px_36px_rgba(10,51,39,0.22)]">
            <h2 className="flex items-center gap-3 text-xl font-bold tracking-normal">
              <Quote className="size-8 text-[#f5b739]" fill="currentColor" />
              What Our Alumni Say
            </h2>
            <p className="mt-8 text-base font-semibold leading-8 text-white/90">
              POTSC shaped my spiritual foundation and equipped me for the
              calling God has placed in my life.
            </p>
            <div className="mt-10 flex items-center gap-4">
              <div className="flex size-16 shrink-0 items-center justify-center rounded-full border-2 border-[#f5b739] bg-white text-lg font-bold text-[#0b4b39]">
                MV
              </div>
              <div>
                <h3 className="text-sm font-extrabold">
                  Rev. Mark Anthony Villanueva
                </h3>
                <p className="mt-1 text-xs leading-5 text-white/78">
                  M.Div. Graduate
                  <br />
                  Senior Pastor, Victory Church
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Faculty;
