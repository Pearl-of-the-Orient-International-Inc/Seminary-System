"use client";

import { useMemo, useState } from "react";
import { format, isWithinInterval, parseISO } from "date-fns";
import { DashboardCharts } from "./_components/DashboardCharts";
import { DashboardHeader } from "./_components/DashboardHeader";
import { DashboardKpis } from "./_components/DashboardKpis";
import { DashboardSidebar } from "./_components/DashboardSidebar";
import { RecentApplicationsTable } from "./_components/RecentApplicationsTable";
import {
  academicYear,
  recentApplications,
  upcomingEvents,
} from "./_components/data";
import EnrollmentOverview from "./_components/EnrollmentOverview";

const Page = () => {
  const [startDate, setStartDate] = useState("2026-05-01");
  const [endDate, setEndDate] = useState("2026-05-31");

  const interval = useMemo(
    () => ({
      start: parseISO(startDate),
      end: parseISO(endDate),
    }),
    [endDate, startDate],
  );

  const filteredApplications = useMemo(
    () =>
      recentApplications.filter((item) =>
        isWithinInterval(parseISO(item.submittedAt), interval),
      ),
    [interval],
  );

  const filteredEvents = useMemo(
    () =>
      upcomingEvents.filter((item) =>
        isWithinInterval(parseISO(item.date), interval),
      ),
    [interval],
  );

  const handleExport = () => {
    const lines = [
      "Seminary Dashboard Export",
      academicYear,
      `Date range: ${startDate} to ${endDate}`,
      "",
      "Recent Applications",
      ...filteredApplications.map(
        (item) =>
          `${item.student} | ${item.id} | ${item.program} | ${item.enrollmentStatus} | ${item.paymentStatus}`,
      ),
      "",
      "Upcoming Events",
      ...filteredEvents.map(
        (item) =>
          `${format(parseISO(item.date), "MMM dd, yyyy")} | ${item.title} | ${item.time} | ${item.location}`,
      ),
    ];

    const blob = new Blob([lines.join("\n")], {
      type: "text/plain;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `seminary-dashboard-${startDate}-to-${endDate}.txt`;
    anchor.click();
    URL.revokeObjectURL(url);
  };

  return (
    <section className="space-y-6 px-4 pb-10 pt-4 md:px-6 md:pb-12">
      <DashboardHeader
        academicYear={academicYear}
        startDate={startDate}
        endDate={endDate}
        onStartDateChange={setStartDate}
        onEndDateChange={setEndDate}
        onExport={handleExport}
      />

      <DashboardKpis />

      <div className="grid gap-6 2xl:grid-cols-[minmax(0,1.65fr)_420px]">
        <EnrollmentOverview />
        <DashboardSidebar events={filteredEvents} />
      </div>

      <DashboardCharts />
      <RecentApplicationsTable applications={filteredApplications} />
    </section>
  );
};

export default Page;
