"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { ArrowLeft, Printer } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useSeminaryCourseSchedulesQuery } from "@/features/seminary/seminary.hooks";

const formatDate = (value: string) =>
  new Intl.DateTimeFormat("en-PH", {
    month: "long",
    day: "numeric",
  }).format(new Date(value));

const formatTime = (value: string) =>
  new Intl.DateTimeFormat("en-PH", {
    hour: "numeric",
    minute: "2-digit",
  })
    .format(new Date(`1970-01-01T${value}:00`))
    .replace(" ", "");

const programLabel = (value: string) =>
  ({
    CERTIFICATE: "Certificate",
    BACHELOR: "Bachelor",
    MASTER_WITH_THESIS: "Master",
    DOCTORATE_WITH_DISSERTATION: "Doctor",
  })[value] ?? value.replaceAll("_", " ");

export default function PrintTimetablePage() {
  const searchParams = useSearchParams();
  const period = searchParams.get("period") ?? "";
  const className = searchParams.get("className") ?? "";
  const schedulesQuery = useSeminaryCourseSchedulesQuery();

  const schedules = useMemo(
    () =>
      (schedulesQuery.data?.data ?? [])
        .filter(
          (schedule) =>
            schedule.period === period &&
            schedule.className === className,
        )
        .sort((left, right) =>
          `${left.scheduledDate}${left.startTime}`.localeCompare(
            `${right.scheduledDate}${right.startTime}`,
          ),
        ),
    [className, period, schedulesQuery.data?.data],
  );

  const scheduleTitle = schedules[0]?.course.courseName ?? className;
  const program = schedules[0]?.course.program;

  return (
    <>
      <style jsx global>{`
        @page { size: A4 portrait; margin: 10mm; }

        @media print {
          body * { visibility: hidden; }
          #schedule-print-view, #schedule-print-view * { visibility: visible; }
          #schedule-print-view {
            position: absolute;
            inset: 0;
            width: 100%;
            padding: 0;
            box-shadow: none;
          }
          .print-controls { display: none !important; }
        }
      `}</style>

      <section className="space-y-6 p-6 lg:p-10">
        <div className="print-controls flex flex-wrap items-center justify-between gap-3">
          <Button asChild variant="outline">
            <Link href="/portal/academics/timetable">
              <ArrowLeft className="size-4" />
              Back to timetable
            </Link>
          </Button>
          <Button onClick={() => window.print()}>
            <Printer className="size-4" />
            Print / Save PDF
          </Button>
        </div>

        <article
          id="schedule-print-view"
          className="mx-auto max-w-5xl bg-white p-6 text-black shadow-sm print:max-w-none print:p-0"
        >
          <header className="text-center">
            <Image
              src="/schedule-header.png"
              alt="Pearl of the Orient Theological Seminary and Colleges"
              width={1200}
              height={210}
              priority
              className="mx-auto h-auto w-full max-w-4xl"
            />
            <h1 className="mt-5 font-serif text-2xl font-bold">CLASS SCHEDULE</h1>
            <p className="text-lg font-medium">{period || "Schedule period"}</p>
            <h2 className="mt-4 font-serif text-2xl font-bold uppercase">
              {scheduleTitle || "Class schedule"}
            </h2>
            {program && (
              <p className="mt-1 text-sm font-semibold uppercase">
                {programLabel(program)} Program
              </p>
            )}
          </header>

          <div className="mt-6 overflow-hidden border border-black">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-black text-center text-[#002b68]">
                  <th className="w-[14%] border-r border-black px-2 py-3">DATE</th>
                  <th className="w-[33%] border-r border-black px-2 py-3">SUBJECT</th>
                  <th className="w-[7%] border-r border-black px-2 py-3">UNIT</th>
                  <th className="w-[14%] border-r border-black px-2 py-3">TIME</th>
                  <th className="w-[20%] border-r border-black px-2 py-3">PROFESSOR</th>
                  <th className="w-[12%] px-2 py-3">REMARKS</th>
                </tr>
              </thead>
              <tbody>
                {schedules.map((schedule, index) => {
                  const previousDate = schedules[index - 1]?.scheduledDate?.slice(0, 10);
                  const currentDate = schedule.scheduledDate?.slice(0, 10);
                  const showDate = currentDate !== previousDate;

                  return (
                    <tr key={schedule.id} className="border-b border-black last:border-b-0">
                      <td className="border-r border-black px-2 py-2 text-center">
                        {showDate && schedule.scheduledDate
                          ? formatDate(schedule.scheduledDate)
                          : ""}
                      </td>
                      <td className="border-r border-black px-2 py-2">
                        {schedule.subjectName}
                      </td>
                      <td className="border-r border-black px-2 py-2 text-center">
                        {schedule.units}
                      </td>
                      <td className="border-r border-black px-2 py-2 text-center whitespace-nowrap">
                        {formatTime(schedule.startTime)}-{formatTime(schedule.endTime)}
                      </td>
                      <td className="border-r border-black px-2 py-2">
                        {schedule.instructor.name}
                      </td>
                      <td className="px-2 py-2 text-center">
                        {schedule.deliveryMode === "ONLINE" ? "Online Class" : "Onsite Class"}
                      </td>
                    </tr>
                  );
                })}
                {!schedules.length && (
                  <tr>
                    <td colSpan={6} className="px-3 py-8 text-center text-muted-foreground">
                      No schedules were found for this selection.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <footer className="mt-14 flex justify-between px-6 text-center text-xs font-semibold">
            <div>
              <p>NOIME B. BAYONG</p>
              <p className="font-normal">Registrar</p>
            </div>
            <div>
              <p>BISHOP RODEL R. MANZO, Ph.D., EdD., D.Min., MPA</p>
              <p className="font-normal">CEO / President</p>
            </div>
          </footer>
        </article>
      </section>
    </>
  );
}
