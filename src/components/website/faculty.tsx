/* eslint-disable @next/next/no-img-element */
"use client";

import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { usePublicSeminaryInstructorsQuery } from "@/features/seminary/seminary.hooks";
import {
  ArrowRight,
  CalendarCheck,
  ClipboardCheck,
  MonitorCheck,
  Quote,
  UserCog,
} from "lucide-react";

const initials = (name: string) =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

const labelFor = (value: string) =>
  value
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (character) => character.toUpperCase());

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
  const instructorsQuery = usePublicSeminaryInstructorsQuery();
  const facultyMembers = instructorsQuery.data?.data ?? [];

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

        <Carousel
          opts={{
            align: "start",
            loop: facultyMembers.length > 3,
            slidesToScroll: 1,
          }}
          className="relative mt-8 px-1 md:px-14"
        >
          <CarouselContent>
            {facultyMembers.map((member) => (
              <CarouselItem
                key={member.id}
                className="basis-[88%] sm:basis-1/2 lg:basis-1/3"
              >
                <article className="min-w-0">
                  <div className="overflow-hidden rounded-lg bg-[#ececec]">
                    <div className="flex h-120 items-center justify-center bg-[linear-gradient(135deg,#e5e7eb,#f8fafc_48%,#d1d5db)]">
                      {member.formalPhotoUrl ? (
                        <img
                          src={member.formalPhotoUrl}
                          alt={member.name}
                          className="h-full w-full object-cover object-top"
                        />
                      ) : (
                        <div className="flex size-32 items-center justify-center rounded-full bg-[#0b4b39] text-4xl font-bold text-[#f5b739]">
                          {initials(member.name)}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="px-0 pb-1 pt-4">
                    <h3 className="flex flex-wrap items-baseline gap-x-2 gap-y-1 text-base font-semibold leading-tight text-slate-900">
                      <span>
                        {member.name},{" "}
                        {member.professionalTitle || labelFor(member.rank)}
                      </span>
                    </h3>
                    <p className="mt-2 text-xs">
                      {(member.areasOfExpertise.length > 0
                        ? member.areasOfExpertise
                        : member.teachingPrograms.map(labelFor)
                      ).join(", ")}
                    </p>
                  </div>
                </article>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="-left-1 hidden size-10 border border-[#0b3327]/10 bg-white text-[#0b4b39] shadow-md hover:bg-[#f5b739] hover:text-[#073722] md:inline-flex" />
          <CarouselNext className="-right-1 hidden size-10 border border-[#0b3327]/10 bg-white text-[#0b4b39] shadow-md hover:bg-[#f5b739] hover:text-[#073722] md:inline-flex" />
          {!instructorsQuery.isLoading && facultyMembers.length === 0 && (
            <p className="rounded-md border border-dashed border-[#0b3327]/20 p-6 text-sm text-[#31463f]">
              Faculty profiles will appear here once active instructors are
              added.
            </p>
          )}
        </Carousel>

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
