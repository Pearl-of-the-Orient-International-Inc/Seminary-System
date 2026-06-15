import Image from "next/image";
import Link from "next/link";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Download,
  Eye,
  FileText,
  FolderOpen,
  Mail,
  Printer,
  Share2,
  UserRound,
  type LucideIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";

const scheduleRows = [
  {
    date: "May 20, 2024 (Mon)",
    time: "8:00 AM - 10:00 AM",
    subject: "Biblical Studies I",
    program: "BTh",
    room: "Room 201",
  },
  {
    date: "May 20, 2024 (Mon)",
    time: "1:00 PM - 3:00 PM",
    subject: "Church History",
    program: "BTh",
    room: "Room 201",
  },
  {
    date: "May 21, 2024 (Tue)",
    time: "8:00 AM - 10:00 AM",
    subject: "Christian Ethics",
    program: "BTh",
    room: "Room 202",
  },
  {
    date: "May 21, 2024 (Tue)",
    time: "1:00 PM - 3:00 PM",
    subject: "Hermeneutics",
    program: "BTh",
    room: "Room 202",
  },
  {
    date: "May 22, 2024 (Wed)",
    time: "8:00 AM - 10:00 AM",
    subject: "Greek I",
    program: "BTh",
    room: "Room 203",
  },
  {
    date: "May 22, 2024 (Wed)",
    time: "1:00 PM - 3:00 PM",
    subject: "Pastoral Ministry",
    program: "BTh",
    room: "Room 203",
  },
];

const announcementDetails: {
  label: string;
  value: string;
  sublabel: string;
  icon: LucideIcon;
}[] = [
  {
    label: "Posted Date",
    value: "May 10, 2024",
    sublabel: "Posted Date",
    icon: CalendarDays,
  },
  {
    label: "Posted By",
    value: "Office of the Academic Affairs",
    sublabel: "Posted By",
    icon: UserRound,
  },
  {
    label: "Category",
    value: "Academics",
    sublabel: "Category",
    icon: FolderOpen,
  },
  {
    label: "Views",
    value: "1,248",
    sublabel: "Views",
    icon: Eye,
  },
];

const relatedAnnouncements = [
  {
    title: "Updated Class Schedule for 2nd Semester",
    category: "Academics",
    date: "April 30, 2024",
    image: "/main/academics.jpg",
  },
  {
    title: "Midterm Grades Now Available",
    category: "Academics",
    date: "April 15, 2024",
    image: "/main/about.jpg",
  },
  {
    title: "Application for AY 2024-2025 is Ongoing",
    category: "Admissions",
    date: "April 10, 2024",
    image: "/main/hero.jpg",
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
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(0,42,35,0.98)_0%,rgba(0,52,39,0.86)_48%,rgba(0,52,39,0.42)_78%,rgba(0,52,39,0.28)_100%)]" />

        <div className="container mx-auto px-6 py-14 lg:px-20">
          <nav className="flex flex-wrap items-center gap-2 text-xs font-semibold text-white/76">
            <Link href="/" className="hover:text-[#f5b739]">
              Home
            </Link>
            <span>›</span>
            <Link href="/announcements" className="hover:text-[#f5b739]">
              Announcements
            </Link>
            <span>›</span>
            <span className="text-[#f5b739]">
              Final Exam Schedule - 2nd Semester AY 2023-2024
            </span>
          </nav>

          <h1 className="mt-5 font-serif text-4xl font-bold leading-tight tracking-normal sm:text-5xl">
            Announcement Details
          </h1>
          <div className="mt-5 h-1 w-20 bg-[#f5b739]" />
          <p className="mt-5 max-w-xl text-sm leading-6 text-white/88 sm:text-base">
            Stay informed about the latest updates, news, and important notices
            from POTSC.
          </p>
        </div>
      </section>

      <section className="px-6 py-10 lg:px-20">
        <div className="container mx-auto grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
          <article className="rounded-md border border-[#0b3327]/10 bg-white p-6 shadow-[0_12px_30px_rgba(10,51,39,0.06)] sm:p-8">
            <span className="rounded-full bg-[#e8f3ee] px-2.5 py-1 text-[10px] font-extrabold uppercase text-[#0b4b39]">
              Academics
            </span>
            <div className="mt-4 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div>
                <h2 className="font-serif text-2xl font-bold leading-tight text-[#0b3327] sm:text-3xl">
                  Final Exam Schedule - 2nd Semester AY 2023-2024
                </h2>
                <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-medium text-[#31463f]/78">
                  <span className="inline-flex items-center gap-2">
                    <CalendarDays className="size-4 text-[#0b4b39]" />
                    May 10, 2024
                  </span>
                  <span>Office of the Academic Affairs</span>
                  <span className="inline-flex items-center gap-2">
                    <Eye className="size-4 text-[#0b4b39]" />
                    1,248 Views
                  </span>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  className="h-9 rounded-md px-3 text-xs font-semibold text-[#31463f] hover:bg-[#f8faf9]"
                >
                  <Share2 className="size-4" />
                  Share
                </Button>
                <Button
                  variant="ghost"
                  className="h-9 rounded-md px-3 text-xs font-semibold text-[#31463f] hover:bg-[#f8faf9]"
                >
                  <Printer className="size-4" />
                  Print
                </Button>
              </div>
            </div>

            <div className="mt-8 space-y-5 text-sm leading-7 text-[#31463f]">
              <p>Dear Students,</p>
              <p>
                Please be informed of the final exam schedule for all programs
                for the 2nd Semester Academic Year 2023-2024.
              </p>
              <p>
                Make sure to review your subjects, dates, times, and room
                assignments. Please arrive on time and bring the necessary
                materials.
              </p>
            </div>

            <section className="mt-8">
              <h3 className="font-bold">Schedule Overview</h3>
              <div className="mt-3 overflow-x-auto rounded-md border border-[#0b3327]/10">
                <table className="w-full min-w-180 border-collapse text-left text-sm">
                  <thead className="bg-[#003f2b] text-white">
                    <tr>
                      {["Date", "Time", "Course/Subject", "Program", "Room"].map(
                        (heading) => (
                          <th key={heading} className="px-4 py-3 font-bold">
                            {heading}
                          </th>
                        )
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {scheduleRows.map((row) => (
                      <tr
                        key={`${row.date}-${row.time}`}
                        className="border-b border-[#0b3327]/10 last:border-b-0"
                      >
                        <td className="px-4 py-3 text-[#31463f]">{row.date}</td>
                        <td className="px-4 py-3 text-[#31463f]">{row.time}</td>
                        <td className="px-4 py-3 font-semibold">
                          {row.subject}
                        </td>
                        <td className="px-4 py-3 text-[#31463f]">
                          {row.program}
                        </td>
                        <td className="px-4 py-3 text-[#31463f]">{row.room}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            <section className="mt-8">
              <h3 className="font-bold">Reminders:</h3>
              <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm leading-7 text-[#31463f]">
                <li>No exam will be given outside the official schedule.</li>
                <li>Bring your student ID and other required materials.</li>
                <li>
                  Follow the dress code and exam room policies at all times.
                </li>
                <li>
                  For any conflicts, report to the Office of Academic Affairs
                  immediately.
                </li>
              </ul>
            </section>

            <div className="mt-8 space-y-1 text-sm leading-7 text-[#31463f]">
              <p>Thank you and may God bless your studies!</p>
              <p>Office of the Academic Affairs</p>
              <p>Pearl of The Orient Theological Seminary and Colleges</p>
            </div>

            <section className="mt-8 rounded-md border border-[#0b3327]/10 p-4">
              <h3 className="flex items-center gap-2 font-bold">
                <FileText className="size-4 text-[#0b4b39]" />
                Attachments
              </h3>
              <div className="mt-4 flex items-center justify-between rounded-md bg-[#f8faf9] px-4 py-3">
                <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-md bg-white text-[#0b4b39] ring-1 ring-[#0b3327]/10">
                    <FileText className="size-5" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold">
                      Final Exam Schedule - 2nd Semester AY 2023-2024.pdf
                    </p>
                    <p className="text-xs text-[#31463f]/70">2.4 MB</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-9 rounded-md text-[#0b4b39] hover:bg-white"
                  aria-label="Download attachment"
                >
                  <Download className="size-4" />
                </Button>
              </div>
            </section>

            <nav className="mt-6 grid gap-3 rounded-md bg-[#f8faf9] p-3 sm:grid-cols-2">
              <Link
                href="/announcements/enrollment-for-1st-semester-ay-2024-2025-is-now-open"
                className="flex items-center gap-3 rounded-md bg-white px-4 py-3 text-sm ring-1 ring-[#0b3327]/8 transition hover:bg-[#fffaf0]"
              >
                <ChevronLeft className="size-4 text-[#0b4b39]" />
                <span>
                  <span className="block text-xs font-semibold text-[#31463f]/65">
                    Previous Announcement
                  </span>
                  <span className="font-bold">
                    Enrollment for 1st Semester AY 2024-2025 is Now Open
                  </span>
                </span>
              </Link>
              <Link
                href="/announcements/potsc-foundation-day-celebration"
                className="flex items-center justify-between gap-3 rounded-md bg-white px-4 py-3 text-right text-sm ring-1 ring-[#0b3327]/8 transition hover:bg-[#fffaf0]"
              >
                <span>
                  <span className="block text-xs font-semibold text-[#31463f]/65">
                    Next Announcement
                  </span>
                  <span className="font-bold">POTSC Foundation Day Celebration</span>
                </span>
                <ChevronRight className="size-4 text-[#0b4b39]" />
              </Link>
            </nav>
          </article>

          <aside className="space-y-6">
            <section className="rounded-md border border-[#0b3327]/10 bg-white p-6 shadow-[0_12px_30px_rgba(10,51,39,0.06)]">
              <h2 className="font-serif text-lg font-bold">
                Announcement Details
              </h2>
              <div className="mt-3 h-1 w-12 bg-[#f5b739]" />
              <div className="mt-5 space-y-5">
                {announcementDetails.map((item) => {
                  const Icon = item.icon;

                  return (
                    <div key={item.label} className="flex gap-3">
                      <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[#e8f3ee] text-[#0b4b39]">
                        <Icon className="size-4" />
                      </div>
                      <div>
                        <p className="text-sm font-bold">{item.value}</p>
                        <p className="text-xs text-[#31463f]/70">
                          {item.sublabel}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            <section className="rounded-md border border-[#0b3327]/10 bg-white p-6 shadow-[0_12px_30px_rgba(10,51,39,0.06)]">
              <h2 className="font-serif text-lg font-bold">
                Related Announcements
              </h2>
              <div className="mt-3 h-1 w-12 bg-[#f5b739]" />
              <div className="mt-5 space-y-4">
                {relatedAnnouncements.map((item) => (
                  <Link
                    key={item.title}
                    href="/announcements/final-exam-schedule-2nd-semester-ay-2023-2024"
                    className="grid grid-cols-[78px_minmax(0,1fr)] gap-3 rounded-md p-2 transition hover:bg-[#f8faf9]"
                  >
                    <Image
                      src={item.image}
                      alt=""
                      width={78}
                      height={58}
                      className="h-14.5 w-19.5 rounded-md object-cover"
                    />
                    <span>
                      <span className="rounded-full bg-[#e8f3ee] px-2 py-0.5 text-[9px] font-extrabold uppercase text-[#0b4b39]">
                        {item.category}
                      </span>
                      <span className="mt-1.5 block text-sm font-bold leading-5">
                        {item.title}
                      </span>
                      <span className="mt-1 block text-xs text-[#31463f]/70">
                        {item.date}
                      </span>
                    </span>
                  </Link>
                ))}
              </div>
              <Button
                asChild
                variant="outline"
                className="mt-5 h-10 w-full rounded-md bg-white text-sm font-bold text-[#0b4b39]"
              >
                <Link href="/announcements">
                  View All Announcements
                  <ChevronRight className="size-4" />
                </Link>
              </Button>
            </section>
          </aside>
        </div>

        <div className="container mx-auto mt-10 rounded-md bg-[#f8faf9] p-6 shadow-[0_12px_30px_rgba(10,51,39,0.06)] ring-1 ring-[#0b3327]/5">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex gap-4">
              <div className="flex size-14 shrink-0 items-center justify-center rounded-full bg-[#003f2b] text-[#f5b739]">
                <Mail className="size-7" />
              </div>
              <div>
                <h2 className="text-xl font-bold">
                  Never Miss an Important Update
                </h2>
                <p className="mt-2 text-sm leading-6 text-[#31463f]">
                  Subscribe to announcements and receive important updates
                  directly to your email.
                </p>
              </div>
            </div>
            <form className="grid gap-3 sm:grid-cols-[minmax(260px,420px)_auto]">
              <label className="sr-only" htmlFor="announcement-email">
                Email address
              </label>
              <input
                id="announcement-email"
                type="email"
                placeholder="Enter your email address"
                className="h-11 rounded-md border border-[#0b3327]/10 bg-white px-4 text-sm outline-none ring-[#f5b739]/30 transition placeholder:text-[#31463f]/55 focus:ring-4"
              />
              <Button className="h-11 rounded-md bg-[#003f2b] px-6 text-sm font-semibold text-white shadow-none hover:bg-[#07533a]">
                Subscribe
              </Button>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Page;
